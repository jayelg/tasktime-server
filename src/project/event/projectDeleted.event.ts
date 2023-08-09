import { EventEmitter2 } from '@nestjs/event-emitter';

export class ProjectDeletedEvent extends EventEmitter2 {
  constructor(
    public readonly projectId: string,
    public readonly projectName: string,
    public readonly orgId: string,
    public readonly deletedAt: string,
    public readonly createdBy: string,
  ) {
    super();
  }
}
