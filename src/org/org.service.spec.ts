import { Test, TestingModule } from '@nestjs/testing';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/org.dto';
import mongoose from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('OrgService', () => {
  let service: OrgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgService,
        {
          provide: getModelToken('Org'),
          useValue: {},
        },
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrgService>(OrgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrg', () => {
    it('should create organization', () => {
      // Creator is org admin by default
      const orgAdminUserId = '64a63893bc1b3da3558df2bf';
      const newOrg: CreateOrgDto = {
        name: 'Test Org 1',
      };

      // Act
      const org = service.createOrg(orgAdminUserId, newOrg);

      // Assert
      expect(org).toBe(newOrg.name); // org.name
      expect(org).toContain(
        // org.members
        new mongoose.Types.ObjectId(orgAdminUserId),
      );
    });
  });
});
