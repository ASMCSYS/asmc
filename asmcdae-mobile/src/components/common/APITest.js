import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {axios} from '../../helpers/axios';
import {baseUrl} from '../../helpers/constants';

const APITest = () => {
  const [testResults, setTestResults] = useState({});

  const testAPI = async () => {
    try {
      console.log('🟢 [API_TEST] Testing API connection...');

      // Test 1: Basic connection
      const response = await axios.get('/auth/me');
      console.log('🟢 [API_TEST] Auth/me response:', response.data);

      setTestResults(prev => ({
        ...prev,
        authMe: {
          success: true,
          data: response.data,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));

      Alert.alert('API Test', 'Auth/me endpoint working!');
    } catch (error) {
      console.log('🔴 [API_TEST] API test failed:', error.message);
      setTestResults(prev => ({
        ...prev,
        authMe: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));

      Alert.alert('API Test Failed', error.message);
    }
  };

  const testLogin = async () => {
    try {
      console.log('🟢 [API_TEST] Testing login endpoint...');

      const loginData = {
        email: 'radhakishanjangid405@gmail.com',
        password: 'ASMC_testing_Password_*#*#*#',
      };

      const response = await axios.post('/auth/member-login', loginData);
      console.log('🟢 [API_TEST] Login response:', response.data);

      setTestResults(prev => ({
        ...prev,
        login: {
          success: true,
          data: response.data,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));

      Alert.alert('Login Test', 'Login endpoint working!');
    } catch (error) {
      console.log('🔴 [API_TEST] Login test failed:', error.message);
      setTestResults(prev => ({
        ...prev,
        login: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));

      Alert.alert('Login Test Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 API Test</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={testAPI} style={styles.button}>
          <Text style={styles.buttonText}>Test Auth/Me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={testLogin} style={styles.button}>
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>

        {Object.entries(testResults).map(([key, result]) => (
          <View key={key} style={styles.resultItem}>
            <Text style={styles.resultKey}>{key}:</Text>
            <Text
              style={[
                styles.resultStatus,
                result.success ? styles.success : styles.error,
              ]}>
              {result.success ? '✅ Success' : '❌ Failed'}
            </Text>
            <Text style={styles.resultTime}>{result.timestamp}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 10,
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  resultKey: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  resultTime: {
    fontSize: 10,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  success: {
    color: '#4caf50',
  },
  error: {
    color: '#f44336',
  },
});

export default APITest;
