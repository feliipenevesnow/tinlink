import { createTransport } from 'nodemailer';

export async function sendEmail(email: string, subject: string, text: string): Promise<boolean> {
   const message = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function sendEmailHTML(email: string, subject: string, html: string = ''): Promise<boolean> {
  const message = {
   from: process.env.EMAIL_USERNAME,
   to: email,
   subject: subject,
   html: html
 };

 try {
   await transporter.sendMail(message);
   return true;
 } catch (err) {
   console.error(err);
   return false;
 }
}

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});