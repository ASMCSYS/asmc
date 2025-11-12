import {Linking, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const openWebsite = async (url, onSuccessRedirect) => {
  try {
    const token = await AsyncStorage.getItem('asmc_token');

    // Add token as URL parameter
    const separator = url.includes('?') ? '&' : '?';
    const urlWithToken = `${url}${separator}token=${encodeURIComponent(
      token || '',
    )}&from=app`;

    console.log('Opening URL:', urlWithToken);

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(urlWithToken);

    if (supported) {
      await Linking.openURL(urlWithToken);
      console.log('URL opened successfully');

      // Call the success callback after a short delay
      if (onSuccessRedirect && typeof onSuccessRedirect === 'function') {
        setTimeout(() => {
          onSuccessRedirect();
        }, 1000);
      }
    } else {
      throw new Error('URL not supported');
    }
  } catch (error) {
    console.error('Error opening website:', error);
    Alert.alert(
      'Unable to Open Link',
      'The booking link could not be opened. Please check your internet connection and try again.',
      [{text: 'OK'}],
    );
  }
};
