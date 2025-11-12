import * as yup from "yup";

export const BannerValidation = yup.object().shape({
    type: yup.string(),
    status: yup.string().required("Required"),
});