import { EventEmitter2 } from '@nestjs/event-emitter';

export class ItemDeletedEvent extends EventEmitter2 {
  constructor(
    public readonly itemId: number,
    public readonly projectId: number,
    public readonly createdAt: string,
    public readonly creator: number,
  ) {
    super();
  }
}
