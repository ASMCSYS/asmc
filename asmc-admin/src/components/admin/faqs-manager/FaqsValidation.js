import * as yup from "yup";

export const FaqsValidation = yup.object().shape({
    question: yup.string().required("Required"),
    answer: yup.string().required("Required"),
    category: yup.string().required("Required"),
    newCategory: yup.string().when('category', {
        is: 'new',
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});