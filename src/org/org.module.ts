import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgSchema } from './org.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }])],
  controllers: [OrgController],
  providers: [OrgService],
  exports: [OrgService],
})
export class OrgModule {}
