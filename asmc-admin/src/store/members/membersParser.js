import { get } from "lodash-es";

export const activeMembersListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        response.result = response?.result?.map(function (row, key) {
            return {
                _id: get(row, "_id", ""),
                name: get(row, "name", ""),
            };
        });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const membersListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }
        if (response.result)
            response.result = response?.result?.map(function (row, key) {
                return {
                    _id: get(row, "_id", ""),
                    name: get(row, "name", ""),
                    email: get(row, "email", ""),
                    mobile: get(row, "mobile", ""),
                    gender: get(row, "gender", ""),
                    chss_number: get(row, "chss_number", ""),
                    non_chss_number: get(row, "non_chss_number", ""),
                    is_family_user: get(row, "is_family_user", false),
                    dob: row?.dob ? new Date(row.dob) : null,
                    member_id: get(row, "member_id", ""),
                    member_status: get(row, "member_status", ""),
                    current_plan: get(row, "current_plan", null),
                    family_details: get(row, "family_details", []),
                    status: get(row, "status", ""),
                    converted: get(row, "converted", ""),
                    profile: get(row, "profile", ""),
                    createdAt: get(row, "createdAt", ""),
                    convertedAt: get(row, "convertedAt", ""),
                    fees_paid: get(row, "fees_paid", false),
                    fees_verified: get(row, "fees_verified", false),
                    tshirt_size: get(row, "tshirt_size", ""),
                    tshirt_name: get(row, "tshirt_name", ""),
                    clothing_type: get(row, "clothing_type", ""),
                    clothing_size: get(row, "clothing_size", ""),
                    instruction: get(row, "instruction", ""),
                    no_of_card_issued: get(row, "no_of_card_issued", ""),
                    last_payment_date: row?.payment_history?.verifiedAt
                        ? new Date(row.payment_history.verifiedAt)
                        : null,
                };
            });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const membersParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        return response;
    } catch (error) {
        throw new Error(error);
    }
};
