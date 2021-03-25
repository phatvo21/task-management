export interface IPubSub {
   publisherEvent(channel: string, message: string): void;

   subscriberEvent(channel: string): void;
}
