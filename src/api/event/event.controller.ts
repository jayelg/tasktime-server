import { Controller, Get, Param, Req } from '@nestjs/common';
import { API_PREFIX } from 'src/shared/config';

@Controller(`${API_PREFIX}/projects/:projectId/events`)
export class EventController {
  @Get()
  async getAllEvents(@Req() req, @Param('projectId') projectId: string) {}
}
