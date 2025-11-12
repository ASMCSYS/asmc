import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext.js';
import defaultStyles from '../../styles/styles.js';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/common/InputField.js.js';
import {axios} from '../../helpers/axios.js';
import {loginUrl, baseUrl} from '../../helpers/constants.js';
import Toast from 'react-native-toast-message';

const LoginContainer = ({navigate}) => {
  const {login} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async values => {
    setIsLoading(true);
    try {
      console.log('🟢 [LOGIN] Attempting login with:', values.email);
      console.log('🟢 [LOGIN] Login URL:', loginUrl);
      console.log('🟢 [LOGIN] Base URL:', baseUrl);
      console.log('🟢 [LOGIN] Full URL:', `${baseUrl}${loginUrl}`);

      const response = await axios.post(loginUrl, values);
      console.log(
        '🟢 [LOGIN] Response data (from interceptor):',
        JSON.stringify(response, null, 2),
      );

      // The response is already the data due to axios interceptor
      const login_response = response;
      console.log(
        '🟢 [LOGIN] Login response data:',
        JSON.stringify(login_response, null, 2),
      );

      if (login_response?.success && login_response.result?.token) {
        console.log('🟢 [LOGIN] Login successful, token found');
        console.log(
          '🟢 [LOGIN] Token length:',
          login_response.result.token.length,
        );
        console.log(
          '🟢 [LOGIN] User data:',
          JSON.stringify(login_response.result, null, 2),
        );

        console.log('🟢 [LOGIN] Calling auth context login with token');
        await login(login_response.result.token);
        console.log('🟢 [LOGIN] Auth context login completed successfully');

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Login successful!',
          text2: `Welcome back, ${login_response.result.name || 'User'}!`,
          visibilityTime: 3000,
        });
      } else {
        console.log('🔴 [LOGIN] Login response missing success or token');
        console.log('🔴 [LOGIN] Success field:', login_response?.success);
        console.log(
          '🔴 [LOGIN] Token field:',
          login_response?.result?.token ? 'present' : 'missing',
        );
        console.log(
          '🔴 [LOGIN] Full response structure:',
          JSON.stringify(login_response, null, 2),
        );

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: login_response?.message || 'Invalid login response',
          text2: 'Please check your credentials and try again',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.log('🔴 [LOGIN] Login error occurred');
      console.log('🔴 [LOGIN] Error object:', error);
      console.log('🔴 [LOGIN] Error name:', error.name);
      console.log('🔴 [LOGIN] Error message:', error.message);
      console.log('🔴 [LOGIN] Error stack:', error.stack);
      console.log('🔴 [LOGIN] Error response:', error?.response);
      console.log('🔴 [LOGIN] Error response data:', error?.response?.data);
      console.log('🔴 [LOGIN] Error config:', error?.config);
      console.log('🔴 [LOGIN] Error status:', error?.response?.status);
      console.log('🔴 [LOGIN] Error status text:', error?.response?.statusText);

      // Try to get more details about the error
      if (error?.response) {
        console.log(
          '🔴 [LOGIN] Full error response:',
          JSON.stringify(error.response, null, 2),
        );
      }

      let errorMessage = 'Login failed';
      if (error?.response?.message) {
        errorMessage = error.response.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: errorMessage,
        text2: 'Please check your credentials and try again',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // email: 'radhakishanjangid405@gmail.com',
  // password: 'ASMC_testing_Password_*#*#*#',

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: values => {
      onFormSubmit(values);
    },
  });

  return (
    <ScrollView
      contentContainerStyle={defaultStyles.scrollView}
      keyboardShouldPersistTaps="handled">
      <View style={defaultStyles.container}>
        {/* Logo */}
        <View style={defaultStyles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={defaultStyles.logo}
          />
        </View>

        {/* Email Input */}
        <InputField
          placeholder="Enter your email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          error={
            formik.errors.email && formik.touched.email
              ? formik.errors.email
              : ''
          }
        />

        {/* Password Input */}
        <InputField
          placeholder="Enter your password"
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          error={
            formik.errors.password && formik.touched.password
              ? formik.errors.password
              : ''
          }
          secureTextEntry={!showPassword}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={defaultStyles.toggleText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          }
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[defaultStyles.submitButton, isLoading && {opacity: 0.7}]}
          onPress={formik.handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={defaultStyles.submitButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password Text */}
        <TouchableOpacity
          onPress={() => {
            navigate.navigate('ForgotPassword');
          }}
          disabled={isLoading}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  forgotPasswordText: {
    fontFamily: 'PlusJakartaSans',
    fontSize: 14,
    color: '#014aad',
    marginTop: 12,
  },
});

export default LoginContainer;
