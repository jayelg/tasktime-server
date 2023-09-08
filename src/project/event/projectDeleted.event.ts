import { EventEmitter2 } from '@nestjs/event-emitter';

export class ProjectDeletedEvent extends EventEmitter2 {
  constructor(
    public readonly projectId: number,
    public readonly projectName: string,
    public readonly orgId: number,
    public readonly deletedAt: string,
    public readonly createdBy: number,
  ) {
    super();
  }
}
