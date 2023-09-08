import { EventEmitter2 } from '@nestjs/event-emitter';

export class ItemCreatedEvent extends EventEmitter2 {
  constructor(
    public readonly itemId: number,
    public readonly projectId: number,
    public readonly createdAt: Date,
    public readonly creator: number,
  ) {
    super();
  }
}
