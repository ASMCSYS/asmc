import { format } from 'date-fns';
import Members from '../../models/members.js';
import { Parser } from 'json2csv';
import Bookings from '../../models/bookings.js';
import { responseSend } from '../../helpers/responseSend.js';
import PaymentHistory from '../../models/payment_history.js';
import EventBookings from '../../models/event_booking.js';
import Events from '../../models/events.js';
import HallBookings from '../../models/hall_booking.js';
import Halls from '../../models/halls.js';
import mongoose from 'mongoose';
import { JsonDecode } from '../../utils/helper.js';

export const exportMembers = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        // Validate date input
        if (!start_date || !end_date) {
            throw new Error('Start date and End date are required');
        }

        const members = await Members.find({
            createdAt: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
            status: true,
        }).select(
            'member_id profile name email gender mobile dob chss_number chss_card_link is_family_user family_details address member_status status converted current_plan added_by feesPaidAt feesVerifiedAt member_post role_activity_name createdAt updatedAt convertedAt fees_paid fees_verified non_chss_number clothing_size clothing_type instruction tshirt_size tshirt_name payment_history no_of_card_issued',
        );

        // If no members found in the range
        if (members.length === 0) {
            throw new Error('No members found in the given date range.');
        }

        const familyFields = [];
        let maxFamilyCount = 0;

        // Step 1: Find the max number of family members across all members
        members.forEach((member) => {
            if (member.family_details && member.family_details.length > maxFamilyCount) {
                maxFamilyCount = member.family_details.length;
            }
        });

        // Step 2: Define familyFields for each family member
        for (let i = 1; i <= maxFamilyCount; i++) {
            familyFields.push(
                { label: `Family Member ${i} ID`, value: `family_member_${i}_id` },
                { label: `Family Member ${i} Name`, value: `family_member_${i}_name` },
                { label: `Family Member ${i} Email`, value: `family_member_${i}_email` },
                {
                    label: `Family Member ${i} Gender`,
                    value: `family_member_${i}_gender`,
                },
                {
                    label: `Family Member ${i} Mobile`,
                    value: `family_member_${i}_mobile`,
                },
                { label: `Family Member ${i} DOB`, value: `family_member_${i}_dob` },
                {
                    label: `Family Member ${i} Relation`,
                    value: `family_member_${i}_relation`,
                },
                {
                    label: `Family Member ${i} Is Dependent`,
                    value: `family_member_${i}_is_dependent`,
                },
                {
                    label: `Family Member ${i} Fees Paid`,
                    value: `family_member_${i}_fees_paid`,
                },
                {
                    label: `Family Member ${i} T-Shirt Size`,
                    value: `family_member_${i}_tshirt_size`,
                },
                {
                    label: `Family Member ${i} T-Shirt Name`,
                    value: `family_member_${i}_tshirt_name`,
                },
                {
                    label: `Family Member ${i} Clothing Type`,
                    value: `family_member_${i}_clothing_type`,
                },
                {
                    label: `Family Member ${i} Clothing Size`,
                    value: `family_member_${i}_clothing_size`,
                },
                {
                    label: `Family Member ${i} Instruction`,
                    value: `family_member_${i}_instruction`,
                },
                {
                    label: `Family Member ${i} No of Card Issued`,
                    value: `family_member_${i}_no_of_card_issued`,
                },
                {
                    label: `Family Member ${i} Plan Amount`,
                    value: `family_member_${i}_plan_amount`,
                },
                {
                    label: `Family Member ${i} Plan Name`,
                    value: `family_member_${i}_plan_name`,
                },
                {
                    label: `Family Member ${i} Plan Type`,
                    value: `family_member_${i}_plan_type`,
                },
                {
                    label: `Family Member ${i} Plan Start Date`,
                    value: `family_member_${i}_plan_start_date`,
                },
                {
                    label: `Family Member ${i} Plan End Date`,
                    value: `family_member_${i}_plan_end_date`,
                },
                {
                    label: `Family Member ${i} Created At`,
                    value: `family_member_${i}_created_at`,
                },
                {
                    label: `Family Member ${i} Updated At`,
                    value: `family_member_${i}_updated_at`,
                },
            );
        }

        // Step 3: Format the member data
        const formattedMembers = members.map((member) => {
            const familyDetails = member.family_details || [];
            let familyData = {};

            familyDetails.forEach((family, index) => {
                const memberNum = index + 1;
                const prefix = `family_member_${memberNum}`;

                familyData[`${prefix}_id`] = family.id || 'N/A';
                familyData[`${prefix}_name`] = family.name || 'N/A';
                familyData[`${prefix}_email`] = family.email || 'N/A';
                familyData[`${prefix}_gender`] = family.gender || 'N/A';
                familyData[`${prefix}_mobile`] = family.mobile || 'N/A';
                familyData[`${prefix}_dob`] = family.dob || 'N/A';
                familyData[`${prefix}_relation`] = family.relation || 'N/A';
                familyData[`${prefix}_is_dependent`] = family.is_dependent ? 'Yes' : 'No';
                familyData[`${prefix}_fees_paid`] = family.fees_paid ? 'Yes' : 'No';
                familyData[`${prefix}_tshirt_size`] = family.tshirt_size || 'N/A';
                familyData[`${prefix}_tshirt_name`] = family.tshirt_name || 'N/A';
                familyData[`${prefix}_clothing_type`] = family.clothing_type || 'N/A';
                familyData[`${prefix}_clothing_size`] = family.clothing_size || 'N/A';
                familyData[`${prefix}_instruction`] = family.instruction || 'N/A';
                familyData[`${prefix}_no_of_card_issued`] =
                    family.no_of_card_issued || 'N/A';
                familyData[`${prefix}_plan_amount`] = family.plans?.amount || 'N/A';
                familyData[`${prefix}_plan_name`] = family.plans?.plan_name || 'N/A';
                familyData[`${prefix}_plan_type`] = family.plans?.plan_type || 'N/A';
                familyData[`${prefix}_plan_start_date`] =
                    family.plans?.start_date || 'N/A';
                familyData[`${prefix}_plan_end_date`] = family.plans?.end_date || 'N/A';
                familyData[`${prefix}_created_at`] = family.createdAt
                    ? format(new Date(family.createdAt), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A';
                familyData[`${prefix}_updated_at`] = family.updatedAt
                    ? format(new Date(family.updatedAt), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A';
            });

            return {
                // Primary Member Details
                member_id: member.member_id,
                profile: member.profile || 'N/A',
                name: member.name,
                email: member.email,
                gender: member.gender || 'N/A',
                mobile: member.mobile,
                dob: member.dob ? format(new Date(member.dob), 'dd/MM/yyyy') : 'N/A',
                chss_number: member.chss_number || 'N/A',
                chss_card_link: member.chss_card_link || 'N/A',
                is_family_user: member.is_family_user ? 'Yes' : 'No',
                address: member.address || 'N/A',
                member_status: member.member_status,
                status: member.status ? 'Active' : 'Inactive',
                converted: member.converted ? 'Yes' : 'No',
                member_post: member.member_post || 'N/A',
                role_activity_name: member.role_activity_name || 'N/A',
                non_chss_number: member.non_chss_number || 'N/A',

                // Primary Member Clothing Details
                tshirt_size: member.tshirt_size || 'N/A',
                tshirt_name: member.tshirt_name || 'N/A',
                clothing_type: member.clothing_type || 'N/A',
                clothing_size: member.clothing_size || 'N/A',
                instruction: member.instruction || 'N/A',
                no_of_card_issued: member.no_of_card_issued || 'N/A',

                // Primary Member Plan Details
                current_plan_id: member.current_plan?.plan_id || 'N/A',
                current_plan_name: member.current_plan?.plan_name || 'N/A',
                current_plan_amount: member.current_plan?.amount || 'N/A',
                current_plan_start_month: member.current_plan?.start_month || 'N/A',
                current_plan_end_month: member.current_plan?.end_month || 'N/A',
                current_plan_dependent_price:
                    member.current_plan?.dependent_member_price || 'N/A',
                current_plan_non_dependent_price:
                    member.current_plan?.non_dependent_member_price || 'N/A',
                current_plan_final_amount: member.current_plan?.final_amount || 'N/A',
                current_plan_start_date: member.current_plan?.start_date || 'N/A',
                current_plan_end_date: member.current_plan?.end_date || 'N/A',
                current_plan_updated_at: member.current_plan?.updated_at
                    ? format(
                          new Date(member.current_plan.updated_at),
                          'dd/MM/yyyy HH:mm:ss',
                      )
                    : 'N/A',

                // Added By Details
                added_by_id: member.added_by?._id || 'N/A',
                added_by_name: member.added_by?.name || 'N/A',

                // Payment and Verification Details
                fees_paid: member.fees_paid ? 'Yes' : 'No',
                fees_verified: member.fees_verified ? 'Yes' : 'No',
                feesPaidAt: member.feesPaidAt
                    ? format(new Date(member.feesPaidAt), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',
                feesVerifiedAt: member.feesVerifiedAt
                    ? format(new Date(member.feesVerifiedAt), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',

                // Timestamps
                createdAt: format(new Date(member.createdAt), 'dd/MM/yyyy HH:mm:ss'),
                updatedAt: format(new Date(member.updatedAt), 'dd/MM/yyyy HH:mm:ss'),
                convertedAt: member.convertedAt
                    ? format(new Date(member.convertedAt), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',

                // Family Members Data
                ...familyData,
            };
        });

        const fields = [
            // Primary Member Basic Details
            { label: 'Member ID', value: 'member_id' },
            { label: 'Profile Picture', value: 'profile' },
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
            { label: 'Gender', value: 'gender' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Date of Birth', value: 'dob' },
            { label: 'CHSS Number', value: 'chss_number' },
            { label: 'CHSS Card Link', value: 'chss_card_link' },
            { label: 'Non-CHSS Number', value: 'non_chss_number' },
            { label: 'Is Family User', value: 'is_family_user' },
            { label: 'Address', value: 'address' },
            { label: 'Member Status', value: 'member_status' },
            { label: 'Status', value: 'status' },
            { label: 'Converted', value: 'converted' },
            { label: 'Member Post', value: 'member_post' },
            { label: 'Role Activity Name', value: 'role_activity_name' },

            // Primary Member Clothing Details
            { label: 'T-Shirt Size', value: 'tshirt_size' },
            { label: 'T-Shirt Name', value: 'tshirt_name' },
            { label: 'Clothing Type', value: 'clothing_type' },
            { label: 'Clothing Size', value: 'clothing_size' },
            { label: 'Instruction', value: 'instruction' },
            { label: 'No of Card Issued', value: 'no_of_card_issued' },

            // Primary Member Current Plan Details
            { label: 'Current Plan ID', value: 'current_plan_id' },
            { label: 'Current Plan Name', value: 'current_plan_name' },
            { label: 'Current Plan Amount', value: 'current_plan_amount' },
            { label: 'Current Plan Start Month', value: 'current_plan_start_month' },
            { label: 'Current Plan End Month', value: 'current_plan_end_month' },
            {
                label: 'Current Plan Dependent Price',
                value: 'current_plan_dependent_price',
            },
            {
                label: 'Current Plan Non-Dependent Price',
                value: 'current_plan_non_dependent_price',
            },
            { label: 'Current Plan Final Amount', value: 'current_plan_final_amount' },
            { label: 'Current Plan Start Date', value: 'current_plan_start_date' },
            { label: 'Current Plan End Date', value: 'current_plan_end_date' },
            { label: 'Current Plan Updated At', value: 'current_plan_updated_at' },

            // Added By Details
            { label: 'Added By ID', value: 'added_by_id' },
            { label: 'Added By Name', value: 'added_by_name' },

            // Payment and Verification Details
            { label: 'Fees Paid', value: 'fees_paid' },
            { label: 'Fees Verified', value: 'fees_verified' },
            { label: 'Fees Paid At', value: 'feesPaidAt' },
            { label: 'Fees Verified At', value: 'feesVerifiedAt' },

            // Timestamps
            { label: 'Created At', value: 'createdAt' },
            { label: 'Updated At', value: 'updatedAt' },
            { label: 'Converted At', value: 'convertedAt' },

            // Family Members Fields
            ...familyFields,
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedMembers);

        // Set headers to prompt file download
        res.header('Content-Type', 'text/csv');
        res.attachment(`comprehensive_members_report_${start_date}_to_${end_date}.csv`);
        return res.send(csv);
    } catch (error) {
        next(error);
    }
};

export const exportEnrollment = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        // Validate date input
        if (!start_date || !end_date) {
            throw new Error('Start date and End date are required');
        }

        console.log(
            {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
            'sdf',
        );

        const extra = [
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                    pipeline: [
                        { $project: { member_id: 1, name: 1, mobile: 1, email: 1 } },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'activities',
                    localField: 'activity_id',
                    foreignField: '_id',
                    as: 'activity_data',
                    pipeline: [{ $project: { activity_id: 1, name: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'batches',
                    localField: 'batch',
                    foreignField: '_id',
                    as: 'batch_data',
                },
            },
            {
                $unwind: {
                    path: '$batch_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'batch_data.location_id',
                    foreignField: '_id',
                    as: 'location_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$location_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'batch_data.sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$sublocation_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    activity_name: { $first: '$activity_name' }, // Replace with your actual field names
                    batch_data: {
                        $push: {
                            _id: '$batch_data._id',
                            batch_code: '$batch_data.batch_code',
                        },
                    },
                    other_fields: { $first: '$$ROOT' },
                },
            },
            {
                $addFields: {
                    'other_fields.batch_data': '$batch_data',
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$other_fields',
                },
            },
        ];

        const bookings = await Bookings.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(start_date), $lte: new Date(end_date) },
                    type: 'enrollment',
                    payment_status: 'Success',
                },
            },
            ...extra,
        ]).allowDiskUse(true);

        // responseSend(res, 200, null, bookings);

        // If no members found in the range
        if (bookings.length === 0) {
            throw new Error('No members found in the given date range.');
        }

        const formattedMembers = await Promise.all(
            bookings.map(async (booking) => {
                // find payment details for each member
                const paymentDetails = await PaymentHistory.findOne(
                    { booking_id: booking._id },
                    { payment_id: 1, amount_paid: 1, createdAt: 1 },
                ).lean();
                return {
                    enrollment_id: booking.booking_id,
                    name:
                        (booking.family_member && booking.family_member?.[0]?.name) ||
                        booking?.member_data?.[0]?.name ||
                        'N/A',
                    mobile:
                        (booking.family_member && booking.family_member?.[0]?.mobile) ||
                        booking?.member_data?.[0]?.mobile ||
                        'N/A',
                    email:
                        (booking.family_member && booking.family_member?.[0]?.email) ||
                        booking?.member_data?.[0]?.email ||
                        'N/A',
                    activity_name:
                        (booking.activity_data && booking.activity_data?.[0]?.name) ||
                        'N/A',
                    batch_code:
                        (booking.batch_data && booking.batch_data?.[0]?.batch_code) ||
                        'N/A',
                    payment_date: paymentDetails?.createdAt
                        ? format(new Date(paymentDetails?.createdAt), 'dd/MM/yyyy')
                        : 'N/A',
                    payment_id: paymentDetails?.payment_id || 'N/A',
                    amount_paid: paymentDetails?.amount_paid || 'N/A',
                    plan_name: booking.fees_breakup?.plan_name || 'N/A',
                    plan_start_date: booking.fees_breakup?.start_date || 'N/A',
                    plan_end_date: booking.fees_breakup?.end_date || 'N/A',
                };
            }),
        );

        const fields = [
            { label: 'Enrollment Id', value: 'enrollment_id' },
            { label: 'Name', value: 'name' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Email', value: 'email' },
            { label: 'Activity Name', value: 'activity_name' },
            { label: 'Batch Code', value: 'batch_code' },
            { label: 'Payment Date', value: 'payment_date' },
            { label: 'Payment Id', value: 'payment_id' },
            { label: 'Total Amount', value: 'amount_paid' },
            { label: 'Plan Name', value: 'plan_name' },
            { label: 'Start Date', value: 'plan_start_date' },
            { label: 'End Date', value: 'plan_end_date' },
        ];

        // const fields = [
        //     { label: 'Enrollment Id', value: 'enrollment_id' },
        //     { label: 'Name', value: 'name' },
        //     { label: 'Mobile', value: 'mobile' },
        //     { label: 'Email', value: 'email' },
        //     { label: 'Activity Name', value: 'activity_name' },
        //     { label: 'Batch Code', value: 'batch_code' },
        //     { label: 'Payment Date', value: 'payment_date' },
        //     { label: 'Payment Mode', value: 'payment_mode' },
        //     { label: 'Order Id', value: 'order_id' },
        //     { label: 'Payment Id', value: 'payment_id' },
        //     { label: 'Total Amount', value: 'amount_paid' },
        //     { label: 'Plan Name', value: 'plan_name' },
        //     { label: 'Start Date', value: 'plan_start_date' },
        //     { label: 'End Date', value: 'plan_end_date' },
        // ];

        // Convert members data to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedMembers);

        // Set headers to prompt file download
        res.header('Content-Type', 'text/csv');
        res.attachment(`enrollments_${start_date}_to_${end_date}.csv`);
        return res.send(csv);
    } catch (error) {
        next(error);
    }
};

export const exportBatchWise = async (req, res, next) => {
    try {
        const { start_date, end_date, batch_id, download } = req.query;

        const arrayBatchId = batch_id
            ? batch_id.split(',').map((id) => new mongoose.Types.ObjectId(id))
            : '';

        const where = {
            payment_status: 'Success',
            status: true,
        };

        if (req.query.activity_id && req.query.activity_id !== '') {
            where.activity_id = mongoose.Types.ObjectId(req.query.activity_id);
        }
        if (batch_id && batch_id !== '') {
            where.batch = { $in: arrayBatchId };
        }

        if (start_date && end_date) {
            where.payment_verified_at = {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            };
        }

        const result = await Bookings.aggregate([
            {
                $match: where,
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                    pipeline: [{ $project: { _id: 1, name: 1, mobile: 1, email: 1 } }],
                },
            },
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
                    localField: 'batch',
                    foreignField: '_id',
                    as: 'batch_data',
                    pipeline: [{ $project: { _id: 1, batch_code: 1, batch_name: 1 } }],
                },
            },
            {
                $unwind: '$member_data', // Unwind arrays since there should be one member per booking
            },
            {
                $unwind: '$activity_data', // Unwind to extract the activity details
            },
            {
                $unwind: '$batch_data', // Unwind to extract batch details
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id
                    batch_name: '$batch_data.batch_name',
                    batch_code: '$batch_data.batch_code',
                    enrollment_id: '$booking_id',
                    name: '$member_data.name',
                    mobile: '$member_data.mobile',
                    email: '$member_data.email',
                    family_member: 1,
                    activity_name: '$activity_data.name',
                    total_amount: '$total_amount',
                    plan_name: '$fees_breakup.plan_name',
                    plan_start_date: '$fees_breakup.start_date',
                    plan_end_date: '$fees_breakup.end_date',
                },
            },
        ]).allowDiskUse(true);

        const filteredData = result.map((item) => {
            return {
                name:
                    item?.family_member.length > 0 && item?.family_member[0]?.name
                        ? item?.family_member[0]?.name
                        : item?.name,
                email:
                    item?.family_member.length > 0 && item?.family_member[0]?.email
                        ? item?.family_member[0]?.email
                        : item?.email,
                mobile:
                    item?.family_member.length > 0 && item?.family_member[0]?.mobile
                        ? item?.family_member[0]?.mobile
                        : item?.mobile,
                batch_name: item?.batch_name,
                batch_code: item?.batch_code,
                enrollment_id: item?.enrollment_id,
                activity_name: item?.activity_name,
                total_amount: item?.total_amount,
                plan_name: item?.plan_name,
                plan_start_date: item?.plan_start_date,
                plan_end_date: item?.plan_end_date,
            };
        });

        if (download) {
            const mergedData = filteredData.reduce((acc, item) => {
                const { batch_name } = item;

                // Check if batch_name already exists in the accumulator
                if (!acc[batch_name]) {
                    // If not, create a new entry with batch_name and initialize with an array
                    acc[batch_name] = [];
                }

                // Push the current item into the array for this batch_name
                acc[batch_name].push(item);

                return acc;
            }, {});

            // Convert the accumulator object into an array if needed
            const resultArray = Object.keys(mergedData).map((batch_name) => ({
                batch_name,
                data: mergedData[batch_name],
            }));

            return responseSend(res, 200, 'Success', resultArray);
        }

        const fields = [
            { label: 'Batch Name', value: 'batch_name' },
            { label: 'Batch Code', value: 'batch_code' },
            { label: 'Enrollment Id', value: 'enrollment_id' },
            { label: 'Name', value: 'name' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Email', value: 'email' },
            { label: 'Activity Name', value: 'activity_name' },
            { label: 'Total Amount', value: 'total_amount' },
            { label: 'Plan Name', value: 'plan_name' },
            { label: 'Start Date', value: 'plan_start_date' },
            { label: 'End Date', value: 'plan_end_date' },
        ];

        // Convert members data to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(filteredData);

        // Set headers to prompt file download
        res.header('Content-Type', 'text/csv');
        res.attachment(`enrollments_${start_date}_to_${end_date}.csv`);
        return res.send(csv);
    } catch (error) {
        next(error);
    }
};

export const exportRenewalReport = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const futureDate = new Date();

        // Set the future date to 15 days from now
        futureDate.setDate(currentDate.getDate() + 15);

        const result = await Bookings.aggregate([
            {
                $addFields: {
                    fees_breakup_end_date: {
                        $dateFromString: {
                            dateString: '$fees_breakup.end_date',
                            format: '%d/%m/%Y',
                        },
                    },
                },
            },
            {
                $match: {
                    fees_breakup_end_date: {
                        $lte: futureDate,
                    },
                    payment_status: 'Success',
                    status: true,
                    type: 'enrollment',
                },
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                    pipeline: [{ $project: { _id: 1, name: 1, mobile: 1, email: 1 } }],
                },
            },
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
                    localField: 'batch',
                    foreignField: '_id',
                    as: 'batch_data',
                    pipeline: [{ $project: { _id: 1, batch_code: 1, batch_name: 1 } }],
                },
            },
            {
                $unwind: '$member_data', // Unwind arrays since there should be one member per booking
            },
            {
                $unwind: '$activity_data', // Unwind to extract the activity details
            },
            {
                $unwind: '$batch_data', // Unwind to extract batch details
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id
                    batch_name: '$batch_data.batch_name',
                    batch_code: '$batch_data.batch_code',
                    enrollment_id: '$booking_id',
                    name: '$member_data.name',
                    mobile: '$member_data.mobile',
                    email: '$member_data.email',
                    family_member: 1,
                    activity_name: '$activity_data.name',
                    total_amount: '$total_amount',
                    plan_name: '$fees_breakup.plan_name',
                    plan_start_date: '$fees_breakup.start_date',
                    plan_end_date: '$fees_breakup.end_date',
                    show_renew_button: '$show_renew_button',
                },
            },
        ]).allowDiskUse(true);

        const filteredData = result.map((item) => {
            return {
                name:
                    item?.family_member.length > 0 && item?.family_member[0]?.name
                        ? item?.family_member[0]?.name
                        : item?.name,
                email:
                    item?.family_member.length > 0 && item?.family_member[0]?.email
                        ? item?.family_member[0]?.email
                        : item?.email,
                mobile:
                    item?.family_member.length > 0 && item?.family_member[0]?.mobile
                        ? item?.family_member[0]?.mobile
                        : item?.mobile,
                batch_name: item?.batch_name,
                batch_code: item?.batch_code,
                enrollment_id: item?.enrollment_id,
                activity_name: item?.activity_name,
                total_amount: item?.total_amount,
                plan_name: item?.plan_name,
                plan_start_date: item?.plan_start_date,
                plan_end_date: item?.plan_end_date,
                show_renew_button: item?.show_renew_button,
            };
        });

        const fields = [
            { label: 'Batch Name', value: 'batch_name' },
            { label: 'Batch Code', value: 'batch_code' },
            { label: 'Enrollment Id', value: 'enrollment_id' },
            { label: 'Name', value: 'name' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Email', value: 'email' },
            { label: 'Activity Name', value: 'activity_name' },
            { label: 'Total Amount', value: 'total_amount' },
            { label: 'Plan Name', value: 'plan_name' },
            { label: 'Start Date', value: 'plan_start_date' },
            { label: 'End Date', value: 'plan_end_date' },
            { label: 'Renew Button Display', value: 'show_renew_button' },
        ];

        // Convert members data to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(filteredData);

        return responseSend(res, 200, 'success', { csv, filteredData });
    } catch (error) {
        next(error);
    }
};

export const exportPaymentSummary = async (req, res, next) => {
    try {
        const { start_date, end_date, payment_type, payment_mode = null } = req.query;

        const matchCondition = {
            payment_status: 'Success',
        };

        if (payment_mode && payment_mode !== '') {
            matchCondition.payment_mode = {
                $in: payment_mode.split(','),
            };
        } else {
            matchCondition.payment_mode = { $ne: null };
        }

        if (start_date && end_date) {
            matchCondition.verifiedAt = {
                $gte: new Date(start_date).toISOString(),
                $lte: new Date(new Date(end_date).setHours(23, 59, 59)).toISOString(),
            };
        } else {
            matchCondition.verifiedAt = { $ne: null }; // Exclude null verifiedAt if no date range is provided
        }

        if (payment_type && payment_type !== '') {
            matchCondition.booking_type = {
                $in: payment_type.split(','),
            };
        }

        // Step 1: Get all unique payment modes
        const allPaymentModes = await PaymentHistory.distinct(
            'payment_mode',
            matchCondition,
        );

        const result = await PaymentHistory.aggregate([
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: {
                        date: '$verifiedAt',
                        payment_mode: '$payment_mode',
                    },
                    total_amount: { $sum: '$amount_paid' },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: '$_id.date',
                    payment_methods: {
                        $push: {
                            payment_mode: '$_id.payment_mode',
                            total_amount: '$total_amount',
                            count: '$count',
                        },
                    },
                    total_amount_per_day: { $sum: '$total_amount' },
                    transaction_count: { $sum: '$count' },
                },
            },
            {
                $set: {
                    payment_methods: {
                        $map: {
                            input: '$payment_methods',
                            as: 'method',
                            in: {
                                payment_mode: '$$method.payment_mode',
                                total_amount: '$$method.total_amount',
                                count: '$$method.count',
                                proportion: {
                                    $divide: ['$$method.count', '$transaction_count'],
                                },
                            },
                        },
                    },
                },
            },
            {
                $sort: { _id: 1 }, // Sort by date ascending
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    total_amount_per_day: 1,
                    transaction_count: 1,
                    payment_methods: 1,
                },
            },
        ]);

        // return responseSend(res, 200, "Success", result);

        if (result && result.length === 0) {
            return responseSend(res, 404, 'Data not found');
        }

        // Step 3: Prepare data for CSV
        const filteredData = result.map((item) => {
            const row = {
                date: item.date,
                total_amount: item.total_amount_per_day,
                transaction_count: item.transaction_count, // Add transaction count
            };

            // Initialize all payment modes with 0
            allPaymentModes.forEach((mode) => {
                row[mode] = 0;
            });

            // Fill in actual values for the payment methods present
            item.payment_methods.forEach((method) => {
                row[method.payment_mode] = method.total_amount;
                row[method.payment_mode + '_count'] = method.count;
            });

            return row;
        });

        // Step 4: Prepare CSV fields
        const fields = [
            { label: 'Date', value: 'date' },
            { label: 'Total Amount', value: 'total_amount' },
            { label: 'Transaction Count', value: 'transaction_count' },
            ...allPaymentModes.map((mode) => ({
                label: mode,
                value: mode,
            })),
        ];

        // Convert members data to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(filteredData);

        return responseSend(res, 200, 'success', { csv, filteredData });
    } catch (error) {
        next(error);
    }
};

export const exportPaymentReport = async (req, res, next) => {
    try {
        const { start_date, end_date, payment_type, payment_mode = null } = req.query;

        const matchCondition = {
            payment_status: 'Success',
        };

        // Apply payment mode filter
        // if (payment_mode && payment_mode !== '') {
        //     matchCondition.payment_mode = { $in: payment_mode.split(',') };
        // }

        // // Apply date range filter
        // if (start_date && end_date) {
        //     matchCondition.createdAt = {
        //         $gte: new Date(start_date),
        //         $lte: new Date(new Date(end_date).setHours(23, 59, 59)),
        //     };
        // }

        // // Apply payment type filter
        // if (payment_type && payment_type !== '') {
        //     matchCondition.booking_type = { $in: payment_type.split(',') };
        // }

        const result = await PaymentHistory.aggregate([
            {
                $match: matchCondition,
            },

            // Lookup all related bookings
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'booking_id',
                    foreignField: '_id',
                    as: 'booking_data',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                booking_id: 1,
                                activity_id: 1,
                                member_id: 1,
                                batch: 1,
                                family_member: 1,
                                fees_breakup: 1,
                                total_amount: 1,
                                enrollment_id: 1,
                            },
                        },
                    ],
                },
            },

            // Lookup primary member
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                member_id: 1,
                                name: 1,
                                mobile: 1,
                                email: 1,
                                family_details: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: '$member_data' },

            // Lookup activities (multiple for multiple bookings)
            {
                $lookup: {
                    from: 'activities',
                    let: {
                        activity_ids: {
                            $map: {
                                input: '$booking_data',
                                as: 'b',
                                in: '$$b.activity_id',
                            },
                        },
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$activity_ids'],
                                },
                            },
                        },
                        { $project: { _id: 1, name: 1 } },
                    ],
                    as: 'activity_data',
                },
            },

            // Lookup batches
            {
                $lookup: {
                    from: 'batches',
                    let: {
                        batch_ids: {
                            $map: {
                                input: '$booking_data',
                                as: 'b',
                                in: '$$b.batch',
                            },
                        },
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$batch_ids'],
                                },
                            },
                        },
                        { $project: { _id: 1, batch_name: 1, batch_code: 1 } },
                    ],
                    as: 'batch_data',
                },
            },

            // Prepare plan_id as ObjectId
            {
                $addFields: {
                    plan_object_ids: {
                        $map: {
                            input: '$plan_id',
                            as: 'id',
                            in: { $toObjectId: '$$id' },
                        },
                    },
                },
            },

            // Lookup plans
            {
                $lookup: {
                    from: 'plans',
                    let: { ids: '$plan_object_ids' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$ids'] },
                            },
                        },
                        {
                            $project: { _id: 1, plan_type: 1, plan_name: 1 },
                        },
                    ],
                    as: 'plan_data',
                },
            },

            // Extract secondary member if exists
            {
                $addFields: {
                    secondary_member_detail: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$member_data.family_details',
                                    as: 'family',
                                    cond: {
                                        $eq: [
                                            '$$family._id',
                                            { $toObjectId: '$secondary_member_id' },
                                        ],
                                    },
                                },
                            },
                            0,
                        ],
                    },
                },
            },

            // Flatten plan name/type
            {
                $addFields: {
                    plan_types: {
                        $map: {
                            input: '$plan_data',
                            as: 'p',
                            in: '$$p.plan_type',
                        },
                    },
                    plan_names: {
                        $map: {
                            input: '$plan_data',
                            as: 'p',
                            in: '$$p.plan_name',
                        },
                    },
                },
            },
        ]).allowDiskUse(true);

        if (!result || result.length === 0) {
            return responseSend(res, 404, 'Data not found');
        }

        // ========== ✅ FORMAT FLATTENED DATA ==========
        const filteredData = result.map((item) => {
            const enrollmentIds =
                item.booking_data?.map((b) => b.booking_id)?.filter(Boolean) || [];
            const batchNames =
                item.booking_data
                    ?.map((b) => {
                        const batch = item.batch_data?.find(
                            (ba) => ba._id?.toString() === b.batch?.toString(),
                        );
                        return batch?.batch_name;
                    })
                    .filter(Boolean) || [];

            const activityNames =
                item.booking_data
                    ?.map((b) => {
                        const act = item.activity_data?.find(
                            (a) => a._id?.toString() === b.activity_id?.toString(),
                        );
                        return act?.name;
                    })
                    .filter(Boolean) || [];

            const row = {
                member_id: item?.member_data?.member_id,
                p_member_name: item?.member_data?.name,
                p_member_mobile: item?.member_data?.mobile,
                s_member_name: item?.secondary_member_detail?.name,
                plan_name: item?.plan_names?.join(', ') || '',
                plan_types: item?.plan_types?.join(', ') || '',
                payment_type: item?.plan_types?.join(', ') || '',
                enrollment_id: [...new Set(enrollmentIds)].join(', '),
                batch_name: [...new Set(batchNames)].join(', '),
                activity_name: [...new Set(activityNames)].join(', '),
                amount_paid: item?.amount_paid,
                payment_date: format(new Date(item?.createdAt), 'yyyy-MM-dd'),
                payment_mode: item?.payment_mode,
                payment_status: item?.payment_status,
                asmc_order_id: item?.order_id,
                cc_avenue_order: JsonDecode(item?.payment_response)?.tracking_id,
            };

            return row;
        });

        // Step 4: Prepare CSV fields
        const fields = [
            { label: 'Member Id', value: 'member_id' },
            { label: 'P Member Name', value: 'p_member_name' },
            { label: 'P Member Mobile', value: 'p_member_mobile' },
            { label: 'S Member Names', value: 's_member_name' },
            { label: 'Payment Types', value: 'payment_type' },
            { label: 'Amount Paid', value: 'amount_paid' },
            { label: 'Payment Date', value: 'payment_date' },
            { label: 'Payment Mode', value: 'payment_mode' },
            { label: 'Payment Status', value: 'payment_status' },
            { label: 'ASMC Order Id', value: 'asmc_order_id' },
            { label: 'CCavenue Order Id', value: 'cc_avenue_order' },
            { label: 'Plan Names', value: 'plan_name' },
            { label: 'Plan Types', value: 'plan_types' },
            { label: 'Enrollment Id', value: 'enrollment_id' },
            { label: 'Batch Name', value: 'batch_name' },
        ];

        // Convert members data to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(filteredData);

        // return responseSend(res, 200, 'success', { csv, filteredData });
        res.header('Content-Type', 'text/csv');
        res.attachment(`members_${start_date}_to_${end_date}.csv`);
        return res.send(csv);
    } catch (error) {
        next(error);
    }
};

export const exportEventBookings = async (req, res, next) => {
    try {
        const { start_date, end_date, event_id, payment_status } = req.query;

        // Build match condition
        const matchCondition = {
            status: true,
        };

        // Add date filter if provided
        if (start_date && end_date) {
            matchCondition.createdAt = {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            };
        }

        // Add event filter if provided
        if (event_id && event_id !== '') {
            matchCondition.event_id = new mongoose.Types.ObjectId(event_id);
        }

        // Add payment status filter if provided
        if (payment_status && payment_status !== '') {
            matchCondition.payment_status = payment_status;
        }

        const eventBookings = await EventBookings.aggregate([
            {
                $match: matchCondition,
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event_id',
                    foreignField: '_id',
                    as: 'event_data',
                    pipeline: [
                        {
                            $project: {
                                event_id: 1,
                                event_name: 1,
                                event_type: 1,
                                event_start_date: 1,
                                event_end_date: 1,
                                event_start_time: 1,
                                event_end_time: 1,
                                location_id: 1,
                                sublocation_id: 1,
                                court: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'event_data.location_id',
                    foreignField: '_id',
                    as: 'location_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'event_data.sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$event_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$location_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$sublocation_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]).allowDiskUse(true);

        // If no event bookings found
        if (eventBookings.length === 0) {
            throw new Error('No event bookings found in the given criteria.');
        }

        // Format the event bookings data
        const formattedEventBookings = eventBookings.map((booking) => {
            // Process member data
            const memberData = booking.member_data || [];
            const nonMemberData = booking.non_member_data || [];

            // Combine all participants (members + non-members)
            const allParticipants = [...memberData, ...nonMemberData];

            // Create participant details
            const participants = allParticipants.map((participant, index) => {
                return {
                    [`participant_${index + 1}_name`]: participant.name || 'N/A',
                    [`participant_${index + 1}_email`]: participant.email || 'N/A',
                    [`participant_${index + 1}_mobile`]: participant.mobile || 'N/A',
                    [`participant_${index + 1}_gender`]: participant.gender || 'N/A',
                    [`participant_${index + 1}_dob`]: participant.dob
                        ? format(new Date(participant.dob), 'dd/MM/yyyy')
                        : 'N/A',
                    [`participant_${index + 1}_member_id`]:
                        participant.member_id || 'N/A',
                    [`participant_${index + 1}_chss_number`]:
                        participant.chss_number || 'N/A',
                    [`participant_${index + 1}_is_member`]:
                        participant.is_member || 'N/A',
                    [`participant_${index + 1}_type`]: participant.type || 'N/A',
                    [`participant_${index + 1}_secondary_member_id`]:
                        participant.secondary_member_id || 'N/A',
                };
            });

            // Flatten participants data
            const flattenedParticipants = participants.reduce((acc, participant) => {
                return { ...acc, ...participant };
            }, {});

            return {
                // Booking Details
                booking_id: booking.booking_id || 'N/A',
                event_id: booking.event_id || 'N/A',
                category_id: booking.category_id || 'N/A',

                // Event Details
                event_name: booking.event_data?.event_name || 'N/A',
                event_type: booking.event_data?.event_type || 'N/A',
                event_start_date: booking.event_data?.event_start_date
                    ? format(new Date(booking.event_data.event_start_date), 'dd/MM/yyyy')
                    : 'N/A',
                event_end_date: booking.event_data?.event_end_date
                    ? format(new Date(booking.event_data.event_end_date), 'dd/MM/yyyy')
                    : 'N/A',
                event_start_time: booking.event_data?.event_start_time || 'N/A',
                event_end_time: booking.event_data?.event_end_time || 'N/A',

                // Location Details
                location: booking.location_data?.title || 'N/A',
                sublocation: booking.sublocation_data?.title || 'N/A',
                court: booking.event_data?.court || 'N/A',

                // Category Details
                category_name: booking.category_data?.category_name || 'N/A',
                category_description:
                    booking.category_data?.category_description || 'N/A',
                category_belts: booking.category_data?.belts || 'N/A',
                category_distance: booking.category_data?.distance || 'N/A',
                category_start_age: booking.category_data?.start_age || 'N/A',
                category_end_age: booking.category_data?.end_age || 'N/A',
                category_gender: Array.isArray(booking.category_data?.gender)
                    ? booking.category_data.gender.join(', ')
                    : booking.category_data?.gender || 'N/A',
                category_members_fees: booking.category_data?.members_fees || 'N/A',
                category_non_members_fees:
                    booking.category_data?.non_members_fees || 'N/A',

                // Booking Form Data
                booking_yourself: booking.booking_form_data?.yourself || 'N/A',
                booking_are_you_member:
                    booking.booking_form_data?.are_you_member || 'N/A',
                booking_partner_member:
                    booking.booking_form_data?.partner_member || 'N/A',
                booking_team_members_count:
                    booking.booking_form_data?.team_members?.length || 0,

                // Payment Details
                amount_paid: booking.amount_paid || 0,
                payment_status: booking.payment_status || 'N/A',
                payment_verified_at: booking.payment_verified_at
                    ? format(new Date(booking.payment_verified_at), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',

                // Participant Count
                total_members: memberData.length,
                total_non_members: nonMemberData.length,
                total_participants: allParticipants.length,

                // Timestamps
                created_at: format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm:ss'),
                updated_at: format(new Date(booking.updatedAt), 'dd/MM/yyyy HH:mm:ss'),

                // Participant Details (flattened)
                ...flattenedParticipants,
            };
        });

        // Find the maximum number of participants across all bookings
        const maxParticipants = Math.max(
            ...eventBookings.map(
                (booking) =>
                    (booking.member_data?.length || 0) +
                    (booking.non_member_data?.length || 0),
            ),
        );

        // Build dynamic fields for participants
        const participantFields = [];
        for (let i = 1; i <= maxParticipants; i++) {
            participantFields.push(
                { label: `Participant ${i} Name`, value: `participant_${i}_name` },
                { label: `Participant ${i} Email`, value: `participant_${i}_email` },
                { label: `Participant ${i} Mobile`, value: `participant_${i}_mobile` },
                { label: `Participant ${i} Gender`, value: `participant_${i}_gender` },
                { label: `Participant ${i} DOB`, value: `participant_${i}_dob` },
                {
                    label: `Participant ${i} Member ID`,
                    value: `participant_${i}_member_id`,
                },
                {
                    label: `Participant ${i} CHSS Number`,
                    value: `participant_${i}_chss_number`,
                },
                {
                    label: `Participant ${i} Is Member`,
                    value: `participant_${i}_is_member`,
                },
                { label: `Participant ${i} Type`, value: `participant_${i}_type` },
                {
                    label: `Participant ${i} Secondary Member ID`,
                    value: `participant_${i}_secondary_member_id`,
                },
            );
        }

        const fields = [
            // Booking Details
            { label: 'Booking ID', value: 'booking_id' },
            { label: 'Event ID', value: 'event_id' },
            { label: 'Category ID', value: 'category_id' },

            // Event Details
            { label: 'Event Name', value: 'event_name' },
            { label: 'Event Type', value: 'event_type' },
            { label: 'Event Start Date', value: 'event_start_date' },
            { label: 'Event End Date', value: 'event_end_date' },
            { label: 'Event Start Time', value: 'event_start_time' },
            { label: 'Event End Time', value: 'event_end_time' },

            // Location Details
            { label: 'Location', value: 'location' },
            { label: 'Sub Location', value: 'sublocation' },
            { label: 'Court', value: 'court' },

            // Category Details
            { label: 'Category Name', value: 'category_name' },
            { label: 'Category Description', value: 'category_description' },
            { label: 'Category Belts', value: 'category_belts' },
            { label: 'Category Distance', value: 'category_distance' },
            { label: 'Category Start Age', value: 'category_start_age' },
            { label: 'Category End Age', value: 'category_end_age' },
            { label: 'Category Gender', value: 'category_gender' },
            { label: 'Category Members Fees', value: 'category_members_fees' },
            { label: 'Category Non-Members Fees', value: 'category_non_members_fees' },

            // Booking Form Data
            { label: 'Booking Yourself', value: 'booking_yourself' },
            { label: 'Booking Are You Member', value: 'booking_are_you_member' },
            { label: 'Booking Partner Member', value: 'booking_partner_member' },
            { label: 'Booking Team Members Count', value: 'booking_team_members_count' },

            // Payment Details
            { label: 'Amount Paid', value: 'amount_paid' },
            { label: 'Payment Status', value: 'payment_status' },
            { label: 'Payment Verified At', value: 'payment_verified_at' },

            // Participant Count
            { label: 'Total Members', value: 'total_members' },
            { label: 'Total Non-Members', value: 'total_non_members' },
            { label: 'Total Participants', value: 'total_participants' },

            // Timestamps
            { label: 'Created At', value: 'created_at' },
            { label: 'Updated At', value: 'updated_at' },

            // Dynamic Participant Fields
            ...participantFields,
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedEventBookings);

        // Set headers to prompt file download
        res.header('Content-Type', 'text/csv');
        const filename = `event_bookings_${start_date || 'all'}_to_${
            end_date || 'all'
        }.csv`;
        res.attachment(filename);
        return res.send(csv);
    } catch (error) {
        next(error);
    }
};

export const exportHallBookings = async (req, res, next) => {
    try {
        const { start_date, end_date, hall_id, payment_status } = req.query;

        // Build match condition
        const matchCondition = {
            status: true,
        };

        // Add date filter if provided
        if (start_date && end_date) {
            matchCondition.createdAt = {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            };
        }

        // Add hall filter if provided
        if (hall_id && hall_id !== '') {
            matchCondition.hall_id = new mongoose.Types.ObjectId(hall_id);
        }

        // Add payment status filter if provided
        if (payment_status && payment_status !== '') {
            matchCondition.payment_status = payment_status;
        }

        const hallBookings = await HallBookings.aggregate([
            {
                $match: matchCondition,
            },
            {
                $lookup: {
                    from: 'halls',
                    localField: 'hall_id',
                    foreignField: '_id',
                    as: 'hall_data',
                    pipeline: [
                        {
                            $project: {
                                hall_id: 1,
                                name: 1,
                                description: 1,
                                advance_booking_period: 1,
                                advance_payment_amount: 1,
                                booking_amount: 1,
                                cleaning_charges: 1,
                                refundable_deposit: 1,
                                additional_charges: 1,
                                other_charges: 1,
                                location_id: 1,
                                sublocation_id: 1,
                                court: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                member_id: 1,
                                name: 1,
                                mobile: 1,
                                email: 1,
                                chss_number: 1,
                                non_chss_number: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'hall_data.location_id',
                    foreignField: '_id',
                    as: 'location_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'hall_data.sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$hall_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$member_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$location_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$sublocation_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]).allowDiskUse(true);

        // If no hall bookings found
        if (hallBookings.length === 0) {
            throw new Error('No hall bookings found in the given criteria.');
        }

        // Format the hall bookings data
        const formattedHallBookings = hallBookings.map((booking) => {
            return {
                // Booking Details
                booking_id: booking.booking_id || 'N/A',
                hall_id: booking.hall_id || 'N/A',
                member_id: booking.member_id || 'N/A',

                // Hall Details
                hall_name: booking.hall_data?.name || 'N/A',
                hall_description: booking.hall_data?.description || 'N/A',
                hall_advance_booking_period:
                    booking.hall_data?.advance_booking_period || 'N/A',
                hall_advance_payment_amount:
                    booking.hall_data?.advance_payment_amount || 'N/A',
                hall_booking_amount: booking.hall_data?.booking_amount || 'N/A',
                hall_cleaning_charges: booking.hall_data?.cleaning_charges || 'N/A',
                hall_refundable_deposit: booking.hall_data?.refundable_deposit || 'N/A',
                hall_additional_charges: booking.hall_data?.additional_charges || 'N/A',
                hall_other_charges: booking.hall_data?.other_charges || 'N/A',

                // Location Details
                location: booking.location_data?.title || 'N/A',
                sublocation: booking.sublocation_data?.title || 'N/A',
                court: booking.hall_data?.court || 'N/A',

                // Member Details
                member_name: booking.member_data?.name || 'N/A',
                member_mobile: booking.member_data?.mobile || 'N/A',
                member_email: booking.member_data?.email || 'N/A',
                member_chss_number: booking.member_data?.chss_number || 'N/A',
                member_non_chss_number: booking.member_data?.non_chss_number || 'N/A',

                // Booking Information
                booking_date: booking.booking_date
                    ? format(new Date(booking.booking_date), 'dd/MM/yyyy')
                    : 'N/A',
                slot_from: booking.slot_from
                    ? format(new Date(booking.slot_from), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',
                slot_to: booking.slot_to
                    ? format(new Date(booking.slot_to), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',
                purpose: booking.purpose || 'N/A',

                // Payment Details
                is_full_payment: booking.is_full_payment ? 'Yes' : 'No',
                total_amount: booking.total_amount || 0,
                amount_paid: booking.amount_paid || 0,
                advance_amount: booking.advance_amount || 0,
                refundable_deposit: booking.refundable_deposit || 0,
                payment_status: booking.payment_status || 'N/A',
                payment_verified_at: booking.payment_verified_at
                    ? format(new Date(booking.payment_verified_at), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',
                partial_payment_verified_at: booking.partial_payment_verified_at
                    ? format(
                          new Date(booking.partial_payment_verified_at),
                          'dd/MM/yyyy HH:mm:ss',
                      )
                    : 'N/A',

                // Cancellation Details
                is_cancelled: booking.is_cancelled ? 'Yes' : 'No',
                cancellation_date: booking.cancellation_date
                    ? format(new Date(booking.cancellation_date), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',
                cancellation_charges: booking.cancellation_charges || 0,
                cancellation_reason: booking.cancellation_reason || 'N/A',

                // Refund Details
                is_refunded: booking.is_refunded ? 'Yes' : 'No',
                refunded_at: booking.refunded_at
                    ? format(new Date(booking.refunded_at), 'dd/MM/yyyy HH:mm:ss')
                    : 'N/A',
                refund_remarks: booking.refund_remarks || 'N/A',
                refund_amount: booking.refund_amount || 'N/A',

                // Admin Details
                admin_remark: booking.admin_remark || 'N/A',

                // Timestamps
                created_at: format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm:ss'),
                updated_at: format(new Date(booking.updatedAt), 'dd/MM/yyyy HH:mm:ss'),
            };
        });

        const fields = [
            // Booking Details
            { label: 'Booking ID', value: 'booking_id' },
            { label: 'Hall ID', value: 'hall_id' },
            { label: 'Member ID', value: 'member_id' },

            // Hall Details
            { label: 'Hall Name', value: 'hall_name' },
            { label: 'Hall Description', value: 'hall_description' },
            {
                label: 'Hall Advance Booking Period',
                value: 'hall_advance_booking_period',
            },
            {
                label: 'Hall Advance Payment Amount',
                value: 'hall_advance_payment_amount',
            },
            { label: 'Hall Booking Amount', value: 'hall_booking_amount' },
            { label: 'Hall Cleaning Charges', value: 'hall_cleaning_charges' },
            { label: 'Hall Refundable Deposit', value: 'hall_refundable_deposit' },
            { label: 'Hall Additional Charges', value: 'hall_additional_charges' },
            { label: 'Hall Other Charges', value: 'hall_other_charges' },

            // Location Details
            { label: 'Location', value: 'location' },
            { label: 'Sub Location', value: 'sublocation' },
            { label: 'Court', value: 'court' },

            // Member Details
            { label: 'Member Name', value: 'member_name' },
            { label: 'Member Mobile', value: 'member_mobile' },
            { label: 'Member Email', value: 'member_email' },
            { label: 'Member CHSS Number', value: 'member_chss_number' },
            { label: 'Member Non-CHSS Number', value: 'member_non_chss_number' },

            // Booking Information
            { label: 'Booking Date', value: 'booking_date' },
            { label: 'Slot From', value: 'slot_from' },
            { label: 'Slot To', value: 'slot_to' },
            { label: 'Purpose', value: 'purpose' },

            // Payment Details
            { label: 'Is Full Payment', value: 'is_full_payment' },
            { label: 'Total Amount', value: 'total_amount' },
            { label: 'Amount Paid', value: 'amount_paid' },
            { label: 'Advance Amount', value: 'advance_amount' },
            { label: 'Refundable Deposit', value: 'refundable_deposit' },
            { label: 'Payment Status', value: 'payment_status' },
            { label: 'Payment Verified At', value: 'payment_verified_at' },
            {
                label: 'Partial Payment Verified At',
                value: 'partial_payment_verified_at',
            },

            // Cancellation Details
            { label: 'Is Cancelled', value: 'is_cancelled' },
            { label: 'Cancellation Date', value: 'cancellation_date' },
            { label: 'Cancellation Charges', value: 'cancellation_charges' },
            { label: 'Cancellation Reason', value: 'cancellation_reason' },

            // Refund Details
            { label: 'Is Refunded', value: 'is_refunded' },
            { label: 'Refunded At', value: 'refunded_at' },
            { label: 'Refund Remarks', value: 'refund_remarks' },
            { label: 'Refund Amount', value: 'refund_amount' },

            // Admin Details
            { label: 'Admin Remark', value: 'admin_remark' },

            // Timestamps
            { label: 'Created At', value: 'created_at' },
            { label: 'Updated At', value: 'updated_at' },
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedHallBookings);

        // Set headers to prompt file download
        res.header('Content-Type', 'text/csv');
        const filename = `hall_bookings_${start_date || 'all'}_to_${
            end_date || 'all'
        }.csv`;
        res.attachment(filename);
        return res.send(csv);
    } catch (error) {
        next(error);
    }
};
