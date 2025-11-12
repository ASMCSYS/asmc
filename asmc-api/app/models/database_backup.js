import mongoose from 'mongoose';

var databaseBackupSchema = new mongoose.Schema(
    {
        date: String,
        url: {
            type: String,
        },
        size: {
            type: String,
        },
    },
    { versionKey: false, timestamps: true },
);

const DatabaseBackup = mongoose.model('database_backup', databaseBackupSchema);

export default DatabaseBackup;
