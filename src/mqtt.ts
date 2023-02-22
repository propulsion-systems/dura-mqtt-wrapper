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
  // Matcher: #
  if (matcher === '#') {
    return true;
  }

  // Topic: /foo, matcher: /foo
  if (topic === matcher) {
    return true;
  }

  const topicFragments = topic.split('/')
  const matcherFragments = matcher.split('/')

  // no match yet so we need to check each fragment
  for (var i = 0; i < matcherFragments.length; i++) {
    const lhsFragment = matcherFragments[i];
    // If we've reached a multi wildcard in the lhs rawTopic,
    // we have a match.
    // (this is the mqtt spec rule finance matches finance or finance/#)
    if (lhsFragment === '#') {
      return true;
    }

    const isLhsWildcard = lhsFragment === '+';
    // If we've reached a wildcard match but the matchee does
    // not have anything at this fragment level then it's not a match.
    // (this is the MQTT spec rule 'finance does not match finance/+'
    if (isLhsWildcard && topicFragments.length <= i) {
      return false;
    }

    // if lhs is not a wildcard we need to check whether the
    // two fragments match each other.
    if (!isLhsWildcard) {
      const rhsFragment = topicFragments[i];
      // If the hs fragment is not wildcard then we need an exact match
      if (lhsFragment !== rhsFragment) {
        return false;
      }
    }
    // If we're at the last fragment of the lhs rawTopic but there are
    // more fragments in the in the matchee then the matchee rawTopic
    // is too specific to be a match.
    if (i + 1 == matcherFragments.length && topicFragments.length > matcherFragments.length) {
      return false;
    }
    // If we're here the current fragment matches so check the next
  }

  return true;
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
