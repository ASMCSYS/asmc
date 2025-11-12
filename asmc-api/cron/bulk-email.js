import cron from 'node-cron';
import Users from '../app/models/users.js';
import { sendMultipleEmail } from '../app/utils/email.js';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE, 10);
const BATCH_DELAY_MINUTES = parseInt(process.env.BATCH_DELAY_MINUTES, 10);

let emailCursor = 1100;

const sendEmailBatches = async () => {
    try {
        console.log(`Email cursor: ${emailCursor}`);
        const users = await Users.find({ roles: "users" })
            .skip(emailCursor)
            .limit(1686);

        if (users.length === 0) {
            console.log('No more emails to send!');
            return false; // Stop the cron job if no emails are left
        }

        // Extract email addresses
        const emailRecipients = users.map(user => user.email);

        // Send the batch of emails
        console.log(emailRecipients, "emailRecipients");
        const isSuccess = await sendMultipleEmail(emailRecipients);

        if (isSuccess) {
            console.log(`Sent ${users.length} emails successfully!`);
            emailCursor += users.length; // Update the cursor
        } else {
            console.log('Failed to send some emails.');
        }

        console.log(`Mail send end: ${emailCursor}`);
        return true;
    } catch (error) {
        console.error('Error sending emails:', error);
    }
};

console.log('Inside Cron File');

// Run the cron job every minute
// cron.schedule(`* * * * *`, async () => {
cron.schedule(`10 * * * *`, async () => {
    console.log('Cron Started...');
    const result = await sendEmailBatches();
    if (!result) {
        console.log('All emails sent, stopping the cron job.');
        console.log('Cron Ended...');
        process.exit(); // Stop the process when all emails are sent
    }
});