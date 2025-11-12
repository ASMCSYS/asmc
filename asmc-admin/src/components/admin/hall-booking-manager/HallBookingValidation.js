import * as yup from "yup";

export const BookingValidation = yup.object().shape({
    member_id: yup.mixed().required("Required"),
    hall_id: yup.mixed().required("Required"),
});
