import { responseSend } from '../helpers/responseSend.js';
import ImageKit from 'imagekit';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

export const imagekit = new ImageKit({
    publicKey: 'public_fwM0ujj28bndeoVqtid8VIbTzZI',
    privateKey: 'private_TspHvWrrsWDVJPPGxeWn/5iZIeA=',
    urlEndpoint: 'https://ik.imagekit.io/hl37bqgg7',
});

// Helper to compress image to <=200KB, skip compression for PDFs
async function compressImageTo200KB(inputPath, outputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    if (ext === '.pdf') {
        // For PDFs, just copy the file (no compression)
        await fs.promises.copyFile(inputPath, outputPath);
        return outputPath;
    }
    let quality = 80;
    let buffer = await fs.promises.readFile(inputPath);
    let compressedBuffer = buffer;
    let size = buffer.length;
    // Try to compress until under 200KB or quality is too low
    while (size > 200 * 1024 && quality > 30) {
        compressedBuffer = await sharp(buffer)
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();
        size = compressedBuffer.length;
        quality -= 10;
    }
    await fs.promises.writeFile(outputPath, compressedBuffer);
    return outputPath;
}

export const imageKitSingle = async (req, res, next, folder = '') => {
    try {
        const originalPath = path.join(__dirname, `../../public/${req.file.filename}`);
        const compressedPath = path.join(
            __dirname,
            `../../public/compressed_${req.file.filename}`,
        );
        await compressImageTo200KB(originalPath, compressedPath);
        imagekit.upload(
            {
                file: fs.createReadStream(compressedPath),
                fileName: req.file.filename,
                folder: folder,
            },
            function (err, response) {
                // Clean up both original and compressed files
                [originalPath, compressedPath].forEach((filePath) => {
                    fs.access(filePath, fs.constants.F_OK, (err) => {
                        if (!err) {
                            fs.unlink(filePath, () => {});
                        }
                    });
                });
                if (err) {
                    return responseSend(res, 417, err.message, null);
                }
                req.file.path = response?.url;
                req.file.imagekitFileId = response?.fileId;
                next();
            },
        );
    } catch (error) {
        responseSend(res, 417, error.message, null);
    }
};

export const imageKitMultiple = async (req, res, next, folder = '') => {
    try {
        if (req.body.type === 'video') {
            next();
            return;
        }
        let completed = 0;
        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            const originalPath = path.join(__dirname, `../../public/${element.filename}`);
            const compressedPath = path.join(
                __dirname,
                `../../public/compressed_${element.filename}`,
            );
            await compressImageTo200KB(originalPath, compressedPath);
            const response = await imagekit.upload({
                file: fs.createReadStream(compressedPath),
                fileName: element.filename,
                folder: folder,
            });
            // Clean up both original and compressed files
            [originalPath, compressedPath].forEach((filePath) => {
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(filePath, () => {});
                    }
                });
            });
            element.path = response?.url;
            element.imagekitFileId = response?.fileId;
            completed++;
            if (completed === req.files.length) {
                next();
            }
        }
    } catch (error) {
        responseSend(res, 417, error.message, null);
    }
};

// Delete image from ImageKit by fileId
export const deleteFromImageKit = async (fileId) => {
    return new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

// Helper to delete an image from ImageKit by URL
export async function deleteImageKitByUrl(url) {
    if (!url) return;
    try {
        // Get file name from URL
        const fileName = url.split('/').pop().split('?')[0];
        // List files with this name
        const result = await imagekit.listFiles({ name: fileName });
        if (result && result.length > 0) {
            // Find the exact match (ignoring query params)
            const file = result.find((f) => f.url.split('?')[0] === url.split('?')[0]);
            if (file) {
                await imagekit.deleteFile(file.fileId);
                console.log('Deleted old image from ImageKit:', url);
            }
        }
    } catch (err) {
        console.error('Error deleting old image from ImageKit:', err.message);
    }
}
