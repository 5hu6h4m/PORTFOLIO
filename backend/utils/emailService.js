const nodemailer = require('nodemailer');

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

/**
 * Sends professional contact emails to both the user and the admin.
 */
const sendContactEmails = async (name, email, subject, message) => {
    const transporter = getTransporter();
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. User Email Template (Confirmation)
    const userMailOptions = {
        from: `"Shubham Jadhav" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thanks for reaching out 🚀',
        text: `Hi ${name},

Thank you for contacting me through my portfolio.

I’ve received your message and will review it shortly. I’ll get back to you as soon as possible.

Here’s a summary of your message:
----------------------------------------
Name: ${name}
Email: ${email}
Message: ${message}
----------------------------------------

Best regards,  
Shubham Jadhav`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #00f5d4; margin-bottom: 20px;">Thanks for reaching out 🚀</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for contacting me through my portfolio.</p>
                <p>I’ve received your message and will review it shortly. I’ll get back to you as soon as possible.</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00f5d4;">
                    <h3 style="margin-top: 0; font-size: 14px; color: #666; text-transform: uppercase;">Message Summary</h3>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 10px 0; white-space: pre-wrap;"><strong>Message:</strong><br/>${message}</p>
                </div>
                <p style="margin-top: 30px;">Best regards,<br/><strong>Shubham Jadhav</strong></p>
            </div>
        `
    };

    // 2. Admin Email Template (Notification)
    const adminMailOptions = {
        from: `"Portfolio System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Admin email
        subject: 'New Portfolio Message 📩',
        text: `You have received a new message from your portfolio.

----------------------------------------
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
----------------------------------------
Timestamp: ${timestamp}

Keep it clean and readable.`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #444; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Portfolio Message 📩</h2>
                <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
                    <div style="margin: 20px 0; padding: 15px; background: #f4f4f4; border-radius: 5px;">
                        <strong>Message:</strong><br/>
                        <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
                    </div>
                    <p style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">Received on: ${timestamp}</p>
                </div>
            </div>
        `
    };

    try {
        // Send both emails
        await Promise.all([
            transporter.sendMail(userMailOptions),
            transporter.sendMail(adminMailOptions)
        ]);
        console.log('Emails sent successfully');
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

module.exports = { sendContactEmails };
