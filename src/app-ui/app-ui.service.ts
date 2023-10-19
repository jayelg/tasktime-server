import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppUiService {
  public serveApp(res, site, path = '/'): void {
    const getAbsolutePath = (p: string) =>
      join(process.cwd(), 'static', site, p);
    // serve index
    const serveIndex = () => {
      res.sendFile(getAbsolutePath('index.html'));
    };
    if (path === '/') {
      serveIndex();
      return;
    }
    // serve assets
    const assetPath = getAbsolutePath(path);
    res.sendFile(assetPath, (err) => {
      if (err) {
        // If the asset is not found, fallback to index.html for client side routing (react router).
        // eg. This will handle client-side routes like '/app/dashboard'.
        res.sendFile(getAbsolutePath('index.html'));
      }
    });
  }
}
