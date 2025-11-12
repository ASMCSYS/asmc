import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import Input from '../../../components/Common/Input';
import { useTheme } from '@mui/material/styles';
import { Person, Lock, Save, Cancel } from '@mui/icons-material';
import { isAuth, updateLocalStorage } from '../../../helpers/cookies';
import { useUpdateProfileMutation, useUpdateUserProfileMutation, useChangePasswordMutation } from '../../../store/staff/staffApis';

// Validation schemas
const profileValidationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .nullable()
        .optional()
});

const passwordValidationSchema = Yup.object({
    oldPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const ProfileEditContainer = ({ navigate }) => {
    const theme = useTheme();
    const authData = isAuth();
    
    const [tabValue, setTabValue] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });

    // API hooks
    const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
    const [updateUserProfile, { isLoading: updateUserLoading }] = useUpdateUserProfileMutation();
    const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();

    // Initial values for forms
    const initialProfileValues = {
        name: authData?.name || '',
        email: authData?.email || '',
        phone: authData?.phone || ''
    };

    const initialPasswordValues = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setMessage({ type: '', text: '' });
    };

    const handleProfileSubmit = async (values, { setSubmitting, resetForm }) => {
        setMessage({ type: '', text: '' });
        
        try {
            // Check if user is admin/super admin or staff
            const isAdminUser = authData?.roles != 'staff';
            
            let response;
            if (isAdminUser) {
                // Use user profile update API for admin/super admin
                let payload = {
                    name: values.name,
                    email: values.email
                }
                response = await updateUserProfile(payload).unwrap();
            } else {
                // Use staff profile update API for staff
                response = await updateProfile(values).unwrap();
            }

            console.log(response, "response");
            
            if (response.success) {
                // Update localStorage with new profile data
                const updatedAuthData = {
                    ...authData,
                    name: values.name,
                    email: values.email,
                    ...(values.phone && { phone: values.phone }) // Only add phone if it exists
                };
                updateLocalStorage(updatedAuthData);
                
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.data?.message || error.message || 'Failed to update profile' });
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
        setMessage({ type: '', text: '' });
        
        try {
            const response = await changePassword({
                old_password: values.oldPassword,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword
            }).unwrap();
            
            if (response.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                resetForm();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.data?.message || error.message || 'Failed to change password' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Profile Settings
            </Typography>
            
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}
            
            <Paper sx={{ width: '100%' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab 
                        icon={<Person />} 
                        label="Profile Information" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<Lock />} 
                        label="Change Password" 
                        iconPosition="start"
                    />
                </Tabs>
                
                <TabPanel value={tabValue} index={0}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Formik
                                initialValues={initialProfileValues}
                                validationSchema={profileValidationSchema}
                                onSubmit={handleProfileSubmit}
                                enableReinitialize
                            >
                                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
                                    const isAdminUser = authData?.roles != 'staff';
                                    
                                    return (
                                        <Form>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Field
                                                        name="name"
                                                        as={Input}
                                                        label="Full Name"
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.name && errors.name}
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Field
                                                        name="email"
                                                        as={Input}
                                                        label="Email Address"
                                                        type="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.email && errors.email}
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                {!isAdminUser && (
                                                    <Grid item xs={12} md={6}>
                                                        <Field
                                                            name="phone"
                                                            as={Input}
                                                            label="Phone Number"
                                                            value={values.phone}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.phone && errors.phone}
                                                            disabled={isSubmitting}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                            
                                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Cancel />}
                                                    onClick={handleCancel}
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </CardContent>
                    </Card>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Change Password
                            </Typography>
                            <Formik
                                initialValues={initialPasswordValues}
                                validationSchema={passwordValidationSchema}
                                onSubmit={handlePasswordSubmit}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                    <Form>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Field
                                                    name="oldPassword"
                                                    as={Input}
                                                    label="Current Password"
                                                    type="password"
                                                    value={values.oldPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.oldPassword && errors.oldPassword}
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Field
                                                    name="newPassword"
                                                    as={Input}
                                                    label="New Password"
                                                    type="password"
                                                    value={values.newPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.newPassword && errors.newPassword}
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Field
                                                    name="confirmPassword"
                                                    as={Input}
                                                    label="Confirm New Password"
                                                    type="password"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.confirmPassword && errors.confirmPassword}
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                        
                                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Changing...' : 'Change Password'}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Cancel />}
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>
                        </CardContent>
                    </Card>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default ProfileEditContainer; 