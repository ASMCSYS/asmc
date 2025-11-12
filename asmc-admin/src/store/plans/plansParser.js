import { get } from "lodash-es";

export const activePlanParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        return response.map(function (row, key) {
            return {
                amount: get(row, "amount", ""),
                kids_price: get(row, "kids_price", ""),
                guest_price: get(row, "guest_price", ""),
                dependent_member_price: get(row, "dependent_member_price", ""),
                non_dependent_member_price: get(row, "non_dependent_member_price", ""),
                plan_id: get(row, "plan_id", ""),
                plan_name: get(row, "plan_name", ""),
                plan_type: get(row, "plan_type", ""),
                label: get(row, "plan_name", ""),
                start_month: get(row, "start_month", ""),
                end_month: get(row, "end_month", ""),
                batch_hours: get(row, "batch_hours", ""),
                plan_timeline: get(row, "plan_timeline", ""),
            }
        });

    } catch (error) {
        throw new Error(error);
    }
}

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
}