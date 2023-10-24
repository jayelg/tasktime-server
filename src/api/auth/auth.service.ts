import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthValidateUserEvent } from './event/authValidate.event';
import { UserValidatedEvent } from 'src/api/user/event/userValidated.event';
import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  private PASSWORD: string;
  constructor(
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {
    this.PASSWORD = process.env.JWT_ENCRYPTION_KEY;
  }

  async generateTokens(user: { id: number; email: string }) {
    const jwtToken = this.jwtService.sign({ id: user.id, email: user.email });
    const encryptedToken = await this.encrypt(jwtToken);
    return {
      access_token: encryptedToken.toString('base64'),
    };
  }

  async extractPayload(encryptedJwtToken: string) {
    const decryptedJwtToken = await this.decrypt(
      Buffer.from(encryptedJwtToken, 'base64'),
    );
    const payload = this.jwtService.decode(decryptedJwtToken);
    return payload;
  }

  async encrypt(textToEncrypt: string): Promise<Buffer> {
    const salt = randomBytes(16); // Generate a new salt for each encryption
    const key = (await promisify(scrypt)(this.PASSWORD, salt, 32)) as Buffer; // Generate key using the salt
    const iv = randomBytes(16); // Initialization vector
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedTextBuffer = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    // Prepend salt and IV to the encrypted data
    return Buffer.concat([salt, iv, encryptedTextBuffer]);
  }

  async decrypt(data: Buffer): Promise<string> {
    // Extract salt and IV from the data
    const salt = Uint8Array.prototype.slice.call(data, 0, 16);
    const iv = Uint8Array.prototype.slice.call(data, 16, 32);
    const encryptedTextBuffer = Uint8Array.prototype.slice.call(data, 32);

    const key = (await promisify(scrypt)(this.PASSWORD, salt, 32)) as Buffer; // Generate key using the salt
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedTextBuffer = Buffer.concat([
      decipher.update(encryptedTextBuffer),
      decipher.final(),
    ]);

    return decryptedTextBuffer.toString();
  }

  async validateUser(email: string) {
    this.eventEmitter.emit(
      'auth.validateUser',
      new AuthValidateUserEvent(email),
    );
    const [userValidatedEvent] = await this.eventEmitter.waitFor(
      'user.validated',
      {
        handleError: false,
        timeout: 0,
        filter: (event: UserValidatedEvent) => event.user.email === email,
        Promise: Promise,
        overload: false,
      },
    );
    return userValidatedEvent.user;
  }
}
