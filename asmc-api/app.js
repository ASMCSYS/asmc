'use strict';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `/.env.${process.env.NODE_ENV}`) });
import connectDB from './app/config/db.config.js';

import rootRouter from './app/routes/index.js';
import { responseSend } from './app/helpers/responseSend.js';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import swaggerUi from 'swagger-ui-express';
import { apiDocumentation } from './docs/apidoc.js';

// import './cron/bulk-email.js';
import './cron/dbBackupCron.js';

const app = express();

const port = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

// CORS Configuration
const corsOptions = {
    origin: [
        'https://asmc-admin-4wvfv8p31-radhakishan-jangids-projects.vercel.app',
        'https://asmc-admin-radhakishan-jangids-projects.vercel.app',
        'https://www.distracted-lamarr.103-50-161-127.plesk.page',
        'http://localhost:3000', // For local development
        "https://asmcdae.in",
        "https://www.asmcdae.in",
        "https://admin.asmcdae.in",
        'http://localhost:3001', // For local development
    ].filter(Boolean), // Remove any undefined/null values
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc)
    maxAge: 86400, // Cache preflight request results for 24 hours
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

app.use('/members/multiple', express.json({ limit: '500MB' }));
app.use('/members/multiple', express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
connectDB();

// test if working
app.use('/health', (req, res) => res.send('ok'));

// if (NODE_ENV === "development" || NODE_ENV === "local") {
app.use(morgan('dev'));
// }

app.use('/', rootRouter);

app.use('/public', express.static(__dirname + '/public'));
app.use('/backups', express.static(__dirname + '/backups'));

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

//for errors
app.use((error, req, res, next) => {
    if (!error) {
        return next();
    }
    return responseSend(res, 400, error.message);
});

app.listen(port, () => {
    console.log('== Server running on Port ==', port);
    console.log('API Documentation available at http://localhost:' + port + '/api-docs');
});
