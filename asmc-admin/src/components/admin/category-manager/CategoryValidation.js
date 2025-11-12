import * as yup from "yup";

export const CategoryValidation = yup.object().shape({
    title: yup.string().required("Required"),
    status: yup.boolean(),
});