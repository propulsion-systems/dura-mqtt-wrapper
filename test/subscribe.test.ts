import { expect, test, vi } from 'vitest'
import { subscribe, Subscriptions } from '../src/mqtt'

test('It should add a subscription and call client subscribe function', () => {
  const topic = 'foo';
  const clientSubscribe = vi.fn()

  let subscriptions: Subscriptions = [];

  subscriptions = subscribe({
    subscription: { topic, callback: (payload) => undefined },
    subscriptions,
    clientSubscribe,
  })

  expect(subscriptions.length).toBe(1);
  expect(subscriptions[0].topic).toBe(topic);

  expect(clientSubscribe).toBeCalledTimes(1);
  expect(clientSubscribe).toBeCalledWith(topic);
});