import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../event.controller';
import { ProjectModule } from 'src/project/project.module';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectModule],
      controllers: [EventController],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
