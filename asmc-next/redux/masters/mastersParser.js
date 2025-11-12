export const facilityParser = (response) => {
    try {
        if (response.result)
            response = response.result

        const parsedData = response.result.map((obj, key) => {
            return {
                _id: obj._id,
                title: obj.title,
                permalink: obj.permalink,
                banner_url: obj.banner_url
            }
        })
        return parsedData;
    } catch (error) {
        throw new Error(error);
    }
}

export const activityParser = (response) => {
    try {
        if (response.result)
            response = response.result

        // response.result = response.result.map((obj, key) => {
        //     return {
        //         id: key + 1,
        //         title: obj.title,
        //         permalink: obj.permalink,
        //         banner_url: obj.banner_url
        //     }
        // })

        console.log(response.result, "response.result");
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export const parseBanner = (response) => {
    try {
        console.log(response, "response");
        
        if (response.result)
            response = response.result;

        if (response?.result && response.result.length > 0) {
            return response.result[0]
        }
        return response;
    } catch (error) {
        throw new Error(error);
    }
}