export const GenerateUserName = (email) => {
    try {
        var nameMatch = email.match(/^([^@]*)@/);
        var name = nameMatch ? nameMatch[1] : makeid(5);

        return name;
    } catch (error) {
        throw new Error(error);
    }
};

export function generateRandomPassword(length) {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    console.log(password, 'password');

    return password;
}

export const calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const generateAndSendOtp = async (mobile) => {
    let otp = Math.round(Math.random() * (9999 - 1000) + 1000);

    // result = await sendOtpMessage(mobile, otp, callback);
    return otp;
};

export function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
}

export const hasOverlap = (days1, days2) => {
    const values1 = days1.map((day) => day.value);
    const values2 = days2.map((day) => day.value);
    return values1.some((day) => values2.includes(day));
};

export const isTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
};

export function calculateNextPlanDates(currentStartMonth, currentEndMonth) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let startYear, endYear;

    // Check if the user is renewing an existing plan
    if (currentDate.getMonth() + 1 > currentEndMonth) {
        // If current date is past the end of the plan, move to the next cycle
        startYear = currentYear + 1;
        endYear = currentYear + 1;
    } else {
        startYear = currentYear;
        endYear = currentYear;
    }

    // Start date (1st day of the start month)
    const startDate = new Date(startYear, currentStartMonth - 1, 1);

    // End date (last day of the end month)
    const endDate = new Date(endYear, currentEndMonth, 0);

    return { startDate, endDate };
}

export const JsonDecode = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return '';
    }
};

export const generateMessages = (label) => {
    const readableLabel = label
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return {
        'any.required': `${readableLabel} is required`,
        'string.base': `${readableLabel} must be a string`,
        'number.base': `${readableLabel} must be a number`,
        'number.min': `${readableLabel} cannot be negative`,
        'array.base': `${readableLabel} must be an array`,
    };
};
