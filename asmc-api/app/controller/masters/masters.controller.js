'use strict';

import mongoose from 'mongoose';
import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import {
    readFacility,
    createFacility,
    readAllFacility,
    updateFacility,
    deleteFacility,
    readBatch,
    createBatch,
    readAllBatch,
    updateBatch,
    deleteBatch,
    readLocation,
    createLocation,
    readAllLocation,
    updateLocation,
    deleteLocation,
    readCategory,
    createCategory,
    readAllCategory,
    updateCategory,
    deleteCategory,
    readTeams,
    createTeams,
    readAllTeams,
    updateTeams,
    deleteTeams,
    readAllGallery,
    deleteGallery,
    bulkGalleryCreate,
    readBanner,
    createBanner,
    readAllBanner,
    updateBanner,
    deleteBanner,
    readParentLocation,
    readParentCategory,
    readFaqs,
    createFaqs,
    readAllFaqs,
    updateFaqs,
    deleteFaqs,
    readTestimonials,
    createTestimonials,
    readAllTestimonials,
    updateTestimonials,
    deleteTestimonials,
    readNotice,
    createNotice,
    readAllNotice,
    updateNotice,
    deleteNotice,
    createFeesCategory,
    readAllFeesCategory,
    readFeesCategory,
    updateFeesCategory,
    deleteFeesCategory,
} from './masters.service.js';
import Batch from '../../models/batch.js';
import { updateMembers } from '../members/members.service.js';
import Activity from '../../models/activity.js';
import Members from '../../models/members.js';
import Faqs from '../../models/faqs.js';
import { deleteImageKitByUrl } from '../../middlewares/imagekit.js';

// facility apis

export const insertFacility = async (req, res, next) => {
    try {
        await createFacility(req.body);

        return responseSend(res, httpCodes.OK, 'Facility Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getFacilityList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [{ title: { $regex: keywords, $options: 'i' } }],
            };

        let result = await readAllFacility(
            filter,
            { title: 1, permalink: 1, banner_url: 1, status: 1, createdAt: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Facility records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleFacility = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readFacility({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editFacility = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let records = await readFacility({ _id });
        if (!records) {
            throw new Error('Facility does not exist!');
        }
        // Delete old image if banner_url is changing
        const oldUrl = records.banner_url;
        const newUrl = req.body.banner_url;
        if (oldUrl && newUrl && oldUrl !== newUrl && !oldUrl.includes('no-image.png')) {
            await deleteImageKitByUrl(oldUrl);
        }
        records = await updateFacility({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Facility updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeFacility = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readFacility({ _id });
        if (!records) {
            throw new Error('Facility does not exist!');
        }

        records = await deleteFacility({ _id });
        responseSend(res, httpCodes.OK, 'Facility deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// batch apis

export const insertBatch = async (req, res, next) => {
    try {
        req.body.sublocation_id = req.body.sublocation_id
            ? req.body.sublocation_id
            : null;

        // check if same batch code exists
        const checkBatchCode = await readBatch({ batch_code: req.body.batch_code });
        if (checkBatchCode) throw new Error('Batch with same code already exists!');
        const checkBatchName = await readBatch({ batch_name: req.body.batch_name });
        if (checkBatchName) throw new Error('Batch with same name already exists!');

        // Check for duplicate slots using the static method from the model
        if (
            await Batch.hasDuplicateSlots(
                req.body.days,
                req.body.start_time,
                req.body.end_time,
                req.body.location_id,
                req.body.sublocation_id,
                req.body.court,
                req.body.activity_id,
            )
        ) {
            throw new Error(
                'Duplicate slots found within the same location, sublocation, secondary sublocation, and activity',
            );
        }

        await createBatch(req.body);

        return responseSend(res, httpCodes.OK, 'Batch Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getBatchList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
            batch_type = 'all',
        } = req.query;

        let filter = {};

        if (active) filter.status = true;
        if (active === false) filter.status = false;

        if (batch_type !== 'all') {
            filter.type = batch_type;
        }

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { batch_type: { $regex: keywords, $options: 'i' } },
                    { batch_name: { $regex: keywords, $options: 'i' } },
                    { batch_code: { $regex: keywords, $options: 'i' } },
                    { 'activity_data.name': { $regex: keywords, $options: 'i' } },
                    { 'category_data.title': { $regex: keywords, $options: 'i' } },
                    { 'location_data.title': { $regex: keywords, $options: 'i' } },
                    { 'sublocation_data.title': { $regex: keywords, $options: 'i' } },
                    { court: { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllBatch(
            filter,
            null,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Batch records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getBatchDropdown = async (req, res, next) => {
    try {
        const where = {
            status: true,
        };

        if (req.query.activity_id && req.query.activity_id !== '') {
            where.activity_id = mongoose.Types.ObjectId(req.query.activity_id);
        }
        let result = await Batch.aggregate([
            {
                $match: where,
            },
            {
                $project: {
                    label: '$batch_name', // Rename batch_name to label
                    value: '$_id', // Rename _id to value
                },
            },
        ]);
        responseSend(res, httpCodes.OK, 'Batch records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleBatch = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readBatch({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editBatch = async (req, res, next) => {
    try {
        const { _id } = req.body;
        req.body.sublocation_id = req.body.sublocation_id
            ? req.body.sublocation_id
            : null;

        let records = await readBatch({ _id });
        if (!records) {
            throw new Error('Batch does not exist!');
        }

        // check if same batch code exists
        const checkBatchCode = await readBatch({
            batch_code: req.body.batch_code,
            _id: { $ne: _id },
        });
        if (checkBatchCode) throw new Error('Batch with same code already exists!');
        const checkBatchName = await readBatch({
            batch_name: req.body.batch_name,
            _id: { $ne: _id },
        });
        if (checkBatchName) throw new Error('Batch with same name already exists!');

        // Check for duplicate slots using the static method from the model
        if (
            await Batch.hasDuplicateSlots(
                req.body.days,
                req.body.start_time,
                req.body.end_time,
                req.body.location_id,
                req.body.sublocation_id,
                req.body.court,
                req.body.activity_id,
                _id,
            )
        ) {
            throw new Error(
                'Duplicate slots found within the same location, sublocation, court, and activity',
            );
        }

        // calculate days_booking_limit
        if (req.body.batch_limit !== records.batch_limit) {
            const days_limit = {};
            req.body.days.forEach((obj) => {
                days_limit[obj.value] = req.body.batch_limit;
            });
        }

        records = await updateBatch({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Batch updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeBatch = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readBatch({ _id });
        if (!records) {
            throw new Error('Batch does not exist!');
        }

        records = await deleteBatch({ _id });
        responseSend(res, httpCodes.OK, 'Batch deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// location apis

export const insertLocation = async (req, res, next) => {
    try {
        if (!req?.body?.parent_id) req.body.parent_id = null;
        await createLocation(req.body);

        return responseSend(res, httpCodes.OK, 'Location Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getLocationList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
            parent_id = null,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (parent_id) {
            filter.parent_id = mongoose.Types.ObjectId(parent_id);
        }

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [{ title: { $regex: keywords, $options: 'i' } }],
            };

        let result = await readAllLocation(
            filter,
            { title: 1, address: 1, status: 1, createdAt: 1, parent_id: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Location records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActionParentLocation = async (req, res, next) => {
    try {
        let filter = {
            status: true,
            parent_id: null,
        };

        let result = await readParentLocation(filter);

        responseSend(res, httpCodes.OK, 'Location records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleLocation = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readLocation({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editLocation = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readLocation({ _id });
        if (!records) {
            throw new Error('Location does not exist!');
        }

        records = await updateLocation({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Location updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeLocation = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readLocation({ _id });
        if (!records) {
            throw new Error('Location does not exist!');
        }

        records = await deleteLocation({ _id });
        responseSend(res, httpCodes.OK, 'Location deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// category apis

export const insertCategory = async (req, res, next) => {
    try {
        if (!req?.body?.parent_id) req.body.parent_id = null;
        await createCategory(req.body);

        return responseSend(res, httpCodes.OK, 'Category Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getCategoryList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [{ title: { $regex: keywords, $options: 'i' } }],
            };

        let result = await readAllCategory(
            filter,
            { title: 1, status: 1, createdAt: 1, parent_id: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Category records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActionParentCategory = async (req, res, next) => {
    try {
        let filter = {
            status: true,
            parent_id: null,
        };

        let result = await readParentCategory(filter);

        responseSend(res, httpCodes.OK, 'Category records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleCategory = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readCategory({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editCategory = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readCategory({ _id });
        if (!records) {
            throw new Error('Category does not exist!');
        }

        records = await updateCategory({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Category updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeCategory = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readCategory({ _id });
        if (!records) {
            throw new Error('Category does not exist!');
        }

        records = await deleteCategory({ _id });
        responseSend(res, httpCodes.OK, 'Category deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// photo gallery apis

export const insertGallery = async (req, res, next) => {
    try {
        const { type, url, title } = req.body;
        const payload = [];
        if (type === 'image' && title) {
            payload.push({
                type,
                url: req.body.url,
                title: req.body.title,
            });
        } else if (type === 'image') {
            req.files.map((obj) => {
                payload.push({
                    type,
                    url: obj.path,
                });
            });
        } else {
            payload.push({
                type,
                url: url,
                video_thumbnail: req.body.video_thumbnail,
            });
        }

        await bulkGalleryCreate(payload);

        return responseSend(res, httpCodes.OK, 'Gallery Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getGalleryList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 3,
            sortBy = -1,
            sortField = 'createdAt',
            type = 'image',
        } = req.query;

        let filter = { type };

        let result = await readAllGallery(
            filter,
            { type: 1, url: 1, video_thumbnail: 1, status: 1, createdAt: 1, title: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Gallery records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const removeGallery = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await deleteGallery({ _id });
        responseSend(res, httpCodes.OK, 'Gallery deleted successfully', {});
    } catch (error) {
        next(error);
    }
};

// banner apis

export const insertBanner = async (req, res, next) => {
    try {
        req.body.url = req.file.path;

        await createBanner(req.body);

        return responseSend(res, httpCodes.OK, 'Banner Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getBannerList = async (req, res, next) => {
    try {
        const {
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
            type = null,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (type) filter.type = type;

        let result = await readAllBanner(
            filter,
            { url: 1, status: 1, type: 1, createdAt: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Banner records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleBanner = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readBanner({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editBanner = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let records = await readBanner({ _id });
        if (!records) {
            throw new Error('Banner does not exist!');
        }
        // Delete old image if url is changing
        const oldUrl = records.url;
        const newUrl = req?.file?.path || req.body.url;
        if (oldUrl && newUrl && oldUrl !== newUrl && !oldUrl.includes('no-image.png')) {
            await deleteImageKitByUrl(oldUrl);
        }
        if (req?.file?.path) req.body.url = req.file.path;
        records = await updateBanner({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Banner updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeBanner = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readBanner({ _id });
        if (!records) {
            throw new Error('Banner does not exist!');
        }

        records = await deleteBanner({ _id });
        responseSend(res, httpCodes.OK, 'Banner deleted successfully', records);
    } catch (error) {
        next(error);
    }
};
// teams apis

export const insertTeams = async (req, res, next) => {
    try {
        await createTeams(req.body);

        return responseSend(res, httpCodes.OK, 'Teams Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getTeamsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { activity_name: { $regex: keywords, $options: 'i' } },
                    { role: { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllTeams(
            filter,
            { name: 1, role: 1, activity_name: 1, status: 1, createdAt: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Teams records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActionParentTeams = async (req, res, next) => {
    try {
        let filter = {
            status: true,
        };

        let result = await readParentTeams(filter);

        responseSend(res, httpCodes.OK, 'Teams records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleTeams = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readTeams({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editTeams = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let records = await readTeams({ _id });
        if (!records) {
            throw new Error('Teams does not exist!');
        }
        // Delete old image if profile is changing
        const oldProfile = records.profile;
        const newProfile = req.body.profile;
        if (
            oldProfile &&
            newProfile &&
            oldProfile !== newProfile &&
            !oldProfile.includes('no-image.png')
        ) {
            await deleteImageKitByUrl(oldProfile);
        }
        records = await updateTeams({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Teams updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeTeams = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readTeams({ _id });
        if (!records) {
            throw new Error('Teams does not exist!');
        }

        records = await deleteTeams({ _id });
        responseSend(res, httpCodes.OK, 'Teams deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// faqs apis

export const insertFaqs = async (req, res, next) => {
    try {
        await createFaqs(req.body);

        return responseSend(res, httpCodes.OK, 'Faqs Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getFaqsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
            filter_by = 'any_word',
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (keywords && keywords !== '') {
            if (filter_by === 'question') {
                filter.question = { $regex: keywords, $options: 'i' };
            } else if (filter_by === 'answer') {
                filter.answer = { $regex: keywords, $options: 'i' };
            } else if (filter_by === 'category') {
                filter.category = { $regex: keywords, $options: 'i' };
            } else if (filter_by && filter_by.startsWith('category_')) {
                const category = filter_by.replace('category_', '');
                filter.category = category;
            } else {
                // Default: search in all fields
                filter = {
                    ...filter,
                    $or: [
                        { question: { $regex: keywords, $options: 'i' } },
                        { answer: { $regex: keywords, $options: 'i' } },
                        { category: { $regex: keywords, $options: 'i' } },
                    ],
                };
            }
        }

        let result = await readAllFaqs(
            filter,
            { question: 1, answer: 1, category: 1, status: 1, createdAt: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Faqs records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleFaqs = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readFaqs({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editFaqs = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readFaqs({ _id });
        if (!records) {
            throw new Error('Faqs does not exist!');
        }

        records = await updateFaqs({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Faqs updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeFaqs = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readFaqs({ _id });
        if (!records) {
            throw new Error('Faqs does not exist!');
        }

        records = await deleteFaqs({ _id });
        responseSend(res, httpCodes.OK, 'Faqs deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

export const getFaqsCategories = async (req, res, next) => {
    try {
        const categories = await Faqs.distinct('category', { status: true });
        responseSend(
            res,
            httpCodes.OK,
            'FAQ categories retrieved successfully',
            categories,
        );
    } catch (error) {
        next(error);
    }
};

// testimonials apis

export const insertTestimonials = async (req, res, next) => {
    try {
        await createTestimonials(req.body);

        return responseSend(res, httpCodes.OK, 'Testimonials Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getTestimonialsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { message: { $regex: keywords, $options: 'i' } },
                    { star: { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllTestimonials(
            filter,
            { message: 1, star: 1, member_id: 1, status: 1, createdAt: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Testimonials records', {
            ...result,
            ...req.query,
        });
    } catch (error) {
        next(error);
    }
};

export const getSingleTestimonials = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readTestimonials({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editTestimonials = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let records = await readTestimonials({ _id });
        if (!records) {
            throw new Error('Testimonials does not exist!');
        }
        // Delete old image if profile is changing
        const oldProfile = records.profile;
        const newProfile = req.body.profile;
        if (
            oldProfile &&
            newProfile &&
            oldProfile !== newProfile &&
            !oldProfile.includes('no-image.png')
        ) {
            await deleteImageKitByUrl(oldProfile);
        }
        records = await updateTestimonials({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Testimonials updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeTestimonials = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readTestimonials({ _id });
        if (!records) {
            throw new Error('Testimonials does not exist!');
        }

        records = await deleteTestimonials({ _id });
        responseSend(res, httpCodes.OK, 'Testimonials deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// notice apis

export const insertNotice = async (req, res, next) => {
    try {
        await createNotice(req.body);

        return responseSend(res, httpCodes.OK, 'Notice Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getNoticeList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
            type = null,
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { question: { $regex: keywords, $options: 'i' } },
                    { answer: { $regex: keywords, $options: 'i' } },
                ],
            };

        if (['admin', 'super'].includes(req?.session?.roles)) {
        } else {
            if (!type || type.length === 0) {
                throw new Error('Type is required');
            }

            filter.type = type;
        }

        let result = await readAllNotice(
            filter,
            { question: 1, answer: 1, pdf_url: 1, status: 1, createdAt: 1 },
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Notice records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleNotice = async (req, res, next) => {
    try {
        const { _id } = req.query;
        let result = await readNotice({ _id });

        if (!result) {
            throw new Error('Notice does not exist!');
        }

        if (result.activities && result.activities.length > 0) {
            const activityData = await Activity.find(
                { _id: result.activities },
                { name: 1, _id: 1 },
            ).lean();
            result.activities = activityData;
        }

        if (result.members && result.members.length > 0) {
            const memberData = await Members.find(
                { _id: result.members },
                { name: 1, _id: 1 },
            ).lean();
            result.members = memberData;
        }

        if (result.batches && result.batches.length > 0) {
            const batchData = await Batch.find(
                { _id: result.batches },
                { batch_name: 1, _id: 1 },
            ).lean();
            result.batches = batchData;
        }

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editNotice = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readNotice({ _id });
        if (!records) {
            throw new Error('Notice does not exist!');
        }

        records = await updateNotice({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Notice updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeNotice = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readNotice({ _id });
        if (!records) {
            throw new Error('Notice does not exist!');
        }

        records = await deleteNotice({ _id });
        responseSend(res, httpCodes.OK, 'Notice deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// fees category apis

export const insertFeesCategory = async (req, res, next) => {
    try {
        await createFeesCategory(req.body);

        return responseSend(res, httpCodes.OK, 'Fees Category Created Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getFeesCategoryList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
            category_type = 'events',
        } = req.query;

        let filter = {};

        if (active) filter.status = true;

        if (category_type) filter.category_type = category_type;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { category_name: { $regex: keywords, $options: 'i' } },
                    { event_type: { $regex: keywords, $options: 'i' } },
                    { 'event_data.event_name': { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllFeesCategory(
            filter,
            {},
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Fees Category records', {
            ...result,
            ...req.query,
        });
    } catch (error) {
        next(error);
    }
};

export const getSingleFeesCategory = async (req, res, next) => {
    try {
        const { _id } = req.query;
        let result = await readFeesCategory({ _id });

        if (!result) {
            throw new Error('Fees Category does not exist!');
        }

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editFeesCategory = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readFeesCategory({ _id });
        if (!records) {
            throw new Error('Fees Category does not exist!');
        }

        records = await updateFeesCategory({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Fees Category updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeFeesCategory = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readFeesCategory({ _id });
        if (!records) {
            throw new Error('Fees Category does not exist!');
        }

        records = await deleteFeesCategory({ _id });
        responseSend(res, httpCodes.OK, 'Fees Category deleted successfully', records);
    } catch (error) {
        next(error);
    }
};
