import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from '../item.controller';
import { ItemService } from '../item.service';

describe('ItemController', () => {
  let controller: ItemController;

  const mockItemService = {
    getItem: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [ItemService],
    })
      .overrideProvider(ItemService)
      .useValue(mockItemService)
      .compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
