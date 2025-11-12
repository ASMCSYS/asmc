import Gallery from '../../models/gallery.js';
import Facility from '../../models/facility.js';
import Batch from '../../models/batch.js';
import Location from '../../models/location.js';
import Category from '../../models/category.js';
import Teams from '../../models/teams.js';
import Faqs from '../../models/faqs.js';
import Testimonials from '../../models/testimonials.js';
import Notice from '../../models/notice.js';
import Banner from '../../models/banner.js';
import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import FeesCategory from '../../models/fees_category.js';

// facility

export const readFacility = async (filter, select = {}) => {
    try {
        const result = await Facility.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateFacility = async (filter, update) => {
    try {
        const result = await Facility.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteFacility = async (filter) => {
    try {
        const result = await Facility.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllFacility = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Facility.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createFacility = async (insertData) => {
    try {
        const result = new Facility(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkFacilityCreate = async (data) => {
    try {
        const result = await Facility.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// batch

export const readBatch = async (filter, select = {}) => {
    try {
        const result = await Batch.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateBatch = async (filter, update) => {
    try {
        const result = await Batch.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteBatch = async (filter) => {
    try {
        const result = await Batch.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllBatch = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'activities',
                    localField: 'activity_id',
                    foreignField: '_id',
                    as: 'activity_data',
                    pipeline: [
                        { $project: { _id: 1, name: 1, category: 1, location: 1 } },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location_id',
                    foreignField: '_id',
                    as: 'location_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $addFields: {
                    activity_data: { $arrayElemAt: ['$activity_data', 0] },
                    category_data: { $arrayElemAt: ['$category_data', 0] },
                    location_data: { $arrayElemAt: ['$location_data', 0] },
                    sublocation_data: { $arrayElemAt: ['$sublocation_data', 0] },
                },
            },
        ];
        const result = await Batch.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createBatch = async (insertData) => {
    try {
        const result = new Batch(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkBatchCreate = async (data) => {
    try {
        const result = await Batch.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// location

export const readLocation = async (filter, select = {}) => {
    try {
        const result = await Location.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateLocation = async (filter, update) => {
    try {
        const result = await Location.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteLocation = async (filter) => {
    try {
        const result = await Location.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllLocation = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'locations',
                    localField: 'parent_id',
                    foreignField: '_id',
                    as: 'parent_data',
                },
            },
        ];
        const result = await Location.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const readParentLocation = async (filter, select = {}) => {
    try {
        const result = await Location.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const createLocation = async (insertData) => {
    try {
        const result = new Location(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkLocationCreate = async (data) => {
    try {
        const result = await Location.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// category

export const readCategory = async (filter, select = {}) => {
    try {
        const result = await Category.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateCategory = async (filter, update) => {
    try {
        const result = await Category.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteCategory = async (filter) => {
    try {
        const result = await Category.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllCategory = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'parent_id',
                    foreignField: '_id',
                    as: 'parent_data',
                },
            },
        ];
        const result = await Category.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const readParentCategory = async (filter, select = {}) => {
    try {
        const result = await Category.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const createCategory = async (insertData) => {
    try {
        const result = new Category(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkCategoryCreate = async (data) => {
    try {
        const result = await Category.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

//  gallery api

export const bulkGalleryCreate = async (data) => {
    try {
        const result = await Gallery.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateGallery = async (filter, update) => {
    try {
        const result = await Gallery.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllGallery = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Gallery.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteGallery = async (filter) => {
    try {
        const result = await Gallery.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// banner

export const readBanner = async (filter, select = {}) => {
    try {
        const result = await Banner.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateBanner = async (filter, update) => {
    try {
        const result = await Banner.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteBanner = async (filter) => {
    try {
        const result = await Banner.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllBanner = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Banner.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createBanner = async (insertData) => {
    try {
        const result = new Banner(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkBannerCreate = async (data) => {
    try {
        const result = await Banner.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// teams

export const readTeams = async (filter, select = {}) => {
    try {
        const result = await Teams.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateTeams = async (filter, update) => {
    try {
        const result = await Teams.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteTeams = async (filter) => {
    try {
        const result = await Teams.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllTeams = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Teams.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const readParentTeams = async (filter, select = {}) => {
    try {
        const result = await Teams.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const createTeams = async (insertData) => {
    try {
        const result = new Teams(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkTeamsCreate = async (data) => {
    try {
        const result = await Teams.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// faqs

export const readFaqs = async (filter, select = {}) => {
    try {
        const result = await Faqs.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateFaqs = async (filter, update) => {
    try {
        const result = await Faqs.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteFaqs = async (filter) => {
    try {
        const result = await Faqs.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllFaqs = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'activities',
                    localField: 'activity_id',
                    foreignField: '_id',
                    as: 'activity_data',
                    pipeline: [{ $project: { _id: 1, name: 1 } }],
                },
            },
            {
                $addFields: {
                    activity_data: { $arrayElemAt: ['$activity_data', 0] },
                },
            },
        ];
        const result = await Faqs.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createFaqs = async (insertData) => {
    try {
        const result = new Faqs(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

// testimonials

export const readTestimonials = async (filter, select = {}) => {
    try {
        const result = await Testimonials.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateTestimonials = async (filter, update) => {
    try {
        const result = await Testimonials.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteTestimonials = async (filter) => {
    try {
        const result = await Testimonials.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllTestimonials = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Testimonials.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createTestimonials = async (insertData) => {
    try {
        const result = new Testimonials(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

// notice

export const readNotice = async (filter, select = {}) => {
    try {
        const result = await Notice.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateNotice = async (filter, update) => {
    try {
        const result = await Notice.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteNotice = async (filter) => {
    try {
        const result = await Notice.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllNotice = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        // add members, activities batches in lookup if ids exists in notice
        const extra = [
            {
                $lookup: {
                    from: 'activities',
                    localField: 'activity_id',
                    foreignField: '_id',
                    as: 'activity_data',
                    pipeline: [{ $project: { _id: 1, name: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'batches',
                    localField: 'batch_id',
                    foreignField: '_id',
                    as: 'batch_data',
                    pipeline: [{ $project: { _id: 1, name: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                    pipeline: [{ $project: { _id: 1, name: 1 } }],
                },
            },
            {
                $addFields: {
                    activity_data: { $arrayElemAt: ['$activity_data', 0] },
                    batch_data: { $arrayElemAt: ['$batch_data', 0] },
                    member_data: { $arrayElemAt: ['$member_data', 0] },
                },
            },
        ];
        const result = await Notice.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createNotice = async (insertData) => {
    try {
        const result = new Notice(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

// fees category

export const readFeesCategory = async (filter, select = {}) => {
    try {
        const result = await FeesCategory.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateFeesCategory = async (filter, update) => {
    try {
        const result = await FeesCategory.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteFeesCategory = async (filter) => {
    try {
        const result = await FeesCategory.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllFeesCategory = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        // add members, activities batches in lookup if ids exists in FeesCategory
        const extra = [];

        if (filter.category_type === 'events') {
            extra.push({
                $lookup: {
                    from: 'events',
                    localField: 'event_id',
                    foreignField: '_id',
                    as: 'event_data',
                    pipeline: [{ $project: { _id: 1, event_name: 1 } }],
                },
            });
        } else if (filter.category_type === 'hall') {
        }

        extra.push({
            $addFields: {
                event_data: { $arrayElemAt: ['$event_data', 0] },
            },
        });

        const result = await FeesCategory.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createFeesCategory = async (insertData) => {
    try {
        const result = new FeesCategory(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};
