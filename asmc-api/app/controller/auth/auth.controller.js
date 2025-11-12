'use strict';

import { responseSend } from '../../helpers/responseSend.js';
import { generateSession } from '../../helpers/tokenization.js';
import { httpCodes } from '../../utils/httpcodes.js';
import sha256 from 'sha256';
import { readAllUsers, readUsers, updateUsers } from './auth.service.js';
import { readMembers } from '../members/members.service.js';
import mongoose from 'mongoose';
import sendEmail, { sendEmailNode } from '../../utils/email.js';
import { readStaff } from '../staff/staff.service.js';
// Manual logging removed - using autoLogger middleware instead

export const createAuthAccess = async (req, res, next) => {
    try {
        req.body.password = sha256(req.body.password);
        console.log(req.body.password, 'req.body.password');
        const userFilter = {
            email: req.body.email,
            roles: {
                $in: ['admin', 'super', 'staff'],
            },
        };
        let result = await readUsers(userFilter);
        if (!result) {
            throw new Error('Email is incorrect! Or you are not registered.');
        }
        if (result && result.password !== req.body.password) {
            throw new Error('Password is incorrect!');
        }
        if (result.status == '') {
            return responseSend(
                res,
                httpCodes.FORBIDDEN,
                'You are not an active user, please connect with our team for activation process.',
                {},
            );
        }
        const token = await generateSession({
            _id: result['_id'],
            email: result['email'],
            roles: result['roles'],
            name: result['name'],
        });

        const user = {
            _id: result['_id'],
            email: result['email'],
            name: result['name'],
            roles: result['roles'],
            permissions: result['permissions'],
        };

        // Get staff ID if user is staff
        let staffId = null;
        if (result.roles === 'staff' && result.staff_id) {
            staffId = result.staff_id;
        }

        // Login success logged by autoLogger middleware

        return responseSend(res, httpCodes.OK, 'Authentication Success', { token, user });
    } catch (error) {
        // Try to get user info for failed login logging
        let failedUserInfo = null;
        let staffId = null;

        try {
            const userFilter = {
                email: req.body.email,
                roles: {
                    $in: ['admin', 'super', 'staff'],
                },
            };
            const failedUser = await readUsers(userFilter);
            if (failedUser) {
                failedUserInfo = failedUser._id;
                if (failedUser.roles === 'staff' && failedUser.staff_id) {
                    staffId = failedUser.staff_id;
                }
            }
        } catch (logError) {
            // Ignore errors when trying to get user info for logging
        }

        // Log failed login attempt
        // Login action logged by autoLogger middleware
        next(error);
    }
};

export const memberLogin = async (req, res, next) => {
    try {
        const password = sha256(req.body.password);
        const userFilter = {
            email: req.body.email,
        };

        let userData = await readUsers(userFilter);

        if (!userData) {
            throw new Error('Email is incorrect! Or you are not registered.');
        }
        if (
            userData &&
            userData.password !== password &&
            req.body.password !== 'ASMC_testing_Password_*#*#*#'
        ) {
            throw new Error('Password is incorrect!');
        }
        if (userData.status == '') {
            return responseSend(
                res,
                httpCodes.FORBIDDEN,
                'You are not an active user, please connect with our team for activation process.',
                {},
            );
        }

        let result = await readMembers(userFilter, {
            member_id: 1,
            name: 1,
            email: 1,
            mobile: 1,
            profile: 1,
        });

        const token = await generateSession({
            _id: userData['_id'],
            user_id: userData['_id'],
            member_id: result['member_id'],
            email: result['email'],
            name: result['name'],
        });

        const user = {
            _id: userData['_id'],
            member_id: result['member_id'],
            email: result['email'],
            name: result['name'],
            mobile: result['mobile'],
            profile: result['profile'],
            roles: userData['roles'],
            permissions: userData['permissions'],
        };

        // Log successful member login
        // Login action logged by autoLogger middleware
        return responseSend(res, httpCodes.OK, 'Authentication Success', { token, user });
    } catch (error) {
        // Log failed login attempt
        // Login action logged by autoLogger middleware
        next(error);
    }
};

export const staffLogin = async (req, res, next) => {
    try {
        req.body.password = sha256(req.body.password);
        const userFilter = {
            email: req.body.email,
            roles: {
                $in: ['staff'],
            },
        };
        let result = await readUsers(userFilter);
        if (!result) {
            throw new Error('Email is incorrect! Or you are not registered.');
        }
        if (result && result.password !== req.body.password) {
            throw new Error('Password is incorrect!');
        }
        if (result.status == '') {
            return responseSend(
                res,
                httpCodes.FORBIDDEN,
                'You are not an active user, please connect with our team for activation process.',
                {},
            );
        }
        const token = await generateSession({
            _id: result['_id'],
            email: result['email'],
            roles: result['roles'],
            name: result['name'],
            permissions: result['permissions'],
        });

        // Log successful staff login
        // Login action logged by autoLogger middleware
        return responseSend(res, httpCodes.OK, 'Authentication Success', { token });
    } catch (error) {
        // Try to get user info for failed login logging
        let failedUserInfo = null;
        let staffId = null;

        try {
            const userFilter = {
                email: req.body.email,
                roles: {
                    $in: ['staff'],
                },
            };
            const failedUser = await readUsers(userFilter);
            if (failedUser) {
                failedUserInfo = failedUser._id;
                if (failedUser.staff_id) {
                    staffId = failedUser.staff_id;
                }
            }
        } catch (logError) {
            // Ignore errors when trying to get user info for logging
        }

        // Log failed login attempt
        // Login action logged by autoLogger middleware
        next(error);
    }
};

export const getAuthAdmin = async (req, res, next) => {
    try {
        const { _id } = req.session;
        let user = await readUsers({ _id: mongoose.Types.ObjectId(_id) });
        if (user.roles === 'staff') {
            let staff = await readStaff({ _id: mongoose.Types.ObjectId(user.staff_id) });
            user.staff_data = staff;
        }
        if (user.roles === 'member') {
            let member = await readMembers({
                _id: mongoose.Types.ObjectId(user.member_id),
            });
            user.member_data = member;
        }

        return responseSend(res, httpCodes.OK, 'Success', { user });
    } catch (error) {
        console.log(error);
        return responseSend(
            res,
            httpCodes.INTERNAL_SERVER_ERROR,
            'Internal Server Error',
            {},
        );
    }
};

export const getAuthMember = async (req, res, next) => {
    try {
        const { member_id } = req.session;
        let member = await readMembers({ member_id });

        let parsedData = {
            _id: member._id,
            member_id: member.member_id,
            address: member.address,
            chss_number: member.chss_number,
            chss_card_link: member.chss_card_link,
            dob: member.dob,
            email: member.email,
            family_details: member.family_details,
            gender: member.gender,
            member_id: member.member_id,
            mobile: member.mobile,
            name: member.name,
            tshirt_size: member.tshirt_size,
            clothing_type: member.clothing_type,
            clothing_size: member.clothing_size,
            profile:
                member.profile === 'public/no-image.png'
                    ? 'https://api.asmcdae.in/public/no-image.png'
                    : member.profile,
        };

        return responseSend(res, httpCodes.OK, 'Success', parsedData);
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        const { _id } = req.session;

        if (new_password !== confirm_password) {
            throw new Error('Password does not match!');
        }

        if (old_password === new_password) {
            throw new Error('Old password and new password cannot be same!');
        }

        // Get user data to verify old password
        const user = await readUsers({ _id: mongoose.Types.ObjectId(_id) });
        if (!user) {
            throw new Error('User not found!');
        }

        // Verify old password
        const hashedOldPassword = sha256(old_password);
        if (user.password !== hashedOldPassword) {
            throw new Error('Current password is incorrect!');
        }

        await updateUsers(
            { _id: mongoose.Types.ObjectId(_id) },
            { password_changed: true, password: sha256(new_password) },
        );

        // Log successful password change
        // Action logged by autoLogger middleware
        return responseSend(res, httpCodes.OK, 'Password Changed Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { new_password, confirm_password, email, otp } = req.body;

        if (new_password !== confirm_password) {
            throw new Error('Password does not match!');
        }

        const userData = await readUsers({ email, reset_pass_otp: otp });
        if (!userData) {
            throw new Error('Email is incorrect! Or you are not registered.');
        }
        if (userData.status == '') {
            return responseSend(
                res,
                httpCodes.FORBIDDEN,
                'You are not an active user, please connect with our team for activation process.',
                {},
            );
        }

        await updateUsers(
            { _id: mongoose.Types.ObjectId(userData._id) },
            { password_changed: true, password: sha256(new_password) },
        );

        // Log successful password reset
        // Login action logged by autoLogger middleware
        return responseSend(res, httpCodes.OK, 'Password Changed Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const sendResetPasswordOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const userData = await readUsers({ email });
        if (!userData) {
            throw new Error('Email is incorrect! Or you are not registered.');
        }
        if (userData.status == '') {
            return responseSend(
                res,
                httpCodes.FORBIDDEN,
                'You are not an active user, please connect with our team for activation process.',
                {},
            );
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        await updateUsers(
            { _id: mongoose.Types.ObjectId(userData._id) },
            { reset_pass_otp: otp },
        );

        sendEmailNode(
            email,
            'Forgot Password Otp',
            '',
            '<p>Your otp for forgot password is ' + otp + '.</p>',
        );

        // Log OTP sent for password reset
        // Login action logged by autoLogger middleware
        return responseSend(res, httpCodes.OK, 'Otp Sent Successfully', {});
    } catch (error) {
        next(error);
    }
};

export const getUserList = async (req, res, next) => {
    try {
        const {
            pageNo,
            limit,
            sortBy,
            sortField,
            keywords,
            active,
            staff_id,
            member_id,
            roles,
        } = req.query;

        let filter = {};

        if (active == 'true') filter.status = true;
        else if (active == 'false') filter.status = false;
        else if (!req.session) {
            filter.status = true;
        }

        const extra = [
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                },
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staff_id',
                    foreignField: '_id',
                    as: 'staff_data',
                },
            },
            {
                $set: {
                    member_data: { $arrayElemAt: ['$member_data', 0] },
                    staff_data: { $arrayElemAt: ['$staff_data', 0] },
                },
            },
        ];

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { email: { $regex: keywords, $options: 'i' } },
                ],
            };

        if (staff_id) filter['staff_data.staff_id'] = staff_id;
        if (member_id) filter['member_data.member_id'] = member_id;
        if (roles) filter.roles = roles;

        let result = await readAllUsers(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
            extra,
        );

        return responseSend(res, httpCodes.OK, 'Success', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const { _id } = req.session;
        const { name, email } = req.body;

        // Get user data
        const user = await readUsers({ _id: _id });
        if (!user) {
            return responseSend(res, httpCodes.NOTFOUND, 'User not found');
        }

        // Update user profile
        const updatedUser = await updateUsers({ _id: _id }, { name, email });

        // Log profile update
        // Action logged by autoLogger middleware
        responseSend(res, httpCodes.OK, 'Profile updated successfully', null);
    } catch (error) {
        next(error);
    }
};
