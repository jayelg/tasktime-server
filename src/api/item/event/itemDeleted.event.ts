import { EventEmitter2 } from '@nestjs/event-emitter';

export class ItemDeletedEvent extends EventEmitter2 {
  constructor(
    public readonly itemId: string,
    public readonly projectId: string,
    public readonly createdAt: string,
    public readonly creator: string,
  ) {
    super();
  }
}
