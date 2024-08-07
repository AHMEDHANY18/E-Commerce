import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async (to, subject, html,attachments=[]) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"ahmed" <${process.env.EMAIL_USER}>`,
        to: to || '',
        subject: subject || 'hi',
        html: html || 'hello',
        attachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent:', info);
    } catch (error) {
        console.error('Error sending mail:', error);
    }
};
