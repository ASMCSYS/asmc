import * as yup from "yup";

export const NoticeValidation = yup.object().shape({
    title: yup.string().required("Required"),
    content: yup.string().required("Required"),
});
