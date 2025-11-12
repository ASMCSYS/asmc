import { get } from "lodash-es";

export const staffListParser = (response, dispatch) => {
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
                    designation: get(row, "designation", ""),
                    department: get(row, "department", ""),
                    phone: get(row, "phone", ""),
                    status: get(row, "status", true),
                    joiningDate: get(row, "joiningDate", ""),
                    smartOfficeId: get(row, "smartOfficeId", ""),
                    team: get(row, "team", ""),
                    reportingTo: get(row, "reportingTo", ""),
                    address: get(row, "address", ""),
                    permissions: get(row, "permissions", []),
                    biometric: get(row, "biometric", {}),
                    createdAt: get(row, "createdAt", ""),
                    converted: get(row, "converted", false),
                    convertedAt: get(row, "convertedAt", ""),
                };
            });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};
