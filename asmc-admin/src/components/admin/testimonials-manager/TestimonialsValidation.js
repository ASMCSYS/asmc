import * as yup from "yup";

export const TestimonialsValidation = yup.object().shape({
    star: yup.string().required("Required"),
    message: yup.string().required("Required"),
    name: yup.string().required("Required"),
    profile: yup.string().required("Required"),
    role: yup.string().required("Required"),
});
