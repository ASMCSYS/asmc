'use strict';

import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import path from 'path';
import {
    insertContactUs,
    readAllContactData,
    readAllDatabaseBackup,
} from './common.service.js';
import sendEmail from '../../utils/email.js';
import Members from '../../models/members.js';
import PaymentHistory from '../../models/payment_history.js';
import { readPlans } from '../plans/plans.service.js';
import { readMembers, updateMembers } from '../members/members.service.js';

import fs from 'fs';
import { exec } from 'child_process';
import archiver from 'archiver';

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import MemberOldPlans from '../../models/member_old_plans.js';
import mongoose from 'mongoose';
import { readBookings, updateBookings } from '../bookings/bookings.service.js';
import cmsModel from '../../models/cms.js';
import DatabaseBackup from '../../models/database_backup.js';
import { imagekit } from '../../middlewares/imagekit.js';
import Activity from '../../models/activity.js';
import Halls from '../../models/halls.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `/.env.${process.env.NODE_ENV}`) });

export const getDashboardCount = async (req, res, next) => {
    try {
        const totalMemberCount = await Members.count();
        const activeMemberCount = await Members.count({ status: true });
        const activePlanMemberCount = await Members.count({
            status: true,
            current_plan: { end_date: { $gte: new Date() } },
        });

        const totalAmountReceivedByPaymentMode = await PaymentHistory.aggregate([
            {
                $match: {
                    payment_status: 'Success', // Filter for successful payments only
                },
            },
            {
                // Join the `plans` collection to get details for each `plan_id`
                $lookup: {
                    from: 'plans', // The `plans` collection
                    localField: 'plan_id', // The `plan_id` field in the current collection
                    foreignField: '_id', // The `_id` field in the `plans` collection
                    as: 'planDetails', // The name of the field to store the joined data
                },
            },
            {
                $project: {
                    payment_mode: 1,
                    amount_paid: 1,
                    planDetails: 1, // Include the joined plan details
                    membershipAmount: {
                        // Sum the amounts from `planDetails` where `plan_type` is "membership"
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$planDetails',
                                        as: 'plan',
                                        cond: { $eq: ['$$plan.plan_type', 'membership'] },
                                    },
                                },
                                as: 'membershipPlan',
                                in: '$$membershipPlan.amount', // Get the amount for membership plans
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    payment_mode: 1,
                    amount_paid: 1,
                    membershipAmount: 1,
                    enrollmentAmount: {
                        // Calculate enrollment amount by subtracting membershipAmount from amount_paid
                        $subtract: ['$amount_paid', '$membershipAmount'],
                    },
                    isMembership: {
                        // Check if there is a membership amount
                        $cond: {
                            if: { $gt: ['$membershipAmount', 0] },
                            then: 1,
                            else: 0,
                        },
                    },
                    isEnrollment: {
                        // Check if the enrollment amount is greater than 0
                        $cond: {
                            if: {
                                $gt: [
                                    { $subtract: ['$amount_paid', '$membershipAmount'] },
                                    0,
                                ],
                            },
                            then: 1,
                            else: 0,
                        },
                    },
                },
            },
            {
                // Group by payment_mode and sum the amounts for membership and enrollment, along with counting
                $group: {
                    _id: '$payment_mode', // Group by payment_mode
                    totalAmountReceivedMembership: { $sum: '$membershipAmount' },
                    totalAmountReceivedEnrollment: { $sum: '$enrollmentAmount' },
                    membershipCount: { $sum: '$isMembership' }, // Count membership payments
                    enrollmentCount: { $sum: '$isEnrollment' }, // Count enrollment payments
                    totalCount: { $sum: 1 }, // Total count of payments per mode
                },
            },
            {
                // Optional: Sort results by total amount received for membership
                $sort: { totalAmountReceivedMembership: -1 },
            },
            {
                // Format the output
                $project: {
                    _id: 0, // Hide the default _id field
                    payment_mode: '$_id', // Rename _id to payment_mode
                    totalAmountReceivedMembership: 1,
                    totalAmountReceivedEnrollment: 1,
                    membershipCount: 1, // Include membership count
                    enrollmentCount: 1, // Include enrollment count
                    totalCount: 1, // Include the total count of payments for each mode
                },
            },
        ]);

        // can you generate last 12 months members data createdAt each month record for line chart graph
        const memberCountByMonth = await Members.aggregate([
            {
                // Project year and month from createdAt field
                $project: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
            },
            {
                // Group by year and month, and count the members
                $group: {
                    _id: { year: '$year', month: '$month' },
                    memberCount: { $sum: 1 },
                },
            },
            {
                // Optionally filter for the current year
                $match: {
                    '_id.year': new Date().getFullYear(), // Use specific year if required
                },
            },
            {
                // Sort the result by month
                $sort: { '_id.month': 1 },
            },
            {
                // Format the result to return only the month and member count
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    count: '$memberCount',
                },
            },
        ]);

        // Initialize an object with all 12 months set to 0
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const memberCountWithZero = months.reduce((acc, month) => {
            acc[month] = 0; // Set default count to 0 for each month
            return acc;
        }, {});

        // Fill in the actual counts from the aggregation result
        memberCountByMonth.forEach(({ month, count }) => {
            memberCountWithZero[month] = count; // Overwrite with actual count
        });

        // can you generate last 12 months payment data from paymentHistory createdAt each month record for line chart graph but apply payment status = success filter
        const paymentAmountByMonth = await PaymentHistory.aggregate([
            {
                // Filter payments with status "Success" first
                $match: {
                    payment_status: 'Success', // Filter only successful payments
                    createdAt: { $exists: true }, // Ensure createdAt field exists
                },
            },
            {
                // Project year and month from createdAt field
                $project: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    amount_paid: 1, // Include amount_paid field in projection
                },
            },
            {
                // Group by year and month, and sum the amount_paid for each group
                $group: {
                    _id: { year: '$year', month: '$month' },
                    totalAmount: { $sum: '$amount_paid' }, // Sum the amount_paid field
                },
            },
            {
                // Optionally filter for the current year
                $match: {
                    '_id.year': new Date().getFullYear(), // Filter for the current year if required
                },
            },
            {
                // Sort the result by month
                $sort: { '_id.month': 1 },
            },
            {
                // Format the result to return only the month and total amount
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    totalAmount: '$totalAmount', // Total amount paid for the month
                },
            },
        ]);

        // Initialize an object with all 12 months set to 0
        const paymentCountWithZero = months.reduce((acc, month) => {
            acc[month] = 0; // Set default count to 0 for each month
            return acc;
        }, {});

        // Fill in the actual counts from the aggregation result
        paymentAmountByMonth.forEach(({ month, totalAmount }) => {
            paymentCountWithZero[month] = totalAmount; // Overwrite with actual count
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            memberCountWithZero,
            paymentCountWithZero,
            totalMemberCount,
            activeMemberCount,
            activePlanMemberCount,
            totalAmountReceivedByPaymentMode,
        });
    } catch (error) {
        next(error);
    }
};

export const getAppStats = async (req, res, next) => {
    try {
        // Get current date in DD/MM/YYYY format
        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY

        // Total active members with current plan and not expired
        const totalActiveMembers = await Members.count({
            status: true,
            current_plan: { $exists: true, $ne: null },
            'current_plan.end_date': { $gte: currentDateString },
        });

        // Total active sports activities
        const totalSportsActivities = await Activity.count({
            status: true,
        });

        // Total Halls
        const totalHalls = await Halls.count({
            status: true,
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            totalActiveMembers,
            totalSportsActivities,
            totalHalls,
        });
    } catch (error) {
        next(error);
    }
};

export const uploadSingleImage = async (req, res, next) => {
    try {
        return responseSend(res, httpCodes.OK, 'File Uploaded Successfully', req.file);
    } catch (error) {
        next(error);
    }
};

export const uploadMultipleImage = async (req, res, next) => {
    try {
        const paths = [];
        req.files.map((obj) => {
            paths.push(obj.path);
        });
        return responseSend(res, httpCodes.OK, 'File Uploaded Successfully', paths);
    } catch (error) {
        next(error);
    }
};

export const contactUsData = async (req, res, next) => {
    try {
        await insertContactUs(req.body);
        return responseSend(res, httpCodes.OK, 'Form submitted successfully', req.file);
    } catch (error) {
        next(error);
    }
};

export const getContactUsData = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
        } = req.query;

        let filter = {};

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { email: { $regex: keywords, $options: 'i' } },
                    { phone_number: { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllContactData(
            filter,
            null,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Contact Us records', {
            ...result,
            ...req.query,
        });
    } catch (error) {
        next(error);
    }
};

export const sendTestMail = async (req, res, next) => {
    try {
        const { email } = req.query;

        // const mailRes = await sendEmail(email, "enrollment_created", {});
        // const mailRes = await sendEmail(email, "forgot_password_46564", { otp: '1234' });
        const mailRes = await sendEmail(email, 'send_welcome_email', { email: email });
        responseSend(res, httpCodes.OK, 'Mail Response', mailRes);
    } catch (error) {
        next(error);
    }
};

export const updatePaymentHistory = async (req, res, next) => {
    try {
        // Step 1: Fetch members whose current plan starts in 2025 and has a valid plan_id
        const membersData = await Members.find(
            {
                'current_plan.start_date': '01/04/2025',
                'current_plan.plan_id': { $exists: true, $ne: null },
            },
            { _id: 1, member_id: 1, current_plan: 1, family_details: 1 },
            { limit: 80 },
        ).lean();

        if (!membersData.length) {
            return responseSend(res, 200, 'No members found', []);
        }

        // Step 2: Create an array of { member_id, plan_id }
        const memberPlanPairs = membersData.map((member) => ({
            member_id: member._id,
            plan_id: new mongoose.Types.ObjectId(member.current_plan.plan_id),
        }));

        // Step 3: Fetch successful payment histories
        const successfulPayments = await PaymentHistory.find(
            {
                $or: memberPlanPairs.map(({ member_id, plan_id }) => ({
                    member_id,
                    plan_id: { $in: [plan_id] },
                    payment_status: 'Success',
                    // createdAt: {
                    //     $gte: new Date('2025-01-01T00:00:00.000Z'),
                    //     $lt: new Date('2026-01-01T00:00:00.000Z'),
                    // },
                })),
            },
            {
                member_id: 1,
                plan_id: 1,
                createdAt: 1,
                payment_status: 1,
                amount: 1,
                verifiedAt: 1,
            }, // Add more fields as needed
        ).lean();

        // Step 4: Map payment history for lookup
        const paymentMap = new Map();
        successfulPayments.forEach((payment) => {
            payment.plan_id.forEach((plan) => {
                const key = `${payment.member_id.toString()}-${plan.toString()}`;
                paymentMap.set(key, payment);
            });
        });

        // Step 5: Build result including payment history (if exists)
        const unpaidMembers = membersData
            .map((member) => {
                const key = `${member._id.toString()}-${member.current_plan.plan_id}`;
                return {
                    ...member,
                    payment_history: paymentMap.get(key) || null,
                };
            })
            .filter((member) => !member.payment_history); // Only keep unpaid

        // Step 6: Return final result
        return responseSend(res, 200, 'Success', unpaidMembers);

        const updates = [];

        for (const member of unpaidMembers) {
            const { _id, current_plan, family_details } = member;

            if (!current_plan?.plan_id) continue; // Skip if no plan exists

            // // Check if a successful payment exists
            // const paymentExists = await PaymentHistory.exists({
            //     member_id: _id,
            //     plan_id: current_plan.plan_id,
            //     payment_status: 'Success',
            //     createdAt: {
            //         $gte: new Date('2025-01-01T00:00:00.000Z'), // Start of 2025
            //         $lt: new Date('2026-01-01T00:00:00.000Z'), // Start of 2026 (Exclusive)
            //     },
            // });

            // if (!paymentExists) updates.push(member);

            // if (!paymentExists) {
            //     // Extract start & end date
            const [startDay, startMonth, startYear] = current_plan.start_date
                .split('/')
                .map(Number);
            const [endDay, endMonth, endYear] = current_plan.end_date
                .split('/')
                .map(Number);

            // Shift year back by 1
            const newStartDate = `${startDay}/${startMonth}/${startYear - 1}`;
            const newEndDate = `${endDay}/${endMonth}/${endYear - 1}`;

            // // Update family details
            const updatedFamilyDetails = family_details.map((family) => {
                if (family.plans?.start_date && family.plans?.end_date) {
                    const [fStartDay, fStartMonth, fStartYear] = family.plans.start_date
                        .split('/')
                        .map(Number);
                    const [fEndDay, fEndMonth, fEndYear] = family.plans.end_date
                        .split('/')
                        .map(Number);

                    return {
                        ...family,
                        plans: {
                            ...family.plans,
                            start_date: `${fStartDay}/${fStartMonth}/${fStartYear - 1}`,
                            end_date: `${fEndDay}/${fEndMonth}/${fEndYear - 1}`,
                        },
                        fees_paid: false, // Reset fees
                    };
                }
                return family;
            });

            updates.push({
                updateOne: {
                    filter: { _id: _id },
                    update: {
                        $set: {
                            'current_plan.start_date': newStartDate,
                            'current_plan.end_date': newEndDate,
                            family_details: updatedFamilyDetails,
                            fees_paid: false, // Reset fees
                            fees_verified: false, // Reset fees
                        },
                    },
                },
            });
            // }
        }

        // console.log(updates);

        // Perform bulk update
        if (updates.length) {
            await Members.bulkWrite(updates);
        }

        console.log(updates.length, 'updates');
        return responseSend(res, httpCodes.OK, 'Fetched', updates);
        // return 'fees_breakup updated successfully.';
        // find family with no start end date in plans
        // const membersWithoutDates = await Members.aggregate([
        //     {
        //         $match: {
        //             'family_details.plans.start_date': { $exists: false },
        //             'family_details.plans.end_date': { $exists: false },
        //             'family_details.plans': { $exists: true },
        //             fees_paid: true,
        //         },
        //     },
        // ]);

        // const updatePromises = membersWithoutDates.map(async (member) => {
        //     const updatedFamilyDetails = member.family_details.map((family) => {
        //         if (family.plans) {
        //             if (!family.plans?.start_date || !family.plans?.end_date) {
        //                 const plan = family.plans || {}; // Ensure `plans` exists

        //                 // Get start and end months from plan
        //                 const start_month = plan.start_month;
        //                 const end_month = plan.end_month;

        //                 // Get the current year
        //                 const currentDate = new Date();
        //                 const currentYear = currentDate.getFullYear();
        //                 const currentMonth = currentDate.getMonth() + 1;

        //                 // Set the start year based on start_month
        //                 let startYear = currentYear;
        //                 if (start_month < currentMonth) {
        //                     startYear += 1;
        //                 }

        //                 // Set the start date
        //                 const startDate = new Date(startYear, start_month - 1, 1);

        //                 // Calculate the correct end year
        //                 let endYear = startYear;
        //                 if (end_month < start_month) {
        //                     endYear += 1; // Normally, a cross-year plan (e.g., April 2025 - March 2026)
        //                 }

        //                 // **Ensure the end year is never 2026**
        //                 if (
        //                     family.plans.start_month === 4 &&
        //                     family.plans.end_month === 3
        //                 ) {
        //                     startDate.setFullYear(2024);
        //                     endYear = 2025;
        //                 } else if (
        //                     family.plans.start_month === 10 &&
        //                     family.plans.end_month === 3
        //                 ) {
        //                     startDate.setFullYear(2024);
        //                     endYear = 2025;
        //                 }

        //                 // Set the end date (last day of end_month)
        //                 let endDate = new Date(endYear, end_month, 0);

        //                 // Update the family member's plans
        //                 family.plans = {
        //                     ...plan,
        //                     start_date: `${String(startDate.getDate()).padStart(
        //                         2,
        //                         '0',
        //                     )}/${String(startDate.getMonth() + 1).padStart(
        //                         2,
        //                         '0',
        //                     )}/${startDate.getFullYear()}`,
        //                     end_date: `${String(endDate.getDate()).padStart(
        //                         2,
        //                         '0',
        //                     )}/${String(endDate.getMonth() + 1).padStart(
        //                         2,
        //                         '0',
        //                     )}/${endDate.getFullYear()}`,
        //                     updated_at: new Date().toISOString(),
        //                 };
        //             }
        //         }
        //         return family;
        //     });

        //     // Update the member record in the database
        //     return Members.updateOne(
        //         { _id: member._id },
        //         { $set: { family_details: updatedFamilyDetails } },
        //     );
        // });

        // // Execute all updates
        // await Promise.all(updatePromises);
        // console.log('Family member plans updated successfully.');

        // find booking with manual payment of enrollment but the payment history amount is not matching with booking amount
        // const history = await PaymentHistory.find({
        //     payment_status: 'Success',
        //     payment_mode: { $ne: 'Online' },
        //     booking_id: { $exists: true, $ne: [] },
        // }).select('booking_id amount_paid');

        // const bookingIds = [];

        // for (let index = 0; index < history.length; index++) {
        //     const element = history[index];

        //     const booking = await Bookings.findOne({ _id: element.booking_id[0] }).select(
        //         'booking_id total_amount',
        //     );

        //     if (booking?.total_amount !== element.amount_paid) {
        //         console.log(booking?.booking_id, 'booking?.booking_id');
        //         bookingIds.push(booking?.booking_id);
        //     }
        // }

        // return responseSend(res, httpCodes.OK, 'success', bookingIds);

        // limit 100
        // booking_id array length > 0
        // const allPayment = await PaymentHistory.find(
        //     {
        //         payment_status: 'Success',
        //         payment_mode: 'Online',
        //         booking_id: { $gt: [] },
        //     },
        //     { _id: 1, booking_id: 1 },
        // ).lean();

        // const bookingIdsToCheck = allPayment.flatMap((payment) => payment.booking_id);

        // const bookingsWithMismatchedStatus = await Bookings.find(
        //     {
        //         _id: { $in: bookingIdsToCheck },
        //         payment_status: { $ne: 'Success' }, // Find bookings with payment_status not equal to 'Success'
        //     },
        //     { _id: 1 },
        // ).lean();

        // const mismatchedBookingIds = bookingsWithMismatchedStatus.map(
        //     (booking) => booking._id,
        // );

        // return responseSend(res, httpCodes.OK, 'success', mismatchedBookingIds);
        // update fees_paid for all family members as secondary member
        // const memberUpdateRes = await Members.updateMany(
        //     {
        //         fees_paid: true,
        //     },
        //     {
        //         $set: {
        //             'family_details.$[].fees_paid': true, // Updates all elements in the array
        //         },
        //     },
        // );
        // responseSend(res, httpCodes.OK, 'success', memberUpdateRes);
        // return false;

        // copy plans of members to all family members
        const members = await Members.aggregate([
            {
                $match: {
                    current_plan: { $exists: true },
                    'family_details.plans.start_date': { $exists: false },
                },
            },
            {
                $addFields: {
                    family_details: {
                        $map: {
                            input: '$family_details',
                            as: 'family',
                            in: {
                                $mergeObjects: ['$$family', { plans: '$current_plan' }],
                            },
                        },
                    },
                },
            },
            {
                $merge: {
                    into: 'members',
                    whenMatched: 'replace',
                    whenNotMatched: 'fail',
                },
            },
        ]);
        responseSend(res, httpCodes.OK, 'success', members);
        return false;

        // update payment verifiedAt
        // const findSuccessPayment = await PaymentHistory.find({
        //     payment_status: "Success",
        //     verifiedAt: { $exists: false }
        // });

        // if (findSuccessPayment && findSuccessPayment.length > 0) {

        //     findSuccessPayment.forEach(async (item) => {
        //         if (item?.verifiedAt) {
        //             await PaymentHistory.updateOne(
        //                 { _id: item._id, payment_status: "Success" },
        //                 { $set: { verifiedAt: new Date(item.verifiedAt).toISOString() } }
        //             );
        //         } else {
        //             await PaymentHistory.updateOne(
        //                 { _id: item._id, payment_status: "Success" },
        //                 { $set: { verifiedAt: item.updatedAt } }
        //             );
        //         }
        //     })

        //     return responseSend(res, httpCodes.OK, "Success", true);
        // }

        // return false;

        // const notExist = [];
        // // find all the records and if not found add in notexist variable
        // const findRecords = []

        // const matchCondition = {
        //     order_id: { $in: findRecords },
        //     payment_status: "Success",
        // };

        // // Step 1: Query to find all matching order IDs
        // const existingOrders = await PaymentHistory.find(matchCondition, { order_id: 1, _id: 0 });

        // // Step 2: Extract the list of found order IDs
        // const existingOrderIds = existingOrders.map((order) => order.order_id);

        // // Step 3: Find missing order IDs
        // const missingOrderIds = findRecords.filter((id) => !existingOrderIds.includes(id));

        // // Step 4: Prepare the response
        // const result = {
        //     existingOrders: existingOrderIds,
        //     missingOrders: missingOrderIds,
        // };

        // return responseSend(res, httpCodes.OK, "Success", result);

        // fix all the payment status to success in bookings
        // Step 1: Find all booking IDs with a success status in PaymentHistory
        // const successfulPayments = await PaymentHistory.find({ payment_status: 'Success', booking_type: "enrollment", booking_id: { $exists: true } }, 'booking_id').lean();

        // // Extract booking IDs from successful payments
        // const bookingIds = successfulPayments
        //     .flatMap(payment => payment.booking_id) // Flatten array of booking IDs
        //     .filter(id => !!id);

        // // return responseSend(res, httpCodes.OK, "Payment History", bookingIds);

        // if (bookingIds.length > 0) {
        //     // Step 2: Update matching bookings with payment_status to 'Success'
        //     await Bookings.updateMany(
        //         { _id: { $in: bookingIds } },
        //         { $set: { payment_status: 'Success' } }
        //     );

        //     console.log(`Updated ${bookingIds.length} booking records to payment_status 'Success'.`);
        // }

        // const findBookings = await

        // update bookings with show_renew_button true
        // const recordsToUpdate = await Bookings.updateMany(
        //     { show_renew_button: false },
        // );
        // return responseSend(res, httpCodes.OK, "Bookings Updated", recordsToUpdate);

        // update payment_verified_at date based on the last updated
        // const recordsToUpdate = await Bookings.aggregate([
        //     {
        //         $match: {
        //             payment_verified_at: null
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,  // Include only _id to identify records to update
        //             payment_verified_at: 1,  // Include only _id to identify records to update
        //             updatedAt: 1  // Include updated_at for the update
        //         }
        //     }
        // ]);

        // const bulkOps = recordsToUpdate.map(record => ({
        //     updateOne: {
        //         filter: { _id: record._id },
        //         update: { $set: { payment_verified_at: record.updatedAt } }
        //     }
        // }));

        // if (bulkOps.length > 0) {
        //     await Bookings.bulkWrite(bulkOps, { timestamps: false });
        // }

        // responseSend(res, httpCodes.OK, "Payment History", bulkOps);
        // return false;

        // const initiatedPaymentsWithSuccessfulRecords = await PaymentHistory.aggregate([
        //     {
        //         $match: {
        //             payment_status: "Initiated",
        //             payment_mode: "Online"
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: false,
        //             amount_paid: 1,
        //             order_id: 1,
        //         }
        //     }
        // ]);

        // const orderIds = initiatedPaymentsWithSuccessfulRecords.map((payment) => payment.order_id);

        // responseSend(res, httpCodes.OK, "Response", { order_id: orderIds });
        // return false;

        const paymentsData = [
            {
                order_id: 'ORD7143815265',
                amount_paid: 2450,
            },
            {
                order_id: 'ORD6734916734',
                amount_paid: 6000,
            },
            {
                order_id: 'ORD8709641184',
                amount_paid: 6000,
            },
            {
                order_id: 'ORD4921427095',
                amount_paid: 8850,
            },
            {
                order_id: 'ORD8066862354',
                amount_paid: 3300,
            },
        ];

        const promises = paymentsData.map(async (payment) => {
            const { order_id, amount_paid } = payment;

            try {
                // Fetch the payment history for the order_id
                const paymentHistory = await PaymentHistory.findOne({
                    order_id: order_id,
                    amount_paid: amount_paid,
                });

                for (let i = 0; i < paymentHistory?.plan_id.length; i++) {
                    const planData = await readPlans({
                        _id: mongoose.Types.ObjectId(paymentHistory?.plan_id[i]),
                    });

                    if (!planData) {
                        console.log(`Plan does not exist for order: ${order_id}`);
                        return;
                    }

                    // Update payment status
                    await PaymentHistory.updateOne(
                        { _id: paymentHistory._id },
                        {
                            $set: {
                                payment_status: 'Success',
                                booking_type: planData?.plan_type,
                            },
                        },
                    );
                    console.log(
                        `Payment status for ${order_id} and plan type ${planData?.plan_type} updated to Success`,
                    );

                    // Handle membership and enrollment logic
                    if (planData?.plan_type === 'membership') {
                        // Handle membership logic (update user current plan)
                        const userData = await readMembers({
                            _id: paymentHistory.member_id,
                        });

                        userData.fees_paid = true;
                        userData.fees_verified = true;
                        userData.feesPaidAt = new Date().toISOString();
                        userData.feesVerifiedAt = new Date().toISOString();

                        // Store the previous plan in members_old_plans
                        await MemberOldPlans.create({
                            member_id: userData._id,
                            old_plan: userData.current_plan,
                            type: 'membership',
                        });

                        const start_month = planData?.start_month;
                        const end_month = planData?.end_month;

                        // Calculate the current year
                        const currentYear = new Date().getFullYear();

                        // Calculate the start date (1st day of the start month)
                        const startDate = new Date(currentYear, start_month - 1, 1);

                        // Calculate the end date (last day of the end month of the next year)
                        // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                        const endYear =
                            end_month <= start_month ? currentYear + 1 : currentYear;
                        const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                        userData.current_plan = {
                            plan_id: planData?.plan_id,
                            plan_name: planData?.plan_name,
                            amount: planData?.amount,
                            final_amount: planData?.amount,
                            start_month: planData?.start_month,
                            end_month: planData?.end_month,
                            dependent_member_price: planData?.dependent_member_price,
                            non_dependent_member_price:
                                planData?.non_dependent_member_price,
                            start_date:
                                String(startDate.getDate()).padStart(2, '0') +
                                '/' +
                                String(startDate.getMonth() + 1).padStart(2, '0') +
                                '/' +
                                startDate.getFullYear(),
                            end_date:
                                String(endDate.getDate()).padStart(2, '0') +
                                '/' +
                                String(endDate.getMonth() + 1).padStart(2, '0') +
                                '/' +
                                endDate.getFullYear(),
                        };
                        await updateMembers({ _id: userData._id }, userData);
                    } else if (planData?.plan_type === 'enrollment') {
                        for (
                            let index = 0;
                            index < paymentHistory?.booking_id.length;
                            index++
                        ) {
                            const bookingId = paymentHistory?.booking_id[index];
                            const bookingData = await readBookings({ _id: bookingId });
                            if (!bookingData) {
                                throw new Error('Booking does not exist!');
                            }

                            bookingData.payment_status = 'Success';
                            bookingData.payment_verified_at = new Date().toISOString();
                            bookingData.feesPaidAt = new Date().toISOString();
                            bookingData.show_renew_button = false;

                            if (bookingData?.fees_breakup) {
                                const start_month =
                                    bookingData?.fees_breakup?.start_month;
                                const end_month = bookingData?.fees_breakup?.end_month;

                                // Calculate the current year and month
                                const currentDate = new Date();
                                const currentYear = currentDate.getFullYear();
                                const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                                // Calculate the start date (1st day of the start month)
                                const startDate = new Date(
                                    start_month < currentMonth
                                        ? currentYear + 1
                                        : currentYear,
                                    start_month - 1,
                                    1,
                                );

                                // Calculate the end date (last day of the end month of the next year)
                                // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                                const endYear =
                                    end_month < start_month ||
                                    (start_month < currentMonth &&
                                        end_month <= currentMonth)
                                        ? currentYear + 1
                                        : currentYear;

                                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                                // Format the dates as DD/MM/YYYY
                                bookingData.fees_breakup.start_date =
                                    String(startDate.getDate()).padStart(2, '0') +
                                    '/' +
                                    String(startDate.getMonth() + 1).padStart(2, '0') +
                                    '/' +
                                    startDate.getFullYear();
                                bookingData.fees_breakup.end_date =
                                    String(endDate.getDate()).padStart(2, '0') +
                                    '/' +
                                    String(endDate.getMonth() + 1).padStart(2, '0') +
                                    '/' +
                                    endDate.getFullYear();
                            }
                            // Store the previous plan in members_old_plans
                            await MemberOldPlans.create({
                                member_id: bookingData.member_id,
                                booking_id: bookingData._id,
                                old_plan: bookingData.fees_breakup,
                                type: 'enrollment',
                            });

                            await updateBookings({ _id: bookingId }, bookingData);
                        }
                    }
                }

                console.log(`Payment for order ${order_id} processed successfully`);
            } catch (error) {
                console.error(`Error processing order ${order_id}:`, error);
            }
        });

        await Promise.all(promises);

        responseSend(res, httpCodes.OK, 'Payment processed successfully');
    } catch (error) {
        next(error);
    }
};

export const generateAndUploadBackup = async () => {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupFolder = path.join(
            __dirname,
            `../../../temp_backups/backup_${timestamp}`,
        );
        const zipFilename = `backup_${timestamp}.zip`;
        const zipPath = path.join(__dirname, `../../../public/${zipFilename}`);
        const mongodumpCommand = `mongodump --uri="${process.env.MONGO_URI}" --out="${backupFolder}"`;

        exec(mongodumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Backup failed:', error.message);
                return reject(new Error('Backup failed'));
            }

            if (stderr) console.error('Backup stderr:', stderr);

            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                fs.rmSync(backupFolder, { recursive: true, force: true });

                const uploadStream = fs.createReadStream(zipPath);

                imagekit.upload(
                    {
                        file: uploadStream,
                        fileName: zipFilename,
                        folder: 'db_backup',
                    },
                    async (err, response) => {
                        if (err) {
                            console.error('ImageKit Upload Error:', err);
                            return reject(new Error('ImageKit upload failed'));
                        }

                        fs.unlink(zipPath, async (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Failed to delete local zip:', unlinkErr);
                            }

                            const backupRecord = new DatabaseBackup({
                                date: new Date().toISOString(),
                                url: response?.url,
                                size:
                                    (archive.pointer() / (1024 * 1024)).toFixed(2) +
                                    ' MB',
                            });

                            await backupRecord.save();
                            resolve(backupRecord);
                        });
                    },
                );
            });

            archive.on('error', (err) => {
                console.error('Archive error:', err);
                reject(new Error('Failed to zip backup folder'));
            });

            archive.pipe(output);
            archive.directory(backupFolder, false);
            archive.finalize();
        });
    });
};

export const backupDB = async (req, res, next) => {
    try {
        const result = await generateAndUploadBackup();
        return responseSend(res, httpCodes.OK, 'Backup successful', result);
    } catch (err) {
        console.error('Backup Error:', err.message);
        return responseSend(
            res,
            httpCodes.INTERNAL_SERVER_ERROR,
            err.message || 'Backup failed',
        );
    }
};

export const getAllBackups = async (req, res) => {
    try {
        const {
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
        } = req.query;

        let result = await readAllDatabaseBackup(
            {},
            null,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Backup list fetched successfully', {
            ...result,
            ...req.query,
        });
    } catch (err) {
        console.error('Fetch Backups Error:', err);
        return responseSend(
            res,
            httpCodes.INTERNAL_SERVER_ERROR,
            'Unable to fetch backups',
        );
    }
};

export const restoreDB = (req, res, next) => {
    const backupPath = path.join(__dirname, `../../../../${req.query.path}`);
    const mongorestoreCommand = `mongorestore --uri="${process.env.MONGO_URI}" --drop "${backupPath}"`;

    exec(mongorestoreCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Restore failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Restore error: ${stderr}`);
            return;
        }
        console.log(`Restore success: ${stdout}`);
    });

    responseSend(res, httpCodes.OK, 'Restore created successfully', backupPath);
};

// Home Page CMS Controller
export const getHomePageCms = async (req, res, next) => {
    try {
        const cmsData = await cmsModel.findOne({ key: 'home_page_cms' });
        responseSend(res, httpCodes.OK, 'Home Page CMS Fetched Successfully', cmsData);
    } catch (error) {
        next(error);
    }
};

export const updateHomePageCms = async (req, res, next) => {
    try {
        const cmsData = await cmsModel.findOne({ key: 'home_page_cms' });
        if (!cmsData) {
            await cmsModel.create({ key: 'home_page_cms', json: req.body });
        } else {
            await cmsModel.findOneAndUpdate({ key: 'home_page_cms' }, { json: req.body });
        }
        responseSend(res, httpCodes.OK, 'Home Page CMS Updated Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getAboutPageCms = async (req, res, next) => {
    try {
        const cmsData = await cmsModel.findOne({ key: 'about_page_cms' });
        responseSend(res, httpCodes.OK, 'About Page CMS Fetched Successfully', cmsData);
    } catch (error) {
        next(error);
    }
};

export const updateAboutPageCms = async (req, res, next) => {
    try {
        const cmsData = await cmsModel.findOne({ key: 'about_page_cms' });
        if (!cmsData) {
            await cmsModel.create({ key: 'about_page_cms', json: req.body });
        } else {
            await cmsModel.findOneAndUpdate(
                { key: 'about_page_cms' },
                { json: req.body },
            );
        }
        responseSend(res, httpCodes.OK, 'About Page CMS Updated Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getSettingsDefault = async (req, res, next) => {
    try {
        const cmsData = await cmsModel.findOne({ key: 'settings_default' });
        responseSend(res, httpCodes.OK, 'About Page CMS Fetched Successfully', cmsData);
    } catch (error) {
        next(error);
    }
};

export const updateSettingsDefault = async (req, res, next) => {
    try {
        const cmsData = await cmsModel.findOne({ key: 'settings_default' });
        if (!cmsData) {
            await cmsModel.create({ key: 'settings_default', json: req.body });
        } else {
            await cmsModel.findOneAndUpdate(
                { key: 'settings_default' },
                { json: req.body },
            );
        }
        responseSend(res, httpCodes.OK, 'Settings Updated Successfully', {});
    } catch (error) {
        next(error);
    }
};
