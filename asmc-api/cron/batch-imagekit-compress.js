import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import connectDB from '../app/config/db.config.js';
import { imagekit } from '../app/middlewares/imagekit.js';

// Import all relevant models
import Activity from '../app/models/activity.js';
import Banner from '../app/models/banner.js';
import cmsModel from '../app/models/cms.js';
import DatabaseBackup from '../app/models/database_backup.js';
import Event from '../app/models/events.js';
import Facility from '../app/models/facility.js';
import Gallery from '../app/models/gallery.js';
import Halls from '../app/models/halls.js';
import Member from '../app/models/members.js';
import Notice from '../app/models/notice.js';
import Testimonials from '../app/models/testimonials.js';
import Teams from '../app/models/teams.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

const TMP_DIR = os.tmpdir();
const MAX_SIZE = 200 * 1024; // 200KB

function getFileNameFromUrl(url) {
    if (!url) return '';
    try {
        return decodeURIComponent(url.split('/').pop().split('?')[0]);
    } catch {
        return '';
    }
}

async function compressImageTo200KB(inputPath, outputPath) {
    console.log(`[COMPRESS] Starting compression: ${inputPath}`);
    let quality = 80;
    let buffer = await fs.promises.readFile(inputPath);
    let compressedBuffer = buffer;
    let size = buffer.length;
    while (size > MAX_SIZE && quality > 30) {
        compressedBuffer = await sharp(buffer)
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();
        size = compressedBuffer.length;
        quality -= 10;
        console.log(`[COMPRESS] Quality: ${quality + 10} -> ${quality}, Size: ${size}`);
    }
    await fs.promises.writeFile(outputPath, compressedBuffer);
    console.log(
        `[COMPRESS] Finished: ${outputPath}, Final Size: ${compressedBuffer.length}`,
    );
    return outputPath;
}

async function downloadImage(url, destPath) {
    console.log(`[DOWNLOAD] Starting download: ${url} -> ${destPath}`);
    const writer = fs.createWriteStream(destPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 30000,
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log(`[DOWNLOAD] Finished: ${destPath}`);
            resolve();
        });
        writer.on('error', (err) => {
            console.error(`[DOWNLOAD] Error: ${err.message}`);
            reject(err);
        });
    });
}

function stripQuery(url) {
    return url ? url.split('?')[0] : '';
}

// Bulk fetch all referenced image URLs from all relevant models/fields
async function getAllReferencedImageUrls() {
    const [
        activities,
        banners,
        cms,
        dbBackups,
        events,
        facilities,
        galleries,
        halls,
        members,
        notices,
        testimonials,
        teams,
    ] = await Promise.all([
        Activity.find({}, { thumbnail: 1, images: 1 }),
        Banner.find({}, { url: 1 }),
        cmsModel.find({}, { json: 1 }),
        DatabaseBackup.find({}, { url: 1 }),
        Event.find({}, { images: 1 }),
        Facility.find({}, { banner_url: 1 }),
        Gallery.find({}, { url: 1 }),
        Halls.find({}, { images: 1 }),
        Member.find({}, { profile: 1, family_details: 1 }),
        Notice.find({}, { pdf_url: 1 }),
        Testimonials.find({}, { profile: 1 }),
        Teams.find({}, { profile: 1 }),
    ]);
    const referencedUrls = new Set();
    // Activities
    activities.forEach((a) => {
        if (a.thumbnail) referencedUrls.add(stripQuery(a.thumbnail));
        if (Array.isArray(a.images))
            a.images.forEach((img) => img && referencedUrls.add(stripQuery(img)));
    });
    // Banners
    banners.forEach((b) => b.url && referencedUrls.add(stripQuery(b.url)));
    // CMS (handle nested json fields)
    cms.forEach((c) => {
        if (c.json) {
            [
                'home_square_image',
                'home_round_image',
                'right_image',
                'fees_structure_url',
            ].forEach((key) => {
                if (c.json[key]) referencedUrls.add(stripQuery(c.json[key]));
            });
        }
    });
    // Database Backups
    dbBackups.forEach((b) => b.url && referencedUrls.add(stripQuery(b.url)));
    // Events
    events.forEach(
        (e) =>
            Array.isArray(e.images) &&
            e.images.forEach((img) => img && referencedUrls.add(stripQuery(img))),
    );
    // Facilities
    facilities.forEach(
        (f) => f.banner_url && referencedUrls.add(stripQuery(f.banner_url)),
    );
    // Galleries
    galleries.forEach((g) => g.url && referencedUrls.add(stripQuery(g.url)));
    // Halls
    halls.forEach(
        (h) =>
            Array.isArray(h.images) &&
            h.images.forEach((img) => img && referencedUrls.add(stripQuery(img))),
    );
    // Members (handle family_details array)
    members.forEach((m) => {
        if (m.profile) referencedUrls.add(stripQuery(m.profile));
        if (Array.isArray(m.family_details)) {
            m.family_details.forEach(
                (f) => f.profile && referencedUrls.add(stripQuery(f.profile)),
            );
        }
    });
    // Notices
    notices.forEach((n) => n.pdf_url && referencedUrls.add(stripQuery(n.pdf_url)));
    // Testimonials
    testimonials.forEach((t) => t.profile && referencedUrls.add(stripQuery(t.profile)));
    // Teams
    teams.forEach((t) => t.profile && referencedUrls.add(stripQuery(t.profile)));
    return referencedUrls;
}

async function updateReferences(oldUrl, newUrl) {
    // Update all references in DB from oldUrl to newUrl
    await Promise.all([
        Activity.updateMany({ thumbnail: oldUrl }, { $set: { thumbnail: newUrl } }),
        Activity.updateMany({ images: oldUrl }, { $set: { 'images.$': newUrl } }),
        Banner.updateMany({ url: oldUrl }, { $set: { url: newUrl } }),
        cmsModel.updateMany(
            { 'json.home_square_image': oldUrl },
            { $set: { 'json.home_square_image': newUrl } },
        ),
        cmsModel.updateMany(
            { 'json.home_round_image': oldUrl },
            { $set: { 'json.home_round_image': newUrl } },
        ),
        cmsModel.updateMany(
            { 'json.right_image': oldUrl },
            { $set: { 'json.right_image': newUrl } },
        ),
        cmsModel.updateMany(
            { 'json.fees_structure_url': oldUrl },
            { $set: { 'json.fees_structure_url': newUrl } },
        ),
        DatabaseBackup.updateMany({ url: oldUrl }, { $set: { url: newUrl } }),
        Event.updateMany({ images: oldUrl }, { $set: { 'images.$': newUrl } }),
        Facility.updateMany({ banner_url: oldUrl }, { $set: { banner_url: newUrl } }),
        Gallery.updateMany({ url: oldUrl }, { $set: { url: newUrl } }),
        Halls.updateMany({ images: oldUrl }, { $set: { 'images.$': newUrl } }),
        Member.updateMany({ profile: oldUrl }, { $set: { profile: newUrl } }),
        Member.updateMany(
            { 'family_details.profile': oldUrl },
            { $set: { 'family_details.$.profile': newUrl } },
        ),
        Notice.updateMany({ pdf_url: oldUrl }, { $set: { pdf_url: newUrl } }),
        Testimonials.updateMany({ profile: oldUrl }, { $set: { profile: newUrl } }),
        Teams.updateMany({ profile: oldUrl }, { $set: { profile: newUrl } }),
    ]);
}

async function main() {
    await connectDB();
    const referencedUrls = await getAllReferencedImageUrls();
    let skip = 0;
    const limit = 10;
    let total = 0;
    let processed = 0;
    let deleted = 0;
    let updated = 0;
    let hasMore = true;
    while (hasMore) {
        const files = await imagekit.listFiles({ skip, limit });
        // console.log(files, 'files');
        if (!files || files.length === 0) break;
        for (const file of files) {
            total++;
            const url = file.url;
            const fileId = file.fileId;
            const name = file.name;
            const size = file.size;
            const ext = path.extname(name).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
            const referenced = referencedUrls.has(stripQuery(url));
            if (!referenced) {
                await imagekit.deleteFile(fileId);
                deleted++;
                console.log(`[DELETED] Not referenced: ${stripQuery(url)}`);
                continue;
            }
            if (size <= MAX_SIZE) {
                console.log(`[SKIP] Already <=200KB: ${stripQuery(url)}`);
                continue;
            }
            try {
                // Download, compress, re-upload, update DB, delete old
                const tmpPath = path.join(TMP_DIR, name);
                const compressedPath = path.join(TMP_DIR, `compressed_${name}`);
                await downloadImage(url, tmpPath);
                await compressImageTo200KB(tmpPath, compressedPath);
                console.log(
                    `[UPLOAD] Uploading compressed image: ${compressedPath} (${
                        fs.statSync(compressedPath).size
                    } bytes)`,
                );
                try {
                    const uploadRes = await Promise.race([
                        imagekit.upload({
                            file: fs.createReadStream(compressedPath),
                            fileName: name,
                            useUniqueFileName: false,
                            // folder: file.folder,
                            overwriteFile: true,
                        }),
                        new Promise((_, reject) =>
                            setTimeout(
                                () => reject(new Error('ImageKit upload timed out')),
                                60000,
                            ),
                        ),
                    ]);
                    console.log(`[UPLOAD] Uploaded: ${uploadRes.url}`);
                    await updateReferences(stripQuery(url), uploadRes.url);
                    await imagekit.deleteFile(fileId);
                    updated++;
                    fs.unlinkSync(tmpPath);
                    fs.unlinkSync(compressedPath);
                    console.log(`[COMPRESSED] ${stripQuery(url)} -> ${uploadRes.url}`);
                } catch (err) {
                    console.error(`[ERROR] Uploading ${compressedPath}: ${err.message}`);
                }
            } catch (err) {
                console.error(`[ERROR] Processing ${url}: ${err.message}`);
            }
        }
        skip += limit;
        hasMore = files.length === limit;
        // hasMore = false;
    }
    console.log(`Done. Total: ${total}, Updated: ${updated}, Deleted: ${deleted}`);
    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
