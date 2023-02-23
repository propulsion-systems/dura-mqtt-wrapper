import { expect, test, vi } from 'vitest'
import { unsubscribe, Subscriptions } from '../src/mqtt'

test('It should remove a subscription and call client unsubscribe function', () => {
  const topic = 'foo';
  const clientUnsubscribe = vi.fn()

  let subscriptions: Subscriptions = [{ topic, callback: (payload) => undefined }];

  subscriptions = unsubscribe({ topic, subscriptions, clientUnsubscribe })

  expect(subscriptions.length).toBe(0);

  expect(clientUnsubscribe).toBeCalledTimes(1);
  expect(clientUnsubscribe).toBeCalledWith(topic);
});