import { Controller, Get, Param, Req } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';

@Controller('projects/:projectId/events')
export class EventController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllEvents(@Req() req, @Param('projectId') projectId: string) {
    // const { events } = await this.projectService.getProject(
    //   req.userId,
    //   projectId,
    //   'events', // property to populate in project
    // );
    // return events;
  }
}
