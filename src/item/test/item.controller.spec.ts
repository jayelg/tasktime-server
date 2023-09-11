import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from '../item.controller';
import { ItemService } from '../item.service';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { User } from 'src/user/entities/user.entity';
import { Item } from '../entities/item.entity';
import { Project } from 'src/project/entities/project.entity';
import { Org } from 'src/org/entities/org.entity';
import { NewItemDto } from '../dto/newItem.dto';
import { UpdateItemDto } from '../dto/updateItem.dto';

describe('ItemController', () => {
  let controller: ItemController;

  const mockItemService = {
    getAllItems: jest.fn(),
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

  describe('getAllItems', () => {
    it('should call itemService.getAllItems method with userId', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      mockItemService.getAllItems.mockResolvedValue(undefined);
      await controller.getAllItems(mockReq);
      expect(mockItemService.getAllItems).toBeCalledWith(mockReq.user.id);
    });

    it('should return an array of items', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const user = new User(mockEmail);
      const org = new Org('org-name');
      const project = new Project(user, org, 'project-name');
      const item = new Item(user, project, 'item-name');
      const expectedResult = [item, { ...item }];
      mockItemService.getAllItems.mockResolvedValue(expectedResult);
      const result = await controller.getAllItems(mockReq);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getItem', () => {
    it('should call itemService.getItem method with itemId', async () => {
      const itemId = 'item-id';
      mockItemService.getItem.mockResolvedValue(undefined);
      await controller.getItem(itemId);
      expect(mockItemService.getItem).toBeCalledWith(itemId);
    });

    it('should return an item', async () => {
      const mockEmail = 'mock@email.com';
      const itemId = 'item-id';
      // create Item with dependant entities
      const user = new User(mockEmail);
      const org = new Org('org-name');
      const project = new Project(user, org, 'project-name');
      const expectedResult = new Item(user, project, 'item-name');

      mockItemService.getItem.mockResolvedValue(expectedResult);

      const result = await controller.getItem(itemId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createItem', () => {
    it('should call itemService.createItem method with userId and NewItemDto', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      const newItem = new NewItemDto();
      newItem.name = 'item-name';
      mockItemService.createItem.mockResolvedValue(undefined);
      await controller.createItem(mockReq, orgId, newItem);
      expect(mockItemService.createItem).toBeCalledWith(
        mockReq.user.id,
        orgId,
        newItem,
      );
    });

    it('should return an item', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const newItem = new NewItemDto();
      newItem.name = 'item-name';
      const projectId = 'project-id';
      // create Item with dependant entities
      const user = new User(mockEmail);
      const org = new Org('org-name');
      const project = new Project(user, org, 'project-name');
      const expectedResult = new Item(user, project, 'item-name');
      mockItemService.createItem.mockResolvedValue(expectedResult);

      const result = await controller.createItem(mockReq, projectId, newItem);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateItem', () => {
    it('should call itemService.updateItem method with userId and UpdateItemDto', async () => {
      const itemId = 'item-id';
      const itemUpdates = new UpdateItemDto();
      itemUpdates.name = 'item-name';
      mockItemService.updateItem.mockResolvedValue(undefined);
      await controller.updateItem(itemId, itemUpdates);
      expect(mockItemService.updateItem).toBeCalledWith(itemId, itemUpdates);
    });

    it('should return an item', async () => {
      const itemId = 'item-id';
      const itemUpdates = new UpdateItemDto();
      itemUpdates.name = 'item-name';
      // create Item with dependant entities
      const user = new User('mock@email.com');
      const org = new Org('org-name');
      const project = new Project(user, org, 'project-name');
      const expectedResult = new Item(user, project, 'item-name');
      mockItemService.updateItem.mockResolvedValue(expectedResult);

      const result = await controller.updateItem(itemId, itemUpdates);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteItem', () => {
    it('should call itemService.deleteItem method with itemId', async () => {
      const itemId = 'item-id';
      mockItemService.deleteItem.mockResolvedValue(undefined);
      await controller.deleteItem(itemId);
      expect(mockItemService.deleteItem).toBeCalledWith(itemId);
    });

    it('should return undefined', async () => {
      const itemId = 'item-id';
      const itemUpdates = new UpdateItemDto();
      itemUpdates.name = 'item-name';
      const expectedResult = undefined;
      mockItemService.deleteItem.mockResolvedValue(expectedResult);

      const result = await controller.deleteItem(itemId);

      expect(result).toEqual(expectedResult);
    });
  });
});
