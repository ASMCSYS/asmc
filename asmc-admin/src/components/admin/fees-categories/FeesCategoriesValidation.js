import * as yup from 'yup';

export const FeesCategoriesValidation = yup.object().shape({
    category_type: yup.mixed().required('Required'),
    event_id: yup.mixed().required('Required'),
    members_type: yup.mixed().required('Required'),
    event_type: yup.mixed().required('Required'),
    category_name: yup.mixed().required('Required'),
    variations: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Variation name is required'),
            values: yup.array().of(
                yup.object().shape({
                    value: yup.string().required('Value is required'),
                    price: yup
                        .number()
                        .typeError('Price must be a number')
                        .required('Price is required')
                        .min(0, 'Price must be greater than or equal to 0'),
                }),
            ),
        }),
    ),
    members_fees: yup.mixed().required('Required'),
    non_members_fees: yup.mixed().required('Required'),
});
