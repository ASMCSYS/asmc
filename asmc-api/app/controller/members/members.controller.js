'use strict';

import sha256 from 'sha256';
import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import {
    readMembers,
    createMembers,
    readAllMembers,
    updateMembers,
    bulkMembersCreate,
    deleteMembers,
    findHighestMemberId,
} from './members.service.js';
import { generateRandomPassword, GenerateUserName } from '../../utils/helper.js';
import {
    FRONTEND_BASE_URL,
    add_new_family_member_mail_content,
    convert_to_user_mail_content,
    userRoles,
} from '../../helpers/constance.js';
import { createUsers } from '../auth/auth.service.js';

import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import sendEmail, { sendEmailNode } from '../../utils/email.js';
const __dirname = path.resolve();

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
    readBookings,
    readSingleBookings,
    updateBookings,
} from '../bookings/bookings.service.js';
import Bookings from '../../models/bookings.js';
import PaymentHistory from '../../models/payment_history.js';
import Members from '../../models/members.js';
import { readPlans } from '../plans/plans.service.js';
import mongoose, { mongo } from 'mongoose';
import Users from '../../models/users.js';
import { deleteImageKitByUrl } from '../../middlewares/imagekit.js';
// import { insertPaymentData } from "../payment/payment.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirnames = path.dirname(__filename);

import ExcelJS from 'exceljs';
import Teams from '../../models/teams.js';
import EventBookings from '../../models/event_booking.js';
import HallBookings from '../../models/hall_booking.js';

dotenv.config({ path: path.join(__dirnames, `../../.env.${process.env.NODE_ENV}`) });

export const insertMembers = async (req, res, next) => {
    try {
        let filter = { email: req.body.email };
        let doc;
        doc = await readMembers(filter, '_id');
        if (doc) {
            throw new Error('email already exists!');
        }

        req.body.added_by = {
            _id: req.session._id,
            name: req.session.name,
        };

        // update id of family members
        // if (req.body.family_details && req.body.family_details.length > 0) {
        //     req.body.family_details.forEach((familyMember, index) => {
        //         familyMember.id = `S${index + 1}-${req.body.member_id}`;
        //     });
        // }

        doc = await createMembers(req.body);

        // update family members id
        if (doc.family_details && doc.family_details.length > 0) {
            doc.family_details.forEach((familyMember, index) => {
                familyMember.id = `S${index + 1}-${doc.member_id}`;
            });
            await updateMembers({ _id: doc._id }, { family_details: doc.family_details });
        }

        if (doc) {
            return responseSend(res, httpCodes.OK, 'Member Created Successfully', doc);
        }
    } catch (error) {
        next(error);
    }
};

export const insertMembersFromExcel = async (req, res, next) => {
    try {
        const startingMemberId = await findHighestMemberId();

        // Modify the documents to include member_id
        req.body.forEach((doc, index) => {
            doc.member_id = String(parseInt(startingMemberId) + (1 + index)).padStart(
                5,
                '0',
            );
        });

        let doc = await bulkMembersCreate(req.body);
        if (doc) {
            return responseSend(res, httpCodes.OK, 'Member Created Successfully', doc);
        }
    } catch (error) {
        next(error);
    }
};

export const getMembersList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            member_status = null,
            member_post = null,
            active = null,
            converted = null,
            fees_paid = null,
            member_id = null,
        } = req.query;
        const { roles } = req.session;

        let filter = {};
        let extra = [];

        if (converted == 'true') filter.converted = true;
        if (active == 'true') filter.status = true;
        if (active == 'false') filter.status = false;

        if (fees_paid == 'true') filter.fees_paid = true;
        else if (fees_paid == 'false') filter.fees_paid = false;
        else if (fees_paid === 'expired') {
            const today = new Date();
            extra.push(
                {
                    $addFields: {
                        end_date_parsed: {
                            $dateFromString: {
                                dateString: '$current_plan.end_date',
                                format: '%d/%m/%Y',
                            },
                        },
                    },
                },
                {
                    $match: {
                        end_date_parsed: { $lt: today },
                    },
                },
            );
        }

        if (member_status) filter.member_status = member_status;
        if (member_post) filter.member_post = member_post;
        if (member_id) filter.member_id = member_id;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { email: { $regex: keywords, $options: 'i' } },
                    { mobile: { $regex: keywords, $options: 'i' } },
                    { non_chss_number: { $regex: keywords, $options: 'i' } },
                    { chss_number: { $regex: keywords, $options: 'i' } },
                    { member_id: keywords },
                    { 'current_plan.plan_name': { $regex: keywords, $options: 'i' } },
                ],
            };

        // map payment_history table to member and find the plan_id and member_id into payment_history table
        // extra.push(
        //     {
        //         $addFields: {
        //             currentPlanObjectId: { $toObjectId: '$current_plan.plan_id' },
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: 'payment_histories',
        //             let: {
        //                 memberId: '$_id',
        //                 currentPlanId: '$currentPlanObjectId',
        //             },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 { $eq: ['$member_id', '$$memberId'] },
        //                                 { $eq: ['$payment_status', 'Success'] },
        //                                 { $in: ['$$currentPlanId', '$plan_id'] },
        //                             ],
        //                         },
        //                     },
        //                 },
        //                 {
        //                     $sort: { verifiedAt: -1 },
        //                 },
        //                 {
        //                     $limit: 1,
        //                 },
        //             ],
        //             as: 'payment_history',
        //         },
        //     },
        //     {
        //         $unwind: {
        //             path: '$payment_history',
        //             preserveNullAndEmptyArrays: true,
        //         },
        //     },
        // );

        let result = await readAllMembers(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
            extra,
        );

        if (roles === 'super') {
            const memberIdsWithPlan = result?.result.map((member) => ({
                memberId: member._id,
                planId: member.current_plan?.plan_id,
            }));

            // Query all payment histories in one go (batched)
            const paymentHistories = await PaymentHistory.aggregate([
                {
                    $match: {
                        payment_status: 'Success',
                        $or: memberIdsWithPlan.map((entry) => ({
                            member_id: entry.memberId,
                            plan_id: { $in: [mongoose.Types.ObjectId(entry.planId)] },
                        })),
                    },
                },
                {
                    $sort: { verifiedAt: -1 },
                },
                {
                    $group: {
                        _id: '$member_id',
                        last_payment: { $first: '$$ROOT' },
                    },
                },
            ]);

            const paymentMap = {};
            for (const p of paymentHistories) {
                paymentMap[p._id.toString()] = p.last_payment;
            }

            // Attach to each member
            let resultData = result?.result.map((member) => ({
                ...member,
                payment_history: paymentMap[member._id.toString()] || null,
            }));

            result.result = resultData;
        }

        responseSend(res, httpCodes.OK, 'Members records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getTeamMembers = async (req, res, next) => {
    try {
        let result = await Teams.find(
            { status: true },
            { _id: 1, name: 1, role: 1, activity_name: 1, profile: 1, display_order: 1 },
        ).select('name profile activity_name role display_order'); // select profile and display_order

        // Sort by display_order with proper handling of string to number conversion
        // and ensuring 0 values come at the end
        result = result.sort((a, b) => {
            const orderA = parseInt(a.display_order) || 0;
            const orderB = parseInt(b.display_order) || 0;

            // If both are 0, maintain original order
            if (orderA === 0 && orderB === 0) {
                return 0;
            }

            // If one is 0, it should come at the end
            if (orderA === 0) return 1;
            if (orderB === 0) return -1;

            // Otherwise sort in descending order (highest first)
            return orderB - orderA;
        });

        responseSend(res, httpCodes.OK, 'Members records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleMembers = async (req, res, next) => {
    try {
        const { _id } = req.query;
        let result = await readMembers({ _id });

        // Filter out inactive family members
        if (result && result.family_details && result.family_details.length > 0) {
            result.family_details = result.family_details.filter(
                (member) => member.active !== false,
            );
        }

        if (result && result?.current_plan?.plan_id) {
            // let paymentData = await readPaymentHistory({ member_id: _id, plan_id: result?.current_plan?.plan_id });
            let paymentData = await PaymentHistory.find({
                member_id: _id,
                payment_status: { $ne: 'Initiated' },
            }).select({});
            result.payment_history = paymentData;
        }

        result.bookings = await Bookings.find({ member_id: _id, status: true })
            .sort({ createdAt: -1 })
            .select({})
            .populate({ path: 'activity_id', as: 'activity_data' })
            .populate({ path: 'batch', as: 'batch_data' })
            .populate({
                path: 'batch',
                model: 'batch',
                populate: [
                    {
                        path: 'category_id',
                        model: 'category',
                        as: 'category_data',
                        required: false,
                    },
                    {
                        path: 'location_id',
                        model: 'location',
                        as: 'location_data',
                        required: false,
                    },
                    {
                        path: 'sublocation_id',
                        model: 'location',
                        as: 'sublocation_data',
                        required: false,
                    },
                ],
                as: 'batch_data',
            });

        // Filter out bookings for inactive secondary members
        // if (result.bookings && result.bookings.length > 0) {
        //     result.bookings = result.bookings.filter((booking) => {
        //         // If booking has no family_member array or empty, keep it (primary member booking)
        //         if (!booking.family_member || booking.family_member.length === 0) {
        //             return true;
        //         }

        //         // Filter out null values first, then check if any family member is still active
        //         const validFamilyMembers = booking.family_member.filter(
        //             (familyMemberId) =>
        //                 familyMemberId !== null && familyMemberId !== undefined,
        //         );

        //         // If no valid family members after filtering nulls, keep the booking (primary member)
        //         if (validFamilyMembers.length === 0) {
        //             return true;
        //         }

        //         // Check if any valid family member in the booking is still active
        //         const hasActiveFamilyMember = validFamilyMembers.some(
        //             (familyMemberId) => {
        //                 // Find the family member in current family_details
        //                 const currentFamilyMember = result.family_details.find(
        //                     (fm) =>
        //                         fm._id && fm._id.toString() === familyMemberId.toString(),
        //                 );

        //                 // Keep if family member is still active
        //                 return (
        //                     currentFamilyMember && currentFamilyMember.active !== false
        //                 );
        //             },
        //         );

        //         return hasActiveFamilyMember;
        //     });
        // }

        result.events = await EventBookings.find({
            member_data: { $elemMatch: { _id: _id } },
            status: true,
        })
            .sort({ createdAt: -1 })
            .select({})
            .populate({ path: 'event_id' })
            .populate({
                path: 'event_id',
                model: 'events',
                populate: [
                    {
                        path: 'location_id',
                        model: 'location',
                        as: 'location_data',
                        required: false,
                    },
                    {
                        path: 'sublocation_id',
                        model: 'location',
                        as: 'sublocation_data',
                        required: false,
                    },
                ],
                as: 'event_data',
            });

        // Filter out event bookings for inactive secondary members
        // if (result.events && result.events.length > 0) {
        //     result.events = result.events.filter((event) => {
        //         // Check if any of the member_data contains active members
        //         if (event.member_data && event.member_data.length > 0) {
        //             const hasActiveMembers = event.member_data.some((memberData) => {
        //                 // If it's the primary member, keep the event
        //                 if (memberData._id && memberData._id.toString() === _id) {
        //                     return true;
        //                 }

        //                 // If it's a secondary member, check if they are still active in family_details
        //                 if (result.family_details && result.family_details.length > 0) {
        //                     const familyMember = result.family_details.find(
        //                         (fm) =>
        //                             fm._id &&
        //                             fm._id.toString() === memberData._id?.toString(),
        //                     );
        //                     return familyMember && familyMember.active !== false;
        //                 }

        //                 return false;
        //             });

        //             return hasActiveMembers; // Keep event only if it has at least one active member
        //         }

        //         return false;
        //     });
        // }

        result.halls = await HallBookings.find({
            member_id: _id,
            status: true,
        })
            .sort({ createdAt: -1 })
            .select({})
            .populate({ path: 'hall_id' })
            .populate({
                path: 'hall_id',
                model: 'halls',
                populate: [
                    {
                        path: 'location_id',
                        model: 'location',
                        as: 'location_data',
                        required: false,
                    },
                    {
                        path: 'sublocation_id',
                        model: 'location',
                        as: 'sublocation_data',
                        required: false,
                    },
                ],
                as: 'hall_data',
            });

        // Filter out hall bookings for inactive secondary members
        // if (result.halls && result.halls.length > 0) {
        //     result.halls = result.halls.filter((hall) => {
        //         // If booking is for primary member, keep it
        //         if (hall.member_id && hall.member_id.toString() === _id) {
        //             return true;
        //         }

        //         // If booking is for secondary member, check if they are still active
        //         if (result.family_details && result.family_details.length > 0) {
        //             const familyMember = result.family_details.find(
        //                 (fm) =>
        //                     fm._id && fm._id.toString() === hall.member_id?.toString(),
        //             );
        //             return familyMember && familyMember.active !== false;
        //         }

        //         return false; // Remove bookings for unknown/inactive members
        //     });
        // }

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const verifyMembersByMemberId = async (req, res, next) => {
    try {
        const { member_id } = req.query;

        let result;

        if (member_id.includes('S')) {
            // Secondary member case
            const primaryMember = await readMembers(
                { family_details: { $elemMatch: { id: member_id } } },
                {
                    _id: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    gender: 1,
                    dob: 1,
                    member_id: 1,
                    chss_number: 1,
                    fees_paid: 1,
                    family_details: 1,
                },
            );

            if (!primaryMember) {
                return responseSend(
                    res,
                    httpCodes.NOTFOUND,
                    'Secondary member not found',
                    false,
                );
            }

            const matchedFamilyMember = primaryMember.family_details.find(
                (fd) => fd.id === member_id,
            );

            if (!matchedFamilyMember) {
                return responseSend(
                    res,
                    httpCodes.NOTFOUND,
                    'Secondary member not found',
                    false,
                );
            }

            return responseSend(res, httpCodes.OK, 'Success', {
                _id: primaryMember._id,
                secondary_member_id: matchedFamilyMember.id,
                member_id: primaryMember.member_id,
                name: matchedFamilyMember.name,
                email: matchedFamilyMember.email,
                mobile: matchedFamilyMember.mobile,
                gender: matchedFamilyMember.gender,
                dob: matchedFamilyMember.dob,
                card_number: matchedFamilyMember.card_number,
                fees_paid: matchedFamilyMember.fees_paid,
                type: 'secondary',
            });
        } else {
            // Primary member case
            result = await readMembers(
                { member_id },
                {
                    _id: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    gender: 1,
                    dob: 1,
                    member_id: 1,
                    chss_number: 1,
                    fees_paid: 1,
                },
            );

            if (!result) {
                return responseSend(
                    res,
                    httpCodes.NOTFOUND,
                    'Primary member not found',
                    false,
                );
            }

            return responseSend(res, httpCodes.OK, 'Success', {
                ...result,
                type: 'primary',
            });
        }
    } catch (error) {
        next(error);
    }
};

export const editMembers = async (req, res, next) => {
    try {
        const { _id } = req.body;
        const { roles } = req.session;

        let records = await readMembers({ _id });
        if (!records) {
            throw new Error('Members does not exist!');
        }

        // Check if the main member's profile image has changed
        const oldProfileUrl = records.profile;
        const newProfileUrl = req.body.profile;
        if (
            oldProfileUrl &&
            newProfileUrl &&
            oldProfileUrl !== newProfileUrl &&
            !oldProfileUrl.includes('no-image.png')
        ) {
            await deleteImageKitByUrl(oldProfileUrl);
        }

        // Delete old family_details profile images if changed and not default
        if (
            Array.isArray(records.family_details) &&
            Array.isArray(req.body.family_details)
        ) {
            for (let i = 0; i < records.family_details.length; i++) {
                const oldFamilyProfile = records.family_details[i]?.profile;
                const newFamilyProfile = req.body.family_details[i]?.profile;
                if (
                    oldFamilyProfile &&
                    newFamilyProfile &&
                    oldFamilyProfile !== newFamilyProfile &&
                    !oldFamilyProfile.includes('no-image.png')
                ) {
                    await deleteImageKitByUrl(oldFamilyProfile);
                }
            }
        }

        if (req.body.fees_paid == 'false') {
            req.body.fees_verified = false;
        }

        // Check if the main member's plan has changed
        // if (roles && roles === 'super') {
        //     if (records.fees_paid) {
        //         const isPlanChanged =
        //             req.body.current_plan &&
        //             JSON.stringify(req.body.current_plan) !==
        //                 JSON.stringify(records.current_plan);

        //         // If plan has changed, update start_date and end_date
        //         if (isPlanChanged) {
        //             if (req.body.fees_paid === false) {
        //                 records.fees_verified = false;
        //             }

        //             req.body.current_plan = req.body.current_plan;
        //         }

        //         // Update family member plans if changed
        //         const updatedFamilyDetails = req.body.family_details.map(
        //             (family, index) => {
        //                 const existingFamily = records.family_details[index] || {};
        //                 family.id = `S${index + 1}-${req.body.member_id}`;
        //                 if (existingFamily.fees_paid) {
        //                     const isFamilyPlanChanged =
        //                         family.plans &&
        //                         JSON.stringify(family.plans) !==
        //                             JSON.stringify(existingFamily.plans);

        //                     if (isFamilyPlanChanged) {
        //                         family.fees_paid = false;
        //                         family.plans = family.plans;
        //                     }
        //                 }
        //                 return family;
        //             },
        //         );

        //         req.body.family_details = updatedFamilyDetails;
        //     }
        // }

        if (req.body.family_details && req.body.family_details.length > 0) {
            req.body.family_details.forEach((familyMember, index) => {
                familyMember.id = `S${index + 1}-${records.member_id}`;
            });
        }

        // check if the profile url is changed

        await updateMembers({ _id }, req.body);

        // Send email notification if a new family member is added
        if (
            records.family_details.length !== req.body.family_details.length &&
            records.converted
        ) {
            const latestFamilyDetails =
                req.body.family_details[req.body.family_details.length - 1];

            const contentForMail = add_new_family_member_mail_content(
                latestFamilyDetails.name,
            );

            let payloadForHtmlTemplate = {
                name: `Congratulation! ${records.name}`,
                msg_content: contentForMail,
                link: process.env.FRONTEND_BASE_URL + '/sign-in',
                link_text: 'Visit Your Profile',
            };

            const filePath = path.join(__dirname, '/app/templates/payment-request.hbs');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            const htmlToSend = template(payloadForHtmlTemplate);

            sendEmailNode(
                records.email,
                `Congratulation! ${records.name}`,
                '',
                htmlToSend,
            );
        }

        // Update user email in Users collection
        if (req.body.email) {
            let user = await Users.findOne({ member_id: records._id });
            if (user) {
                let payloadToUpdate = {
                    email: req.body.email,
                    name: req.body.name,
                };
                if (!user.password_changed) {
                    payloadToUpdate = {
                        ...payloadToUpdate,
                        password: sha256(`${GenerateUserName(req.body.email)}@asmc`),
                    };
                }
                await Users.updateOne({ _id: user._id }, payloadToUpdate);
            }
        }

        records = await readMembers({ _id });
        responseSend(res, httpCodes.OK, 'Members updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const addStartAndEndDates = (plan) => {
    if (!plan) return null;

    const start_month = plan.start_month;
    const end_month = plan.end_month;

    // Get current date details
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Calculate start date - always use current year for start date
    let startYear = currentYear;
    const startDate = new Date(startYear, start_month - 1, 1);

    // Calculate end date - ensure it's after the start date
    let endYear = startYear;
    if (end_month < start_month) {
        endYear = startYear + 1;
    }
    const endDate = new Date(endYear, end_month, 0); // Last day of the end month

    return {
        ...plan,
        start_date: `${String(startDate.getDate()).padStart(2, '0')}/${String(
            startDate.getMonth() + 1,
        ).padStart(2, '0')}/${startDate.getFullYear()}`,
        end_date: `${String(endDate.getDate()).padStart(2, '0')}/${String(
            endDate.getMonth() + 1,
        ).padStart(2, '0')}/${endDate.getFullYear()}`,
        updated_at: new Date().toISOString(),
    };
};

export const removeMembers = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readMembers({ _id });
        if (!records) {
            throw new Error('Members does not exist!');
        }

        records = await deleteMembers({ _id });
        responseSend(res, httpCodes.OK, 'Members deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

export const convertToUser = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readMembers({ _id });
        if (!records) {
            throw new Error('Members does not exist!');
        }

        if (!records.current_plan) {
            throw new Error('Member does not have any membership.');
        } else if (!records.email) {
            throw new Error('Member does not have any email id.');
        } else if (records.converted) {
            throw new Error('Member already converted to user.');
        } else if (!records.status) {
            throw new Error('Member is not an active user.');
        }

        // let password = generateRandomPassword(6);
        let password = sha256(`${GenerateUserName(records.email)}@asmc`);

        let payload = {
            name: records.name,
            email: records.email,
            mobile: records.mobile,
            password: password,
            status: true,
            roles: userRoles.USERS,
            member_id: records._id,
        };

        await createUsers(payload);

        await updateMembers(
            { _id: records._id },
            { converted: true, convertedAt: new Date().toISOString() },
        );

        // temporary fees paid of member
        // if (records?.current_plan) {
        //     const start_month = records?.current_plan?.start_month;
        //     const end_month = records?.current_plan?.end_month;

        //     // Calculate the current year
        //     const currentYear = new Date().getFullYear();

        //     // Calculate the start date (1st day of the start month)
        //     const startDate = new Date(currentYear, start_month - 1, 1);

        //     // Calculate the end date (last day of the end month of the next year)
        //     // We subtract 1 from end_month to get the zero-indexed month for Date constructor
        //     const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
        //     const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

        //     records.current_plan.start_date = String(startDate.getDate()).padStart(2, '0') + '/' + String(startDate.getMonth() + 1).padStart(2, '0') + '/' + startDate.getFullYear();
        //     records.current_plan.end_date = String(endDate.getDate()).padStart(2, '0') + '/' + String(endDate.getMonth() + 1).padStart(2, '0') + '/' + endDate.getFullYear();
        // }
        await updateMembers({ _id: records._id }, { current_plan: records.current_plan });
        // await updateMembers({ _id: records._id }, { current_plan: records.current_plan, fees_paid: true, feesPaidAt: new Date().toISOString(), fees_verified: true, feesVerifiedAt: new Date().toISOString() });

        const contentForMail = convert_to_user_mail_content(records.email, password);
        // send mail here
        let payloadForHtmlTemplate = {
            name: `Congratulation! ${records.name}`,
            msg_content: contentForMail,
            link: process.env.FRONTEND_BASE_URL + '/sign-in',
            link_text: 'Visit Your Profile',
        };

        const filePath = path.join(__dirname, '/app/templates/payment-request.hbs');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        const htmlToSend = template(payloadForHtmlTemplate);

        sendEmailNode(records.email, `Congratulation! ${records.name}`, '', htmlToSend);

        responseSend(res, httpCodes.OK, 'User converted successfully', {});
    } catch (error) {
        next(error);
    }
};

export const tempConvertToUser = async (req, res, next) => {
    try {
        let records = await Members.find({
            converted: false,
            current_plan: { $exists: true },
        });

        for (const record of records) {
            let password = sha256(`${GenerateUserName(record.email)}@asmc`);

            let payload = {
                name: record.name,
                email: record.email,
                mobile: record.mobile,
                password: password,
                status: true,
                roles: userRoles.USERS,
                member_id: record._id,
            };

            // Create the user
            await createUsers(payload);

            // Temporary fees paid for member
            if (record?.current_plan) {
                const start_month = record?.current_plan?.start_month;
                const end_month = record?.current_plan?.end_month;

                // Calculate the current year
                const currentYear = new Date().getFullYear();

                // Calculate the start date (1st day of the start month)
                const startDate = new Date(currentYear, start_month - 1, 1);

                // Calculate the end date (last day of the end month of the next year)
                const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                // Format the start and end dates
                record.current_plan.start_date =
                    String(startDate.getDate()).padStart(2, '0') +
                    '/' +
                    String(startDate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    startDate.getFullYear();
                record.current_plan.end_date =
                    String(endDate.getDate()).padStart(2, '0') +
                    '/' +
                    String(endDate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    endDate.getFullYear();

                // Update the member with fees paid and fees verified information
                await updateMembers(
                    { _id: record._id },
                    {
                        current_plan: record.current_plan,
                        fees_paid: true,
                        feesPaidAt: new Date().toISOString(),
                        fees_verified: true,
                        feesVerifiedAt: new Date().toISOString(),
                        converted: true,
                        convertedAt: new Date().toISOString(),
                    },
                );
            }
        }

        responseSend(res, httpCodes.OK, 'User converted successfully', records);
    } catch (error) {
        next(error);
    }
};

export const tempPlanUpdateOfAllMember = async (req, res, next) => {
    let records = await Members.find({ 'current_plan.start_date': { $exists: false } })
        .select({ _id: 1, current_plan: 1, profile: 1 })
        .lean();
    if (records && records.length > 0) {
        for (const obj of records) {
            if (obj?.current_plan) {
                const currentPlanData = await readPlans({
                    _id: mongoose.Types.ObjectId(obj?.current_plan?.plan_id),
                });
                const start_month = currentPlanData?.start_month;
                const end_month = currentPlanData?.end_month;

                if (obj?.profile === 'public/no-image.png') {
                    obj.profile = 'https://api.asmcdae.in/public/no-image.png';
                }

                obj.current_plan.start_month = start_month;
                obj.current_plan.end_month = end_month;

                // Calculate the current year
                const currentYear = new Date().getFullYear();

                // Calculate the start date (1st day of the start month)
                const startDate = new Date(currentYear, start_month - 1, 1);

                // Calculate the end date (last day of the end month of the next year)
                // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                obj.current_plan.start_date =
                    String(startDate.getDate()).padStart(2, '0') +
                    '/' +
                    String(startDate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    startDate.getFullYear();
                obj.current_plan.end_date =
                    String(endDate.getDate()).padStart(2, '0') +
                    '/' +
                    String(endDate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    endDate.getFullYear();

                await updateMembers(
                    { _id: obj._id },
                    { current_plan: obj.current_plan, profile: obj.profile },
                );
            }
        }
    }

    responseSend(res, httpCodes.OK, 'Updated', {});
};

export const memberPayment = async (req, res, next) => {
    try {
        const { member_id, reference_no, amount_paid } = req.body;
        const { path: file_url } = req.file;

        let records = await readMembers({ _id: member_id }, { _id: 1, current_plan: 1 });
        if (!records) {
            throw new Error('Members does not exist!');
        }

        let allPlanIds = [];
        let allBookingIds = [];

        if (!records.fees_paid) {
            allPlanIds.push(records?.current_plan?.plan_id);
        }

        // update booking status if user is making payment of booking
        const bookingData = await Bookings.find({
            member_id: member_id,
            payment_status: 'Pending',
        })
            .select({})
            .lean();
        if (bookingData && bookingData.length > 0) {
            await updateBookings(
                { member_id: member_id, payment_status: 'Pending' },
                { payment_status: 'Success', feesPaidAt: new Date().toISOString() },
            );

            bookingData.map((obj) => {
                allPlanIds.push(obj?.fees_breakup?.plan_id);
                allBookingIds.push(obj._id);
            });
        }

        // create payment history
        const paymentHistoryPayload = {
            member_id: records._id,
            plan_id: allPlanIds,
            booking_id: allBookingIds,
            payment_file: file_url,
            payment_id: reference_no,
            amount_paid: amount_paid,
            remarks: 'Payment is made using UPI scan qr code',
            payment_mode: 'QR Code Scan',
        };
        // await insertPaymentData(paymentHistoryPayload);

        // update fees_paid status in member table if user is making first time payment with membership amount
        if (!records.fees_paid)
            await updateMembers(
                { _id: records._id },
                { fees_paid: true, feesPaidAt: new Date().toISOString() },
            );

        responseSend(
            res,
            httpCodes.OK,
            'We have received your payment request please wait for admin to verify your payment.',
            {},
        );
    } catch (error) {
        next(error);
    }
};

export const exportMembers = async (req, res, next) => {
    try {
        // Fetch all members
        const members = await Members.find().lean();

        // Initialize variables for tracking maximum number of activities
        let srNo = 1;

        // Prepare the workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Members Data');

        // Define the columns for the Excel sheet
        worksheet.columns = [
            { header: 'Sr. No.', key: 'sr_no', width: 10 },
            { header: 'Membership No.', key: 'membership_no', width: 20 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Mobile No.', key: 'mobile', width: 15 },
            { header: 'Sports Activities', key: 'activity', width: 30 },
            { header: 'Valid Up to', key: 'valid_up_to', width: 15 },
        ];

        // Loop through the members and populate data
        for (const member of members) {
            // Fetch the bookings for this member
            const bookings = await Bookings.find({ member_id: member._id })
                .populate('activity_id', 'name') // Assuming 'name' is the field for activity name
                .lean();

            if (bookings.length === 0) {
                worksheet.addRow({
                    sr_no: srNo++,
                    membership_no: `P-${member?.member_id.padStart(5, '0')}`,
                    name: member?.name || '',
                    mobile: member?.mobile || '',
                    activity: '',
                    valid_up_to: '', // Assuming this data is not available in the provided schema
                });
            } else {
                // Loop through each booking
                for (const booking of bookings) {
                    let name = member?.name; // Default to primary member
                    let mobile = member?.mobile;
                    let membershipNo = `P-${member?.member_id.padStart(5, '0')}`; // Primary member ID format

                    // Check if booking is for secondary member
                    if (booking.family_member && booking.family_member.length > 0) {
                        const familyMemberIndex = booking.family_member[0]; // Assuming family_member contains index of family member

                        if (familyMemberIndex) {
                            name = familyMemberIndex.name; // Name of secondary member
                            mobile = ''; // Mobile not applicable for secondary member
                            membershipNo = `S1-${member?.member_id.padStart(5, '0')}`; // Secondary member ID format
                        }
                    }

                    // Add the row for each booking with sports activity and details
                    worksheet.addRow({
                        sr_no: srNo++,
                        membership_no: membershipNo,
                        name: name || '',
                        mobile: mobile || '',
                        activity: booking.activity_id?.name || '',
                        valid_up_to: booking?.fees_breakup?.end_date, // Assuming this data is not available in the provided schema
                    });
                }
            }
        }

        // Set the response header to download the file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=members_data.xlsx');

        // Write the Excel file to the response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};

export const updateSecondaryMemberId = async (req, res, next) => {
    try {
        // find all member and update their secondary member id based on primary member like member id is 00001 add S1-00001 for first family_details

        const members = await Members.find();

        const bulkOps = [];

        for (const member of members) {
            if (member.family_details && member.family_details.length > 0) {
                // Update the embedded array in memory
                member.family_details.forEach((familyMember, index) => {
                    familyMember.id = `S${index + 1}-${member.member_id}`;
                });

                // Push the full update for the parent member
                bulkOps.push({
                    updateOne: {
                        filter: { _id: member._id },
                        update: { $set: { family_details: member.family_details } },
                        timestamps: false,
                    },
                });
            }
        }

        if (bulkOps.length > 0) {
            await Members.bulkWrite(bulkOps);
            console.log('Bulk update completed');
            responseSend(res, httpCodes.OK, 'Bulk update completed', {});
        } else {
            console.log('No updates needed');
            responseSend(res, httpCodes.OK, 'No updates needed', {});
        }
    } catch (error) {
        next(error);
    }
};

export const updateMembershipPlan = async (req, res, next) => {
    try {
        const { member_ids, plan_id, update_secondary } = req.query;
        console.log(member_ids.split(','), 'member_ids');
        console.log(plan_id, 'plan_id');
        // // find all member and update their secondary member id based on primary member like member id is 00001 add S1-00001 for first family_details

        const membersData = await Members.find({
            member_id: { $in: member_ids.split(',') },
        });

        const planData = await readPlans({ _id: plan_id });

        const bulkOps = [];

        for (const member of membersData) {
            const updateOperations = [];

            if (update_secondary) {
                // Update secondary member plans
                member.family_details.forEach((familyMember, index) => {
                    updateOperations.push({
                        $set: {
                            [`family_details.${index}.plans`]:
                                addStartAndEndDates(planData),
                        },
                    });
                });
            }

            // Update primary member plan
            updateOperations.push({
                $set: {
                    current_plan: addStartAndEndDates(planData),
                },
            });

            // Combine all operations for this member
            bulkOps.push({
                updateOne: {
                    filter: { _id: member._id },
                    update: {
                        $set: Object.assign({}, ...updateOperations.map((op) => op.$set)),
                    },
                },
            });
        }

        await Members.bulkWrite(bulkOps);

        responseSend(res, httpCodes.OK, 'Bulk update completed', {
            membersData,
            planData,
            bulkOps,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Temporary API to update active field in family_details based on member status
 *
 * This function:
 * 1. Finds all members in the database
 * 2. For each member with family_details, updates the 'active' field of each family member
 * 3. Sets family_details[].active = member.status (true for active members, false for inactive)
 * 4. Uses bulkWrite for efficient database operations
 *
 * Usage: GET /api/members/temp-update-family-active-status
 *
 * This is a one-time operation to sync family member active status with their primary member's status.
 * After running this, you can remove the API endpoint.
 */
export const updateFamilyDetailsActiveStatus = async (req, res, next) => {
    try {
        console.log('Starting bulk update of family_details active status...');

        // Find all members
        const members = await Members.find();
        console.log(`Found ${members.length} members to process`);

        const bulkOps = [];
        let updatedCount = 0;
        let skippedCount = 0;
        let activeMembersCount = 0;
        let inactiveMembersCount = 0;

        for (const member of members) {
            if (member.family_details && member.family_details.length > 0) {
                console.log(
                    `Processing member ${member.member_id} (${member.name}) - Status: ${member.status}, Family members: ${member.family_details.length}`,
                );

                // Create update operations for each family member
                const familyUpdates = member.family_details.map(
                    (familyMember, index) => ({
                        $set: {
                            [`family_details.${index}.active`]: member.status,
                        },
                    }),
                );

                // Combine all family updates for this member
                const combinedUpdate = {
                    $set: Object.assign(
                        {},
                        ...familyUpdates.map((update) => update.$set),
                    ),
                };

                bulkOps.push({
                    updateOne: {
                        filter: { _id: member._id },
                        update: combinedUpdate,
                        timestamps: false,
                    },
                });

                updatedCount += member.family_details.length;

                if (member.status) {
                    activeMembersCount++;
                } else {
                    inactiveMembersCount++;
                }
            } else {
                skippedCount++;
            }
        }

        if (bulkOps.length > 0) {
            console.log(`Executing ${bulkOps.length} bulk operations...`);
            console.log(
                `Active members: ${activeMembersCount}, Inactive members: ${inactiveMembersCount}`,
            );

            const result = await Members.bulkWrite(bulkOps);
            console.log('Bulk update completed successfully');
            console.log('Bulk write result:', result);

            responseSend(
                res,
                httpCodes.OK,
                'Family details active status updated successfully',
                {
                    totalMembers: members.length,
                    membersWithFamily: bulkOps.length,
                    familyMembersUpdated: updatedCount,
                    membersSkipped: skippedCount,
                    activeMembers: activeMembersCount,
                    inactiveMembers: inactiveMembersCount,
                    bulkWriteResult: result,
                },
            );
        } else {
            console.log('No updates needed - no members with family details found');
            responseSend(
                res,
                httpCodes.OK,
                'No updates needed - no members with family details found',
                {
                    totalMembers: members.length,
                    membersWithFamily: 0,
                    familyMembersUpdated: 0,
                    membersSkipped: members.length,
                },
            );
        }
    } catch (error) {
        console.error('Error updating family details active status:', error);
        next(error);
    }
};
