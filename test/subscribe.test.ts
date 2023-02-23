import { expect, test, vi } from 'vitest'
import { subscribe, Subscriptions } from '../src/mqtt'

test('It should add a subscription and call client subscribe function', () => {
  const topic = 'foo';
  const client = vi.fn()

  let subscriptions: Subscriptions = [];

  subscriptions = subscribe({
    subscription: { topic, callback: (payload) => undefined },
    subscriptions,
    client,
  })

  expect(subscriptions.length).toBe(1);
  expect(subscriptions[0].topic).toBe(topic);

  expect(client).toBeCalledTimes(1);
  expect(client).toBeCalledWith(topic);
});