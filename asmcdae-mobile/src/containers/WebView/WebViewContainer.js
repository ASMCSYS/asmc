import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebViewWithURLMonitoring} from '../../helpers/inAppBrowser.js';

const WebViewContainer = ({route, navigate}) => {
  const {url} = route.params;

  // Define target URLs to check
  const targetUrls = [
    'success',
    'payment-complete',
    'thank-you',
    'payment-success',
    'order-complete',
    'booking-success',
    'dashboard',
    'pending-payment',
    'booked-activity',
    'sports-activity',
    'booked-events',
    'booked-halls',
  ];

  // Check if URL is a target URL
  const isTargetURL = url => {
    return targetUrls.some(targetUrl =>
      url.toLowerCase().includes(targetUrl.toLowerCase()),
    );
  };

  // Handle initial URL check
  useEffect(() => {
    if (url && isTargetURL(url)) {
      console.log(
        'Initial URL is already a target URL, redirecting immediately',
      );
      handleTargetURLReached(url);
    }
  }, [url]);

  const handleTargetURLReached = targetURL => {
    console.log('Target URL reached:', targetURL);

    // Determine the booking type and redirect accordingly
    if (url.includes('sports-booking')) {
      // Activity booking - redirect to booked activity
      console.log('Redirecting to booked activity...');
      navigate.replace('BookedActivity');
    } else if (url.includes('/events/booking/')) {
      // Event booking - redirect to booked events
      console.log('Redirecting to booked events...');
      navigate.replace('BookedEvents');
    } else if (url.includes('hall-booking')) {
      // Hall booking - redirect to booked halls
      console.log('Redirecting to booked halls...');
      navigate.replace('BookedHalls');
    } else {
      // Default fallback - go back to previous screen
      console.log('Default fallback - going back...');
      navigate.goBack();
    }
  };

  // Don't render WebView if initial URL is already a target URL
  if (url && isTargetURL(url)) {
    console.log('Initial URL is target URL, not rendering WebView');
    return null;
  }

  return (
    <View style={styles.container}>
      <WebViewWithURLMonitoring
        url={url}
        onTargetURLReached={handleTargetURLReached}
        // hideElements={[
        //   '.header',
        //   '.footer',
        //   '.navbar',
        //   '.breadcrumb',
        //   '.sidebar',
        //   '.main-header',
        //   '.main-footer',
        //   '.desktop-only',
        //   '.hide-in-app',
        //   '.site-header',
        //   '.top-bar',
        //   '.topnav',
        //   '.main-navigation',
        //   '.logo',
        //   '.brand',
        //   '.menu',
        //   '.nav-menu',
        //   '.announcement',
        //   '.promo-bar',
        //   '.cookie-notice',
        //   '.newsletter-popup',
        //   '.ad-banner',
        //   '.social-share',
        //   '.search-bar',
        //   '.user-menu',
        //   '.language-selector',
        //   '.currency-selector',
        //   '.widget-area',
        //   '.site-footer',
        //   '.banner--inner',
        //   '.widget-visible',
        //   '.progress-wrap',
        //   '.tawk-min-container',
        // ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default WebViewContainer;
