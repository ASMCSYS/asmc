import mongoose from 'mongoose';

var userSchema = new mongoose.Schema(
    {
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'members',
            required: false,
        },
        staff_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'staff',
            required: false,
        },
        name: String,
        email: String,
        password: String,
        roles: {
            type: String,
            default: 'users',
        },
        permissions: [{ type: String }],
        status: {
            type: Boolean,
            default: true,
        },
        password_changed: {
            type: Boolean,
            default: false,
        },
        reset_pass_otp: {
            type: String,
            default: '',
        },
    },
    { versionKey: false, timestamps: true },
);

const Users = mongoose.model('users', userSchema);

export default Users;
