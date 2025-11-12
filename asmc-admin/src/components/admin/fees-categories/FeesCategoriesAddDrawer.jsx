import React, { Fragment, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { FeesCategoriesValidation } from './FeesCategoriesValidation';
import {
    Drawer,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    InputLabel,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import IconButtonIcons from '../../Common/IconButtonIcons';
import Button from '../../Common/Button';
import { useDispatch } from 'react-redux';

import { setSnackBar } from '../../../store/common/commonSlice';
import {
    useAddNewFeesCategoriesMutation,
    useUpdateFeesCategoriesMutation,
} from '../../../store/masters/mastersApis';
import BasicSelect from '../../Common/Select';
import Input from '../../Common/Input';
import VariationAddComponent from './VariationAddComponent';
import AutoCompleteServerSide from '../../Common/AutoCompleteServerSide';

export const FeesCategoryAddDrawer = ({
    initialValues,
    show,
    close,
    formType,
    categoryType,
    getEventDropdown,
}) => {
    const dispatch = useDispatch();
    const disabled = formType === 'View' ? true : false;

    const [eventData, setEventData] = useState(null);

    const [addNewFeesCategories, { isLoading: addFeesCategoriesLoading }] =
        useAddNewFeesCategoriesMutation();
    const [updateFeesCategories, { isLoading: updateFeesCategoriesLoading }] =
        useUpdateFeesCategoriesMutation();

    const fetchEventData = async (_id) => {
        if (!_id) return;
        const payload = {
            _id: _id,
        };
        const activeRes = await getEventDropdown(payload);

        if (
            activeRes &&
            activeRes?.data &&
            activeRes?.data?.result &&
            activeRes?.data?.result.length > 0
        ) {
            setEventData({
                ...activeRes?.data?.result[0],
                name: activeRes?.data?.result[0]?.event_name,
            });
        }
    };

    useEffect(() => {
        if (formType === 'View' || formType === 'Edit') {
            fetchEventData(initialValues?.event_id);
        }
    }, [initialValues]);

    const onFormSubmit = async (values) => {
        try {
            let payload = {
                ...values,
            };

            delete payload.event_data;

            if (formType === 'Edit') {
                payload._id = initialValues._id;
                await updateFeesCategories(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: 'Fees Category updated successfully',
                        severity: 'success',
                    }),
                );
            } else {
                await addNewFeesCategories(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: 'Fees Category created successfully',
                        severity: 'success',
                    }),
                );
            }
            close();
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: 'error',
                }),
            );
        }
    };

    return (
        <Drawer
            anchor={'right'}
            open={show}
            PaperProps={{
                sx: { width: { xs: '100%', md: '70%', sm: '70%', lg: '70%' } },
            }}
            onClose={() => close()}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onFormSubmit(values)}
                validationSchema={FeesCategoriesValidation}
                enableReinitialize
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    setFieldValue,
                }) => (
                    <Grid
                        container
                        sx={{ display: 'flex' }}
                        direction={'column'}
                        width={'100%'}
                        height={'100%'}
                    >
                        {console.log(values, 'values')}
                        <Grid
                            container
                            flex={0}
                            px={1}
                            py={1}
                            borderBottom={1}
                            borderColor={'rgba(5, 5, 5, 0.06)'}
                        >
                            <Grid item alignSelf={'center'}>
                                <IconButtonIcons
                                    color="default"
                                    title="Close"
                                    IconComponent={CloseIcon}
                                    onClick={() => close()}
                                />
                            </Grid>
                            <Grid item alignSelf={'center'}>
                                <Typography variant="h6">
                                    {formType} Fees Categories
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={'auto'}>
                            <Grid container spacing={2}>
                                {categoryType === 'events' && (
                                    <Grid item xs={12} md={6}>
                                        <AutoCompleteServerSide
                                            label="Type & Select Event *"
                                            name="event_id"
                                            id="event_id"
                                            fullWidth
                                            fetchDataFunction={(d) => getEventDropdown(d)}
                                            onChange={(val) => {
                                                if (val) {
                                                    setFieldValue('event_id', val._id);
                                                    setFieldValue(
                                                        'members_type',
                                                        val?.members_type,
                                                    );
                                                    setFieldValue(
                                                        'event_type',
                                                        val?.event_type,
                                                    );
                                                    setEventData(val);
                                                } else {
                                                    setFieldValue('event_id', null);
                                                    setFieldValue('members_type', null);
                                                    setFieldValue('event_type', null);
                                                    setEventData(null);
                                                }
                                            }}
                                            defaultValue={eventData || null}
                                            error={Boolean(errors.event_id)}
                                            helperText={errors.event_id}
                                            isMultiple={true}
                                            disabled={disabled}
                                            apiParams={{ active: true }}
                                            keyname="event_name"
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.members_type || ''}
                                        onChange={handleChange('members_type')}
                                        displayEmpty
                                        label="Members Type *"
                                        name="members_type"
                                        id="members_type"
                                        items={[
                                            {
                                                value: 'Both',
                                                label: 'Both',
                                            },
                                            {
                                                value: 'Members Only',
                                                label: 'Members Only',
                                            },
                                            {
                                                value: 'Non Members Only',
                                                label: 'Non Members Only',
                                            },
                                        ]}
                                        disabled={true}
                                        error={Boolean(errors.members_type)}
                                        helperText={errors.members_type}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.event_type || ''}
                                        onChange={handleChange('event_type')}
                                        displayEmpty
                                        label="Event Type *"
                                        name="event_type"
                                        id="event_type"
                                        items={[
                                            {
                                                value: 'Single',
                                                label: 'Single',
                                            },
                                            {
                                                value: 'Double',
                                                label: 'Double',
                                            },
                                            {
                                                value: 'Team',
                                                label: 'Team',
                                            },
                                        ]}
                                        disabled={true}
                                        error={Boolean(errors.event_type)}
                                        helperText={errors.event_type}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="category_name"
                                        name="category_name"
                                        label="Category Name *"
                                        onChange={handleChange('category_name')}
                                        value={values?.category_name || ''}
                                        error={Boolean(errors.category_name)}
                                        helperText={errors.category_name}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        type="number"
                                        id="members_fees"
                                        name="members_fees"
                                        label="Member Fees *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue('members_fees', e.target.value);
                                        }}
                                        value={values?.members_fees || ''}
                                        error={Boolean(errors.members_fees)}
                                        helperText={errors.members_fees}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        type="number"
                                        id="non_members_fees"
                                        name="non_members_fees"
                                        label="Non Member Fees *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue(
                                                'non_members_fees',
                                                e.target.value,
                                            );
                                        }}
                                        value={values?.non_members_fees || ''}
                                        error={Boolean(errors.non_members_fees)}
                                        helperText={errors.non_members_fees}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <VariationAddComponent
                                        errors={errors}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        disabled={disabled}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {formType !== 'View' ? (
                            <Grid
                                flexShrink={0}
                                borderTop={1}
                                borderColor={'rgba(152, 188, 252, 0.16)'}
                                sx={{ padding: '8px 16px' }}
                            >
                                <Grid
                                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    <Grid
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            size="large"
                                            color="warning"
                                            type="button"
                                            onClick={() => close()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="large"
                                            type="submit"
                                            loading={
                                                addFeesCategoriesLoading ||
                                                updateFeesCategoriesLoading
                                            }
                                            onClick={() => handleSubmit()}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                )}
            </Formik>
        </Drawer>
    );
};
