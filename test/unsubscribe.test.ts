import { expect, test, vi } from 'vitest'
import { unsubscribe, Subscriptions, Quality } from '../src/mqtt'

test('It should remove a subscription and call client unsubscribe function', () => {
  const topic = 'foo';
  const wrapper = vi.fn();

  let subscriptions: Subscriptions = [{ topic, quality: Quality.zero, callback: (payload) => undefined }];

  subscriptions = unsubscribe({ topic, subscriptions, wrapper });

  expect(subscriptions.length).toBe(0);

  expect(wrapper).toBeCalledTimes(1);
  expect(wrapper).toBeCalledWith(topic);
});