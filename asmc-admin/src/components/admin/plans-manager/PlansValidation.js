import * as yup from "yup";

export const PlansValidation = yup.object().shape({
    plan_type: yup.string().required("Required"),
    plan_name: yup.string().required("Required"),
    description: yup.string().required("Required"),
    amount: yup.number(),
    dependent_member_price: yup.number().optional(),
    non_dependent_member_price: yup.number().optional(),
    kids_price: yup.number().optional(),
    guest_price: yup.number().optional(),
    start_month: yup.number().optional(),
    end_month: yup.number().optional(),
    status: yup.string().required("Required"),
});