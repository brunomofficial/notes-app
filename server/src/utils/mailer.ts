import nodemailer from "nodemailer";
import "dotenv/config"

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
    }
});

export const sendVerificationEmail = async (toEmail: string, code: string | number) => {
    await transporter.sendMail({
        from: `"Notes App" <${process.env.BREVO_SENDER_EMAIL}>`,
        to: toEmail,
        subject: "Verify your email address",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to Notes App!</h2>
                <p>Please use the verification code below to complete your sign up:</p>
                <h1 style="letter-spacing: 2px">${code}</h1>
                <p>This code will expire in 10 minutes</p>
            </div>
        `
    });
}