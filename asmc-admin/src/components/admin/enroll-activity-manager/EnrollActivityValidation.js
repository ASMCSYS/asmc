import * as yup from "yup";

export const EnrollActivityValidation = yup.object().shape({
    activity_id: yup.mixed().required("Required"),
    member_id: yup.mixed().required("Required"),
});