import * as yup from "yup";

export const HallsValidation = yup.object().shape({
    images: yup.mixed().required("Required"),
    name: yup.mixed().required("Required"),
    location_id: yup.mixed().required("Required"),
    description: yup.mixed().required("Required"),
    advance_booking_period: yup.mixed().required("Required"),
});
