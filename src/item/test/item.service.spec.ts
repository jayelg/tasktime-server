import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item, ItemSchema } from '../item.schema';
import { ItemService } from '../item.service';
import { rootMongooseTestModule } from 'src/test/utils/mongoTest.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ItemService', () => {
  let service: ItemService;
  let itemModel: Model<Item>;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
      ],
      providers: [
        ItemService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemModel = module.get<Model<Item>>(getModelToken('Item'));

    // clear in memory db before each test
    await itemModel.deleteMany({});

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
