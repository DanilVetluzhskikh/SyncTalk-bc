import { Injectable } from '@nestjs/common';
import { UserAction } from 'src/types/shared';

@Injectable()
export class EventsService {
  private subscribers = new Map<number, (data: UserAction) => void>();

  subscribe(userId: number, callback: (data: UserAction) => void) {
    this.subscribers.set(userId, callback);
  }

  unsubscribe(userId: number) {
    this.subscribers.delete(userId);
  }

  notifySubscribers(userId: number, data: UserAction) {
    if (this.subscribers.has(userId)) {
      const callback = this.subscribers.get(userId);
      callback(data);
      this.unsubscribe(userId);
    }
  }
}
