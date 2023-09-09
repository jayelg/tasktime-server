import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import AuthValidateUserListener from './listeners/authValidateUser.listener';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthValidateUserListener],
  exports: [UserService],
})
export class UserModule {}
