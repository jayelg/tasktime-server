import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class PublicUiService {
  getPublicAppPath(): string {
    return join('static', 'public');
  }
}
