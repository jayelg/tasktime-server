import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { MagicLoginStrategy } from '../magicLogin.strategy';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    generateTokens: jest.fn(),
  };

  const mockMagicLoginStrategy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, MagicLoginStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(MagicLoginStrategy)
      .useValue(mockMagicLoginStrategy)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
