import cron from 'node-cron';
import { generateAndUploadBackup } from '../app/controller/common/common.controller.js';

// Schedule: Every day at 1:00 AM IST
cron.schedule('30 19 * * *', async () => {
    // 19:30 UTC = 1:00 AM IST
    console.log('[CRON] Running scheduled DB backup...');
    try {
        const result = await generateAndUploadBackup();
        console.log('[CRON] Backup Success:', result?.url);
    } catch (err) {
        console.error('[CRON] Backup Failed:', err.message);
    }
});
