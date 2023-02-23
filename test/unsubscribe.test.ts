import { expect, test, vi } from 'vitest'
import { unsubscribe, Subscriptions } from '../src/mqtt'

test('It should remove a subscription and call client unsubscribe function', () => {
  const topic = 'foo';
  const client = vi.fn()

  let subscriptions: Subscriptions = [{ topic, callback: (payload) => undefined }];

  subscriptions = unsubscribe({ topic, subscriptions, client })

  expect(subscriptions.length).toBe(0);

  expect(client).toBeCalledTimes(1);
  expect(client).toBeCalledWith(topic);
});