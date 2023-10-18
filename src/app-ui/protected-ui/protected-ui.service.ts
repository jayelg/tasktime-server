import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class ProtectedUiService {
  getProtectedAppPath(): string {
    return join('static', 'protected');
  }
}
