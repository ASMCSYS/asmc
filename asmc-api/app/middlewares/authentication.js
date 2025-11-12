import jwt from 'jsonwebtoken';
import { responseSend } from '../helpers/responseSend.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = async (req, res, next) => {
    try {
        let access_token = req.header('Authorization');
        if (!access_token) throw new Error('No token, authorization denied');
        access_token = access_token.split(' ')[1];

        req.session = jwt.verify(access_token, JWT_SECRET);

        next();
    } catch (e) {
        responseSend(res, 403, 'Unresolved Authentication error: ' + e.message, null);
    }
};

const getAuthUser = async (req, res, next) => {
    try {
        let access_token = req.header('Authorization');
        access_token = access_token.split(' ')[1];

        req.session = jwt.verify(access_token, JWT_SECRET);

        next();
    } catch (e) {
        next();
    }
};

export { authenticateUser, getAuthUser };
