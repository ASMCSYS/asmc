import { format } from "date-fns";
import Papa from "papaparse";

export const handleDateTimeDefault = (date, formats = "dd-MM-yyyy hh:mm:ss a") => {
    try {
        return format(new Date(date), formats);
    } catch (e) {
        return "-";
    }
};

export const parseIsoDefault = (date) => {
    try {
        return new Date(date);
    } catch (e) {
        return "Invalid Date";
    }
};

export const convertCSVToJson = (csvData) => {
    const result = [];

    Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (parsedData) {
            parsedData.data.forEach((row) => {
                const obj = {};
                const familyDetails = [];

                for (const key in row) {
                    if (key.includes("family_details[")) {
                        const index = parseInt(key.match(/\[(.*?)\]/)[1]);
                        const field = key.split("]").pop().trim().substring(1); // 'name' or 'is_dependent'

                        if (!familyDetails[index] && row[key] !== null) {
                            familyDetails[index] = { name: "", is_dependent: false };
                        }

                        if (row[key] !== null) familyDetails[index][field] = row[key];
                    } else {
                        obj[key.toLowerCase()] = row[key] !== null ? row[key].toString() : "";
                    }
                }

                if (familyDetails.length > 0) {
                    obj.family_details = familyDetails.filter((el) => el.name !== "" || el.is_dependent !== "");
                    if (obj.family_details.length > 0) {
                        obj.is_family_user = true;
                    }
                }

                result.push(obj);
            });
        },
    });

    return result;
};

export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

export const calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) || "";
};

export function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}

export function hasChildren(item) {
    const { items: children } = item;

    if (children === undefined) {
        return false;
    }

    if (children.constructor !== Array) {
        return false;
    }

    if (children.length === 0) {
        return false;
    }

    return true;
}

export function calculatePlanAmount(plan, family) {
    let totalAmount = plan?.amount || 0;

    if (family && family.length > 0) {
        family.map((obj) => {
            if (obj.is_dependent) {
                totalAmount += plan?.dependent_member_price || 0;
            } else {
                totalAmount += plan?.non_dependent_member_price || 0;
            }
            return totalAmount;
        });
    }

    return totalAmount;
}

export const readFirstArray = (array) => {
    try {
        return array[0];
    } catch (e) {
        return array;
    }
};

export const generatePermaLink = (string) => {
    return string.replace(/\s+/g, "-").toLowerCase();
};

export function generateBatchName(sportName, batchCode) {
    // Extract the first four characters of the sport name
    const sportPrefix = sportName.substring(0, 4);

    // Replace any spaces with underscores
    const formattedSportPrefix = sportPrefix.replace(/ /g, "_");

    // Combine the formatted sport prefix and the batch code
    const batchName = `${formattedSportPrefix}_${batchCode}`;

    return batchName;
}

export const getMonthNameByNumber = (monthNumber) => {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return monthNames[monthNumber - 1];
};

export const JsonDecode = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return "";
    }
};

export const parseStringDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return null;
    return new Date(`${year}-${month}-${day}`);
};
