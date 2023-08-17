import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { join } from 'path';

// This service imports all listeners in this directory
//
// This allow the user module's providers to be dynamicly
// populated with listener classes in this directory.

@Injectable()
export class UserListenersService {
  getListeners() {
    const basePath = join(__dirname, './');
    const files = readdirSync(basePath).filter((file) =>
      file.endsWith('.listener.ts'),
    );
    return files.map((file) =>
      import(resolve(basePath, file)).then((module) => module.default),
    );
  }
}
