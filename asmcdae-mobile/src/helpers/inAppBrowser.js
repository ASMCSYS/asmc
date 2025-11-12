import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const WebViewWithURLMonitoring = ({
  url,
  onTargetURLReached,
  onClose,
  hideElements = [],
}) => {
  const [token, setToken] = useState('');
  const [webViewKey, setWebViewKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentURL, setCurrentURL] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('asmc_token').then(setToken);
  }, []);

  const urlWithToken = `${url}${
    url.includes('?') ? '&' : '?'
  }token=${encodeURIComponent(token || '')}`;

  // CSS to hide elements
  const hideElementsCSS = `
        <style>
            /* Hide header elements - more comprehensive */
            header, .header, #header, .navbar, .nav, .navigation, .main-header,
            .site-header, .site-header-wrapper, .top-bar, .topbar, .top-nav, .topnav,
            .main-navigation, .primary-nav, .logo, .brand, .branding,
            .menu, .menu-wrapper, .nav-menu, .announcement, .announcement-bar, .promo-bar { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                top: -9999px !important;
            }
            
            /* Hide footer elements */
            footer, .footer, #footer, .main-footer, .site-footer { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
            }
            
            /* Hide specific elements by class or ID */
            .hide-in-app, .mobile-hide, .desktop-only, .breadcrumb, .breadcrumbs,
            .cookie-notice, .cookie-banner, .newsletter-popup, .popup, .modal,
            .ad-banner, .advertisement, .social-share, .share-buttons,
            .search-bar, .search-form, .user-menu, .account-menu,
            .language-selector, .currency-selector { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
            }
            
            /* Hide sidebars */
            .sidebar, .side-nav, .sidebar-nav, .widget-area { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
            }
            
            /* IMPORTANT: Preserve buttons and interactive elements */
            button, .btn, input[type="button"], input[type="submit"], 
            .btn-success, .btn-primary, .btn-secondary, .btn-danger,
            [class*="btn"], [class*="button"], [class*="submit"] {
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: static !important;
                top: auto !important;
                height: auto !important;
                overflow: visible !important;
                pointer-events: auto !important;
            }
            
            /* Preserve form elements and interactive content */
            form, .form, input, select, textarea, label,
            .form-group, .form-control, .input-group {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: static !important;
                pointer-events: auto !important;
            }
            
            /* Preserve booking and payment related elements */
            [class*="booking"], [class*="payment"], [class*="slot"], [class*="time"],
            [class*="date"], [class*="continue"], [class*="proceed"] {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: static !important;
                pointer-events: auto !important;
            }
            
            /* Hide any element with header/nav in class name - but be more selective */
            [class*="header"]:not([class*="button"]):not([class*="btn"]):not([class*="form"]),
            [class*="nav"]:not([class*="button"]):not([class*="btn"]):not([class*="form"]), 
            [class*="menu"]:not([class*="button"]):not([class*="btn"]):not([class*="form"]), 
            [class*="top"]:not([class*="button"]):not([class*="btn"]):not([class*="form"]) {
                display: none !important;
                visibility: hidden !important;
            }
            
            /* Hide any element with header/nav in id - but be more selective */
            [id*="header"]:not([id*="button"]):not([id*="btn"]):not([id*="form"]),
            [id*="nav"]:not([id*="button"]):not([id*="btn"]):not([id*="form"]),
            [id*="menu"]:not([id*="button"]):not([id*="btn"]):not([id*="form"]),
            [id*="top"]:not([id*="button"]):not([id*="btn"]):not([id*="form"]) {
                display: none !important;
                visibility: hidden !important;
            }

            // Custom css for mobile app
            .slots-modal {
                margin: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
            }
            .slots-modal .container {
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Custom elements to hide (passed as prop) */
            ${hideElements
              .map(
                selector => `${selector} { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
            }`,
              )
              .join('\n')}
        </style>
    `;

  // Define your target URLs
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

  // Check if a URL is a target URL
  const isTargetURL = url => {
    return targetUrls.some(targetUrl =>
      url.toLowerCase().includes(targetUrl.toLowerCase()),
    );
  };

  // Check if initial URL is already a target URL
  useEffect(() => {
    if (url && isTargetURL(url)) {
      console.log(
        'Initial URL is already a target URL, redirecting immediately',
      );
      onTargetURLReached?.(url);
    }
  }, [url]);

  const handleNavigationStateChange = navState => {
    const currentURL = navState.url;
    setCurrentURL(currentURL);
    console.log('Current URL:', currentURL);

    if (isTargetURL(currentURL)) {
      console.log('Target URL detected, closing WebView');
      onTargetURLReached?.(currentURL);
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  // Inject CSS after page loads
  const injectedJavaScript = `
        (function() {
            console.log('Starting CSS injection...');
            
            // Set the from=app cookie to identify mobile app environment
            document.cookie = 'from=app; path=/; max-age=3600; domain=.asmcdae.in';
            
            // Function to check for mobile app close signal
            function checkMobileAppCloseSignal() {
                var cookies = document.cookie.split(';');
                var fromMobileAppCookie = cookies.find(function(cookie) {
                    return cookie.trim().startsWith('fromMobileApp=');
                });
                
                if (fromMobileAppCookie) {
                    var value = fromMobileAppCookie.split('=')[1];
                    if (value === 'close') {
                        console.log('Mobile app close signal detected');
                        // Send message to React Native
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'CLOSE_WEBVIEW',
                            reason: 'cookie_signal'
                        }));
                        return true;
                    }
                }
                return false;
            }
            
            // Check for close signal every 2 seconds
            setInterval(checkMobileAppCloseSignal, 2000);
            
            // Periodic check to ensure buttons remain functional
            setInterval(ensureButtonFunctionality, 3000);
            
            // Debug function to log all elements
            function debugElements() {
                console.log('=== DEBUGGING ELEMENTS ===');
                var allElements = document.querySelectorAll('*');
                var headerElements = [];
                var navElements = [];
                var menuElements = [];
                
                allElements.forEach(function(element) {
                    var className = element.className || '';
                    var id = element.id || '';
                    var tagName = element.tagName.toLowerCase();
                    
                    if (className.includes('header') || id.includes('header') || tagName === 'header') {
                        headerElements.push({
                            tag: tagName,
                            id: id,
                            class: className,
                            element: element
                        });
                    }
                    
                    if (className.includes('nav') || id.includes('nav') || tagName === 'nav') {
                        navElements.push({
                            tag: tagName,
                            id: id,
                            class: className,
                            element: element
                        });
                    }
                    
                    if (className.includes('menu')) {
                        menuElements.push({
                            tag: tagName,
                            id: id,
                            class: className,
                            element: element
                        });
                    }
                });
                
                console.log('Header elements found:', headerElements.length, headerElements);
                console.log('Nav elements found:', navElements.length, navElements);
                console.log('Menu elements found:', menuElements.length, menuElements);
                console.log('=== END DEBUGGING ===');
            }
            
            // Run debug after a delay
            setTimeout(debugElements, 1000);
            
            // Function to inject CSS
            function injectCSS() {
                try {
                    // Remove any existing injected styles
                    var existingStyle = document.getElementById('asmc-injected-style');
                    if (existingStyle) {
                        existingStyle.remove();
                    }
                    
                    // Create new style element
                    var style = document.createElement('style');
                    style.id = 'asmc-injected-style';
                    style.innerHTML = \`${hideElementsCSS.replace(
                      /`/g,
                      '\\`',
                    )}\`;
                    
                    // Insert at the beginning of head to ensure it loads first
                    if (document.head) {
                        document.head.insertBefore(style, document.head.firstChild);
                        console.log('CSS injected successfully');
                    } else {
                        console.log('Document head not found, retrying...');
                        setTimeout(injectCSS, 100);
                        return;
                    }
                } catch (error) {
                    console.error('Error injecting CSS:', error);
                }
            }
            
            // Function to hide elements with JavaScript
            function hideElements() {
                console.log('Hiding elements with JavaScript...');
                
                var selectors = [
                    'header', '.header', '#header', '.navbar', '.nav', '.navigation', '.main-header',
                    'footer', '.footer', '#footer', '.main-footer',
                    '.hide-in-app', '.mobile-hide', '.desktop-only', '.breadcrumb', '.breadcrumbs',
                    '.sidebar', '.side-nav', '.sidebar-nav',
                    '.top-bar', '.topbar', '.top-nav', '.topnav',
                    '.site-header', '.site-header-wrapper',
                    '.main-navigation', '.primary-nav',
                    '.logo', '.brand', '.branding',
                    '.menu', '.menu-wrapper', '.nav-menu',
                    '.announcement', '.announcement-bar', '.promo-bar',
                    '.cookie-notice', '.cookie-banner',
                    '.newsletter-popup', '.popup', '.modal',
                    '.ad-banner', '.advertisement',
                    '.social-share', '.share-buttons',
                    '.search-bar', '.search-form',
                    '.user-menu', '.account-menu',
                    '.language-selector', '.currency-selector',
                    '.banner--inner', '.widget-visible', '.progress-wrap', '.tawk-min-container'
                ];
                
                var hiddenCount = 0;
                selectors.forEach(function(selector) {
                    try {
                        var elements = document.querySelectorAll(selector);
                        elements.forEach(function(element) {
                            // Skip if element contains buttons or interactive elements
                            if (element.querySelector('button, .btn, input[type="button"], input[type="submit"]')) {
                                console.log('Skipping element with buttons:', selector, element);
                                return;
                            }
                            
                            console.log('Hiding element:', selector, element);
                            element.style.setProperty('display', 'none', 'important');
                            element.style.setProperty('visibility', 'hidden', 'important');
                            element.style.setProperty('opacity', '0', 'important');
                            element.style.setProperty('height', '0', 'important');
                            element.style.setProperty('overflow', 'hidden', 'important');
                            element.style.setProperty('position', 'absolute', 'important');
                            element.style.setProperty('top', '-9999px', 'important');
                            hiddenCount++;
                        });
                    } catch (error) {
                        console.error('Error hiding selector:', selector, error);
                    }
                });
                
                // Also hide elements by partial class name match - but be more selective
                try {
                    var allElements = document.querySelectorAll('*');
                    allElements.forEach(function(element) {
                        var className = element.className || '';
                        var id = element.id || '';
                        var tagName = element.tagName.toLowerCase();
                        
                        // Skip if element is a button or contains buttons
                        if (tagName === 'button' || className.includes('btn') || 
                            className.includes('button') || element.querySelector('button, .btn')) {
                            return;
                        }
                        
                        if ((className.includes('header') || className.includes('nav') || 
                            className.includes('menu') || className.includes('top') ||
                            id.includes('header') || id.includes('nav')) &&
                            !className.includes('btn') && !className.includes('button') &&
                            !className.includes('form') && !className.includes('booking') &&
                            !className.includes('payment') && !className.includes('slot')) {
                            console.log('Hiding element by partial match:', element);
                            element.style.setProperty('display', 'none', 'important');
                            element.style.setProperty('visibility', 'hidden', 'important');
                            hiddenCount++;
                        }
                    });
                } catch (error) {
                    console.error('Error in partial matching:', error);
                }
                
                console.log('Total elements hidden:', hiddenCount);
                return hiddenCount;
            }
            
            // Function to ensure buttons remain clickable
            function ensureButtonFunctionality() {
                console.log('Ensuring button functionality...');
                
                // Find all buttons and ensure they're clickable
                var buttons = document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]');
                buttons.forEach(function(button) {
                    // Ensure button is visible and clickable
                    button.style.setProperty('display', 'inline-block', 'important');
                    button.style.setProperty('visibility', 'visible', 'important');
                    button.style.setProperty('opacity', '1', 'important');
                    button.style.setProperty('position', 'static', 'important');
                    button.style.setProperty('pointer-events', 'auto', 'important');
                    button.style.setProperty('z-index', '9999', 'important');
                    
                    // Ensure parent containers are also visible
                    var parent = button.parentElement;
                    while (parent && parent !== document.body) {
                        parent.style.setProperty('display', 'block', 'important');
                        parent.style.setProperty('visibility', 'visible', 'important');
                        parent.style.setProperty('opacity', '1', 'important');
                        parent.style.setProperty('position', 'static', 'important');
                        parent.style.setProperty('pointer-events', 'auto', 'important');
                        parent = parent.parentElement;
                    }
                    
                    console.log('Ensured button functionality:', button);
                });
                
                // Also ensure form elements are functional
                var forms = document.querySelectorAll('form, .form');
                forms.forEach(function(form) {
                    form.style.setProperty('display', 'block', 'important');
                    form.style.setProperty('visibility', 'visible', 'important');
                    form.style.setProperty('opacity', '1', 'important');
                    form.style.setProperty('position', 'static', 'important');
                    form.style.setProperty('pointer-events', 'auto', 'important');
                });
            }
            
            // Initial injection
            injectCSS();
            var initialHidden = hideElements();
            
            // Ensure buttons are functional after hiding elements
            setTimeout(ensureButtonFunctionality, 100);
            
            // Retry multiple times to catch dynamic content
            var retryCount = 0;
            var maxRetries = 10;
            
            // function retryHide() {
            //     if (retryCount < maxRetries) {
            //         setTimeout(function() {
            //             console.log('Retry', retryCount + 1, 'of', maxRetries);
            //             injectCSS();
            //             var hidden = hideElements();
            //             retryCount++;
                        
            //             if (hidden > 0) {
            //                 retryHide();
            //             }
            //         }, 200 * (retryCount + 1));
            //     }
            // }
            
            // retryHide();
            
            // Mutation observer for dynamic content
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // Element node
                                // Check if the added node is a button or contains buttons
                                if (node.matches && (node.matches('button') || node.matches('.btn') || 
                                    node.matches('input[type="button"]') || node.matches('input[type="submit"]'))) {
                                    console.log('New button detected:', node);
                                    ensureButtonFunctionality();
                                } else if (node.querySelector && node.querySelector('button, .btn, input[type="button"], input[type="submit"]')) {
                                    console.log('New element with button detected:', node);
                                    ensureButtonFunctionality();
                                }
                                
                                // Re-run hide function for new header/nav elements
                                if (node.matches && (node.matches('header') || node.matches('.header') || node.matches('#header'))) {
                                    console.log('Hiding dynamically added element:', node);
                                    node.style.setProperty('display', 'none', 'important');
                                    node.style.setProperty('visibility', 'hidden', 'important');
                                }
                            }
                        });
                    }
                });
            });
            
            // Start observing
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
                console.log('Mutation observer started');
            } else {
                // Wait for body to be available
                setTimeout(function() {
                    if (document.body) {
                        observer.observe(document.body, { childList: true, subtree: true });
                        console.log('Mutation observer started (delayed)');
                    }
                }, 100);
            }
            
            console.log('CSS injection and element hiding complete');
        })();
        true;
    `;

  return (
    <View style={styles.container}>
      {/* Header with close button */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
        <View style={styles.placeholder} />
      </View> */}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        key={webViewKey}
        source={{uri: urlWithToken}}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={handleLoadEnd}
        onLoad={() => {
          console.log('WebView loaded, injecting CSS...');
          // Additional injection on load
          setTimeout(() => {
            const additionalScript = `
                            (function() {
                                console.log('Additional CSS injection on load...');
                                var style = document.createElement('style');
                                style.innerHTML = \`${hideElementsCSS.replace(
                                  /`/g,
                                  '\\`',
                                )}\`;
                                document.head.appendChild(style);
                                
                                // Force hide all header-like elements
                                var elements = document.querySelectorAll('header, .header, #header, .navbar, .nav, .navigation, .main-header, .site-header, .top-bar, .topnav, .main-navigation, .logo, .brand, .menu, .nav-menu, .announcement, .promo-bar, .banner--inner, .widget-visible, .progress-wrap, .tawk-min-container');
                                elements.forEach(function(el) {
                                    el.style.setProperty('display', 'none', 'important');
                                    el.style.setProperty('visibility', 'hidden', 'important');
                                    el.style.setProperty('opacity', '0', 'important');
                                    el.style.setProperty('height', '0', 'important');
                                    el.style.setProperty('overflow', 'hidden', 'important');
                                    el.style.setProperty('position', 'absolute', 'important');
                                    el.style.setProperty('top', '-9999px', 'important');
                                });
                                console.log('Additional injection complete, hidden', elements.length, 'elements');
                            })();
                        `;
            // Note: We can't directly execute this, but the injectedJavaScript should handle it
          }, 500);
        }}
        startInLoadingState={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
        injectedJavaScript={injectedJavaScript}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1 ASMC-App"
        onMessage={event => {
          console.log('WebView message:', event.nativeEvent.data);
          try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === 'CLOSE_WEBVIEW') {
              console.log('Closing WebView due to:', message.reason);
              onTargetURLReached?.(currentURL);
            }
          } catch (error) {
            console.log('Non-JSON message:', event.nativeEvent.data);
          }
        }}
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
        }}
        // SSL Certificate handling
        onShouldStartLoadWithRequest={request => {
          console.log('Loading request:', request.url);
          // Allow all requests including HTTPS
          return true;
        }}
        onLoadProgress={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('Loading progress:', nativeEvent.progress);
        }}
        // SSL Certificate trust settings
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Trust all certificates for development/testing
        onContentProcessDidTerminate={syntheticEvent => {
          console.warn('Content process terminated, reloading...');
          setWebViewKey(prev => prev + 1);
        }}
        // Additional SSL settings
        onRenderProcessGone={syntheticEvent => {
          console.warn('Render process gone, reloading...');
          setWebViewKey(prev => prev + 1);
        }}
        // Additional SSL and security settings
        allowsProtectedMedia={true}
        allowsFullscreenVideo={true}
        allowsLinkPreview={false}
        // Handle SSL errors gracefully
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          // If it's an SSL error, try to reload
          if (
            nativeEvent.description &&
            nativeEvent.description.includes('SSL')
          ) {
            console.log('SSL error detected, attempting to reload...');
            setTimeout(() => {
              setWebViewKey(prev => prev + 1);
            }, 1000);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
