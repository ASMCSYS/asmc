import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import defaultStyles from "../../styles/styles.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../components/common/InputField.js.js";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useChangePassword } from "../../hooks/useAuth.js";

const ChangePasswordContainer = ({ navigate }) => {
  const { mutate: handleChangePassword, isPending } = useChangePassword();

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      old_password: Yup.string().required("Old password is required"),
      new_password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("new_password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      handleChangePassword(values, {
        onSuccess: (response) => {
          if (response?.success) {
            Toast.show({
              type: "success",
              text1: "Password has been successfully updated",
            });
            navigate.goBack();
          } else {
            Toast.show({
              type: "error",
              text1: response?.message || "Failed to update password",
            });
          }
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: error?.message || "An error occurred",
          });
        },
      });
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView contentContainerStyle={defaultStyles.scrollView}>
        <View style={defaultStyles.container}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Update your password to keep your account secure.
          </Text>

          <InputField
            placeholder="Enter Old Password"
            value={formik.values.old_password}
            onChangeText={formik.handleChange("old_password")}
            onBlur={formik.handleBlur("old_password")}
            error={
              formik.errors.old_password && formik.touched.old_password
                ? formik.errors.old_password
                : ""
            }
            secureTextEntry
          />

          <InputField
            placeholder="Enter New Password"
            value={formik.values.new_password}
            onChangeText={formik.handleChange("new_password")}
            onBlur={formik.handleBlur("new_password")}
            error={
              formik.errors.new_password && formik.touched.new_password
                ? formik.errors.new_password
                : ""
            }
            secureTextEntry
          />

          <InputField
            placeholder="Confirm New Password"
            value={formik.values.confirm_password}
            onChangeText={formik.handleChange("confirm_password")}
            onBlur={formik.handleBlur("confirm_password")}
            error={
              formik.errors.confirm_password && formik.touched.confirm_password
                ? formik.errors.confirm_password
                : ""
            }
            secureTextEntry
          />

          <TouchableOpacity
            style={[defaultStyles.submitButton, isPending && { opacity: 0.7 }]}
            onPress={formik.handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={defaultStyles.submitButtonText}>
                Change Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
  },
  title: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
});

export default ChangePasswordContainer;
