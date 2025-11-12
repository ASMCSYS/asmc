'use strict';

import { FRONTEND_BASE_URL, activity_new_mail_content } from '../../helpers/constance.js';
import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import { readMembers } from '../members/members.service.js';
import {
    createBookings,
    deleteBookings,
    readBookings,
    readAllBookings,
    updateBookings,
    readSingleBookings,
} from './bookings.service.js';

import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import sendEmail, { sendEmailNode } from '../../utils/email.js';
import { readBatch, updateBatch } from '../masters/masters.service.js';
import mongoose from 'mongoose';
import { readActivity } from '../activity/activity.service.js';
import { insertPaymentData, readPaymentHistory } from '../payment/payment.service.js';
import Bookings from '../../models/bookings.js';
import { addStartAndEndDates } from '../members/members.controller.js';
import PaymentHistory from '../../models/payment_history.js';
const __dirname = path.resolve();

export const insertBookings = async (req, res, next) => {
    try {
        let payload = { ...req.body };

        if (payload.total_amount === 0) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Total amount cannot be zero',
                {},
            );
        }
        // payload.payment_status = "Pending";
        // Verified Temporary

        const start_month = payload?.fees_breakup?.start_month;
        const end_month = payload?.fees_breakup?.end_month;

        // Calculate the current year
        const currentYear = new Date().getFullYear();

        // Calculate the start date (1st day of the start month) of the current year
        const startDate = new Date(currentYear, start_month - 1, 1);

        // Calculate the end date (last day of the end month of the next year)
        // We subtract 1 from end_month to get the zero-indexed month for Date constructor
        const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
        const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

        // payload.fees_breakup.start_date =
        //     String(startDate.getDate()).padStart(2, '0') +
        //     '/' +
        //     String(startDate.getMonth() + 1).padStart(2, '0') +
        //     '/' +
        //     startDate.getFullYear();
        // payload.fees_breakup.end_date =
        //     String(endDate.getDate()).padStart(2, '0') +
        //     '/' +
        //     String(endDate.getMonth() + 1).padStart(2, '0') +
        //     '/' +
        //     endDate.getFullYear();

        // console.log(payload, "payload");
        // return false;

        // validating batch here
        const batch = await readBatch({ _id: mongoose.Types.ObjectId(payload.batch) });
        if (!batch) {
            return responseSend(res, httpCodes.NOTFOUND, 'Batch not found', {});
        }
        if (batch.status === false) {
            return responseSend(res, httpCodes.NOTFOUND, 'Batch is not active', {});
        }
        if (batch.batch_limit <= 0) {
            return responseSend(res, httpCodes.NOTFOUND, 'Batch is full', {});
        }

        // validating member here
        const member = await readMembers({
            _id: mongoose.Types.ObjectId(payload.member_id),
        });
        if (!member) {
            return responseSend(res, httpCodes.NOTFOUND, 'Member not found', {});
        }

        // validating activity here
        const activity = await readActivity({
            _id: mongoose.Types.ObjectId(payload.activity_id),
        });
        if (!activity) {
            return responseSend(res, httpCodes.NOTFOUND, 'Activity not found', {});
        }

        if (activity.status === false) {
            return responseSend(res, httpCodes.NOTFOUND, 'Activity is not active', {});
        }

        // validating batch limit here
        if (activity.batch_limit <= 0) {
            return responseSend(res, httpCodes.NOTFOUND, 'Activity is full', {});
        }

        payload.status = true;

        await createBookings(payload);

        // updating batch limit here
        const batchData = {
            batch_limit: Number(batch.batch_limit) - 1,
        };
        await updateBatch({ _id: batch._id }, batchData);

        const userData = await readMembers({ _id: payload.member_id });

        // send mail to member for payment
        let payloadForHtmlTemplate = {
            name: `Congratulation! ${userData.name}`,
            msg_content: activity_new_mail_content,
            link: FRONTEND_BASE_URL + '/pending-payment',
            link_text: 'Visit Your Profile',
        };

        const filePath = path.join(__dirname, '/app/templates/new-activity.hbs');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        const htmlToSend = template(payloadForHtmlTemplate);

        sendEmailNode(userData.email, `Congratulation! ${userData.name}`, '', htmlToSend);

        return responseSend(
            res,
            httpCodes.OK,
            'Bookings has been created successfully',
            {},
        );
    } catch (error) {
        next(error);
    }
};

export const insertBatchBookings = async (req, res, next) => {
    try {
        const {
            amount,
            batch_id,
            activity_id,
            players,
            chss_number,
            booking_date,
            booking_time,
            plan_details,
        } = req.body;

        if (amount === 0) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Total amount cannot be zero',
                {},
            );
        }
        // validating batch here
        const batch = await readBatch(
            { _id: mongoose.Types.ObjectId(batch_id) },
            { _id: 1, status: 1, batch_limit: 1 },
        );
        if (!batch) {
            return responseSend(res, httpCodes.NOTFOUND, 'Batch not found', {});
        }

        if (!batch.status) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'Batch is not active', {});
        }

        if (batch.batch_limit > 0) {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            const existingBookings = await readSingleBookings({
                batch: batch_id,
                booking_date,
                booking_time,
                $or: [
                    { payment_status: 'Success' },
                    { payment_status: 'Pending', createdAt: { $gte: tenMinutesAgo } },
                ],
            });

            if (existingBookings?.length >= batch.batch_limit) {
                return responseSend(
                    res,
                    httpCodes.BAD_REQUEST,
                    'Selected slot is already fully booked',
                    {},
                );
            }
        }

        const findFirstVerifiedMember = players.find((item) => item.is_member === 'Yes');

        const payload = {
            activity_id: activity_id,
            member_id: findFirstVerifiedMember?._id || null,
            batch: batch_id,
            total_amount: amount,
            payment_status: 'Pending',
            fees_breakup: plan_details,
            primary_eligible: true,
            type: 'booking',
            players: players,
            chss_number: chss_number,
            booking_date,
            booking_time,
            status: true,
        };

        await createBookings(payload);

        // send mail to member for payment
        if (findFirstVerifiedMember) {
            let payloadForHtmlTemplate = {
                name: `Congratulation! ${findFirstVerifiedMember.name}`,
                msg_content: activity_new_mail_content,
                link: FRONTEND_BASE_URL + '/pending-payment',
                link_text: 'Visit Your Profile',
            };

            const filePath = path.join(__dirname, '/app/templates/new-activity.hbs');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);

            const htmlToSend = template(payloadForHtmlTemplate);

            sendEmailNode(
                findFirstVerifiedMember.email,
                `Congratulation! ${findFirstVerifiedMember.name}`,
                '',
                htmlToSend,
            );
        }

        return responseSend(
            res,
            httpCodes.OK,
            'Bookings has been created successfully',
            {},
        );
    } catch (error) {
        next(error);
    }
};

export const getBookingsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = false,
            type = 'enrollment',
            booking_id = null,
        } = req.query;

        // updating all booking type = enrollment
        // await updateBookings({ _id: { $ne: null } }, { type: "enrollment" });

        let filter = {
            type: type,
        };

        if (type === 'booking') {
            filter = {
                ...filter,
                $or: [{ payment_status: 'Success' }, { payment_status: 'Pending' }],
            };
        }

        if (active) filter.status = true;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { short_description: { $regex: keywords, $options: 'i' } },
                    { booking_id: parseInt(keywords) },
                    { 'family_member.name': { $regex: keywords, $options: 'i' } },
                    { 'member_data.name': { $regex: keywords, $options: 'i' } },
                    { 'member_data.mobile': keywords },
                    { 'member_data.chss_number': keywords },
                    { 'member_data.member_id': keywords },

                    { 'activity_data.name': { $regex: keywords, $options: 'i' } },
                    { 'activity_data.activity_id': parseInt(keywords) },
                    { 'location_data.title': { $regex: keywords, $options: 'i' } },
                    { 'sublocation_data.title': { $regex: keywords, $options: 'i' } },
                    { 'batch_data.batch_code': { $regex: keywords, $options: 'i' } },
                    { 'batch_data.batch_name': { $regex: keywords, $options: 'i' } },
                ],
            };

        if (booking_id) {
            filter = {
                ...filter,
                booking_id: parseInt(booking_id),
            };
        }

        let result = await readAllBookings(
            filter,
            null,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Bookings records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleBookings = async (req, res, next) => {
    try {
        const { _id } = req.query;
        let result = await readBookings({ _id });
        result = JSON.parse(JSON.stringify(result));

        if (result && result?.payment_status === 'Paid') {
            let paymentData = await readPaymentHistory({ booking_id: _id });
            result.payment_history = paymentData;
        }

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editBookings = async (req, res, next) => {
    try {
        let payload = { ...req.body };
        const { _id } = req.body;
        const { roles } = req.session;

        let records = await readBookings({ _id });
        if (!records) {
            throw new Error('Bookings does not exist!');
        }

        const start_month = payload?.fees_breakup?.start_month;
        const end_month = payload?.fees_breakup?.end_month;

        // Calculate the current year
        const currentYear = new Date().getFullYear();

        // Calculate the start date (1st day of the start month) of the current year
        const startDate = new Date(currentYear, start_month - 1, 1);

        // Calculate the end date (last day of the end month of the next year)
        // We subtract 1 from end_month to get the zero-indexed month for Date constructor
        const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
        const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

        // payload.fees_breakup.start_date = String(startDate.getDate()).padStart(2, '0') + '/' + String(startDate.getMonth() + 1).padStart(2, '0') + '/' + startDate.getFullYear();
        // payload.fees_breakup.end_date = String(endDate.getDate()).padStart(2, '0') + '/' + String(endDate.getMonth() + 1).padStart(2, '0') + '/' + endDate.getFullYear();

        // validating batch here
        // const batch = await readBatch({ _id: mongoose.Types.ObjectId(payload.batch) });
        // if (!batch) {
        //     return responseSend(res, httpCodes.NOTFOUND, 'Batch not found', {});
        // }
        // if (batch.status === false) {
        //     return responseSend(res, httpCodes.NOTFOUND, 'Batch is not active', {});
        // }
        // if (batch.batch_limit <= 0) {
        //     return responseSend(res, httpCodes.NOTFOUND, 'Batch is full', {});
        // }

        // validating member here
        const member = await readMembers({
            _id: mongoose.Types.ObjectId(payload.member_id),
        });
        if (!member) {
            return responseSend(res, httpCodes.NOTFOUND, 'Member not found', {});
        }

        // validating activity here
        const activity = await readActivity({
            _id: mongoose.Types.ObjectId(payload.activity_id),
        });
        if (!activity) {
            return responseSend(res, httpCodes.NOTFOUND, 'Activity not found', {});
        }

        if (activity.status === false) {
            return responseSend(res, httpCodes.NOTFOUND, 'Activity is not active', {});
        }

        // validating batch limit here
        if (activity.batch_limit <= 0) {
            return responseSend(res, httpCodes.NOTFOUND, 'Activity is full', {});
        }

        // if (payload.batch !== records.batch) {
        //     // updating batch limit here
        //     const addedBatch = await readBatch({
        //         _id: mongoose.Types.ObjectId(records.batch),
        //     });
        //     const addedBatchData = {
        //         batch_limit: Number(addedBatch.batch_limit) + 1,
        //     };
        //     await updateBatch({ _id: addedBatch._id }, addedBatchData);

        //     // updating batch limit here
        //     const batchData = {
        //         batch_limit: Number(batch.batch_limit) - 1,
        //     };
        //     await updateBatch({ _id: batch._id }, batchData);
        // }

        if (roles && roles === 'super') {
            req.body.fees_breakup = addStartAndEndDates(req.body.fees_breakup);

            // find payment history record for booking_id and plan_id
            const paymentHistory = await PaymentHistory.findOne({
                booking_id: mongoose.Types.ObjectId(_id),
                plan_id: mongoose.Types.ObjectId(records?.fees_breakup?.plan_id),
                payment_status: 'Success',
            });

            if (paymentHistory) {
                const oldPlanId = records?.fees_breakup?.plan_id;
                const newPlanId = req.body?.fees_breakup?.plan_id;

                let updatedPlanIds = paymentHistory.plan_id.map((id) =>
                    id.toString() === oldPlanId.toString() ? newPlanId : id,
                );

                // Remove duplicates just in case
                updatedPlanIds = [...new Set(updatedPlanIds.map((id) => id.toString()))];

                await PaymentHistory.updateOne(
                    {
                        _id: paymentHistory._id,
                    },
                    {
                        $set: {
                            plan_id: updatedPlanIds,
                        },
                    },
                );
            }
        }

        records = await updateBookings({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Bookings updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const updateStatusBookings = async (req, res, next) => {
    try {
        const { _id, status } = req.body;

        let records = await readBookings({ _id });
        if (!records) {
            throw new Error('Bookings does not exist!');
        }

        records = await updateBookings({ _id }, { status: status });
        responseSend(res, httpCodes.OK, 'Bookings updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeBookings = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readBookings({ _id });
        if (!records) {
            throw new Error('Bookings does not exist!');
        }

        records = await deleteBookings({ _id });
        responseSend(res, httpCodes.OK, 'Bookings deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

export const paymentUpdateBookings = async (req, res, next) => {
    try {
        const { booking_id, reference_no } = req.body;
        const { path: file_url } = req.file;

        let records = await readBookings({ _id: booking_id }, { _id: 1 });
        if (!records) {
            throw new Error('Booking does not exist!');
        }
        // create payment history

        const paymentHistoryPayload = {
            booking_id: records._id,
            member_id: records.member_id?._id,
            plan_id: records?.fees_breakup?.plan_id,
            payment_file: file_url,
            payment_id: reference_no,
            remarks:
                'Payment is made using UPI scan qr code for booking id ' +
                records.booking_id,
            payment_mode: 'QR Code Scan',
        };
        await insertPaymentData(paymentHistoryPayload);

        // update fees_paid status in member table
        await updateBookings(
            { _id: records._id },
            { payment_status: 'Success', feesPaidAt: new Date().toISOString() },
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

export const tempUpdateStatus = async (req, res, next) => {
    try {
        await Bookings.updateMany(
            { payment_status: { $ne: 'Success' } },
            {
                payment_status: 'Success',
                status: true,
                feesPaidAt: new Date().toISOString(),
            },
        );
        responseSend(res, httpCodes.OK, 'Payment status updated successfully.', {});
    } catch (error) {
        next(error);
    }
};

export const updateRenewButton = async (req, res, next) => {
    try {
        const { booking_id, show_renew_button } = req.body;

        await Bookings.updateOne(
            { booking_id: booking_id },
            { show_renew_button: show_renew_button },
        );

        responseSend(res, httpCodes.OK, 'Renew Button status updated successfully.', {});
    } catch (error) {
        next(error);
    }
};
