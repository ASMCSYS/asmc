import * as yup from "yup";

export const MembersValidation = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string().required("Required"),
    mobile: yup.string().required("Required"),
    profile: yup.string().required("Required"),
});

export const FamilyMembersValidation = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string(),
    gender: yup.string(),
    mobile: yup.string(),
    dob: yup.string(),
    relation: yup.string(),
    is_dependent: yup.string().required("Required"),
    active: yup.boolean().optional(),
});
