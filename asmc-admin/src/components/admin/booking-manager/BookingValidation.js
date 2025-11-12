import * as yup from "yup";

export const BookingValidation = yup.object().shape({
    activity_id: yup.mixed().required("Required"),
    member_id: yup.mixed().required("Required"),
});