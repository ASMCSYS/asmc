import React from 'react';
import {WebView} from 'react-native-webview';
import {Platform} from 'react-native';

export const SSLWebView = ({url, ...props}) => {
  const handleShouldStartLoadWithRequest = request => {
    console.log('SSLWebView - Loading request:', request.url);

    // Always allow requests to asmcdae.in
    if (request.url.includes('asmcdae.in')) {
      console.log('SSLWebView - Allowing asmcdae.in request');
      return true;
    }

    // Allow all other requests
    return true;
  };

  const handleError = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    console.warn('SSLWebView - Error:', nativeEvent);

    // Handle SSL errors specifically
    if (nativeEvent.description && nativeEvent.description.includes('SSL')) {
      console.log('SSLWebView - SSL error detected, attempting to continue...');
      // For SSL errors, we'll try to continue anyway
      return;
    }
  };

  const webViewProps = {
    source: {uri: url},
    onShouldStartLoadWithRequest: handleShouldStartLoadWithRequest,
    onError: handleError,
    originWhitelist: ['*'],
    mixedContentMode: 'compatibility',
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
    allowsProtectedMedia: true,
    allowsFullscreenVideo: true,
    allowsLinkPreview: false,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    startInLoadingState: true,
    scalesPageToFit: true,
    // Additional SSL settings for Android
    ...(Platform.OS === 'android' && {
      androidLayerType: 'hardware',
      androidHardwareAccelerationDisabled: false,
    }),
    // Additional SSL settings for iOS
    ...(Platform.OS === 'ios' && {
      allowsBackForwardNavigationGestures: true,
    }),
    // User agent to mimic a regular browser
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1 ASMC-App',
    ...props,
  };

  return <WebView {...webViewProps} />;
};
