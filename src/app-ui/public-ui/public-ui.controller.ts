import { Controller, Get, Res } from '@nestjs/common';
import { SkipAuth } from 'src/shared/decorators/SkipAuth.decorator';
import { PublicUiService } from './public-ui.service';

@Controller('/')
export class PublicUiController {
  constructor(private readonly publicUiService: PublicUiService) {}

  @SkipAuth()
  @Get()
  servePublicApp(@Res() res): void {
    const publicAppPath = this.publicUiService.getPublicAppPath();
    res.sendFile('index.html', { root: publicAppPath });
  }
}
