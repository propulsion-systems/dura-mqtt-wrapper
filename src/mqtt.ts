interface Subscription<T> {
  readonly topic: string;
  readonly callback: (payload: T | string) => T | void;
}

interface Message {
  readonly topic: string;
  readonly payload: string;
}

type Subscriptions<T> = Array<Subscription<T>>;

interface Match {
  readonly topic: string;
  readonly matcher: string;
}

export function matches({ topic, matcher }: Match): boolean {
  console.log(topic);
  console.log(matcher);

  return false;
}

export function onMessage<T>({ topic, payload }: Message, subscriptions: Subscriptions<T>) {
  for (const { topic: matcher, callback } of subscriptions) {
    if (!matches({ topic: topic, matcher: matcher })) {
      continue;
    }

    callback(payload);
  }
}

interface Subscribe<T> {
  readonly subscription: Subscription<T>;
  readonly subscriptions: Subscriptions<T>;
}

export function subscribe<T>({ subscription, subscriptions }: Subscribe<T>): Subscriptions<T> {
  return [...subscriptions, subscription];
}

interface Unsubscribe<T> {
  readonly topic: string;
  readonly subscriptions: Subscriptions<T>;
}

export function unsubscribe<T>({ topic, subscriptions }: Unsubscribe<T>): Subscriptions<T> {
  return subscriptions.filter(({ topic: matcher }) => !matches({ topic: topic, matcher: matcher }));
}
