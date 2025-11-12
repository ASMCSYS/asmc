import * as yup from "yup";

export const ActivityValidation = yup.object().shape({
    name: yup.string().required("Required"),
    facility_id: yup.string(),
    location: yup.array().required("Required"),
    short_description: yup.string(),
    description: yup.string(),
    thumbnail: yup.string(),
});

export const feesAddValidation = yup.object().shape({
    plan_id: yup.string().required("Required"),
    plan_name: yup.string().required("Required"),
    member_price: yup.number().required("Required"),
    non_member_price: yup.number(),
    member_price_with_ac: yup.number(),
    non_member_price_with_ac: yup.number(),
});