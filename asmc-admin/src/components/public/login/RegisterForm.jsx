import React, { useState } from "react";
import Button from "../../Common/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Formik } from "formik";
import Input from "../../Common/Input";
import * as yup from "yup";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

const validateRegisterForm = yup.object().shape({
    name: yup.string().required("Name number is required!"),
    email: yup.string().email().required("Email number is required!"),
    mobile: yup.number().required("Mobile number is required!").positive().min(10),
    username: yup.string().required("Required"),
    password: yup.string().required('Required'),
});

const RegisterFormComponent = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const { submit, loading, goToLogin } = props;
    const initialValues = {
        name: "",
        email: "",
        mobile: "",
        username: "",
        password: "",
        status: "",
    };

    const onFormSubmit = async (values) => {
        submit(values);
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onFormSubmit(values)}
                validationSchema={validateRegisterForm}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                    setFieldValue
                }) => (
                    <>

                        <Container maxWidth="xs">
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    height: "100vh",
                                    width: "auto",
                                    mx: 4,
                                }}
                                spacing={1.5}
                            >
                                <Typography
                                    variant="h5"
                                    align="center"
                                    sx={{
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        // color: "#212121",
                                        fontSize: "28px",
                                    }}
                                >
                                    Register
                                </Typography>

                                <Typography
                                    variant="subtitle2"
                                    align="center"
                                    sx={{ fontSize: "15px", color: "#7D7D7D" }}
                                >
                                    Welcome to Edubridge
                                </Typography>

                                <Input
                                    type="text"
                                    fullWidth
                                    placeholder="Enter your name"
                                    id="name"
                                    name="name"
                                    variant="outlined"
                                    onChange={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    value={values.name}
                                    error={errors.name && Boolean(errors.name)}
                                    helperText={errors.name}
                                />

                                <Input
                                    type="text"
                                    fullWidth
                                    placeholder="Enter your email"
                                    id="email"
                                    name="email"
                                    variant="outlined"
                                    onChange={(e) => [setFieldValue("email", e.target.value), setFieldValue("username", e.target.value?.email?.split('@').length > 0 ? e.target.value?.email.split('@')[0] : null)]}
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                    error={errors.email && Boolean(errors.email)}
                                    helperText={errors.email}
                                />

                                <Input
                                    type="text"
                                    fullWidth
                                    placeholder="Enter your mobile"
                                    id="mobile"
                                    name="mobile"
                                    variant="outlined"
                                    onChange={handleChange("mobile")}
                                    onBlur={handleBlur("mobile")}
                                    value={values.mobile}
                                    error={errors.mobile && Boolean(errors.mobile)}
                                    helperText={errors.mobile}
                                />

                                <Input
                                    type="text"
                                    fullWidth
                                    placeholder="Enter username"
                                    id="username"
                                    name="username"
                                    variant="outlined"
                                    readonly
                                    onChange={handleChange("username")}
                                    onBlur={handleBlur("username")}
                                    value={values?.email?.split('@').length > 0 ? values?.email.split('@')[0] : null}
                                    error={errors.username && Boolean(errors.username)}
                                    helperText={errors.username}
                                />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    placeholder="Enter password"
                                    id="password"
                                    name="password"
                                    variant="outlined"
                                    onChange={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                    error={errors.password && Boolean(errors.password)}
                                    helperText={errors.password}
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Button
                                    onClick={handleSubmit}
                                    loading={loading}
                                    fullWidth
                                >
                                    Continue
                                </Button>
                                <Button
                                    onClick={() => goToLogin()}
                                    fullWidth
                                    sx={{
                                        color: "#ffffff",
                                        backgroundColor: "orange",
                                        "&:hover": {
                                            backgroundColor: "orange",
                                        },
                                    }}
                                >
                                    Already have an account? Login here.
                                </Button>
                            </Stack>
                        </Container>
                    </>
                )}
            </Formik>
        </>
    );
};
export default RegisterFormComponent;
