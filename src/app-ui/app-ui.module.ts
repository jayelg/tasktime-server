import { Module } from '@nestjs/common';
import { AppUiService } from './app-ui.service';
import { AppUiController } from './app-ui.controller';

@Module({
  controllers: [AppUiController],
  providers: [AppUiService],
})
export class AppUiModule {}
