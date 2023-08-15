import { Test, TestingModule } from '@nestjs/testing';
import { OrgController } from '../org.controller';
import { UserModule } from 'src/user/user.module';

describe('OrgController', () => {
  let controller: OrgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [OrgController],
    }).compile();

    controller = module.get<OrgController>(OrgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
