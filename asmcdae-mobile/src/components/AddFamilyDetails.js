import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TextInput,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectPicker from "./common/SelectPicker.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sizeValues } from "../helpers/constants.js";
import ImageUpload from "./common/ImageUpload.js";

const AddFamilyDetails = ({ familyMemberInitalval, submit }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const formik = useFormik({
    initialValues: familyMemberInitalval,
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      mobile: Yup.string().required("Required"),
      dob: Yup.string().required("Required"),
      relation: Yup.string().required("Required"),
      is_dependent: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      submit(values);
    },
  });

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      formik.setFieldValue("dob", selectedDate); // Save in 'YYYY-MM-DD' format
    }
    setShowDatePicker(false);
  };

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Profile</Text>
          <ImageUpload
            fieldName="profile"
            value={formik.values.profile}
            onChange={(value) => formik.setFieldValue("profile", value)}
          />

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f8f9fa" }]}
            placeholder="Name"
            value={formik.values.name}
            editable={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f8f9fa" }]}
            placeholder="Email"
            value={formik.values.email}
            editable={false}
          />

          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f8f9fa" }]}
            placeholder="Mobile"
            value={formik.values.mobile}
            editable={false}
          />

          <Text style={styles.label}>CHSS Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f8f9fa" }]}
            placeholder="CHSS Number"
            value={formik.values.chss_number}
            editable={false}
          />

          <Text style={styles.label}>Date of Birth</Text>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formik.values.dob
                ? format(new Date(formik.values.dob), "dd-MM-yyyy")
                : "Select your date of birth"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setShowDatePicker(false)}
              >
                <Ionicons name="close-circle" size={24} color="gray" />
              </TouchableOpacity>

              <DateTimePicker
                value={
                  formik.values.dob ? new Date(formik.values.dob) : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()} // Prevent future dates
              />
            </View>
          )}

          <Text style={styles.label}>Gender</Text>
          <SelectPicker
            selectedValue={formik.values.gender}
            onValueChange={(value) => formik.setFieldValue("gender", value)}
            errorMessage={
              formik.errors.gender && formik.touched.gender
                ? formik.errors.gender
                : ""
            }
            placeholder="Select Gender"
            style={styles.input}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            label="Select Gender"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f8f9fa" }]}
            placeholder="Address"
            value={formik.values.address}
            onChangeText={formik.handleChange("address")}
            onBlur={formik.handleBlur("address")}
            multiline={true}
            numberOfLines={4}
          />

          <Text style={styles.label}>T-Shirt Size</Text>
          <SelectPicker
            selectedValue={formik.values.tshirt_size}
            onValueChange={(value) =>
              formik.setFieldValue("tshirt_size", value)
            }
            errorMessage={
              formik.errors.tshirt_size && formik.touched.tshirt_size
                ? formik.errors.tshirt_size
                : ""
            }
            placeholder="T-Shirt Size"
            style={styles.input}
            options={sizeValues.map((size) => ({
              label: size,
              value: size,
            }))}
            label="Select T-Shirt Size"
          />

          <Text style={styles.label}>Name on Tshirt</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f8f9fa" }]}
            placeholder="Name on Tshirt"
            value={formik.values.tshirt_name}
            onChangeText={formik.handleChange("tshirt_name")}
            onBlur={formik.handleBlur("tshirt_name")}
          />

          <Text style={styles.label}>Clothing Type</Text>
          <SelectPicker
            selectedValue={formik.values.clothing_type}
            onValueChange={(value) =>
              formik.setFieldValue("clothing_type", value)
            }
            errorMessage={
              formik.errors.clothing_type && formik.touched.clothing_type
                ? formik.errors.clothing_type
                : ""
            }
            placeholder="Clothing Type"
            style={styles.input}
            options={[
              { label: "Shorts", value: "Shorts" },
              { label: "Track Pants", value: "Track Pants" },
            ]}
            label="Select Clothing Type"
          />

          {formik.values?.clothing_type && (
            <Fragment>
              <Text style={styles.label}>
                {formik.values?.clothing_type} Size
              </Text>
              <SelectPicker
                selectedValue={formik.values.clothing_size}
                onValueChange={(value) =>
                  formik.setFieldValue("clothing_size", value)
                }
                errorMessage={
                  formik.errors.clothing_size && formik.touched.clothing_size
                    ? formik.errors.clothing_size
                    : ""
                }
                placeholder={`Select ${formik.values?.clothing_type} Size`}
                style={styles.input}
                options={sizeValues.map((size) => ({
                  label: size,
                  value: size,
                }))}
                label={`Select ${formik.values?.clothing_type} Size`}
              />
            </Fragment>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: "#007bff" }]}
        onPress={formik.handleSubmit}
      >
        <Text style={styles.submitButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  form: {
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    padding: 8,
    borderRadius: 8,
  },
  uploadButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
  },
  uploadText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  profilePreview: {
    width: 80,
    height: 80,
    marginLeft: 16,
    borderRadius: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    color: "#555",
    fontSize: 16,
  },
  datePickerContainer: {
    position: "relative",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  closeIcon: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  submitButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddFamilyDetails;
