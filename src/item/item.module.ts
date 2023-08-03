import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './item.schema';
import { ProjectSchema } from '../project/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Item', schema: ItemSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
