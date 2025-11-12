import mongoose from 'mongoose';

var familySchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        email: String,
        gender: String,
        mobile: String,
        dob: String,
        relation: String,
        card_number: String,
        profile: String,
        is_dependent: Boolean,
        fees_paid: {
            type: Boolean,
            default: false,
        },
        plans: Object,
        tshirt_size: String,
        clothing_type: String,
        clothing_size: String,
        tshirt_name: String,
        instruction: String,
        no_of_card_issued: {
            type: String,
            default: '0',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

var membersSchema = new mongoose.Schema(
    {
        member_id: { type: String, default: '00001', unique: true },
        profile: {
            type: String,
            default: 'https://api.asmcdae.in/public/no-image.png',
        },
        name: String,
        email: String,
        password: String,
        gender: String,
        mobile: String,
        alternate_mobile: String,
        dob: String,
        chss_number: String,
        non_chss_number: String,
        chss_card_link: String,
        fees_paid: Boolean,
        fees_verified: Boolean,
        is_family_user: Boolean,
        family_details: [familySchema],
        address: String,
        tshirt_size: String,
        clothing_type: String,
        clothing_size: String,
        tshirt_name: String,
        instruction: String,
        no_of_card_issued: {
            type: String,
            default: '0',
        },
        member_status: {
            type: String,
            default: 'Active',
        },
        status: {
            type: Boolean,
            default: true,
        },
        converted: {
            type: Boolean,
            default: false,
        },
        current_plan: {
            type: Object,
            default: {},
        },
        added_by: Object,
        convertedAt: Date,
        feesPaidAt: {
            type: Date,
            default: null,
        },
        feesVerifiedAt: {
            type: Date,
            default: null,
        },
        member_post: {
            type: String,
            default: '',
        },
        role_activity_name: {
            type: String,
            default: '',
        },
    },
    { versionKey: false, timestamps: true },
);

membersSchema.pre('save', function (next) {
    var doc = this;
    Members.findOne(
        {},
        { member_id: 1 },
        { sort: { member_id: -1 } },
        function (error, counter) {
            if (error) return next(error);
            if (counter && counter.member_id) {
                // Increment the member_id with leading zeros
                const newId = String(parseInt(counter.member_id) + 1).padStart(5, '0');
                doc.member_id = newId;
            } else {
                doc.member_id = '00001'; // Default starting member_id
            }
            next();
        },
    );
});

const Members = mongoose.model('members', membersSchema);

export default Members;
