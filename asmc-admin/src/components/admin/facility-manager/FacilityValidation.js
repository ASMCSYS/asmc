import * as yup from "yup";

export const FacilityValidation = yup.object().shape({
    title: yup.string().required("Required"),
    permalink: yup.string().required("Required"),
    banner_url: yup.string().required("Required"),
    status: yup.boolean(),
});