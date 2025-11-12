'use strict';
import multer from 'multer';

import { responseSend } from '../helpers/responseSend.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

export const imageProcessingMultiple = async (req, res, next) => {
    try {
        let dir = './public';
        var date = new Date();

        let Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, dir);
            },
            filename: function (req, file, callback) {
                var fileExt = file.originalname.split('.').pop();
                var fileUnique = Math.round(Math.random() * (999999 - 100000) + 100000);
                let filename = fileUnique + '-' + date.getTime() + '.' + fileExt;
                callback(null, filename);
            },
        });

        const upload = multer({
            storage: Storage,
            limits: {
                fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
            },
            fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
                    return cb(
                        new Error(
                            'File should be an image with jpg,jpeg,png,webp extensions',
                        ),
                    );
                }
                cb(undefined, true);
            },
        }).any();

        upload(req, res, async (err) => {
            try {
                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                } else if (err instanceof multer.MulterError) {
                    throw new Error(err);
                }

                if (req.files) {
                    let finalFiles = [];

                    req.files.map(function (val, key) {
                        val.path = `public/${val.filename}`;
                        finalFiles.push(val);
                    });
                    req.files = finalFiles;
                    next();
                } else {
                    if (req.method === 'PUT' || req.body.type === 'video') {
                        next();
                    } else {
                        throw new Error('Please Upload a file.');
                    }
                }
            } catch (error) {
                responseSend(res, 417, error.message, null);
            }
        });
    } catch (error) {
        responseSend(res, 417, error.message, null);
    }
};

export const imageProcessingSingle = async (req, res, next) => {
    try {
        let dir = './public';
        var date = new Date();

        let Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, dir);
            },
            filename: function (req, file, callback) {
                var fileExt = file.originalname.split('.').pop();
                var fileUnique = Math.round(Math.random() * (999999 - 100000) + 100000);
                let filename = fileUnique + '-' + date.getTime() + '.' + fileExt;
                callback(null, filename);
            },
        });

        const upload = multer({
            storage: Storage,
            limits: {
                fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
            },
            fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/)) {
                    return cb(
                        new Error(
                            'File should be an image with jpg,jpeg,png,webp extensions',
                        ),
                    );
                }
                cb(undefined, true);
            },
        }).single('image');

        upload(req, res, async (err) => {
            try {
                if (err) {
                    throw new Error(err);
                }

                if (req.file) {
                    req.file.path = `public/${req.file.filename}`;
                    console.log(req.file, 'file');
                    next();
                } else {
                    if (req.method === 'PUT') {
                        next();
                    } else {
                        throw new Error('Please Upload a file.');
                    }
                }
            } catch (error) {
                responseSend(res, 417, error.message, null);
            }
        });
    } catch (error) {
        responseSend(res, 417, error.message, null);
    }
};
