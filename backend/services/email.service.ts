import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_ID || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Contact Manager" <${process.env.EMAIL_ID}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || '',
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendContactCreatedNotification(
    ownerEmail: string,
    ownerName: string,
    contactName: string,
    contactEmail: string,
    contactPhone: string
  ): Promise<boolean> {
    const subject = 'New Contact Added - Contact Manager';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 5px 5px; }
            .contact-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2563eb; }
            .contact-details p { margin: 8px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Contact Manager</h1>
            </div>
            <div class="content">
              <h2>Hello ${ownerName},</h2>
              <p>A new contact has been successfully added to your contact list.</p>

              <div class="contact-details">
                <h3 style="margin-top: 0; color: #2563eb;">Contact Details</h3>
                <p><span class="label">Name:</span> ${contactName}</p>
                <p><span class="label">Email:</span> ${contactEmail}</p>
                <p><span class="label">Phone:</span> ${contactPhone}</p>
                <p><span class="label">Created At:</span> ${new Date().toLocaleString()}</p>
              </div>

              <p>You can manage this contact by logging into your account.</p>
            </div>
            <div class="footer">
              <p>© 2024 Contact Manager. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hello ${ownerName},

      A new contact has been successfully added to your contact list.

      Contact Details:
      Name: ${contactName}
      Email: ${contactEmail}
      Phone: ${contactPhone}
      Created At: ${new Date().toLocaleString()}

      You can manage this contact by logging into your account.

      © 2024 Contact Manager. All rights reserved.
    `;

    return this.sendEmail({
      to: ownerEmail,
      subject,
      html,
      text,
    });
  }
}

// Export a singleton instance
export const emailService = new EmailService();
