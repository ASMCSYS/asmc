'use strict';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, resolve } from 'url';
import crypto from 'crypto';
import qs from 'qs';
import fs from 'fs';
import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import PaymentHistory from '../../models/payment_history.js';
import Bookings from '../../models/bookings.js';
import { readMembers, updateMembers } from '../members/members.service.js';
import {
    readAllPaymentHistory,
    readPaymentHistory,
    updatePaymentHistory,
} from './payment.service.js';
import {
    createBookings,
    readBookings,
    readSingleBookings,
    updateBookings,
} from '../bookings/bookings.service.js';
import {
    payment_status_decline_mail_content,
    payment_status_mail_content,
} from '../../helpers/constance.js';
const __filename = fileURLToPath(import.meta.url);
const __dirnames = path.dirname(__filename);
import handlebars from 'handlebars';
import sendEmail from '../../utils/email.js';
import mongoose, { mongo } from 'mongoose';
import { readPlans } from '../plans/plans.service.js';
import { readBatch, updateBatch } from '../masters/masters.service.js';
import EventBookings from '../../models/event_booking.js';
import { calculateNextPlanDates } from '../../utils/helper.js';
import HallBookings from '../../models/hall_booking.js';
import { getSingleBookings } from '../bookings/bookings.controller.js';
const __dirname = path.resolve();

dotenv.config({ path: path.join(__dirnames, `../../.env.${process.env.NODE_ENV}`) });

async function generateOrderId(prefix = 'ORD') {
    let isUnique = false;
    let newOrderId = '';

    while (!isUnique) {
        // Generate a new order ID using current timestamp for more uniqueness
        newOrderId =
            prefix + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10000);

        // Check if the generated order ID already exists in PaymentHistory
        const existingOrder = await PaymentHistory.findOne({ order_id: newOrderId });

        if (!existingOrder) {
            // If no existing order is found, mark it as unique
            isUnique = true;
        }
    }

    return newOrderId;
}

export const initiatePayment = async (req, res, next) => {
    try {
        const { amount, customer_email, customer_phone, remarks } = req.body;
        const { member_id } = req.session;

        let records = await readMembers(
            { member_id: member_id },
            {
                _id: 1,
                current_plan: 1,
                fees_paid: 1,
                name: 1,
                address: 1,
                family_details: 1,
            },
        );
        if (!records) {
            throw new Error('Members does not exist!');
        }

        let allPlanIds = [];
        let allBookingIds = [];

        if (!records.fees_paid) {
            allPlanIds.push(records?.current_plan?.plan_id);
        }

        if (records?.family_details) {
            records?.family_details.forEach((family) => {
                if (!family?.fees_paid) {
                    allPlanIds.push(family?.plans?.plan_id);
                }
            });
        }

        // update booking status if user is making payment of booking
        const bookingData = await Bookings.find({
            member_id: records._id,
            payment_status: 'Pending',
            status: true,
        })
            .select({})
            .lean();
        if (bookingData && bookingData.length > 0) {
            bookingData.map((obj) => {
                allPlanIds.push(obj?.fees_breakup?.plan_id);
                allBookingIds.push(obj._id);
            });
        }

        const order_id = await generateOrderId();

        const data = {
            merchant_id: process.env.Merchant_ID,
            order_id: order_id,
            currency: 'INR',
            amount: amount,
            redirect_url: process.env.BACKEND_BASE_URL + '/payment/ccavenue-response', // Where to redirect after payment
            cancel_url: process.env.BACKEND_BASE_URL + '/payment/ccavenue-response',
            language: 'EN',
            billing_name: records?.name,
            billing_address: records?.address,
            billing_city: '',
            billing_state: '',
            billing_zip: '',
            billing_country: '',
            billing_tel: customer_phone,
            billing_email: customer_email,
            remarks,
        };

        const queryStringData = qs.stringify(data);

        const encryptedData = encrypt(queryStringData, process.env.Working_Key);

        await PaymentHistory.create({
            member_id: records._id,
            plan_id: allPlanIds,
            order_id: order_id,
            booking_id: allBookingIds,
            amount_paid: amount,
            remarks: remarks,
            payment_mode: 'Online',
            payment_status: 'Initiated',
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            accessCode: process.env.Access_Code,
            order_id,
            encryptedData,
        });
    } catch (error) {
        next(error);
    }
};

export const ccavenueResponse = (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            try {
                console.log(
                    ccavEncResponse,
                    'Raw Encoded Response from ccavenueResponse',
                );

                // Parse the form-urlencoded response
                const ccavPOST = qs.parse(ccavEncResponse);
                const encryptedResponse = ccavPOST.encResp;

                // Decrypt the response using the working key
                const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

                // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
                const responseData = qs.parse(ccavResponse);

                // Extract important fields from the response
                const { order_id, order_status: payment_order_status } = responseData;

                const order_status = ['Success', 'Shipped', 'Successful'].includes(
                    payment_order_status,
                )
                    ? 'Success'
                    : 'Failed';

                if (!order_id) {
                    throw new Error('Order ID not found in response');
                }

                const paymentHistory = await PaymentHistory.findOne({
                    order_id: order_id,
                });

                // Update payment history based on order_status
                if (order_status === 'Success' && paymentHistory) {
                    await updatePaymentStatus(
                        paymentHistory._id,
                        order_status === 'Success',
                        responseData,
                    );

                    // Send response to client
                    const redirectUrl =
                        process.env.FRONTEND_BASE_URL +
                        `/pending-payment?order_id=${order_id}&status=${order_status}`;
                    return response.redirect(redirectUrl);
                } else {
                    console.log(
                        `Payment Failed for order id ${order_id} and order status ${order_status} on ccavenueResponse`,
                    );
                    await PaymentHistory.updateOne(
                        { order_id: order_id },
                        {
                            $set: {
                                payment_status: 'Failed',
                                payment_response: JSON.stringify(responseData),
                            },
                        },
                    );
                    console.log('Payment status updated to Failed');

                    // Send response to client
                    const redirectUrl =
                        process.env.FRONTEND_BASE_URL +
                        `/pending-payment?order_id=${order_id}&status=${order_status}`;
                    return response.redirect(redirectUrl);
                }
            } catch (error) {
                console.error('Error processing CCAvenue response:', error);
                next(error); // Pass the error to the error-handling middleware
            }
        });
    } catch (error) {
        console.error('Error processing CCAvenue response:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

function encrypt(plainText, workingKey) {
    var m = crypto.createHash('md5');
    m.update(workingKey);
    var key = m.digest();
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var encoded = cipher.update(plainText, 'utf8', 'hex');
    encoded += cipher.final('hex');
    return encoded;
}

// Function to decrypt data
function decrypt(encText, workingKey) {
    var m = crypto.createHash('md5');
    m.update(workingKey);
    var key = m.digest();
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(encText, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}

export const gePaymentHistoryList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            payment_status = null,
            filter_by = 'any_word',
        } = req.query;

        let filter = {};

        if (payment_status) filter = { ...filter, payment_status: payment_status };

        if (keywords && keywords !== '' && filter_by === 'any_word')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { email: { $regex: keywords, $options: 'i' } },
                    { order_id: parseInt(keywords) },
                    { payment_response: { $regex: keywords, $options: 'i' } },
                    {
                        bookings_data: {
                            $elemMatch: {
                                booking_id: parseInt(keywords),
                            },
                        },
                    },
                    {
                        activity_data: {
                            $elemMatch: {
                                name: { $regex: keywords, $options: 'i' },
                            },
                        },
                    },
                    {
                        member_data: {
                            $elemMatch: {
                                member_id: keywords,
                            },
                        },
                    },
                ],
            };

        if (keywords && keywords !== '' && filter_by === 'member_id')
            filter = {
                ...filter,
                member_data: {
                    $elemMatch: {
                        member_id: keywords,
                    },
                },
            };

        if (keywords && keywords !== '' && filter_by === 'booking_id')
            filter = {
                ...filter,
                bookings_data: {
                    $elemMatch: {
                        booking_id: parseInt(keywords),
                    },
                },
            };

        if (keywords && keywords !== '' && filter_by === 'payment_id')
            filter = {
                ...filter,
                payment_response: { $regex: keywords, $options: 'i' },
            };

        let result = await readAllPaymentHistory(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Members records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const updatePaymentRemarks = async (req, res, next) => {
    try {
        const { _id, remarks, difference_amount_paid } = req.body;

        let records = await readPaymentHistory({ _id });
        if (!records) {
            throw new Error('Records does not exist!');
        }

        records = await updatePaymentHistory(
            { _id },
            { remarks: remarks, difference_amount_paid: difference_amount_paid },
        );
        responseSend(res, httpCodes.OK, 'Records updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const updatePaymentStatus = async (_id, status, responseData) => {
    try {
        let records = await readPaymentHistory({ _id });
        if (!records) {
            throw new Error('Records does not exist!');
        }

        // update payment history status
        let payload = {
            payment_status: 'Success',
            payment_verified: true,
            verifiedAt: new Date().toISOString(),
            payment_response: JSON.stringify(responseData),
        };
        await updatePaymentHistory({ _id }, payload);

        // update payment and plan start date end date
        const userData = await readMembers({ _id: records.member_id });

        if (status) {
            userData.fees_paid = true;
            userData.fees_verified = true;
            userData.feesPaidAt = new Date().toISOString();
            userData.feesVerifiedAt = new Date().toISOString();

            // userData.family_details.forEach((family) => {
            //     family.fees_paid = true;
            // });

            if (userData?.current_plan) {
                const start_month = userData?.current_plan?.start_month;
                const end_month = userData?.current_plan?.end_month;

                // Calculate the current year
                const currentYear = new Date().getFullYear();

                // Calculate the start date (1st day of the start month)
                const startDate = new Date(currentYear, start_month - 1, 1);

                // Calculate the end date (last day of the end month of the next year)
                // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                userData.current_plan.start_date =
                    String(startDate.getDate()).padStart(2, '0') +
                    '/' +
                    String(startDate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    startDate.getFullYear();
                userData.current_plan.end_date =
                    String(endDate.getDate()).padStart(2, '0') +
                    '/' +
                    String(endDate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    endDate.getFullYear();
            }

            if (userData?.family_details && userData?.family_details.length > 0) {
                userData.family_details.forEach((family) => {
                    if (family?.plans) {
                        const start_month = family?.plans?.start_month;
                        const end_month = family?.plans?.end_month;

                        // Calculate the current
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                        // Calculate the start date (1st day of the start month)
                        // const startDate = new Date(
                        //     start_month < currentMonth ? currentYear + 1 : currentYear,
                        //     start_month - 1,
                        //     1,
                        // );
                        const startDate = new Date(currentYear, start_month - 1, 1);

                        // Calculate the end date (last day of the end month of the next year)
                        // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                        const endYear =
                            end_month < start_month ||
                            (start_month < currentMonth && end_month <= currentMonth)
                                ? currentYear + 1
                                : currentYear;

                        const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                        family.fees_paid = true;

                        family.plans.start_date =
                            String(startDate.getDate()).padStart(2, '0') +
                            '/' +
                            String(startDate.getMonth() + 1).padStart(2, '0') +
                            '/' +
                            startDate.getFullYear();
                        family.plans.end_date =
                            String(endDate.getDate()).padStart(2, '0') +
                            '/' +
                            String(endDate.getMonth() + 1).padStart(2, '0') +
                            '/' +
                            endDate.getFullYear();
                    }
                });
            }

            await updateMembers({ _id: userData._id }, userData);
        }

        if (records && records.booking_id.length > 0) {
            // update booking payment status and generate start and end date based on the plan

            for (let index = 0; index < records.booking_id.length; index++) {
                const bookingId = records.booking_id[index];
                const bookingData = await readBookings({ _id: bookingId });
                if (!bookingData) {
                    throw new Error('Booking does not exist!');
                }

                if (status) {
                    bookingData.payment_status = 'Success';
                    bookingData.payment_verified_at = new Date().toISOString();
                    bookingData.feesPaidAt = new Date().toISOString();
                    bookingData.show_renew_button = false;

                    if (bookingData?.fees_breakup) {
                        const start_month = bookingData?.fees_breakup?.start_month;
                        const end_month = bookingData?.fees_breakup?.end_month;

                        // Calculate the current year and month
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                        // Calculate the start date (1st day of the start month)
                        // const startDate = new Date(
                        //     start_month < currentMonth ? currentYear + 1 : currentYear,
                        //     start_month - 1,
                        //     1,
                        // );
                        const startDate = new Date(currentYear, start_month - 1, 1);

                        // Calculate the end date (last day of the end month of the next year)
                        // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                        const endYear =
                            end_month < start_month ||
                            (start_month < currentMonth && end_month <= currentMonth)
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
                } else {
                    bookingData.payment_status = 'Failed';
                }
                await updateBookings({ _id: bookingId }, bookingData);
            }

            // await updateBookings({ member_id: records.member_id, payment_status: "Success" }, { payment_status: "Verified", payment_verified_at: new Date().toISOString() });
        }

        // send mail here
        // let payloadForHtmlTemplate = {
        //     name: status ? `Congratulation! ${userData.name}` : `Payment Verification Failed! ${userData.name}`,
        //     msg_content: status ? payment_status_mail_content : payment_status_decline_mail_content,
        //     link: process.env.FRONTEND_BASE_URL + "/pending-payment",
        //     link_text: "Visit Your Profile"
        // }

        // const filePath = path.join(__dirname, '/app/templates/payment-status.hbs');
        // const source = fs.readFileSync(filePath, 'utf-8').toString();
        // const template = handlebars.compile(source);

        // const htmlToSend = template(payloadForHtmlTemplate);

        // sendEmail(
        //     userData.email,
        //     status ? `Congratulation! ${userData.name}` : `Payment Verification Failed! ${userData.name}`,
        //     "",
        //     htmlToSend
        // );

        return true;
    } catch (error) {
        console.log(error, 'error in update payment status');
    }
};

export const renewPayment = async (req, res, next) => {
    try {
        const {
            amount,
            customer_email,
            customer_phone,
            remarks,
            plan_id,
            booking_id = null,
            renew_member_id,
            renew_secondary_member_id,
        } = req.body;
        const { member_id } = req.session;

        let memberData = await readMembers(
            { member_id: member_id },
            { _id: 1, current_plan: 1, name: 1, address: 1, family_details: 1 },
        );
        if (!memberData) {
            throw new Error('Members does not exist!');
        }

        let secondaryMemberData = null;

        if (renew_secondary_member_id) {
            secondaryMemberData = memberData.family_details.find(
                (member) => member._id == renew_secondary_member_id,
            );
        }

        const planData = await readPlans({ _id: plan_id });
        if (!planData) {
            throw new Error('Plan does not exist!');
        }

        const order_id = await generateOrderId();

        const data = {
            merchant_id: process.env.Merchant_ID,
            order_id: order_id,
            currency: 'INR',
            amount: amount,
            redirect_url:
                process.env.BACKEND_BASE_URL + '/payment/ccavenue-renew-response', // Where to redirect after payment
            cancel_url: process.env.BACKEND_BASE_URL + '/payment/ccavenue-renew-response',
            language: 'EN',
            billing_name: memberData?.name,
            billing_address: memberData?.address,
            billing_city: '',
            billing_state: '',
            billing_zip: '',
            billing_country: '',
            billing_tel: customer_phone,
            billing_email: customer_email,
            remarks,
        };

        const queryStringData = qs.stringify(data);

        const encryptedData = encrypt(queryStringData, process.env.Working_Key);

        await PaymentHistory.create({
            member_id: memberData._id,
            secondary_member_id: renew_secondary_member_id,
            booking_id: booking_id,
            plan_id: [plan_id],
            order_id: order_id,
            amount_paid: amount,
            remarks: remarks,
            payment_mode: 'Online',
            payment_status: 'Initiated',
            booking_type: planData?.plan_type,
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            accessCode: process.env.Access_Code,
            order_id,
            encryptedData,
        });
    } catch (error) {
        next(error);
    }
};

export const ccavenueRenewResponse = async (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            try {
                console.log(
                    ccavEncResponse,
                    'Raw Encoded Response from ccavenueRenewResponse',
                );

                // Parse the form-urlencoded response
                const ccavPOST = qs.parse(ccavEncResponse);
                const encryptedResponse = ccavPOST.encResp;

                // Decrypt the response using the working key
                const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

                // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
                const responseData = qs.parse(ccavResponse);

                // Extract important fields from the response
                const {
                    order_id,
                    order_status: payment_order_status,
                    amount: ccavenueAmount,
                } = responseData;

                const order_status = ['Success', 'Shipped', 'Successful'].includes(
                    payment_order_status,
                )
                    ? 'Success'
                    : 'Failed';

                if (!order_id) {
                    throw new Error('Order ID not found in response');
                }

                const paymentHistory = await PaymentHistory.findOne({
                    order_id: order_id,
                });

                // Update payment history based on order_status
                if (order_status === 'Success' && paymentHistory) {
                    // update payment history status
                    const planData = await readPlans({
                        _id: mongoose.Types.ObjectId(paymentHistory?.plan_id[0]),
                    });

                    let payload = {
                        booking_type: planData?.plan_type || 'renewal',
                        payment_status: 'Success',
                        payment_verified: true,
                        verifiedAt: new Date().toISOString(),
                        payment_response: JSON.stringify(responseData),
                    };

                    await updatePaymentHistory({ _id: paymentHistory?._id }, payload);

                    for (let i = 0; i < paymentHistory?.plan_id.length; i++) {
                        const planData = await readPlans({
                            _id: mongoose.Types.ObjectId(paymentHistory?.plan_id[i]),
                        });
                        if (!planData) {
                            console.log('Plan does not exist!');
                        }

                        if (planData) {
                            const userData = await readMembers({
                                _id: paymentHistory.member_id,
                            });

                            if (planData?.plan_type === 'membership') {
                                const start_month = planData?.start_month;
                                const end_month = planData?.end_month;

                                // Calculate the current year
                                const currentDate = new Date();
                                const currentYear = currentDate.getFullYear();
                                const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                                // Calculate the start date (1st day of the start month)
                                const startDate = new Date(
                                    currentYear, // Always use current year for renewal
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

                                if (
                                    paymentHistory &&
                                    paymentHistory?.secondary_member_id
                                ) {
                                    userData.family_details.forEach((family) => {
                                        if (
                                            family._id ==
                                            paymentHistory?.secondary_member_id
                                        ) {
                                            family.fees_paid = true;

                                            family.plans = {
                                                plan_id: planData?.plan_id,
                                                plan_name: planData?.plan_name,
                                                amount: planData?.amount,
                                                final_amount: family?.is_dependent_member
                                                    ? planData?.dependent_member_price
                                                    : planData?.non_dependent_member_price,
                                                start_month: planData?.start_month,
                                                end_month: planData?.end_month,
                                                dependent_member_price:
                                                    planData?.dependent_member_price,
                                                non_dependent_member_price:
                                                    planData?.non_dependent_member_price,
                                                start_date:
                                                    String(startDate.getDate()).padStart(
                                                        2,
                                                        '0',
                                                    ) +
                                                    '/' +
                                                    String(
                                                        startDate.getMonth() + 1,
                                                    ).padStart(2, '0') +
                                                    '/' +
                                                    startDate.getFullYear(),
                                                end_date:
                                                    String(endDate.getDate()).padStart(
                                                        2,
                                                        '0',
                                                    ) +
                                                    '/' +
                                                    String(
                                                        endDate.getMonth() + 1,
                                                    ).padStart(2, '0') +
                                                    '/' +
                                                    endDate.getFullYear(),
                                                created_at: new Date().toISOString(),
                                                updated_at: new Date().toISOString(),
                                            };
                                        }
                                    });
                                } else {
                                    userData.fees_paid = true;
                                    userData.fees_verified = true;
                                    userData.feesPaidAt = new Date().toISOString();
                                    userData.feesVerifiedAt = new Date().toISOString();

                                    userData.family_details.forEach((family) => {
                                        family.fees_paid = true;
                                    });

                                    userData.current_plan = {
                                        plan_id: planData?.plan_id,
                                        plan_name: planData?.plan_name,
                                        amount: planData?.amount,
                                        final_amount: planData?.amount,
                                        start_month: planData?.start_month,
                                        end_month: planData?.end_month,
                                        dependent_member_price:
                                            planData?.dependent_member_price,
                                        non_dependent_member_price:
                                            planData?.non_dependent_member_price,
                                        start_date:
                                            String(startDate.getDate()).padStart(2, '0') +
                                            '/' +
                                            String(startDate.getMonth() + 1).padStart(
                                                2,
                                                '0',
                                            ) +
                                            '/' +
                                            startDate.getFullYear(),
                                        end_date:
                                            String(endDate.getDate()).padStart(2, '0') +
                                            '/' +
                                            String(endDate.getMonth() + 1).padStart(
                                                2,
                                                '0',
                                            ) +
                                            '/' +
                                            endDate.getFullYear(),
                                    };
                                }
                                await updateMembers({ _id: userData._id }, userData);
                            } else if (planData?.plan_type === 'enrollment') {
                                // const start_month = planData?.start_month;
                                // const end_month = planData?.end_month;

                                // // Calculate the current year and month
                                // const currentDate = new Date();
                                // const currentYear = currentDate.getFullYear();
                                // const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                                // // Calculate the start date (1st day of the start month)
                                // const startDate = new Date(
                                //     start_month < currentMonth
                                //         ? currentYear + 1
                                //         : currentYear,
                                //     start_month - 1,
                                //     1,
                                // );

                                // // Calculate the end date (last day of the end month of the next year)
                                // // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                                // const endYear =
                                //     end_month < start_month ||
                                //     (start_month < currentMonth && end_month <= currentMonth)
                                //         ? currentYear + 1
                                //         : currentYear;

                                // const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                                // const { startDate, endDate } = calculateNextPlanDates(userData?.fee);

                                for (
                                    let index = 0;
                                    index < paymentHistory?.booking_id.length;
                                    index++
                                ) {
                                    const bookingId = paymentHistory?.booking_id[index];
                                    const userBooking = await Bookings.findOne({
                                        _id: bookingId,
                                    });

                                    const { startDate, endDate } = calculateNextPlanDates(
                                        planData.start_month,
                                        planData.end_month,
                                    );

                                    userBooking.fees_breakup = {
                                        ...planData,
                                        start_date:
                                            String(startDate.getDate()).padStart(2, '0') +
                                            '/' +
                                            String(startDate.getMonth() + 1).padStart(
                                                2,
                                                '0',
                                            ) +
                                            '/' +
                                            startDate.getFullYear(),
                                        end_date:
                                            String(endDate.getDate()).padStart(2, '0') +
                                            '/' +
                                            String(endDate.getMonth() + 1).padStart(
                                                2,
                                                '0',
                                            ) +
                                            '/' +
                                            endDate.getFullYear(),
                                    };

                                    userBooking.payment_status = 'Success';
                                    userBooking.payment_verified_at =
                                        new Date().toISOString();
                                    userBooking.feesPaidAt = new Date().toISOString();
                                    userBooking.show_renew_button = false;

                                    userBooking.total_amount =
                                        paymentHistory?.amount_paid;

                                    await Bookings.updateOne(
                                        { _id: userBooking._id },
                                        userBooking,
                                    );
                                }
                            }

                            // send mail here
                            sendRenewMail(userData);
                        }
                    }

                    // Send response to client
                    const redirectUrl =
                        process.env.FRONTEND_BASE_URL +
                        `/pending-payment?order_id=${order_id}&status=${order_status}`;
                    return response.redirect(redirectUrl);
                } else {
                    console.log(
                        `Payment Failed for order id ${order_id} and order status ${order_status} on ccAvenueRenewResponse`,
                    );
                    await PaymentHistory.updateOne(
                        { order_id: order_id },
                        {
                            $set: {
                                payment_status: 'Failed',
                                payment_response: JSON.stringify(responseData),
                            },
                        },
                    );

                    // Send response to client
                    const redirectUrl =
                        process.env.FRONTEND_BASE_URL +
                        `/pending-payment?order_id=${order_id}&status=${order_status}`;
                    return response.redirect(redirectUrl);
                }
            } catch (error) {
                console.error('Error processing CCAvenue response:', error);
                next(error); // Pass the error to the error-handling middleware
            }
        });
    } catch (error) {
        console.error('Error processing CCAvenue response:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

const sendRenewMail = (userData) => {
    let payloadForHtmlTemplate = {
        name: `Congratulation! ${userData.name}`,
        msg_content: payment_status_mail_content,
        link: process.env.FRONTEND_BASE_URL + '/pending-payment',
        link_text: 'Visit Your Profile',
    };

    const filePath = path.join(__dirname, '/app/templates/payment-status.hbs');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    const htmlToSend = template(payloadForHtmlTemplate);

    // sendEmail(
    //     userData.email,
    //     `Congratulation! ${userData.name}`,
    //     "",
    //     htmlToSend
    // );
};

export const bookingPayment = async (req, res, next) => {
    try {
        const {
            amount,
            customer_email,
            customer_phone,
            batch_id,
            activity_id,
            remarks,
            players,
            chss_number,
            booking_date,
            booking_time,
            plan_details,
            booking_id,
        } = req.body;
        const { member_id } = req.session;

        let bookingRecords = null;
        // validating member here
        const member = await readMembers(
            { member_id: member_id },
            { _id: 1, name: 1, address: 1, email: 1, mobile: 1, chss_number: 1 },
        );
        if (!member) {
            return responseSend(res, httpCodes.NOTFOUND, 'Member not found', {});
        }

        if (!booking_id) {
            // create booking
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
                return responseSend(
                    res,
                    httpCodes.BAD_REQUEST,
                    'Batch is not active',
                    {},
                );
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

            const payload = {
                activity_id: activity_id,
                member_id: member._id,
                batch: batch_id,
                total_amount: amount,
                payment_status: 'Initiated',
                fees_breakup: plan_details,
                primary_eligible: true,
                type: 'booking',
                players: players,
                chss_number: chss_number,
                booking_date,
                booking_time,
            };

            bookingRecords = await createBookings(payload);
            if (!bookingRecords) {
                return responseSend(
                    res,
                    httpCodes.BAD_REQUEST,
                    'Something went wrong',
                    {},
                );
            }
        } else {
            bookingRecords = await readBookings(
                {
                    booking_id: booking_id,
                },
                { _id: 1, total_amount: 1, fees_breakup: 1, payment_status: 1 },
            );
        }

        const order_id = await generateOrderId();

        const data = {
            merchant_id: process.env.Merchant_ID,
            order_id: order_id,
            currency: 'INR',
            amount: amount,
            redirect_url:
                process.env.BACKEND_BASE_URL +
                '/payment/ccavenue-booking-payment-response', // Where to redirect after payment
            cancel_url:
                process.env.BACKEND_BASE_URL +
                '/payment/ccavenue-booking-payment-response',
            language: 'EN',
            billing_name: member?.name,
            billing_address: member?.address,
            billing_city: '',
            billing_state: '',
            billing_zip: '',
            billing_country: '',
            billing_tel: customer_phone,
            billing_email: customer_email,
            remarks,
        };

        const queryStringData = qs.stringify(data);

        const encryptedData = encrypt(queryStringData, process.env.Working_Key);

        await PaymentHistory.create({
            member_id: member?._id,
            plan_id: [bookingRecords?.fees_breakup?.plan_id],
            order_id: order_id,
            booking_id: [bookingRecords._id],
            amount_paid: amount,
            remarks: remarks,
            payment_mode: 'Online',
            payment_status: 'Initiated',
            booking_type: 'booking',
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            accessCode: process.env.Access_Code,
            order_id,
            encryptedData,
        });
    } catch (error) {
        next(error);
    }
};

export const ccavenueBookingPaymentResponse = async (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            try {
                console.log(
                    ccavEncResponse,
                    'Raw Encoded Response from ccavenueBookingPaymentResponse',
                );

                // Parse the form-urlencoded response
                const ccavPOST = qs.parse(ccavEncResponse);
                const encryptedResponse = ccavPOST.encResp;

                // Decrypt the response using the working key
                const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

                // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
                const responseData = qs.parse(ccavResponse);

                // Extract important fields from the response
                const {
                    order_id,
                    order_status: payment_order_status,
                    amount: ccavenueAmount,
                } = responseData;

                const order_status = ['Success', 'Shipped', 'Successful'].includes(
                    payment_order_status,
                )
                    ? 'Success'
                    : 'Failed';

                if (!order_id) {
                    throw new Error('Order ID not found in response');
                }

                const paymentHistory = await PaymentHistory.findOne({
                    order_id: order_id,
                });

                // Update payment history based on order_status
                if (order_status === 'Success') {
                    // update payment history status
                    let payload = {
                        payment_status: 'Success',
                        payment_verified: true,
                        verifiedAt: new Date().toISOString(),
                        payment_response: JSON.stringify(responseData),
                    };

                    await updatePaymentHistory({ _id: paymentHistory?._id }, payload);

                    for (let i = 0; i < paymentHistory?.plan_id.length; i++) {
                        const planData = await readPlans({
                            _id: mongoose.Types.ObjectId(paymentHistory?.plan_id[i]),
                        });
                        if (!planData) {
                            throw new Error('Plan does not exist!');
                        }

                        if (planData) {
                            for (
                                let index = 0;
                                index < paymentHistory?.booking_id.length;
                                index++
                            ) {
                                const bookingId = paymentHistory?.booking_id[index];
                                const userBooking = await Bookings.findOne(
                                    { _id: bookingId },
                                    { _id: 1, payment_status: 1, batch: 1 },
                                );
                                userBooking.payment_status = 'Success';
                                userBooking.status = true;
                                userBooking.payment_verified_at =
                                    new Date().toISOString();
                                userBooking.feesPaidAt = new Date().toISOString();
                                userBooking.show_renew_button = false;

                                await Bookings.updateOne(
                                    { _id: userBooking._id },
                                    userBooking,
                                );
                            }
                        }
                    }

                    // Send response to client
                    const redirectUrl =
                        process.env.FRONTEND_BASE_URL +
                        `/pending-payment?order_id=${order_id}&status=${order_status}`;
                    return response.redirect(redirectUrl);
                } else {
                    console.log(
                        `Payment Failed for order id ${order_id} and order status ${order_status} on ccAvenueBookingPaymentResponse`,
                    );
                    await PaymentHistory.updateOne(
                        { order_id: order_id },
                        {
                            $set: {
                                payment_status: 'Failed',
                                payment_response: JSON.stringify(responseData),
                            },
                        },
                    );

                    for (
                        let index = 0;
                        index < paymentHistory?.booking_id.length;
                        index++
                    ) {
                        const booking_id = paymentHistory?.booking_id[index];

                        // update batch slot by plus and update the payemnt status to failed
                        if (booking_id) {
                            const userBooking = await Bookings.findOne(
                                { _id: mongoose.Types.ObjectId(booking_id) },
                                { _id: 1, payment_status: 1, batch: 1 },
                            );

                            if (userBooking) {
                                userBooking.payment_status = 'Failed';
                                userBooking.show_renew_button = false;
                                await Bookings.updateOne(
                                    { _id: userBooking._id },
                                    userBooking,
                                );

                                // update batch details
                                const batchData = await readBatch(
                                    { _id: userBooking.batch },
                                    { _id: 1, batch_limit: 1 },
                                );
                                if (batchData) {
                                    batchData.batch_limit =
                                        parseInt(batchData.batch_limit) + 1;
                                    await updateBatch({ _id: batchData._id }, batchData);
                                }
                            }
                        }
                    }

                    // Send response to client
                    const redirectUrl =
                        process.env.FRONTEND_BASE_URL +
                        `/pending-payment?order_id=${order_id}&status=${order_status}`;
                    return response.redirect(redirectUrl);
                }
            } catch (error) {
                console.error('Error processing CCAvenue response:', error);
                next(error); // Pass the error to the error-handling middleware
            }
        });
    } catch (error) {
        console.error('Error processing CCAvenue response:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

export const handleOfflinePayment = async (req, res, next) => {
    try {
        if (req?.body?.event_booking_id) {
            const bookingData = await EventBookings.findOne({
                _id: mongoose.Types.ObjectId(req?.body?.event_booking_id),
                payment_status: 'Pending',
                status: true,
            })
                .select({ _id: 1, member_data: 1 })
                .lean();

            let member_id = null;
            if (bookingData?.member_data.length > 0) {
                let records = await readMembers(
                    { member_id: bookingData?.member_data[0]?.member_id },
                    { _id: 1, name: 1, address: 1 },
                );
                if (records) {
                    member_id = records?._id;
                }
            }

            const order_id = await generateOrderId('EVT');

            await PaymentHistory.create({
                member_id: member_id || null,
                order_id: order_id,
                event_booking_id: [bookingData._id],
                amount_paid: req.body.amount_paid,
                remarks: req.body.remarks,
                payment_mode: req.body.payment_mode || 'Offline',
                booking_type: 'event',
                payment_status: 'Success',
                payment_verified: true,
                payment_file: req.body.payment_file,
                createdAt: req.body.createdAt,
                verifiedAt: req.body.createdAt,
            });

            await EventBookings.updateOne(
                { _id: bookingData._id },
                {
                    $set: {
                        payment_status: 'Success',
                        payment_verified_at: new Date().toISOString(),
                    },
                },
            );
        } else if (req?.body?.booking_id) {
            const bookingData = await Bookings.findOne({
                _id: mongoose.Types.ObjectId(req?.body?.booking_id),
                payment_status: 'Pending',
                status: true,
            })
                .select({ _id: 1, member_id: 1 })
                .lean();

            let member_id = null;
            if (bookingData?.member_id) {
                let records = await readMembers(
                    { member_id: bookingData?.member_id },
                    { _id: 1, name: 1, address: 1 },
                );
                if (records) {
                    member_id = records?._id;
                }
            }

            const order_id = await generateOrderId('ORD');

            await PaymentHistory.create({
                member_id: member_id || null,
                order_id: order_id,
                booking_id: [bookingData._id],
                amount_paid: req.body.amount_paid,
                remarks: req.body.remarks,
                payment_mode: req.body.payment_mode || 'Offline',
                booking_type: 'booking',
                payment_status: 'Success',
                payment_verified: true,
                payment_file: req.body.payment_file,
                createdAt: req.body.createdAt,
                verifiedAt: req.body.createdAt,
            });

            await Bookings.updateOne(
                { _id: bookingData._id },
                {
                    $set: {
                        payment_status: 'Success',
                        payment_verified_at: new Date().toISOString(),
                    },
                },
            );
        } else {
            const planData = await readPlans({
                _id: mongoose.Types.ObjectId(req.body.plan_id),
            });
            if (!planData) {
                throw new Error('Plan does not exist!');
            }

            let payload = {
                member_id: req.body.member_id,
                booking_id: req.body.booking_id ? [req.body.booking_id] : [],
                payment_file: req.body.payment_file,
                amount_paid: req.body.amount_paid,
                plan_id: [req.body.plan_id],
                payment_status: 'Success',
                payment_verified: true,
                remarks: req.body.remarks,
                payment_mode: req.body.payment_mode || 'Offline',
                createdAt: req.body.createdAt,
                verifiedAt: req.body.createdAt,
                booking_type: planData.plan_type,
            };

            await PaymentHistory.create(payload);

            const userData = await readMembers({ _id: req.body.member_id });

            if (planData?.plan_type === 'membership') {
                userData.fees_paid = true;
                userData.fees_verified = true;
                userData.feesPaidAt = new Date().toISOString();
                userData.feesVerifiedAt = new Date().toISOString();

                userData.family_details.forEach((family) => {
                    family.fees_paid = true;
                });

                const start_month = planData?.start_month;
                const end_month = planData?.end_month;

                // Calculate the current year
                const currentYear = new Date().getFullYear();

                // Calculate the start date (1st day of the start month)
                const startDate = new Date(currentYear, start_month - 1, 1);

                // Calculate the end date (last day of the end month of the next year)
                // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                const endYear = end_month <= start_month ? currentYear + 1 : currentYear;
                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                userData.current_plan = {
                    plan_id: planData?.plan_id,
                    plan_name: planData?.plan_name,
                    amount: planData?.amount,
                    final_amount: planData?.amount,
                    start_month: planData?.start_month,
                    end_month: planData?.end_month,
                    dependent_member_price: planData?.dependent_member_price,
                    non_dependent_member_price: planData?.non_dependent_member_price,
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
                const start_month = planData?.start_month;
                const end_month = planData?.end_month;

                // Calculate the current year and month
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                // Calculate the start date (1st day of the start month)
                // const startDate = new Date(
                //     start_month < currentMonth ? currentYear + 1 : currentYear,
                //     start_month - 1,
                //     1,
                // );
                const startDate = new Date(currentYear, start_month - 1, 1);

                // Calculate the end date (last day of the end month of the next year)
                // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                const endYear =
                    end_month < start_month ||
                    (start_month < currentMonth && end_month <= currentMonth)
                        ? currentYear + 1
                        : currentYear;

                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                const userBooking = await Bookings.findOne({
                    _id: mongoose.Types.ObjectId(req.body.booking_id),
                });

                if (!userBooking) {
                    throw new Error('Booking does not exist!');
                }

                userBooking.payment_status = 'Success';
                userBooking.payment_verified_at = new Date().toISOString();
                userBooking.feesPaidAt = new Date().toISOString();
                userBooking.show_renew_button = false;

                userBooking.fees_breakup = {
                    ...planData,
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
                userBooking.total_amount = planData?.amount_paid;

                await Bookings.updateOne({ _id: userBooking._id }, userBooking);
            }
        }
        return responseSend(res, httpCodes.CREATED, 'Payment Received', null);
    } catch (error) {
        next(error);
    }
};

export const ccavenueStatusReconcile = (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            console.log('Called from ccavenueStatusReconcile');

            // Parse the form-urlencoded response
            const ccavPOST = qs.parse(ccavEncResponse);
            const encryptedResponse = ccavPOST.encResp;

            // Decrypt the response using the working key
            const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

            // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
            const responseData = qs.parse(ccavResponse);

            // Extract important fields from the response
            const {
                order_id,
                order_status: payment_order_status,
                amount: ccavenueAmount,
            } = responseData;

            const order_status = ['Success', 'Shipped', 'Successful'].includes(
                payment_order_status,
            )
                ? 'Success'
                : 'Failed';

            if (!order_id) {
                throw new Error('Order ID not found in response');
            }

            const paymentHistory = await PaymentHistory.findOne({ order_id: order_id });

            // Update payment history based on order_status
            if (order_status === 'Success' && paymentHistory) {
                // update payment history status
                let payload = {
                    payment_status: 'Success',
                    payment_verified: true,
                    verifiedAt: new Date().toISOString(),
                    payment_response: JSON.stringify(responseData),
                };

                await updatePaymentHistory({ _id: paymentHistory?._id }, payload);

                if (
                    paymentHistory.booking_type === 'enrollment' ||
                    paymentHistory.booking_type === 'membership' ||
                    paymentHistory.booking_type === 'renewal'
                ) {
                    for (let i = 0; i < paymentHistory?.plan_id.length; i++) {
                        const planData = await readPlans({
                            _id: mongoose.Types.ObjectId(paymentHistory?.plan_id[i]),
                        });
                        if (!planData) {
                            console.log('Plan does not exist!');
                        }

                        if (planData) {
                            const userData = await readMembers({
                                _id: paymentHistory.member_id,
                            });
                            if (planData?.plan_type === 'membership') {
                                const start_month = planData?.start_month;
                                const end_month = planData?.end_month;

                                // Calculate the current year
                                const currentYear = new Date().getFullYear();

                                // Calculate the start date (1st day of the start month)
                                const startDate = new Date(
                                    currentYear,
                                    start_month - 1,
                                    1,
                                );

                                // Calculate the end date (last day of the end month of the next year)
                                // We subtract 1 from end_month to get the zero-indexed month for Date constructor
                                const endYear =
                                    end_month <= start_month
                                        ? currentYear + 1
                                        : currentYear;
                                const endDate = new Date(endYear, end_month, 0); // Date of 0 gives the last day of the previous month

                                userData.fees_paid = true;
                                userData.fees_verified = true;
                                userData.feesPaidAt = new Date().toISOString();
                                userData.feesVerifiedAt = new Date().toISOString();

                                userData.family_details.forEach((family) => {
                                    family.fees_paid = true;
                                });

                                userData.current_plan = {
                                    plan_id: planData?.plan_id,
                                    plan_name: planData?.plan_name,
                                    amount: planData?.amount,
                                    final_amount: planData?.amount,
                                    start_month: planData?.start_month,
                                    end_month: planData?.end_month,
                                    dependent_member_price:
                                        planData?.dependent_member_price,
                                    non_dependent_member_price:
                                        planData?.non_dependent_member_price,
                                    start_date:
                                        String(startDate.getDate()).padStart(2, '0') +
                                        '/' +
                                        String(startDate.getMonth() + 1).padStart(
                                            2,
                                            '0',
                                        ) +
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
                                const start_month = planData?.start_month;
                                const end_month = planData?.end_month;

                                // Calculate the current year and month
                                const currentDate = new Date();
                                const currentYear = currentDate.getFullYear();
                                const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based

                                // Calculate the start date (1st day of the start month)
                                // const startDate = new Date(
                                //     start_month < currentMonth
                                //         ? currentYear + 1
                                //         : currentYear,
                                //     start_month - 1,
                                //     1,
                                // );
                                const startDate = new Date(
                                    currentYear,
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

                                for (
                                    let index = 0;
                                    index < paymentHistory?.booking_id.length;
                                    index++
                                ) {
                                    const bookingId = paymentHistory?.booking_id[index];
                                    const userBooking = await Bookings.findOne({
                                        _id: mongoose.Types.ObjectId(bookingId),
                                    });

                                    userBooking.fees_breakup = {
                                        ...planData,
                                        start_date:
                                            String(startDate.getDate()).padStart(2, '0') +
                                            '/' +
                                            String(startDate.getMonth() + 1).padStart(
                                                2,
                                                '0',
                                            ) +
                                            '/' +
                                            startDate.getFullYear(),
                                        end_date:
                                            String(endDate.getDate()).padStart(2, '0') +
                                            '/' +
                                            String(endDate.getMonth() + 1).padStart(
                                                2,
                                                '0',
                                            ) +
                                            '/' +
                                            endDate.getFullYear(),
                                    };

                                    userBooking.payment_status = 'Success';
                                    userBooking.payment_verified_at =
                                        new Date().toISOString();
                                    userBooking.feesPaidAt = new Date().toISOString();
                                    userBooking.show_renew_button = false;

                                    userBooking.total_amount = planData?.amount_paid;

                                    await Bookings.updateOne(
                                        { _id: userBooking._id },
                                        userBooking,
                                    );
                                }
                            } else if (planData?.plan_type === 'bookings') {
                                for (
                                    let index = 0;
                                    index < paymentHistory?.booking_id.length;
                                    index++
                                ) {
                                    const bookingId = paymentHistory?.booking_id[index];
                                    const userBooking = await Bookings.findOne(
                                        {
                                            _id: bookingId,
                                        },
                                        { _id: 1, payment_status: 1, batch: 1 },
                                    );
                                    userBooking.payment_status = 'Success';
                                    userBooking.status = true;
                                    userBooking.payment_verified_at =
                                        new Date().toISOString();
                                    userBooking.feesPaidAt = new Date().toISOString();
                                    userBooking.show_renew_button = false;

                                    await Bookings.updateOne(
                                        { _id: userBooking._id },
                                        userBooking,
                                    );
                                }
                            }

                            // send mail here
                            sendRenewMail(userData);
                        }
                    }
                }

                // Send response to client
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/pending-payment?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            } else {
                console.log(
                    `Payment Failed for order id ${order_id} and order status ${order_status} on ccAvenueStatusReconcile`,
                );
                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Failed',
                            payment_response: JSON.stringify(responseData),
                        },
                    },
                );

                // Send response to client
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/pending-payment?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            }
        });
    } catch (error) {
        next(error);
    }
};

export const initiateEventPayment = async (req, res, next) => {
    try {
        const {
            amount,
            booking_id,
            customer_email,
            customer_phone,
            customer_name,
            remarks,
        } = req.body;
        if (!amount || !booking_id || !customer_email || !customer_phone || !remarks) {
            throw new Error('All fields are required');
        }
        const session = req?.session;

        let records = session?.member_id
            ? await readMembers(
                  { member_id: session?.member_id },
                  { _id: 1, name: 1, address: 1 },
              )
            : null;
        // if (!records) {
        //     throw new Error('Members does not exist!');
        // }

        // update booking status if user is making payment of booking
        const bookingData = await EventBookings.findOne({
            booking_id: booking_id,
            payment_status: 'Pending',
            status: true,
        })
            .select({ _id: 1 })
            .lean();

        const order_id = await generateOrderId('EVT');

        const data = {
            merchant_id: process.env.Merchant_ID,
            order_id: order_id,
            currency: 'INR',
            amount: amount,
            redirect_url:
                process.env.BACKEND_BASE_URL + '/payment/ccavenue-event-payment-response', // Where to redirect after payment
            cancel_url:
                process.env.BACKEND_BASE_URL + '/payment/ccavenue-event-payment-response',
            language: 'EN',
            billing_name: customer_name,
            billing_address: records?.address || '',
            billing_city: '',
            billing_state: '',
            billing_zip: '',
            billing_country: '',
            billing_tel: customer_phone,
            billing_email: customer_email,
            remarks,
        };

        const queryStringData = qs.stringify(data);

        const encryptedData = encrypt(queryStringData, process.env.Working_Key);

        await PaymentHistory.create({
            member_id: records?._id || null,
            order_id: order_id,
            event_booking_id: [bookingData._id],
            amount_paid: amount,
            remarks: remarks,
            payment_mode: 'Online',
            payment_status: 'Initiated',
            booking_type: 'event',
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            accessCode: process.env.Access_Code,
            order_id,
            encryptedData,
        });
    } catch (error) {
        next(error);
    }
};

export const ccavenueResponseEventPayment = (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            console.log(
                ccavEncResponse,
                'Raw Encoded Response from ccavenueResponseEventPayment',
            );

            // Parse the form-urlencoded response
            const ccavPOST = qs.parse(ccavEncResponse);
            const encryptedResponse = ccavPOST.encResp;

            // Decrypt the response using the working key
            const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

            // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
            const responseData = qs.parse(ccavResponse);

            // Extract important fields from the response
            const { order_id, order_status: payment_order_status } = responseData;

            const order_status = ['Success', 'Shipped', 'Successful'].includes(
                payment_order_status,
            )
                ? 'Success'
                : 'Failed';

            if (!order_id) {
                throw new Error('Order ID not found in response');
            }

            const paymentHistory = await PaymentHistory.findOne({ order_id: order_id });

            // Update payment history based on order_status
            if (order_status === 'Success' && paymentHistory) {
                // update event payment status
                await EventBookings.updateOne(
                    { _id: paymentHistory?.event_booking_id[0] },
                    {
                        $set: {
                            payment_status: 'Success',
                            payment_verified_at: new Date().toISOString(),
                        },
                    },
                );

                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Success',
                            payment_response: JSON.stringify(responseData),
                            verifiedAt: new Date().toISOString(),
                            payment_verified: true,
                        },
                    },
                );
                console.log('Payment status updated to Success');

                // Send response to client
                if (!paymentHistory?.member_id) {
                    return response.redirect(
                        process.env.FRONTEND_BASE_URL +
                            `/booked-events/guest?order_id=${order_id}&status=${order_status}`,
                    );
                }
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/booked-events?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            } else {
                console.log(
                    `Payment Failed for order id ${order_id} and order status ${order_status} on ccAvenueResponseEventPayment`,
                );
                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Failed',
                            payment_response: JSON.stringify(responseData),
                        },
                    },
                );
                console.log('Payment status updated to Failed');

                // Send response to client
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/pending-payment?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            }
        });
    } catch (error) {
        console.error('Error processing CCAvenue response:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

export const initiateHallPayment = async (req, res, next) => {
    try {
        const {
            amount,
            booking_id,
            customer_email,
            customer_phone,
            customer_name,
            remarks,
        } = req.body;
        if (!amount || !booking_id || !customer_email || !customer_phone || !remarks) {
            throw new Error('All fields are required');
        }
        const session = req?.session;

        let records = session?.member_id
            ? await readMembers(
                  { member_id: session?.member_id },
                  { _id: 1, name: 1, address: 1 },
              )
            : null;
        if (!records) {
            throw new Error('Members does not exist!');
        }

        // update booking status if user is making payment of booking
        const bookingData = await HallBookings.findOne({
            booking_id: booking_id,
            payment_status: 'Pending',
            status: true,
        })
            .select({ _id: 1 })
            .lean();

        const order_id = await generateOrderId('HALL');

        const data = {
            merchant_id: process.env.Merchant_ID,
            order_id: order_id,
            currency: 'INR',
            amount: amount,
            redirect_url:
                process.env.BACKEND_BASE_URL + '/payment/ccavenue-hall-payment-response', // Where to redirect after payment
            cancel_url:
                process.env.BACKEND_BASE_URL + '/payment/ccavenue-hall-payment-response',
            language: 'EN',
            billing_name: customer_name,
            billing_address: records?.address || '',
            billing_city: '',
            billing_state: '',
            billing_zip: '',
            billing_country: '',
            billing_tel: customer_phone,
            billing_email: customer_email,
            remarks,
        };

        const queryStringData = qs.stringify(data);

        const encryptedData = encrypt(queryStringData, process.env.Working_Key);

        await PaymentHistory.create({
            member_id: records?._id || null,
            order_id: order_id,
            hall_booking_id: [bookingData._id],
            amount_paid: amount,
            remarks: remarks,
            payment_mode: 'Online',
            payment_status: 'Initiated',
            booking_type: 'hall',
        });

        return responseSend(res, httpCodes.OK, 'Fetched', {
            accessCode: process.env.Access_Code,
            order_id,
            encryptedData,
        });
    } catch (error) {
        next(error);
    }
};

export const ccavenueResponseHallPayment = (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            console.log(
                ccavEncResponse,
                'Raw Encoded Response from ccavenueResponseHallPayment',
            );

            // Parse the form-urlencoded response
            const ccavPOST = qs.parse(ccavEncResponse);
            const encryptedResponse = ccavPOST.encResp;

            // Decrypt the response using the working key
            const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

            // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
            const responseData = qs.parse(ccavResponse);

            // Extract important fields from the response
            const { order_id, order_status: payment_order_status } = responseData;

            const order_status = ['Success', 'Shipped', 'Successful'].includes(
                payment_order_status,
            )
                ? 'Success'
                : 'Failed';

            if (!order_id) {
                throw new Error('Order ID not found in response');
            }

            const paymentHistory = await PaymentHistory.findOne({ order_id: order_id });

            // Update payment history based on order_status
            if (order_status === 'Success' && paymentHistory) {
                // update event payment status
                const bookingData = await HallBookings.findOne({
                    _id: paymentHistory?.hall_booking_id[0],
                    status: true,
                }).populate('hall_id');

                const totalPayable =
                    Number(bookingData?.hall_id?.booking_amount || 0) +
                    Number(bookingData?.hall_id?.cleaning_charges || 0) +
                    Number(bookingData?.hall_id?.refundable_deposit || 0) +
                    Number(bookingData?.hall_id?.additional_charges || 0);

                const amountPaid = Number(bookingData?.amount_paid || 0);
                const pendingAmount = totalPayable - amountPaid;

                await HallBookings.updateOne(
                    { _id: paymentHistory?.hall_booking_id[0] },
                    {
                        $set: {
                            payment_status: pendingAmount === 0 ? 'Paid' : 'Partial Paid',
                            payment_verified_at: new Date().toISOString(),
                        },
                    },
                );

                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Success',
                            payment_response: JSON.stringify(responseData),
                            verifiedAt: new Date().toISOString(),
                            payment_verified: true,
                        },
                    },
                );

                // Send response to client
                if (!paymentHistory?.member_id) {
                    return response.redirect(
                        process.env.FRONTEND_BASE_URL +
                            `/booked-halls/guest?order_id=${order_id}&status=${order_status}`,
                    );
                }
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/booked-halls?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            } else {
                console.log(
                    `Payment Failed for order id ${order_id} and order status ${order_status} on ccavenueResponseHallPayment`,
                );
                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Failed',
                            payment_response: JSON.stringify(responseData),
                        },
                    },
                );
                console.log('Payment status updated to Failed');

                // Send response to client
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/pending-payment?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            }
        });
    } catch (error) {
        console.error('Error processing CCAvenue response:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

export const initiateRemainHallPayment = async (req, res, next) => {
    try {
        const {
            amount,
            booking_id,
            customer_email,
            customer_phone,
            customer_name,
            remarks,
        } = req.body;
        if (!amount || !booking_id || !customer_email || !customer_phone || !remarks) {
            throw new Error('All fields are required');
        }
        const session = req?.session;

        let records = session?.member_id
            ? await readMembers(
                  { member_id: session?.member_id },
                  { _id: 1, name: 1, address: 1 },
              )
            : null;
        if (!records) {
            throw new Error('Members does not exist!');
        }

        // update booking status if user is making payment of booking
        const bookingData = await HallBookings.findOne({
            booking_id: booking_id,
            status: true,
        }).populate('hall_id');

        if (!bookingData) {
            throw new Error('No pending booking found for this ID');
        }

        if (!bookingData?.hall_id) {
            throw new Error('Hall data not found');
        }

        const totalPayable =
            Number(bookingData?.hall_id?.booking_amount || 0) +
            Number(bookingData?.hall_id?.cleaning_charges || 0) +
            Number(bookingData?.hall_id?.refundable_deposit || 0) +
            Number(bookingData?.hall_id?.additional_charges || 0);

        const amountPaid =
            bookingData.payment_status === 'Success'
                ? Number(bookingData?.amount_paid || 0)
                : 0;
        const pendingAmount = totalPayable - amountPaid;

        if (Number(amount) !== pendingAmount) {
            throw new Error('Amount mismatch. Please pay the exact remaining balance.');
        }

        const order_id = await generateOrderId('HALL');

        const data = {
            merchant_id: process.env.Merchant_ID,
            order_id: order_id,
            currency: 'INR',
            amount: amount,
            redirect_url:
                process.env.BACKEND_BASE_URL +
                '/payment/ccavenue-remain-hall-payment-response', // Where to redirect after payment
            cancel_url:
                process.env.BACKEND_BASE_URL +
                '/payment/ccavenue-remain-hall-payment-response',
            language: 'EN',
            billing_name: customer_name,
            billing_address: records?.address || '',
            billing_city: '',
            billing_state: '',
            billing_zip: '',
            billing_country: '',
            billing_tel: customer_phone,
            billing_email: customer_email,
            remarks,
        };

        const queryStringData = qs.stringify(data);

        const encryptedData = encrypt(queryStringData, process.env.Working_Key);

        const paymentPayload = {
            member_id: records?._id || null,
            order_id: order_id,
            hall_booking_id: [bookingData._id],
            amount_paid: amount,
            remarks: remarks,
            payment_mode: 'Online',
            payment_status: 'Initiated',
            booking_type: 'hall',
        };

        await PaymentHistory.create(paymentPayload);

        return responseSend(res, httpCodes.OK, 'Fetched', {
            accessCode: process.env.Access_Code,
            order_id,
            encryptedData,
        });
    } catch (error) {
        next(error);
    }
};

export const ccavenueResponseRemainHallPayment = (request, response, next) => {
    try {
        let ccavEncResponse = '';

        // Handle the incoming data
        request.on('data', (chunk) => {
            ccavEncResponse += chunk.toString(); // Convert the buffer to a string
        });

        // Once all data is received
        request.on('end', async () => {
            console.log(
                ccavEncResponse,
                'Raw Encoded Response from ccavenueResponseHallPayment',
            );

            // Parse the form-urlencoded response
            const ccavPOST = qs.parse(ccavEncResponse);
            const encryptedResponse = ccavPOST.encResp;

            // Decrypt the response using the working key
            const ccavResponse = decrypt(encryptedResponse, process.env.Working_Key);

            // Convert the decrypted response into a readable format (Optional: Generate HTML or JSON)
            const responseData = qs.parse(ccavResponse);

            // Extract important fields from the response
            const { order_id, order_status: payment_order_status } = responseData;

            const order_status = ['Success', 'Shipped', 'Successful'].includes(
                payment_order_status,
            )
                ? 'Success'
                : 'Failed';

            if (!order_id) {
                throw new Error('Order ID not found in response');
            }

            const paymentHistory = await PaymentHistory.findOne({ order_id: order_id });

            // Update payment history based on order_status
            if (order_status === 'Success' && paymentHistory) {
                const bookingData = await HallBookings.findOne({
                    _id: paymentHistory?.hall_booking_id[0],
                    status: true,
                }).populate('hall_id');

                let fullPayment = false;
                if (bookingData?.payment_status === 'Pending') {
                    fullPayment = true;
                }

                const totalPayable =
                    Number(bookingData?.hall_id?.booking_amount || 0) +
                    Number(bookingData?.hall_id?.cleaning_charges || 0) +
                    Number(bookingData?.hall_id?.refundable_deposit || 0) +
                    Number(bookingData?.hall_id?.additional_charges || 0);

                // update event payment status
                await HallBookings.updateOne(
                    { _id: paymentHistory?.hall_booking_id[0] },
                    {
                        $set: {
                            amount_paid: totalPayable,
                            payment_status: 'Success',
                            partial_payment_verified_at: new Date().toISOString(),
                            is_full_payment: fullPayment,
                        },
                    },
                );

                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Success',
                            payment_response: JSON.stringify(responseData),
                            verifiedAt: new Date().toISOString(),
                            payment_verified: true,
                        },
                    },
                );

                // Send response to client
                if (!paymentHistory?.member_id) {
                    return response.redirect(
                        process.env.FRONTEND_BASE_URL +
                            `/booked-halls/guest?order_id=${order_id}&status=${order_status}`,
                    );
                }
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/booked-halls?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            } else {
                console.log(
                    `Payment Failed for order id ${order_id} and order status ${order_status} on ccavenueResponseHallPayment`,
                );
                await PaymentHistory.updateOne(
                    { order_id: order_id },
                    {
                        $set: {
                            payment_status: 'Failed',
                            payment_response: JSON.stringify(responseData),
                        },
                    },
                );
                console.log('Payment status updated to Failed');

                // Send response to client
                const redirectUrl =
                    process.env.FRONTEND_BASE_URL +
                    `/pending-payment?order_id=${order_id}&status=${order_status}`;
                return response.redirect(redirectUrl);
            }
        });
    } catch (error) {
        console.error('Error processing CCAvenue response:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};
