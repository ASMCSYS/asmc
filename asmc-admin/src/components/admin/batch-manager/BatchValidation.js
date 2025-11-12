import * as yup from "yup";

export const BatchValidation = yup.object().shape({
    batch_type: yup.string().required("Required"),
    batch_code: yup.string().required("Required"),
    batch_name: yup.string().required("Required"),
    activity_id: yup.string().required("Required"),
    category_id: yup.string().required("Required"),
    location_id: yup.string().required("Required"),
    status: yup.boolean(),
});