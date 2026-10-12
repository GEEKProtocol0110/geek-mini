require('./load-utils.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const history = require('../src/utils/storage.ts');
const originalNow = Date.now;
const now = Date.parse('2026-10-12T00:00:05Z');
const store = () => {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
};
const score = (mode, correct, total, offset = 0, extra = {}) => ({ mode, score: correct, total, accuracy: 100, timestamp: now - offset, ...extra });
const freshResult = () => { delete require.cache[require.resolve('../src/utils/roundResult.ts')]; return require('../src/utils/roundResult.ts'); };
const deny = () => { throw new DOMException('Blocked', 'SecurityError'); };
test.beforeEach(() => {
  Date.now = () => now;
  for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(globalThis, name, { configurable: true, value: store() });
});
test.after(() => { Date.now = originalNow; delete globalThis.localStorage; delete globalThis.sessionStorage; });

test('history rejects impossible scores and future timestamps, recomputes accuracy and keeps newest twenty', () => {
  const valid = score('daily', 3, 5);
  const invalid = [{ ...valid, total: 4 }, { ...valid, score: 6 }, { ...valid, timestamp: now + 1 }, { ...valid, timestamp: -1 },
    { ...valid, score: '3' }, { ...valid, mode: 'other' }, { ...valid, total: null }, score('speed', 1, 11), score('speed', 0, -1)];
  localStorage.setItem(history.SCORE_KEY, JSON.stringify([...invalid, ...Array.from({ length: 24 }, (_, i) => score('daily', 3, 5, (24 - i) * 1000))]));
  const saved = history.getScoreHistory();
  assert.equal(saved.length, 20); assert.equal(saved[0].timestamp, now - 1000); assert.equal(saved[19].timestamp, now - 20000);
  assert.ok(saved.every(item => item.accuracy === 60));
  assert.equal(history.saveScore(score('daily', 6, 5)), false);
});

test('Speed best counts correct answers before percentage, then resolves ties by accuracy and recency', () => {
  const values = [score('speed', 1, 1), score('speed', 8, 10, 3000, { accuracy: 80 }), score('speed', 8, 9, 2000, { accuracy: 89 }),
    score('speed', 8, 9, 1000, { accuracy: 89 }), score('daily', 5, 5)];
  localStorage.setItem(history.SCORE_KEY, JSON.stringify(values));
  assert.equal(history.getBestScore('speed').timestamp, now - 1000);
  assert.equal(history.getBestScore('daily').score, 5);
  assert.equal(history.bestScore([], 'speed'), null);
});

test('Daily summary follows the generation date across midnight and never guesses a legacy score date', () => {
  const values = [score('daily', 5, 5, 0, { utcDate: '2026-10-11' }), score('daily', 2, 5),
    score('daily', 3, 5, 0, { utcDate: '2026-10-12' }), score('daily', 4, 5, 0, { utcDate: '2026-10-12' }),
    score('daily', 5, 5, 0, { utcDate: '2026-10-13' }), score('daily', 5, 5, 0, { utcDate: '2026-02-29' })];
  localStorage.setItem(history.SCORE_KEY, JSON.stringify(values));
  const saved = history.getScoreHistory(), summary = history.practiceSummary(saved, '2026-10-12');
  assert.equal(summary.todayAttempts, 2); assert.equal(summary.todayDaily.score, 4); assert.equal(summary.totalGames, 6);
  assert.equal(saved.filter(item => item.utcDate).length, 3);
});

test('finishing a Daily preserves its set date in history and zero-answer Speed has zero accuracy', () => {
  const api = freshResult(); api.finishRound('daily', 4, 5, { utcDate: '2026-10-11' }); api.finishRound('speed', 0, 0);
  const scores = history.getScoreHistory();
  assert.equal(scores.find(item => item.mode === 'daily').utcDate, '2026-10-11');
  assert.equal(scores.find(item => item.mode === 'speed').accuracy, 0);
});

test('clearing Mini records removes stored and in-memory results and cooldown without touching other keys', () => {
  const api = freshResult(); api.finishRound('speed', 2, 3);
  localStorage.setItem('unrelated', 'keep'); sessionStorage.setItem('unrelated', 'keep');
  assert.equal(api.clearPracticeData(), true);
  assert.deepEqual(history.getScoreHistory(), []); assert.equal(api.getLastResult(), null); assert.equal(freshResult().getLastResult(), null);
  assert.equal(api.getSpeedCooldown(), 0); assert.equal(localStorage.getItem('speed_last_play'), null);
  assert.equal(localStorage.getItem('unrelated'), 'keep'); assert.equal(sessionStorage.getItem('unrelated'), 'keep');
});

test('a failed deletion does not suppress independent clears or falsely report complete deletion', () => {
  const api = freshResult(); api.finishRound('speed', 2, 3);
  const remove = localStorage.removeItem;
  localStorage.removeItem = key => key === history.SCORE_KEY ? deny() : remove(key);
  assert.equal(api.clearPracticeData(), false);
  assert.equal(history.getScoreHistory().length, 1); assert.equal(localStorage.getItem('speed_last_play'), null);
  assert.equal(api.getLastResult(), null); assert.equal(sessionStorage.getItem('geek_mini_last_result'), null);
});

test('blocked storage has a distinct read state and does not prevent clearing the other store', () => {
  const api = freshResult(); api.finishRound('speed', 1, 2);
  assert.deepEqual(history.readScoreHistory().available, true);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: deny });
  assert.deepEqual(history.readScoreHistory(), { scores: [], available: false });
  assert.equal(api.clearPracticeData(), false); assert.equal(sessionStorage.getItem('geek_mini_last_result'), null);
  assert.equal(api.getLastResult(), null); assert.equal(api.getSpeedCooldown(), 0);
});
