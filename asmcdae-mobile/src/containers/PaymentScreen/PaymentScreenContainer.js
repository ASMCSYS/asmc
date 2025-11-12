import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {axios} from '../../helpers/axios.js';
import {paymentUrl} from '../../helpers/constants.js';
import Toast from 'react-native-toast-message';
import {useGetMemberData} from '../../hooks/useAuth.js';
import {useAuth} from '../../contexts/AuthContext.js';

const {width, height} = Dimensions.get('window');

const PaymentScreenContainer = ({route, navigate}) => {
  const {authData, updateAuthData} = useAuth();
  const {
    payload,
    url = '/payment/initiate-payment',
    goBackPop = 1,
    navigateTo = null,
  } = route.params;
  const [paymentForm, setPaymentForm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'
  const [paymentMessage, setPaymentMessage] = useState('');
  const [webViewClosed, setWebViewClosed] = useState(false);
  const [finalPaymentResult, setFinalPaymentResult] = useState(null);

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const crossOpacity = useRef(new Animated.Value(0)).current;

  const {refetch, data: memberData} = useGetMemberData({_id: authData._id});

  // Animation functions
  const showPaymentStatus = (status, message) => {
    setPaymentStatus(status);
    setPaymentMessage(message);

    // Show overlay with animation
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate icon based on status
    setTimeout(() => {
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Show checkmark or cross after icon animation
      setTimeout(() => {
        if (status === 'success') {
          Animated.timing(checkmarkOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if (status === 'failed') {
          Animated.timing(crossOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      }, 300);
    }, 200);
  };

  const hidePaymentStatus = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Use setTimeout to avoid state updates during animation cleanup
      setTimeout(() => {
        setPaymentStatus(null);
        setPaymentMessage('');
        // Reset animation values
        iconScale.setValue(0);
        checkmarkOpacity.setValue(0);
        crossOpacity.setValue(0);
      }, 50);
    });
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url, payload);
      const {accessCode, encryptedData, order_id} = response.result;

      const formHtml = `
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { 
                                background-color: transparent; 
                                margin: 0; 
                                padding: 0; 
                                font-family: Arial, sans-serif;
                            }
                            form { display: none; }
                            .loading {
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                text-align: center;
                                color: #333;
                            }
                        </style>
                    </head>
                    <body onload="document.forms[0].submit()">
                        <div class="loading">
                            <h3>Redirecting to Payment Gateway...</h3>
                            <p>Please wait while we securely redirect you to the payment page.</p>
                        </div>
                        <form method="post" action="${paymentUrl}">
                            <input type="hidden" name="access_code" value="${accessCode}" />
                            <input type="hidden" name="encRequest" value="${encryptedData}" />
                            <input type="hidden" name="order_id" value="${order_id}" />
                        </form>
                    </body>
                </html>
            `;
      setPaymentForm(formHtml);
    } catch (error) {
      console.error('Payment initiation error:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: 'Failed to initialize payment. Please try again.',
      });
      // Navigate back on error
      if (navigateTo) {
        navigate.navigate(navigateTo);
      } else {
        navigate.pop(goBackPop);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initiatePayment();

    // Set a timeout for payment processing (5 minutes)
    const timeout = setTimeout(() => {
      if (loading || isPaymentInProgress) {
        Toast.show({
          type: 'error',
          text1: 'Payment Timeout',
          text2: 'Payment session expired. Please try again.',
        });
        navigate.pop(goBackPop);
      }
    }, 300000); // 5 minutes

    setPaymentTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [payload]);

  // Custom URL parameter parser (since URLSearchParams.get is not implemented in React Native WebView)
  const parseUrlParams = url => {
    try {
      const params = {};
      const queryString = url.split('?')[1];
      if (!queryString) return params;

      // Split by & and handle each parameter
      const pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });

      return params;
    } catch (error) {
      console.error('Error parsing URL params:', error);
      return {};
    }
  };

  const handleWebViewNavigation = async navState => {
    const {url} = navState;
    console.log('Payment WebView URL:', url);

    // Handle payment success/failure redirects only
    if (url.includes('/pending-payment') || url.includes('payment-status')) {
      setIsPaymentInProgress(false);

      try {
        // Use custom URL parser instead of URLSearchParams
        const urlParams = parseUrlParams(url);
        console.log('Parsed URL params:', urlParams);

        const orderStatus = urlParams.status || urlParams.order_status;
        const orderId = urlParams.order_id;

        console.log('Payment Status:', orderStatus);
        console.log('Order ID:', orderId);

        // More robust status checking for CCAvenue
        const isSuccess =
          orderStatus === 'Success' ||
          orderStatus === 'success' ||
          orderStatus === 'SUCCESS' ||
          url.includes('status=Success') ||
          url.includes('status=success');

        const isFailure =
          orderStatus === 'Aborted' ||
          orderStatus === 'Failed' ||
          orderStatus === 'failure' ||
          orderStatus === 'FAILED' ||
          url.includes('status=Failed') ||
          url.includes('status=Aborted');

        if (isFailure) {
          // Payment failed - store result and close WebView
          setFinalPaymentResult({
            status: 'failed',
            message: 'Payment Failed',
            orderId: orderId,
          });
          setWebViewClosed(true);
        } else if (isSuccess) {
          // Payment successful - store result and close WebView
          setFinalPaymentResult({
            status: 'success',
            message: 'Payment Successful',
            orderId: orderId,
          });
          setWebViewClosed(true);
        } else {
          // Unknown status - log for debugging but don't treat as error
          console.log('Unknown payment status:', orderStatus);
          console.log('Full URL params:', urlParams);
          console.log(
            'URL contains success indicators:',
            url.includes('Success') || url.includes('success'),
          );
          console.log(
            'URL contains failure indicators:',
            url.includes('Failed') || url.includes('Aborted'),
          );
        }
      } catch (error) {
        console.error('Error parsing payment response:', error);
        // Don't show error toast immediately, just log the error
        console.log('Full URL that caused error:', url);
      }
    }
  };

  const handleWebViewError = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    console.warn('Payment WebView error:', nativeEvent);

    // Handle SSL errors specifically
    if (nativeEvent.description && nativeEvent.description.includes('SSL')) {
      console.log('SSL error in payment WebView, attempting to continue...');
      // For payment gateways, we might need to continue anyway
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Payment Error',
      text2: 'Unable to load payment gateway.',
    });
  };

  const handleWebViewClose = () => {
    console.log('WebView closed');
    setWebViewClosed(true);

    // If no final result yet, treat as failure
    if (!finalPaymentResult) {
      setFinalPaymentResult({
        status: 'failed',
        message: 'Payment Cancelled',
        orderId: null,
      });
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (paymentTimeout) {
      clearTimeout(paymentTimeout);
    }
    setLoading(false);
    setIsPaymentInProgress(false);
  };

  // Handle component unmount
  useEffect(() => {
    return cleanup;
  }, []);

  // Handle payment result after WebView closes
  useEffect(() => {
    if (webViewClosed && finalPaymentResult) {
      // Show payment status modal
      showPaymentStatus(finalPaymentResult.status, finalPaymentResult.message);

      // Handle success case - update member data
      if (finalPaymentResult.status === 'success') {
        const updateMemberData = async () => {
          try {
            // Force refetch with fresh data
            const freshData = await refetch();
            console.log('Fresh member data after payment:', freshData);

            if (freshData?.data?.result) {
              updateAuthData(freshData.data.result);
              console.log('Auth data updated with fresh payment data');
            } else if (freshData?.result) {
              // Handle different response structure
              updateAuthData(freshData.result);
              console.log(
                'Auth data updated with fresh payment data (alt structure)',
              );
            }
          } catch (error) {
            console.error('Error updating member data:', error);
          }
        };
        updateMemberData();
      }

      // Auto redirect after animation
      setTimeout(() => {
        hidePaymentStatus();
        if (finalPaymentResult.status === 'success') {
          if (navigateTo) {
            navigate.reset({
              index: 1,
              routes: [
                {
                  name: 'TabNavigator',
                  state: {
                    index: 0,
                    routes: [{name: 'Home'}],
                  },
                },
                {name: navigateTo},
              ],
            });
          } else {
            // Navigate back and trigger refresh using navigation state
            navigate.pop(goBackPop);
          }
        } else {
          if (navigateTo) {
            navigate.navigate(navigateTo);
          } else {
            navigate.pop(goBackPop);
          }
        }
      }, 3000);
    }
  }, [webViewClosed, finalPaymentResult]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Processing Payment...</Text>
        </View>
      )}

      {!webViewClosed && (
        <WebView
          originWhitelist={['*']}
          source={{html: paymentForm}}
          onNavigationStateChange={handleWebViewNavigation}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          onMessage={handleWebViewClose}
          javaScriptEnabled
          domStorageEnabled
          style={styles.webView}
          startInLoadingState={false}
          // SSL and security configurations
          allowsBackForwardNavigationGestures={false}
          allowsLinkPreview={false}
          cacheEnabled={false}
          incognito={true}
          // Handle SSL certificate issues
          onShouldStartLoadWithRequest={request => {
            console.log('Payment WebView loading:', request.url);
            // Only allow specific domains for security
            const allowedDomains = [
              'secure.ccavenue.com',
              'asmcdae.in',
              'www.asmcdae.in',
            ];

            const url = request.url.toLowerCase();
            const isAllowed = allowedDomains.some(domain =>
              url.includes(domain),
            );

            if (!isAllowed) {
              console.log('Blocked navigation to:', request.url);
              return false;
            }

            return true;
          }}
          // Additional security headers
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          // Disable debugging features that add extra parameters
          debuggingEnabled={false}
        />
      )}

      {/* Payment Status Overlay */}
      {paymentStatus && (
        <Animated.View
          style={[
            styles.paymentStatusOverlay,
            {
              opacity: overlayOpacity,
            },
          ]}>
          <Animated.View
            style={[
              styles.paymentStatusModal,
              {
                transform: [{scale: modalScale}],
              },
            ]}>
            {/* Status Icon */}
            <Animated.View
              style={[
                styles.statusIconContainer,
                {
                  transform: [{scale: iconScale}],
                },
              ]}>
              {paymentStatus === 'pending' && (
                <ActivityIndicator size="large" color="#007AFF" />
              )}
              {paymentStatus === 'success' && (
                <View style={styles.successIcon}>
                  <View style={styles.checkmarkCircle}>
                    <Animated.View
                      style={[
                        styles.checkmark,
                        {
                          opacity: checkmarkOpacity,
                        },
                      ]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </Animated.View>
                  </View>
                </View>
              )}
              {paymentStatus === 'failed' && (
                <View style={styles.failedIcon}>
                  <View style={styles.crossCircle}>
                    <Animated.View
                      style={[
                        styles.cross,
                        {
                          opacity: crossOpacity,
                        },
                      ]}>
                      <Text style={styles.crossText}>✕</Text>
                    </Animated.View>
                  </View>
                </View>
              )}
            </Animated.View>

            {/* Status Text */}
            <Text style={styles.statusTitle}>{paymentMessage}</Text>
            <Text style={styles.statusSubtitle}>
              {paymentStatus === 'success'
                ? 'Your payment has been processed successfully!'
                : paymentStatus === 'failed'
                ? 'Your payment was not successful. Please try again.'
                : 'Processing your payment...'}
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    paymentStatus === 'success' ? '#4CAF50' : '#F44336',
                },
              ]}
              onPress={() => {
                hidePaymentStatus();
                if (paymentStatus === 'success') {
                  if (navigateTo) {
                    navigate.reset({
                      index: 1,
                      routes: [
                        {
                          name: 'TabNavigator',
                          state: {
                            index: 0,
                            routes: [{name: 'Home'}],
                          },
                        },
                        {name: navigateTo},
                      ],
                    });
                  } else {
                    navigate.pop(goBackPop);
                  }
                } else {
                  if (navigateTo) {
                    navigate.navigate(navigateTo);
                  } else {
                    navigate.pop(goBackPop);
                  }
                }
              }}>
              <Text style={styles.actionButtonText}>
                {paymentStatus === 'success' ? 'Continue' : 'Try Again'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    position: 'relative', // Allow overlay to be positioned above the WebView
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Position the loading overlay over the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a dark translucent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it appears above the WebView
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent', // Make WebView background transparent
    borderWidth: 0, // Remove any borders
  },
  // Payment Status Overlay Styles
  paymentStatusOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Highest z-index to appear above everything
  },
  paymentStatusModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    minWidth: width * 0.8,
    maxWidth: 350,
  },
  statusIconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  failedIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F44336',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cross: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreenContainer;
