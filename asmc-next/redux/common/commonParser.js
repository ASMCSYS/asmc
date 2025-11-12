import { BaseUrl } from "@/utils/constants";

function getYouTubeId(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})$/;
    const match = url.match(regExp);

    if (match && match[1]) {
        return match[1];
    } else {
        return null; // Invalid URL or no match found
    }
}

export const recordsParser = (response) => {
    try {
        if (response.result)
            response = response.result

        response.result = response.result.map((obj, key) => {
            return {
                id: key + 1,
                src: BaseUrl + "/" + obj.url,
                thumb: BaseUrl + "/" + obj.url
            }
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}
export const videoParser = (response) => {
    try {
        if (response.result)
            response = response.result

        response.result = response.result.map((obj, key) => {
            return {
                id: key + 1,
                src: obj.url,
                thumb: `https://img.youtube.com/vi/${getYouTubeId(obj.url)}/default.jpg`
            }
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}
export const memberParser = (response) => {
    try {
        if (response.result)
            response = response.result

        response.result = response.result.map((obj, key) => {
            return {
                id: key + 1,
                profile: BaseUrl + "/" + (obj.profile ? obj.profile : "public/no-image.png"),
                name: obj.name,
                member_status: obj.member_status,
            }
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}