import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Item } from './entities/item.entity';
import { ItemMember } from './entities/itemMember.entity';
import { ItemRepository } from './repositories/item.repository';
import { ItemAncestryService } from './itemAncestry.service';
import { ItemAncestryRepository } from './repositories/itemAncestry.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Item, ItemMember])],
  providers: [
    ItemService,
    ItemAncestryService,
    ItemRepository,
    ItemAncestryRepository,
  ],
  controllers: [ItemController],
  exports: [ItemService],
})
export class ItemModule {}
