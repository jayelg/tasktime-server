import { EventEmitter2 } from '@nestjs/event-emitter';

export class ItemCreatedEvent extends EventEmitter2 {
  constructor(
    public readonly itemId: string,
    public readonly projectId: string,
    public readonly createdAt: Date,
    public readonly creator: string,
  ) {
    super();
  }
}
