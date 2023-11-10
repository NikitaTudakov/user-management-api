import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {

    constructor(private configService: ConfigService){}

    async sendResetPasswordEmail(email: string, resetLink: string): Promise<string> {
        const originEmail = this.configService.get<string>('ORIGIN_EMAIL');
        const originPass = this.configService.get<string>('ORIGIN_EMAL_PASS');
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: originEmail,
                pass: originPass,
            },
        });

        const mailOptions = {
            from: originEmail,
            to: email,
            subject: 'Invetorsoft Test App: Password Reset Instructions',
            html: `<p>Click the following link to reset your password: <a href="${resetLink}">reset link</a></p>`,
        };

        try {
            return await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email error: ' + error);
            throw new Error('Error sending email');
        }
    }
}