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

// Function to list available backups
function listBackups() {
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
        console.error('No backups directory found!');
        process.exit(1);
    }

    const backups = fs
        .readdirSync(backupDir)
        .filter((file) => fs.statSync(path.join(backupDir, file)).isDirectory())
        .filter((dir) => dir.startsWith('backup_'));

    if (backups.length === 0) {
        console.error('No backups found!');
        process.exit(1);
    }

    console.log('Available backups:');
    backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup}`);
    });

    return backups;
}

// Get backup path from command line argument or use latest
const backups = listBackups();
let backupToRestore = process.argv[2];

if (!backupToRestore) {
    // Use the most recent backup if none specified
    backupToRestore = backups[backups.length - 1];
    console.log(`\nNo backup specified. Using most recent backup: ${backupToRestore}`);
}

const backupDir = path.join(__dirname, '../../backups');
const backupPath = path.join(backupDir, backupToRestore);

if (!fs.existsSync(backupPath)) {
    console.error(`Backup '${backupToRestore}' not found!`);
    process.exit(1);
}

// Find the database subdirectory (mongodump creates a subdirectory with the database name)
const subdirs = fs
    .readdirSync(backupPath)
    .filter((item) => fs.statSync(path.join(backupPath, item)).isDirectory());

if (subdirs.length === 0) {
    console.error('No database subdirectory found in backup!');
    process.exit(1);
}

// Use the first subdirectory (should be the database name)
const databaseBackupPath = path.join(backupPath, subdirs[0]);
console.log(`Found database subdirectory: ${subdirs[0]}`);

// Construct the mongorestore command
const mongorestoreCmd = `mongorestore --uri="${process.env.MONGO_URI}" --drop "${databaseBackupPath}"`;

console.log('\nStarting database restore...');
console.log(`Restoring from: ${databaseBackupPath}`);

exec(mongorestoreCmd, (error, stdout, stderr) => {
    if (error) {
        console.error('Error during restore:', error);
        process.exit(1);
    }

    if (stderr) {
        console.error('mongorestore stderr:', stderr);
    }

    console.log('Restore completed successfully!');
});
