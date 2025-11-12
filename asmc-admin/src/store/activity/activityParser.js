import { parseISO } from "date-fns";
import { get } from "lodash-es";

export const activeActivityListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }
        if (response.result)
            response.result = response.result.map((obj) => {
                return {
                    _id: obj._id,
                    name: obj.name,
                }
            })

        return response;

    } catch (error) {
        throw new Error(error);
    }
}

export const activityListParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        // if (response.result)
        //     response.result = response.result.map((obj) => {
        //         if (obj.view_time_slots) {
        //             obj.view_time_slots = obj.view_time_slots.map((objj) => {
        //                 if (objj.time_slots) {
        //                     objj.time_slots = objj.time_slots.map((objjj) => {
        //                         if (objjj.from) {
        //                             objjj.from = parseISO(objjj.from);
        //                             objjj.to = parseISO(objjj.to);
        //                         }
        //                         return objjj;
        //                     })
        //                     return objj;
        //                 }
        //             })
        //             return obj;
        //         }
        //         return obj;
        //     })

        return response;

    } catch (error) {
        throw new Error(error);
    }
}

export const activityParser = (response) => {
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