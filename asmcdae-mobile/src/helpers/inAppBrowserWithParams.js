import {Linking, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Opens a URL in system browser with token as URL parameter
 * @param {string} url - The URL to open
 * @param {Object} options - Additional options for the browser
 * @param {Function} onSuccessRedirect - Callback function when browser is closed
 * @returns {Promise<void>}
 */
export const openInAppBrowserWithToken = async (
  url,
  options = {},
  onSuccessRedirect,
) => {
  try {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('asmc_token');

    // Add token as URL parameter
    const separator = url.includes('?') ? '&' : '?';
    const urlWithToken = `${url}${separator}token=${encodeURIComponent(
      token || '',
    )}&from=app`;

    console.log('Opening URL with token:', urlWithToken);

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(urlWithToken);

    if (supported) {
      await Linking.openURL(urlWithToken);
      console.log('URL opened successfully in system browser');

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
    console.error('Error opening in-app browser with token:', error);

    // Fallback to system browser
    await openInSystemBrowser(url);
    throw error;
  }
};

/**
 * Opens a URL in the system browser as fallback
 * @param {string} url - The URL to open
 * @returns {Promise<void>}
 */
export const openInSystemBrowser = async url => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      throw new Error('URL not supported');
    }
  } catch (error) {
    console.error('Error opening in system browser:', error);
    Alert.alert(
      'Unable to Open Link',
      'The link could not be opened. Please check the URL and try again.',
      [{text: 'OK'}],
    );
  }
};
