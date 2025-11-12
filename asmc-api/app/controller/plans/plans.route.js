"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";
import {
    authenticateUser, getAuthUser
} from "../../middlewares/authentication.js";
import { checkPermission } from "../../middlewares/permission.js";
import { PLANS_PERMISSIONS } from "../../utils/permissions.utils.js";
import {
    insertPlans, getPlansList, getActivePlansList, getSinglePlans, editPlans, removePlans, getMemberNextPlan
} from "./plans.controller.js";
import {
    insertPlansVal, getPlansListVal, singlePlansVal, editPlansVal,
} from "./plans.validator.js";

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    checkPermission(PLANS_PERMISSIONS.CREATE),
    reqValidator(insertPlansVal),
    insertPlans
);

router.get(
    "/active",
    getAuthUser,
    getActivePlansList
)

router.get(
    "/list",
    getAuthUser,
    checkPermission(PLANS_PERMISSIONS.READ),
    reqValidator(getPlansListVal),
    getPlansList
)

router.get(
    "/",
    authenticateUser,
    checkPermission(PLANS_PERMISSIONS.READ),
    reqValidator(singlePlansVal),
    getSinglePlans
)

router.put(
    "/",
    authenticateUser,
    checkPermission(PLANS_PERMISSIONS.UPDATE),
    reqValidator(editPlansVal),
    editPlans
);

router.delete(
    "/",
    authenticateUser,
    checkPermission(PLANS_PERMISSIONS.DELETE),
    reqValidator(singlePlansVal),
    removePlans
);

router.get(
    "/get-next-plan",
    authenticateUser,
    getMemberNextPlan
)

export default router;
