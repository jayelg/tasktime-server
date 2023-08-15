import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getModelToken('Item'),
          useValue: {},
        },
        {
          provide: getModelToken('Project'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
