import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (toEmail: string, code: string | number) => {
    
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": process.env.BREVO_API_KEY!,
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            sender: { name: "Notes App", email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: toEmail }],
            subject: "Verify your email address",
            htmlContent: `
                <h2>Welcome to Notes App!</h2>
                <p>Please use the verification code below to complete your sign up:</p>
                <h1 style="letter-spacing: 2px">${code}</h1>
                <p>This code will expire in 10 minutes</p>
            `
        }),
    });

    if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);

}
