export const JsonDecode = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return '';
    }
};

export const getMonthNameByNumber = (monthNumber) => {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    return monthNames[monthNumber - 1];
};

export const calculatePlanAmount = (plan, family, renewMemberData) => {
    if (renewMemberData) {
        if (renewMemberData?.current_plan) {
            return renewMemberData?.current_plan?.amount;
        } else if (renewMemberData?.plans) {
            return renewMemberData?.is_dependent
                ? renewMemberData?.plans?.dependent_member_price
                : renewMemberData?.plans?.non_dependent_member_price;
        }
    } else {
        let totalAmount = plan?.amount || plan?.member_price || 0;

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
};
