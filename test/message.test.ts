import { expect, vi, test } from 'vitest';
import { onMessage, Subscriptions } from '../src/mqtt';

test('It should call subscription callback if topic matches', () => {
  const topic = 'foo';
  const payload = 'json';

  const callback = vi.fn()

  const subscriptions: Subscriptions = [{ topic, callback }];

  onMessage({ topic, payload, subscriptions })

  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith(payload);
});

test('It should not call subscription callback if topic does not match', () => {
  const topic = 'foo';
  const payload = 'json';

  const callback = vi.fn()

  const subscriptions: Subscriptions = [{ topic, callback }];

  onMessage({ topic: 'bar', payload, subscriptions })

  expect(callback).toBeCalledTimes(0);
});