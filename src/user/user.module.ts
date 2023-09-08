import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserListenersService } from './listeners/userListeners.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserListenersService],
  exports: [UserService],
})
export class UserModule {}
