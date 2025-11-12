import { get } from "lodash-es";
import { readFirstArray } from "../../helpers/utils";

export const eventsListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        if (response.result)
            // response.result = response.result.map((obj, key) => {
            //     return {
            //         _id: obj?._id,
            //         events_id: obj?.events_id,
            //         payment_status: obj?.payment_status,
            //         payment_verified_at: obj?.payment_verified_at,
            //         primary_eligible: obj?.primary_eligible,
            //         createdAt: obj?.createdAt,
            //         total_amount: obj?.total_amount,
            //         fees_breakup: obj?.fees_breakup,
            //         batch_data: obj?.batch_data,
            //         batch: obj?.batch,
            //         family_member: obj?.family_member,
            //         status: obj?.status,
            //         member_id: readFirstArray(obj?.member_data),
            //         activity_id: readFirstArray(obj?.activity_data),
            //     }
            // })

            return response;
    } catch (error) {
        throw new Error(error);
    }
};
export const eventsBookingListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        if (response.result)
            // response.result = response.result.map((obj, key) => {
            //     return {
            //         _id: obj?._id,
            //         events_id: obj?.events_id,
            //         payment_status: obj?.payment_status,
            //         payment_verified_at: obj?.payment_verified_at,
            //         primary_eligible: obj?.primary_eligible,
            //         createdAt: obj?.createdAt,
            //         total_amount: obj?.total_amount,
            //         fees_breakup: obj?.fees_breakup,
            //         batch_data: obj?.batch_data,
            //         batch: obj?.batch,
            //         family_member: obj?.family_member,
            //         status: obj?.status,
            //         member_id: readFirstArray(obj?.member_data),
            //         activity_id: readFirstArray(obj?.activity_data),
            //     }
            // })

            return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const eventsParser = (response) => {
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
