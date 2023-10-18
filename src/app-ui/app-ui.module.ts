import { Module } from '@nestjs/common';
import { PublicUiController } from './public-ui/public-ui.controller';
import { ProtectedUiController } from './protected-ui/protected-ui.controller';
import { PublicUiService } from './public-ui/public-ui.service';
import { ProtectedUiService } from './protected-ui/protected-ui.service';

@Module({
  controllers: [PublicUiController, ProtectedUiController],
  providers: [PublicUiService, ProtectedUiService],
})
export class AppUiModule {}
