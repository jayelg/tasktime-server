import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

describe('jwtAuthGuard', () => {
  let service: JwtAuthGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    service = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access when @SkipAuth() decorator is used', async () => {
      // Mock that the @SkipAuth() decorator is used
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const context = new ExecutionContextHost([
        { getClass: jest.fn(), getHandler: jest.fn() },
      ]);

      const result = await service.canActivate(context);

      expect(result).toBe(true);
    });

    it('should call super.canActivate() when @SkipAuth() decorator is not used', async () => {
      // Mock @SkipAuth() decorator not used
      mockReflector.getAllAndOverride.mockReturnValue(false);

      // Mock the behavior of super.canActivate()
      const superCanActivateMock = jest.fn();
      service['canActivate'] = superCanActivateMock;

      const context = new ExecutionContextHost([
        { getClass: jest.fn(), getHandler: jest.fn() }, // Simulate context data
      ]);

      await service.canActivate(context);

      expect(superCanActivateMock).toHaveBeenCalledWith(context);
    });
  });
});
