const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing with User:', process.env.EMAIL_USER);
console.log('Testing with Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const test = async () => {
    try {
        console.log('Verifying Transporter...');
        await transporter.verify();
        console.log('Transporter is ready to take our messages!');

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Debug Test',
            text: 'If you receive this, the email system is working correctly.'
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Email Debug Error:', error);
    }
};

test();
