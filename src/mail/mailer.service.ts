import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

interface CustomMailOptions extends Mail.Options {
  template?: string;
  context?: Record<string, any>;
}

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: configService.get<string>('SMTP_URL'),
        secure: true,
        auth: {
          user: configService.get<string>('SMTP_USER'),
          pass: configService.get<string>('SMTP_PASS'),
        },
      },
      {
        from: `"${configService.get<string>('APP_NAME')}" 
             <${configService.get<string>('SMTP_FROM_ADDRESS')}>`,
      },
    );
  }

  async sendMail(options: CustomMailOptions) {
    if (options.template && options.context) {
      // Load the template file based on options.template
      const templatePath = __dirname + `/templates/${options.template}.hbs`;
      const templateContent = readFileSync(templatePath).toString();
      const template = compile(templateContent);

      // Apply the context to the template and set the resulting HTML as the email body
      options.html = template(options.context);
    }

    // nodemailer cannot handle template or context so they need to be removed.
    const { template, context, ...mailOptions } = options;
    return this.transporter.sendMail(mailOptions);
  }
}
