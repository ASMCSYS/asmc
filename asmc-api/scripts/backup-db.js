import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.join(__dirname, '/../', envFile) });

// Verify MongoDB URI is available
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI environment variable is not set!');
    console.log(
        'Please make sure you have a .env file in the root directory with MONGO_URI defined.',
    );
    process.exit(1);
}

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Generate timestamp for backup folder name
const timestamp = new Date().toISOString().replace(/:/g, '-');
const backupPath = path.join(backupDir, `backup_${timestamp}`);

// Extract database name from MongoDB URI
const dbName = 'asmc_db_backup_' + timestamp;

// Construct the mongodump command
const mongodumpCmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${backupPath}"`;

console.log('Starting database backup...');
exec(mongodumpCmd, (error, stdout, stderr) => {
    if (error) {
        console.error('Error during backup:', error);
        process.exit(1);
    }

    if (stderr) {
        console.error('mongodump stderr:', stderr);
    }

    console.log('Backup completed successfully!');
    console.log(`Backup stored in: ${backupPath}`);
});
