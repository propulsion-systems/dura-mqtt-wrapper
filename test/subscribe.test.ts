import { expect, test, vi } from 'vitest'
import { Quality, subscribe, Subscriptions } from '../src/mqtt'

test('It should add a subscription and call client subscribe function', () => {
  const topic = 'foo';
  const quality = Quality.one;

  const callback = vi.fn();
  const wrapper = vi.fn();

  let subscriptions: Subscriptions = [];

  subscriptions = subscribe({
    subscription: { topic, quality: Quality.one, callback },
    subscriptions,
    wrapper,
  });

  expect(subscriptions.length).toBe(1);
  expect(subscriptions[0].topic).toBe(topic);

  expect(wrapper).toBeCalledTimes(1);
  expect(wrapper).toBeCalledWith({ topic, quality, callback });
});