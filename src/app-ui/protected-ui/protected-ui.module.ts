import { Module } from '@nestjs/common';
import { ProtectedUiController } from './protected-ui.controller';
import { ProtectedUiService } from './protected-ui.service';

@Module({
  controllers: [ProtectedUiController],
  providers: [ProtectedUiService]
})
export class ProtectedUiModule {}
