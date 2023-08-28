import { Controller, Get, Param, Req } from '@nestjs/common';

@Controller('projects/:projectId/events')
export class EventController {
  @Get()
  async getAllEvents(@Req() req, @Param('projectId') projectId: string) {}
}
