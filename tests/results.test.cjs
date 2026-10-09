require('./load-utils.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const originalNow = Date.now;
let now;
const store = () => {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
};
const fresh = () => {
  delete require.cache[require.resolve('../src/utils/roundResult.ts')];
  return require('../src/utils/roundResult.ts');
};
const deny = () => { throw new DOMException('Synthetic blocked storage', 'SecurityError'); };
test.beforeEach(() => {
  now = 100000; Date.now = () => now;
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: store() });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: store() });
});
test.after(() => { Date.now = originalNow; delete globalThis.sessionStorage; delete globalThis.localStorage; });

test('a blocked session store does not suppress the result, history or cooldown', () => {
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, get: deny });
  const api = fresh(), result = api.finishRound('speed', 3, 4);
  assert.deepEqual(api.getLastResult(), result); assert.equal(result.historySaved, true);
  assert.equal(JSON.parse(localStorage.getItem('geek_mini_scores')).length, 1);
  assert.equal(localStorage.getItem('speed_last_play'), String(now));
  assert.equal(api.getSpeedCooldown(), 30); now += 12000; assert.equal(api.getSpeedCooldown(), 18);
});

test('blocked local storage still keeps a session result and visit-only cooldown', () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: deny });
  const api = fresh(), result = api.finishRound('speed', 0, 0);
  assert.equal(result.historySaved, false); assert.deepEqual(api.getLastResult(), result);
  assert.equal(JSON.parse(sessionStorage.getItem('geek_mini_last_result')).historySaved, false);
  assert.equal(api.getSpeedCooldown(), 30); now += 30000; assert.equal(api.getSpeedCooldown(), 0);
  assert.deepEqual(fresh().getLastResult(), result, 'A fresh page can recover the session receipt');
});

test('both stores blocked still retain the result during client-side navigation', () => {
  for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(globalThis, name, { configurable: true, get: deny });
  const api = fresh(), result = api.finishRound('daily', 4, 5);
  assert.equal(result.historySaved, false); assert.deepEqual(api.getLastResult(), result);
  assert.equal(fresh().getLastResult(), null, 'A new document cannot promise persistence when both stores are blocked');
});

test('failed score-history writes do not prevent other result writes', () => {
  const storage = localStorage, originalSet = storage.setItem;
  storage.setItem = (key, value) => { if (key === 'geek_mini_scores') deny(); else originalSet(key, value); };
  const api = fresh(); api.finishRound('speed', 2, 3);
  assert.equal(api.getLastResult().historySaved, false); assert.equal(localStorage.getItem('speed_last_play'), String(now));
  assert.equal(fresh().getLastResult().score, 2);
});

test('valid older results remain readable without claiming history was saved', () => {
  sessionStorage.setItem('geek_mini_last_result', JSON.stringify({ mode: 'daily', score: 2, total: 5, timestamp: now }));
  assert.deepEqual(fresh().getLastResult(), { mode: 'daily', score: 2, total: 5, timestamp: now, historySaved: false });
});

test('malformed, impossible or future results do not render as valid receipts', () => {
  const valid = { mode: 'daily', score: 2, total: 5, timestamp: now, historySaved: true };
  const values = ['{', 'null', '[]', ...[{ ...valid, score: 6 }, { ...valid, score: '2' }, { ...valid, total: 100 }, { ...valid, timestamp: now + 1 }, { ...valid, timestamp: null }, { ...valid, historySaved: 'true' }, { ...valid, mode: 'speed', total: 11 }].map(JSON.stringify)];
  for (const raw of values) { sessionStorage.setItem('geek_mini_last_result', raw); assert.equal(fresh().getLastResult(), null); }
});

test('future, negative and malformed cooldowns cannot lock a player out', () => {
  for (const value of ['NaN', 'Infinity', '-1', String(now + 1), '1e100', ' 99999 ', '0']) {
    localStorage.setItem('speed_last_play', value); assert.equal(fresh().getSpeedCooldown(), 0);
  }
  localStorage.setItem('speed_last_play', String(now - 5000)); assert.equal(fresh().getSpeedCooldown(), 25);
});

test('score history remains bounded to twenty entries', () => {
  const api = fresh();
  for (let i = 0; i < 25; i++) { now += 1000; api.finishRound('daily', i % 6, 5); }
  const history = JSON.parse(localStorage.getItem('geek_mini_scores'));
  assert.equal(history.length, 20); assert.equal(history[0].timestamp, now);
});
