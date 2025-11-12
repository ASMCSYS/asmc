import * as yup from "yup";

export const LocationValidation = yup.object().shape({
    title: yup.string().required("Required"),
    address: yup.string().required("Required"),
    status: yup.boolean(),
});