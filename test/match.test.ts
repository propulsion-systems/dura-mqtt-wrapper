import { expect, test } from 'vitest';
import { matches } from '../src/mqtt';

const tests = [
  { topic: 'foo', matcher: 'foo', expectation: true },
  { topic: 'foo', matcher: '#', expectation: true },
  { topic: 'foo', matcher: '+', expectation: true },
  { topic: 'foo/bar', matcher: 'foo/#', expectation: true },
  { topic: 'foo/bar', matcher: 'foo/+', expectation: true },
  { topic: 'foo/bar', matcher: 'foo/bar', expectation: true },
  { topic: 'foo/baz', matcher: 'foo/bar', expectation: false },
  { topic: 'foo/baz/bizz', matcher: 'foo/+/baz', expectation: false },
  { topic: 'foo', matcher: 'foo/+/baz', expectation: false },
  { topic: 'foo/bizz/bar', matcher: 'foo/bizz', expectation: false },
];

for (const { topic, matcher, expectation } of tests) {
  test(`Topic: ${topic}, matcher: ${matcher} -> ${expectation}`, () => {
    expect(matches({ topic, matcher })).toBe(expectation);
  })
}