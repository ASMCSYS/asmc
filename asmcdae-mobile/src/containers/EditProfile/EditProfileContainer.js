import React, { Fragment, useEffect, useMemo, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useHandleImageUpload } from "../../hooks/useCommon.js";
import SelectPicker from "../../components/common/SelectPicker.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sizeValues } from "../../helpers/constants.js";
import ImageUpload from "../../components/common/ImageUpload.js";
import { useUpdateMember } from "../../hooks/useAuth.js";
import { useAuth } from "../../contexts/AuthContext.js";
import { CommonModal } from "../../components/common/CommonModal.js";
import FamilyDetails from "../../components/FamilyDetails.js";
import AddFamilyDetails from "../../components/AddFamilyDetails.js";

const initialFamilyData = {
  name: "",
  email: "",
  gender: "Male",
  mobile: "",
  dob: "",
  relation: "",
  is_dependent: true,
};

const EditProfileContainer = ({ navigate, route }) => {
  const { refetch } = route.params;
  const { authData, updateAuthData } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [familyMemberInitalval, setFamilyMemberInitalval] =
    useState(initialFamilyData);
  const [familyEditKey, setFamilyEditKey] = useState(false);
  const [familyMemberData, setFamilyMemberData] = useState([]);

  const { mutate: updateProfile, isPending } = useUpdateMember();
  const { mutate: handleImageUpload } = useHandleImageUpload();

  // Get member data from auth context or use a query hook
  const memberData = authData; // Assuming member data is in authData

  useEffect(() => {
    setFamilyMemberData(memberData?.family_details || []);
  }, [memberData?.family_details]);

  const formik = useFormik({
    initialValues: {
      _id: memberData?._id,
      profile: memberData?.profile || "",
      name: memberData?.name || "",
      email: memberData?.email || "",
      mobile: memberData?.mobile || "",
      chss_number: memberData?.chss_number || "",
      dob: memberData?.dob || "",
      gender: memberData?.gender || "",
      address: memberData?.address || "",
      tshirt_size: memberData?.tshirt_size || "",
      tshirt_name: memberData?.tshirt_name || "",
      clothing_type: memberData?.clothing_type || "",
      clothing_size: memberData?.clothing_size || "",
      family_details: memberData?.family_details || [],
    },
    validationSchema: Yup.object({
      profile: Yup.string().nullable(),
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile: Yup.string().required("Mobile number is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: async (values) => {
      let payload = {
        ...values,
        name: memberData?.name,
        email: memberData?.email,
        mobile: memberData?.mobile,
        chss_number: memberData?.chss_number,
      };
      payload.family_details = familyMemberData;

      console.log(payload, "payload");

      updateProfile(payload, {
        onSuccess: (response) => {
          console.log(response, "response");
          if (response?.success) {
            updateAuthData({
              ...authData,
              profile: response?.result?.profile,
            });
            refetch();
            Toast.show({
              type: "success",
              text1: "Profile has been successfully updated",
            });
            navigate.goBack();
          } else {
            Toast.show({
              type: "error",
              text1: response?.message || "Failed to update profile",
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

  useEffect(() => {
    const isFormModified = Object.keys(formik.values).some(
      (key) => formik.values[key] !== formik.initialValues[key]
    );
    setIsModified(isFormModified); // Set modified state
  }, [formik.values]);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      formik.setFieldValue("dob", selectedDate); // Save in 'YYYY-MM-DD' format
    }
    setShowDatePicker(false);
  };

  const handleEditFamilyMember = (data, key) => {
    setFamilyEditKey(key);
    setFamilyMemberInitalval(data);
    setModalOpen(true);
  };

  const FamilyMemberComponent = () => {
    const onFamilySubmit = (val) => {
      let oldData = JSON.parse(JSON.stringify(familyMemberData));

      if (familyEditKey !== false) {
        oldData[familyEditKey] = val;
      } else {
        oldData.push(val);
      }
      setFamilyMemberData(oldData);
      setFamilyMemberInitalval(initialFamilyData);
      setFamilyEditKey(false);
      setModalOpen(false);
    };

    return (
      <AddFamilyDetails
        familyMemberInitalval={familyMemberInitalval}
        submit={onFamilySubmit}
      />
    );
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
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
              onChangeText={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              editable={false}
            />
            {formik.errors.name && formik.touched.name && (
              <Text style={styles.errorText}>{formik.errors.name}</Text>
            )}

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

            <Text style={styles.label}>Family Details</Text>
            <FamilyDetails
              familyMemberData={familyMemberData}
              handleEditFamilyMember={handleEditFamilyMember}
            />
          </View>

          <CommonModal
            title="Update Family Member"
            visible={modalOpen}
            onCancel={() => setModalOpen(false)}
            children={<FamilyMemberComponent />}
            presentationStyle="overFullScreen"
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isModified ? "#007bff" : "#ccc" },
        ]}
        onPress={formik.handleSubmit}
        disabled={!isModified}
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
    paddingTop: 16,
    backgroundColor: "#f8f9fa",
    paddingBottom: 80,
  },
  form: {
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
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
    fontFamily: "PlusJakartaSans-Bold",
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
    fontFamily: "PlusJakartaSans-Bold",
  },
  familyMemberText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 40,
    zIndex: 10,
  },
});

export default EditProfileContainer;
