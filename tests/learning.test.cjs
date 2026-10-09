require('./load-utils.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { questionBank, validReview, isUtcDate } = require('../src/utils/questionBank.ts');
const { challengeShare, embedMarkup } = require('../src/utils/share.ts');

test('the public learning bank has distinct reviewed prompts, unambiguous choices and primary sources', () => {
  assert.ok(questionBank.length >= 50 && questionBank.length <= 100);
  assert.equal(new Set(questionBank.map(q => q.id)).size, questionBank.length);
  assert.equal(new Set(questionBank.map(q => q.question.trim().toLowerCase())).size, questionBank.length);
  assert.ok(new Set(questionBank.map(q => q.topic)).size >= 10);
  const hosts = new Set(['kaspa.org', 'wiki.kaspa.org', 'docs.kaspa.org', 'github.com']);
  for (const question of questionBank) {
    assert.equal(question.choices.length, 4, question.id);
    assert.equal(new Set(question.choices.map(c => c.trim().toLowerCase())).size, 4, question.id);
    assert.ok(question.choices.every(c => typeof c === 'string' && c.trim()));
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.ok(question.explain.trim() && question.topic.trim() && question.source.label.trim());
    const url = new URL(question.source.url);
    assert.equal(url.protocol, 'https:'); assert.ok(hosts.has(url.hostname));
    if (url.hostname === 'github.com') assert.match(url.pathname, /^\/(kaspanet|kasplex)\//);
    assert.ok(isUtcDate(question.reviewedAt)); assert.ok(question.reviewedAt <= new Date().toISOString().slice(0, 10));
  }
});

test('review checks scores, repeated IDs, bounds and the one unanswered Speed question', () => {
  const q = questionBank[0], q2 = questionBank[1];
  const answer = { questionId: q.id, selected: q.answer };
  assert.ok(validReview([answer], 1, 1, 'speed'));
  assert.ok(validReview([answer, { questionId: q2.id, selected: null }], 1, 1, 'speed'));
  assert.ok(validReview([{ questionId: q.id, selected: null }], 0, 0, 'speed'));
  for (const items of [[answer, answer], [{ ...answer, questionId: 'unknown' }], [{ ...answer, selected: 4 }], [{ ...answer, selected: '0' }], [null], [{ questionId: q.id, selected: null }, { questionId: q2.id, selected: null }]]) assert.equal(validReview(items, 1, 1, 'speed'), false);
  assert.equal(validReview([answer], 0, 1, 'speed'), false);
  assert.equal(validReview([answer], 1, 2, 'speed'), false);
  assert.equal(validReview([{ questionId: q.id, selected: null }], 0, 0, 'daily'), false);
});

test('Daily sharing retains the round date after midnight and does not promise an archive', () => {
  const data = challengeShare('daily', 'https://example.test', { score: 3, total: 5, utcDate: '2026-10-09' });
  assert.match(data.text, /3\/5.*Daily Challenge \(2026-10-09 UTC\)/);
  assert.equal(data.url, 'https://example.test/daily');
  const speed = challengeShare('speed', 'https://example.test', { score: 2, total: 4, utcDate: '2026-10-09' });
  assert.match(speed.text, /2\/4.*Speed Round/); assert.doesNotMatch(speed.text, /UTC/);
  const legacy = challengeShare('daily', 'https://example.test', { score: 1, total: 5 });
  assert.doesNotMatch(legacy.text, /UTC/, 'An older receipt cannot be labelled with today’s date');
});

test('both embed modes use the selected route and an accessible title', () => {
  for (const mode of ['daily', 'speed']) {
    const html = embedMarkup(mode, 'https://example.test');
    assert.match(html, new RegExp(`/embed\\?mode=${mode}`));
    assert.match(html, mode === 'daily' ? /title="Geek Mini Daily Challenge"/ : /title="Geek Mini Speed Round"/);
    assert.match(html, /max-width:100%/);
  }
});

test('UTC date validation rejects impossible dates rather than normalizing them', () => {
  assert.ok(isUtcDate('2024-02-29'));
  for (const value of ['2026-02-29', '2026-13-01', '2026-10-32', 'not-a-date', null, 1]) assert.equal(isUtcDate(value), false);
});

test('native sharing cancellation is quiet and clipboard failure stays actionable', async () => {
  const { shareChallenge } = require('../src/utils/share.ts');
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let copied = '';
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { origin: 'https://example.test' } } });
    const mock = { share: async () => { throw new DOMException('Cancelled', 'AbortError'); }, clipboard: { writeText: async text => { copied = text; } } };
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: mock });
    assert.equal(await shareChallenge('speed'), 'cancelled'); assert.equal(copied, '');
    mock.share = async () => { throw new Error('Native share unavailable'); };
    assert.equal(await shareChallenge('speed'), 'copied'); assert.match(copied, /Speed Round.*\/speed/);
    mock.clipboard.writeText = async () => { throw new DOMException('Blocked', 'NotAllowedError'); };
    assert.equal(await shareChallenge('daily'), 'failed');
  } finally {
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor); else delete globalThis.navigator;
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor); else delete globalThis.window;
  }
});
