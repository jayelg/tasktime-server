import { Module } from '@nestjs/common';
import { PublicUiController } from './public-ui.controller';
import { PublicUiService } from './public-ui.service';

@Module({
  controllers: [PublicUiController],
  providers: [PublicUiService]
})
export class PublicUiModule {}
