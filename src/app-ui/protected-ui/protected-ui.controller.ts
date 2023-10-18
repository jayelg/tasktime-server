import { Controller, Get, Res } from '@nestjs/common';
import { ProtectedUiService } from './protected-ui.service';

@Controller('app')
export class ProtectedUiController {
  constructor(private readonly protectedUiService: ProtectedUiService) {}

  @Get()
  serveProtectedApp(@Res() res): void {
    const protectedAppPath = this.protectedUiService.getProtectedAppPath();
    res.sendFile('index.html', { root: protectedAppPath });
  }
}
