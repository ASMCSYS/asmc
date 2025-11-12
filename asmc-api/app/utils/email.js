import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const transporter = nodemailer.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    secure: false,
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmailNode = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: 'ASMC <info@asmcdae.in>', // Make sure this matches the SMTP server's expectations
            to: to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { success: true, info };
    } catch (error) {
        // Log the error to monitor issues
        console.error('Failed to send email:', error.message);

        // Check for spam-related error code
        if (error.responseCode === 550 && error.response.includes('SPAM filters')) {
            console.warn('Email rejected by spam filters.');
        }

        // Return a consistent error response without throwing
        return { success: false, error: error.message };
    }
};

const MSG91_API_URL = 'https://control.msg91.com/api/v5/email/send';

const sendEmail = async (to, template_id, variables) => {
    try {
        const bodyData = {
            recipients: [
                {
                    to: [
                        {
                            email: to,
                            name: '-',
                        },
                    ],
                    variables: variables,
                },
            ],
            from: {
                name: 'info',
                email: 'info@mail.asmcdae.in',
            },
            domain: 'mail.asmcdae.in',
            template_id: template_id,
        };

        const response = await axios.post(MSG91_API_URL, bodyData, {
            headers: {
                authkey: process.env.MSG91_AUTH_KEY,
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.status === 'success') {
            console.log('Email sent successfully');
            return true;
        } else {
            console.log('Failed to send email:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

export const sendMultipleEmail = async (to) => {
    try {
        const toMailWithVar = to.map((email) => {
            return {
                to: [
                    {
                        email: email,
                        name: '-',
                    },
                ],
                variables: {
                    email: email,
                },
            };
        });
        const bodyData = {
            recipients: toMailWithVar,
            from: {
                name: 'info',
                email: 'info@mail.asmcdae.in',
            },
            domain: 'mail.asmcdae.in',
            template_id: 'send_welcome_email',
        };

        console.log(bodyData, 'bodyData');

        const response = await axios.post(MSG91_API_URL, bodyData, {
            headers: {
                authkey: process.env.MSG91_AUTH_KEY,
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.status === 'success') {
            console.log('Email sent successfully');
            return true;
        } else {
            console.log('Failed to send email:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;
