import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [EventController],
})
export class EventModule {}
