require('./load-utils.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { questionBank } = require('../src/utils/questionBank.ts');
const { speedFocuses, questionsForFocus, speedFocusLabel, speedLink } = require('../src/utils/speedFocus.ts');
const { buildRounds } = require('../src/utils/rounds.ts');
const { challengeShare } = require('../src/utils/share.ts');

test('focused pools cover the bank once and generate ten distinct questions with correct shuffled answers', () => {
  assert.equal(questionBank.length, 100);
  const assigned = speedFocuses.filter(f => f.topics).flatMap(f => questionsForFocus(f.id));
  assert.equal(assigned.length, questionBank.length); assert.equal(new Set(assigned.map(q => q.id)).size, questionBank.length);
  for (const focus of speedFocuses) {
    const pool = questionsForFocus(focus.id), ids = new Set(pool.map(q => q.id)); assert.ok(pool.length >= 10);
    for (let repeat = 0; repeat < 40; repeat++) {
      const rounds = buildRounds('speed', '2026-10-14', focus.id);
      assert.equal(rounds.length, 10); assert.equal(new Set(rounds.map(r => r.question.id)).size, 10);
      for (const round of rounds) { assert.ok(ids.has(round.question.id)); assert.equal(round.choices.filter(c => c.isCorrect).length, 1); assert.equal(round.choices.find(c => c.isCorrect).text, round.question.choices[round.question.answer]); }
    }
  }
});
test('Daily stays shared and mixed even when a caller provides a Speed focus; unknown focus safely uses the full bank', () => {
  const daily = buildRounds('daily', '2026-10-14');
  for (const focus of speedFocuses) assert.deepEqual(buildRounds('daily', '2026-10-14', focus.id), daily);
  assert.equal(questionsForFocus('unknown'), questionBank); assert.equal(speedLink('unknown'), '/speed');
  assert.equal(speedFocusLabel('<script>'), 'All Kaspa topics');
});
test('focused share links retain the topic without putting scores or arbitrary parameters in the URL', () => {
  const data = challengeShare('speed', 'https://mini.example', { score: 8, total: 10, focus: 'wallets' });
  assert.match(data.text, /8\/10.*Wallets and payments/); assert.equal(data.url, 'https://mini.example/speed?focus=wallets');
  for (const focus of ['mixed', 'https://evil.invalid', 'wallets&score=10', null]) {
    const bad = challengeShare('speed', 'https://mini.example', { score: 1, total: 2, focus }); assert.equal(bad.url, 'https://mini.example/speed');
  }
  assert.equal(challengeShare('daily', 'https://mini.example', { score: 3, total: 5, focus: 'wallets' }).url, 'https://mini.example/daily');
});

const store = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) }; };
const freshResult = () => { delete require.cache[require.resolve('../src/utils/roundResult.ts')]; return require('../src/utils/roundResult.ts'); };
test('Speed focus survives result reload and history; legacy and malformed metadata are not mislabelled', () => {
  globalThis.localStorage = store(); globalThis.sessionStorage = store();
  try {
    const api = freshResult(); api.finishRound('speed', 7, 10, { focus: 'network' });
    assert.equal(freshResult().getLastResult().focus, 'network');
    const history = require('../src/utils/storage.ts'); assert.equal(history.getScoreHistory()[0].focus, 'network');
    const raw = JSON.parse(sessionStorage.getItem('geek_mini_last_result')); raw.focus = 'fake'; sessionStorage.setItem('geek_mini_last_result', JSON.stringify(raw));
    assert.equal(freshResult().getLastResult().focus, undefined);
    const saved = JSON.parse(localStorage.getItem(history.SCORE_KEY)); saved[0].focus = 'fake'; localStorage.setItem(history.SCORE_KEY, JSON.stringify(saved)); assert.equal(history.getScoreHistory()[0].focus, undefined);
    api.finishRound('daily', 5, 5, { focus: 'wallets', utcDate: new Date().toISOString().slice(0, 10) }); assert.equal(freshResult().getLastResult().focus, undefined);
  } finally { delete globalThis.localStorage; delete globalThis.sessionStorage; }
});
test('blocked stores still retain the focused visit-only receipt and do not invent a saved record', () => {
  const deny = () => { throw new DOMException('Blocked', 'SecurityError'); };
  globalThis.localStorage = { getItem: deny, setItem: deny }; globalThis.sessionStorage = { getItem: deny, setItem: deny };
  try {
    const api = freshResult(), result = api.finishRound('speed', 2, 4, { focus: 'builders' });
    assert.equal(result.historySaved, false); assert.equal(api.getLastResult().focus, 'builders'); assert.equal(api.getLastResult().score, 2);
  } finally { delete globalThis.localStorage; delete globalThis.sessionStorage; }
});
