import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) })
const JWT_SECRET = process.env.JWT_SECRET;
const accessTokenOptions = { expiresIn: "2 days" };

export const generateSession = async (accessTokenData) => {
    const access_token = jwt.sign(accessTokenData, JWT_SECRET, accessTokenOptions);
    return access_token;
}