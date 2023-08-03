import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UserModule
        MailerModule.forRootAsync({
          imports: [ConfigModule], // Import ConfigModule here too
          useFactory: async (configService: ConfigService) => ({
            transport: {
              host: configService.get<string>('SMTP_URL'),
              secure: false,
              auth: {
                user: configService.get<string>('SMTP_USER'),
                pass: configService.get<string>('SMTP_PASS'),
              },
            },
            defaults: {
              from: `"${configService.get<string>(
                'APP_NAME',
              )}" <${configService.get<string>('SMTP_FROM_ADDRESS')}>`,
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
          inject: [ConfigService], // Inject ConfigService here
        }),
      ],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
