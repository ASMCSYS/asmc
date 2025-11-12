import { get } from "lodash-es";

export const activeLocationParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        return response?.result?.map((row, key) => {
            return {
                _id: get(row, "_id", ""),
                title: get(row, "title", ""),
            };
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const parentLocationParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (response && response.length === 0) {
            return response;
        }
        return response.map(function (row, key) {
            return {
                value: get(row, "_id", ""),
                label: get(row, "title", ""),
            };
        });
    } catch (error) {
        throw new Error(error);
    }
};
export const activeCategoryParser = (response, dispatch) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response) {
            return [];
        }

        return response.result.map((row, key) => {
            return {
                _id: get(row, "_id", ""),
                title: get(row, "title", ""),
            };
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const parentCategoryParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (response && response.length === 0) {
            return response;
        }
        return response.map(function (row, key) {
            return {
                value: get(row, "_id", ""),
                label: get(row, "title", ""),
            };
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const mastersListParser = (response, dispatch) => {
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
                    address: get(row, "address", ""),
                    status: get(row, "status", ""),
                    parent_data: get(row, "parent_data", ""),
                    parent_id: get(row, "parent_id", ""),
                    createdAt: get(row, "createdAt", ""),
                };
            });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const categoryParser = (response, dispatch) => {
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
                    status: get(row, "status", ""),
                    parent_data: get(row, "parent_data", ""),
                    parent_id: get(row, "parent_id", ""),
                    createdAt: get(row, "createdAt", ""),
                };
            });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const teamsParser = (response, dispatch) => {
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
                    role: get(row, "role", ""),
                    name: get(row, "name", ""),
                    profile: get(row, "profile", ""),
                    activity_name: get(row, "activity_name", ""),
                    display_order: get(row, "display_order", ""),
                    status: get(row, "status", ""),
                    createdAt: get(row, "createdAt", ""),
                };
            });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const mastersParser = (response) => {
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

export const bannerListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }
        if (response.result)
            response.result = response.result.map(function (row, key) {
                return {
                    _id: get(row, "_id", ""),
                    url: get(row, "url", ""),
                    status: get(row, "status", ""),
                    type: get(row, "type", ""),
                    createdAt: get(row, "createdAt", ""),
                };
            });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const planListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }

        // response.result = response.result.map(function (row, key) {
        //     return {
        //         _id: get(row, "_id", ""),
        //         url: get(row, "url", ""),
        //         status: get(row, "status", ""),
        //         type: get(row, "type", ""),
        //         createdAt: get(row, "createdAt", ""),
        //     }
        // });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const batchListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }

        response.result = response.result.map(function (row, key) {
            return {
                _id: get(row, "_id", ""),
                activity_id: get(row, "activity_id", ""),
                batch_code: get(row, "batch_code", ""),
                batch_name: get(row, "batch_name", ""),
                batch_type: get(row, "batch_type", ""),
                batch_limit: get(row, "batch_limit", ""),
                no_of_player: get(row, "no_of_player", ""),
                days: get(row, "days", ""),
                days_prices: get(row, "days_prices", ""),
                start_time: get(row, "start_time", ""),
                end_time: get(row, "end_time", ""),
                type: get(row, "type", ""),
                category_id: get(row, "category_id", ""),
                location_id: get(row, "location_id", ""),
                court: get(row, "court", ""),
                status: get(row, "status", ""),
                subcategory_name: get(row, "subcategory_name", ""),
                sublocation_id: get(row, "sublocation_id", ""),
                activity_data: row.activity_data,
                category_data: get(row, "category_data", null),
                location_data: get(row, "location_data", null),
                sublocation_data: get(row, "sublocation_data", null),
                advance_booking_period: get(row, "advance_booking_period", null),
                fees: get(row, "fees", null),
                slots: get(row, "slots", null),
            };
        });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const faqsListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }

        response.result = response.result.map(function (row, key) {
            return {
                _id: get(row, "_id", ""),
                question: get(row, "question", ""),
                answer: get(row, "answer", ""),
                category: get(row, "category", ""),
                createdAt: get(row, "createdAt", ""),
                status: get(row, "status", ""),
            };
        });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const testimonialsListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }

        response.result = response.result.map(function (row, key) {
            return {
                _id: get(row, "_id", ""),
                message: get(row, "message", ""),
                star: get(row, "star", ""),
                name: get(row, "name", ""),
                role: get(row, "role", ""),
                profile: get(row, "profile", ""),
                createdAt: get(row, "createdAt", ""),
                status: get(row, "status", ""),
            };
        });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const noticeListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }

        response.result = response.result.map(function (row, key) {
            return {
                _id: get(row, "_id", ""),
                type: get(row, "type", ""),
                members: get(row, "members", ""),
                createdAt: get(row, "createdAt", ""),
                status: get(row, "status", ""),
                activities: get(row, "activities", ""),
                batches: get(row, "batches", ""),
                content: get(row, "content", ""),
                title: get(row, "title", ""),
            };
        });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const feesCategoriesListParser = (response) => {
    try {
        if (response?.result) {
            response = response.result;
        }
        if (!response || !response.result) {
            return [];
        }

        response.result = response.result.map(function (row, key) {
            return {
                _id: get(row, "_id", ""),
                category_type: get(row, "category_type", ""),
                event_id: get(row, "event_id", ""),
                event_data: get(row, "event_data", ""),
                members_type: get(row, "members_type", ""),
                event_type: get(row, "event_type", ""),
                category_name: get(row, "category_name", ""),
                variations: get(row, "variations", []),
                members_fees: get(row, "members_fees", 0),
                non_members_fees: get(row, "non_members_fees", 0),
                createdAt: get(row, "createdAt", ""),
            };
        });

        return response;
    } catch (error) {
        throw new Error(error);
    }
};
