import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const InAppWebView = ({
  visible,
  onClose,
  url,
  title = "Web Page",
  onNavigationStateChange = () => {},
  onError = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webViewRef = useRef(null);

  const [injectedJavaScript, setInjectedJavaScript] = useState("");

  // Generate injected JavaScript with cookies
  const generateInjectedJS = async () => {
    try {
      const token = await AsyncStorage.getItem("asmc_token");

      const js = `
                (function() {
                    // Set cookies
                    document.cookie = "asmc_token=${token}; path=/; domain=.asmcdae.in";
                    localStorage.setItem('token', '${token}');
                    
                    // Hide header and footer if they exist
                    document.addEventListener("DOMContentLoaded", function() {
                        const header = document.querySelector("header");
                        if (header) header.style.display = "none";
                        const footer = document.querySelector("footer");
                        if (footer) footer.style.display = "none";
                        
                        // Also hide common navigation elements
                        const nav = document.querySelector("nav");
                        if (nav) nav.style.display = "none";
                    });
                    
                    // Additional customizations
                    const style = document.createElement('style');
                    style.textContent = \`
                        body { 
                            padding-top: 0 !important; 
                            margin-top: 0 !important; 
                        }
                        .header, .footer, .navbar { 
                            display: none !important; 
                        }
                    \`;
                    document.head.appendChild(style);
                })();
                true;
            `;

      setInjectedJavaScript(js);
    } catch (error) {
      console.error("Error generating injected JavaScript:", error);
      setInjectedJavaScript("true;");
    }
  };

  React.useEffect(() => {
    if (visible) {
      generateInjectedJS();
    }
  }, [visible, url]);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setIsLoading(navState.loading);
    onNavigationStateChange(navState);
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error:", nativeEvent);
    onError(nativeEvent);
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#007bff" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerActions}>
          {canGoBack && (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {canGoForward && (
            <TouchableOpacity
              onPress={handleGoForward}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleRefresh} style={styles.headerButton}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});

export default InAppWebView;
