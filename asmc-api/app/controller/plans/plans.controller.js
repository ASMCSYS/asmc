'use strict';

import mongoose from 'mongoose';
import { responseSend } from '../../helpers/responseSend.js';
import Batch from '../../models/batch.js';
import { httpCodes } from '../../utils/httpcodes.js';
import {
    readPlans,
    createPlans,
    readAllPlans,
    updatePlans,
    bulkPlansCreate,
    deletePlans,
    readActivePlans,
} from './plans.service.js';
import e from 'express';
import Plans from '../../models/plans.js';
import Members from '../../models/members.js';

export const insertPlans = async (req, res, next) => {
    try {
        let doc = await createPlans(req.body);
        if (doc) {
            return responseSend(res, httpCodes.OK, 'Plan Created Successfully', doc);
        }
    } catch (error) {
        next(error);
    }
};

export const getPlansList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
            plan_type = null,
        } = req.query;

        let filter = {};

        if (active == 'true') filter.status = true;
        if (plan_type) filter.plan_type = plan_type;

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { plan_name: { $regex: keywords, $options: 'i' } },
                    { plan_id: keywords },
                    { plan_type: keywords },
                ],
            };

        let result = await readAllPlans(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Plans records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActivePlansList = async (req, res, next) => {
    try {
        const { plan_type = null } = req.query;

        let filter = { status: true };

        if (plan_type) {
            filter.plan_type = plan_type;
        }

        let result = await readActivePlans(filter);

        responseSend(res, httpCodes.OK, 'Plans records', result);
    } catch (error) {
        next(error);
    }
};

export const getSinglePlans = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await readPlans({ _id });

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editPlans = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readPlans({ _id });
        if (!records) {
            throw new Error('Plans does not exist!');
        }

        await updatePlans({ _id }, req.body);
        records = await readPlans({ _id });
        responseSend(res, httpCodes.OK, 'Plans updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removePlans = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readPlans({ _id });
        if (!records) {
            throw new Error('Plans does not exist!');
        }

        records = await deletePlans({ _id });
        responseSend(res, httpCodes.OK, 'Plans deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

export const getMemberNextPlan = async (req, res, next) => {
    try {
        const {
            type = 'membership',
            plan_id = '',
            activity_id = null,
            batch_id = null,
        } = req.query;
        let nextPlan;
        if (activity_id) {
            const findBatch = await Batch.findOne({
                activity_id: activity_id,
                _id: mongoose.Types.ObjectId(batch_id),
            });

            if (!findBatch) {
                return responseSend(
                    res,
                    httpCodes.CONFLICT,
                    'No Next Plan Available',
                    null,
                );
            }
            // const planData = findBatch.fees.find((fee) => fee.plan_id.equals(plan_id));

            // if (!planData) {
            //     return responseSend(
            //         res,
            //         httpCodes.CONFLICT,
            //         'No Next Plan Available',
            //         null,
            //     );
            // }

            const planData = await readPlans({ plan_id, plan_type: type });

            const fees = await Promise.all(
                findBatch.fees.map(async (fee) => {
                    const plan = await Plans.findOne({
                        _id: fee.plan_id,
                        status: true,
                    });
                    return plan ? fee : null; // Keep only valid fees
                }),
            );

            const filteredFees = fees.filter(Boolean);

            nextPlan = filteredFees.filter((fee) => {
                return fee.start_month === planData.end_month + 1;
            });

            // if (planData.start_month === 4 && planData.end_month === 9) {
            //     nextPlan = findBatch.fees.find((fee) => {
            //         return fee.start_month === 10 && fee.end_month === 3;
            //     });
            // } else if (planData.start_month === 10 && planData.end_month === 3) {
            //     // October to March (Half Yearly), next plan is April to September
            //     nextPlan = findBatch.fees.find((fee) => {
            //         return fee.start_month === 4 && fee.end_month === 9;
            //     });
            // } else if (planData.start_month === 4 && planData.end_month === 3) {
            //     // April to March (Yearly), next plan could be April to March again (renewal)
            //     nextPlan = findBatch.fees.find((fee) => {
            //         return fee.start_month === 4 && fee.end_month === 3;
            //     });
            // } else {
            //     const nextStartMonth = (planData.end_month % 12) + 1; // Handle transition to January (1) if end_month is December (12)
            //     console.log(nextStartMonth, 'nextStartMonth');

            //     nextPlan = findBatch.fees.find((fee) => {
            //         return fee.start_month === nextStartMonth;
            //     });
            // }
            return responseSend(res, httpCodes.OK, 'Next Plan', nextPlan);
        } else {
            const result = await readPlans({ plan_id, plan_type: type });

            if (!result) {
                const startMonth = new Date().getMonth() + 2;
                nextPlan = await Plans.find({
                    start_month: startMonth,
                    plan_type: type,
                    status: true,
                });
            } else {
                nextPlan = await Plans.find({
                    start_month: result.end_month + 1,
                    plan_type: type,
                    status: true,
                });
            }

            if (nextPlan.length === 0) {
                // find member data
                const memberData = await Members.findOne({
                    member_id: req.session.member_id,
                });
                console.log(memberData, 'memberDatamemberData');
                if (!memberData) {
                    return responseSend(
                        res,
                        httpCodes.CONFLICT,
                        'Member not found',
                        null,
                    );
                }
                nextPlan = await Plans.find({
                    start_month: memberData.current_plan.end_month + 1,
                    plan_type: type,
                    status: true,
                });
            }
        }

        if (nextPlan) {
            return responseSend(res, httpCodes.OK, 'Next Plan', nextPlan);
        } else {
            return responseSend(res, httpCodes.CONFLICT, 'No Next Plan Available', null);
        }
    } catch (error) {
        next(error);
    }
};
