import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import defaultStyles from "../../styles/styles.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../components/common/InputField.js";
import Toast from "react-native-toast-message";

const ForgotPasswordContainer = ({ navigate }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailEntered, setEmailEntered] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Formik setup for the initial email form
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setEmailEntered(values.email); // Store the entered email
      // API call to send OTP to the email
      const response = await sendOtpToEmail(values.email); // Send OTP
      if (response.success) {
        setIsOtpSent(true); // Show OTP and password fields
        Toast.show({
          // Show toast notification
          type: "success",
          position: "bottom",
          text1: "OTP Sent Successfully!",
          text2: "Please check your email to retrieve the OTP.",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Failed to send OTP. Please try again.",
          visibilityTime: 3000,
        });
      }
      setIsLoading(false);
    },
  });

  // Formik setup for OTP, new password, and confirm password fields
  const passwordFormik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setIsResetting(true);
      // API call to reset the password
      const response = await resetPassword(values); // API to reset password
      if (response.success) {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Password has been successfully updated",
          visibilityTime: 3000,
        });
        navigate.goBack(); // Go back to the login screen after successful reset
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Failed to reset password. Please try again.",
          visibilityTime: 3000,
        });
      }
      setIsResetting(false);
    },
  });

  // Simulated API calls (You can replace this with actual API calls)
  const sendOtpToEmail = async (email) => {
    // Simulate sending OTP logic
    console.log("Sending OTP to:", email);
    return { success: true }; // Simulated response
  };

  const resetPassword = async (values) => {
    // Simulate password reset logic
    console.log("Resetting password for OTP:", values.otp);
    return { success: true }; // Simulated response
  };

  return (
    <ScrollView
      contentContainerStyle={defaultStyles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      <View style={defaultStyles.container}>
        {/* Logo */}
        <View style={defaultStyles.logoContainer}>
          <Image
            source={require("../../../assets/icon.png")}
            style={defaultStyles.logo}
          />
        </View>

        {/* Email Input */}
        {!isOtpSent ? (
          <>
            <InputField
              placeholder="Enter your email"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : ""
              }
            />

            <TouchableOpacity
              style={[
                defaultStyles.submitButton,
                isLoading && { opacity: 0.7 },
              ]}
              onPress={formik.handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={defaultStyles.submitButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // If OTP is sent, show OTP, New Password, and Confirm Password fields
          <>
            {emailEntered && (
              <InputField
                placeholder="Email"
                value={emailEntered}
                editable={false}
                style={styles.disabledInput}
              />
            )}

            <InputField
              placeholder="Enter OTP"
              value={passwordFormik.values.otp}
              onChangeText={passwordFormik.handleChange("otp")}
              onBlur={passwordFormik.handleBlur("otp")}
              error={
                passwordFormik.errors.otp && passwordFormik.touched.otp
                  ? passwordFormik.errors.otp
                  : ""
              }
              keyboardType="numeric"
            />

            <InputField
              placeholder="Enter New Password"
              value={passwordFormik.values.newPassword}
              onChangeText={passwordFormik.handleChange("newPassword")}
              onBlur={passwordFormik.handleBlur("newPassword")}
              error={
                passwordFormik.errors.newPassword &&
                passwordFormik.touched.newPassword
                  ? passwordFormik.errors.newPassword
                  : ""
              }
              secureTextEntry
            />

            <InputField
              placeholder="Confirm New Password"
              value={passwordFormik.values.confirmPassword}
              onChangeText={passwordFormik.handleChange("confirmPassword")}
              onBlur={passwordFormik.handleBlur("confirmPassword")}
              error={
                passwordFormik.errors.confirmPassword &&
                passwordFormik.touched.confirmPassword
                  ? passwordFormik.errors.confirmPassword
                  : ""
              }
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                defaultStyles.submitButton,
                isResetting && { opacity: 0.7 },
              ]}
              onPress={passwordFormik.handleSubmit}
              disabled={isResetting}
            >
              {isResetting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={defaultStyles.submitButtonText}>
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => navigate.goBack()}
          disabled={isLoading || isResetting}
        >
          <Text style={styles.forgotPasswordText}>Go Back?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  forgotPasswordText: {
    fontFamily: "PlusJakartaSans",
    fontSize: 14,
    color: "#014aad",
    marginTop: 12,
  },
  disabledInput: {
    backgroundColor: "#e0e0e0", // Light grey background for disabled input
    color: "#666", // Lighter text color
    opacity: 0.6,
    marginTop: 10,
  },
});

export default ForgotPasswordContainer;
