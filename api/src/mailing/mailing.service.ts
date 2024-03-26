import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { join } from 'path';
import pug from 'pug';

@Injectable()
export class MailingService {
  private transporter: nodemailer.Transporter;

  public templates = {
    votesAdmin: {
      html: this.compileTemplate('votes-admin'),
      text: this.compileTemplate('votes-admin-txt'),
    },
    votesVoter: {
      html: this.compileTemplate('votes-voter'),
      text: this.compileTemplate('votes-voter-txt'),
    },
    accessLink: {
      html: this.compileTemplate('access-link'),
      text: this.compileTemplate('access-link-txt'),
    },
  };

  constructor(config: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: config.getOrThrow<string>('MAIL_HOST'),
        port: 25,
        secure: false,
        tls: { rejectUnauthorized: false },
      },
      {
        from: {
          name: 'VR FORMS',
          address: 'noreply@forms.viarezo.fr',
        },
      },
    );
  }

  private compileTemplate(template: string) {
    const templatesFolder = join(__dirname, 'templates');

    const templatePath = join(templatesFolder, `${template}.pug`);

    return pug.compileFile(templatePath);
  }

  public async sendMail(
    template: {
      html: pug.compileTemplate;
      text: pug.compileTemplate;
    },
    to: string,
    subject: string,
    options?: any,
  ) {
    const html = template.html(options);
    const text = template.text(options);

    await this.transporter.sendMail({
      to,
      subject,
      html,
      text,
    });
  }
}
