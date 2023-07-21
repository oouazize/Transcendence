import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs'

@Injectable()
export class MailTemplate {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(toUser: string) {
    const from: string = 'transcendencePro2023@outlook.com';
    const to: string = toUser;
    const subject: string = 'Email confirmation';
    const htmlfile = fs.readFileSync('/home/ijmari/Desktop/Transcendence/app/backend/src/auth/htmlSources/file.html', 'utf-8');
    console.log(`${to}`);
    const v = await this.mailerService.sendMail({
      from, 
      to,
      subject,
      html: htmlfile
    });
    console.log('SUCCESSFUL');
  }
}
