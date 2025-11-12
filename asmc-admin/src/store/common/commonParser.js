export const paymentHistoryParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        response.result = response?.result?.map(function (row, key) {
            let memberData = {};

            if (row?.member_data && row?.member_data.length > 0) {
                memberData = row?.member_data[0];
            }

            return {
                ...row,
                member_data: memberData,
            }
        });

        return response;

    } catch (error) {
        throw new Error(error);
    }
}