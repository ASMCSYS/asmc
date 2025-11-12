import * as yup from "yup";

export const VideoGalleryValidation = yup.object().shape({
    video_thumbnail: yup.string().required("Required"),
    url: yup.string().required("Required"),
});
