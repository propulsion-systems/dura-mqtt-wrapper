export type Callback = (payload: string) => void;

export interface SubscriptionObject {
  readonly topic: string;
  readonly callback: Callback;
}

export type Subscriptions = Array<SubscriptionObject>;

export interface MatchObject {
  readonly topic: string;
  readonly matcher: string;
}

export function matches({ topic, matcher }: MatchObject): boolean {
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

export interface MessageObject {
  readonly topic: string;
  readonly payload: string;
  readonly subscriptions: Subscriptions;
}

export function onMessage({ topic, payload, subscriptions }: MessageObject): void {
  for (const { topic: matcher, callback } of subscriptions) {
    if (!matches({ topic: topic, matcher: matcher })) {
      continue;
    }

    callback(payload);
  }
}

export type ClientSubscribe = (topic: string) => void;

export interface SubscribeObject {
  readonly subscription: SubscriptionObject;
  readonly subscriptions: Subscriptions;
  readonly clientSubscribe: ClientSubscribe;
}

export function subscribe({ subscription, subscriptions, clientSubscribe }: SubscribeObject): Subscriptions {
  clientSubscribe(subscription.topic)

  return [...subscriptions, subscription];
}

export type ClientUnsubscribe = (topic: string) => void;

export interface UnsubscribeObject {
  readonly topic: string;
  readonly subscriptions: Subscriptions;
  readonly clientUnsubscribe: ClientUnsubscribe;
}

export function unsubscribe({ topic, subscriptions, clientUnsubscribe }: UnsubscribeObject): Subscriptions {
  clientUnsubscribe(topic)

  return subscriptions.filter(({ topic: matcher }) => topic !== matcher);
}
