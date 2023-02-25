import { expect, vi, test, beforeEach, Mock } from 'vitest';
import { onMessage, Quality, Subscriptions } from '../src/mqtt';

const topic = 'foo';
const payload = 'json';

let callback: Mock;

beforeEach(() => {
  callback = vi.fn();
});

test('It should call subscription callback if topic matches', () => {
  const subscriptions: Subscriptions = [{ topic, quality: Quality.zero, callback }];

  onMessage({ topic, payload, subscriptions });

  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith(payload);
});

test('It should not call subscription callback if topic does not match', () => {
  const subscriptions: Subscriptions = [{ topic, quality: Quality.zero, callback }];

  onMessage({ topic: 'bar', payload, subscriptions });

  expect(callback).toBeCalledTimes(1);
});