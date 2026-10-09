require('./load-utils.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { createRoundClock } = require('../src/utils/roundClock.ts');
const { buildRounds } = require('../src/utils/rounds.ts');

test('a delayed callback cannot turn a thirty-second round into a longer game', () => {
  let wall = 100000, monotonic = 500;
  const clock = createRoundClock(30000, () => wall, () => monotonic);
  assert.equal(clock.secondsLeft(), 30);
  wall += 12750; monotonic += 12750;
  assert.equal(clock.secondsLeft(), 18);
  // No timer callback runs while the page is suspended; the next answer checks time.
  wall += 17250; monotonic += 17250;
  assert.equal(clock.expired(), true); assert.equal(clock.secondsLeft(), 0);
  wall += 60000; assert.equal(clock.secondsLeft(), 0);
});

test('system sleep and backwards clock changes cannot replenish the round', () => {
  let wall = 100000, monotonic = 0;
  const clock = createRoundClock(30000, () => wall, () => monotonic);
  wall -= 3600000; monotonic = 15000;
  assert.equal(clock.secondsLeft(), 15);
  wall = 100000; monotonic = 0;
  assert.equal(clock.secondsLeft(), 15, 'Observed elapsed time never decreases');
  wall = 130000; assert.equal(clock.expired(), true, 'Wall time counts sleep even if monotonic time paused');
});

test('Daily questions and answer ordering remain shared for the same UTC date', () => {
  const daily = buildRounds('daily', '2026-10-09');
  assert.deepEqual(buildRounds('daily', '2026-10-09'), daily);
  assert.equal(daily.length, 5); assert.equal(new Set(daily.map(r => r.question.id)).size, 5);
  assert.notDeepEqual(buildRounds('daily', '2026-10-10').map(r => r.question.id), daily.map(r => r.question.id));
  for (const round of [...daily, ...buildRounds('speed')]) {
    assert.equal(round.choices.filter(c => c.isCorrect).length, 1);
    assert.equal(round.choices.find(c => c.isCorrect).text, round.question.choices[round.question.answer]);
  }
  assert.equal(buildRounds('speed').length, 10);
});
