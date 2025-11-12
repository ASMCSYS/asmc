import { get } from "lodash-es";

export const facilityActiveListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        return response.result.map(function (row, key) {
            return {
                value: get(row, "_id", ""),
                label: get(row, "title", ""),
            }
        });

    } catch (error) {
        throw new Error(error);
    }
}
export const facilityListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        if (response.result)
            response.result = response.result.map((row, key) => {
                return {
                    _id: get(row, "_id", ""),
                    title: get(row, "title", ""),
                    permalink: get(row, "permalink", ""),
                    banner_url: get(row, "banner_url", ""),
                    status: get(row, "status", ""),
                    createdAt: get(row, "createdAt", ""),
                }
            })

        return response;

    } catch (error) {
        throw new Error(error);
    }
}

export const facilityParser = (response) => {
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