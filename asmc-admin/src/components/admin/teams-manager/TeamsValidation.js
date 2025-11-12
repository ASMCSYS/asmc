import * as yup from "yup";

export const TeamsValidation = yup.object().shape({
    name: yup.string().required("Required"),
    profile: yup.string(),
    activity_name: yup.string().required("Required"),
    role: yup.string().required("Required"),
    status: yup.boolean(),
});