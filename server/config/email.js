import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
    // For development: using Gmail or other SMTP
    // For production: use services like SendGrid, AWS SES, etc.

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // For development only
        },
    });
};

// Send email function
export const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME || 'MERN App'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};
