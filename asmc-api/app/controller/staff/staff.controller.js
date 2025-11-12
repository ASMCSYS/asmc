import sha256 from 'sha256';
import { responseSend } from '../../helpers/responseSend.js';
import { GenerateUserName } from '../../utils/helper.js';
import { httpCodes } from '../../utils/httpcodes.js';
import { createUsers } from '../auth/auth.service.js';
import {
    createStaff,
    readStaff,
    readAllStaff,
    updateStaff,
    deleteStaff,
} from './staff.service.js';
import Users from '../../models/users.js';

export const insertStaff = async (req, res, next) => {
    try {
        const staff = await createStaff(req.body);
        responseSend(res, httpCodes.OK, 'Staff created successfully', staff);
    } catch (error) {
        next(error);
    }
};

export const getStaffList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
        } = req.query;

        let filter = {};

        if (active == 'true') filter.status = true;
        else if (active == 'false') filter.status = false;
        else if (!req.session) {
            filter.status = true;
        }

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { email: { $regex: keywords, $options: 'i' } },
                    { staff_id: { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllStaff(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Staff records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleStaff = async (req, res, next) => {
    try {
        const staff = await readStaff({ _id: req.params.id });
        responseSend(res, httpCodes.OK, 'Staff record', staff);
    } catch (error) {
        next(error);
    }
};

export const editStaff = async (req, res, next) => {
    try {
        if (!req.body._id) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'Missing staff ID');
        }
        const oldStaff = await readStaff({ _id: req.body._id });
        if (!oldStaff) {
            return responseSend(res, httpCodes.NOTFOUND, 'Staff not found');
        }
        const staff = await updateStaff({ _id: req.body._id }, req.body);

        // update user permissions
        await Users.updateOne(
            { staff_id: req.body._id },
            { permissions: req.body.permissions },
        );
        responseSend(res, httpCodes.OK, 'Staff updated successfully', staff);
    } catch (error) {
        next(error);
    }
};

export const removeStaff = async (req, res, next) => {
    try {
        const staff = await readStaff({ _id: req.query._id });
        await deleteStaff({ _id: req.query._id });
        responseSend(res, httpCodes.OK, 'Staff deleted successfully', {});
    } catch (error) {
        next(error);
    }
};

export const convertToUser = async (req, res, next) => {
    try {
        const staff = await readStaff({ _id: req.body._id });
        if (!staff) {
            return responseSend(res, httpCodes.NOTFOUND, 'Staff not found');
        }

        if (staff.converted) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Staff already converted to user',
            );
        }

        let password = sha256(`${GenerateUserName(staff.email)}@asmc`);

        const userData = {
            staff_id: staff._id,
            name: staff.name,
            email: staff.email,
            password: password,
            roles: 'staff',
            permissions: staff.permissions,
        };
        const user = await createUsers(userData);

        if (!user) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Failed to convert staff to user',
            );
        }

        await updateStaff(
            { _id: staff._id },
            { converted: true, convertedAt: new Date().toISOString() },
        );

        responseSend(res, httpCodes.OK, 'Staff converted to user successfully', user);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { user_id } = req.session;
        const { name, email, phone } = req.body;

        // Get user data to find staff_id
        const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return responseSend(res, httpCodes.NOTFOUND, 'User not found');
        }

        if (user.roles !== 'staff' && user.roles !== 'admin') {
            return responseSend(res, httpCodes.FORBIDDEN, 'Access denied');
        }

        // Update staff profile
        const updatedStaff = await updateStaff(
            { _id: user.staff_id },
            { name, email, phone },
        );

        // Update user email if changed
        if (email !== user.email) {
            await Users.updateOne({ _id: user_id }, { email });
        }

        responseSend(res, httpCodes.OK, 'Profile updated successfully', updatedStaff);
    } catch (error) {
        next(error);
    }
};
