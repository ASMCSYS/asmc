import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoutesContainer from "./routes";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Appearance, ActivityIndicator, View } from "react-native";
import { queryClient } from "./lib/queryClient";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  const [loaded] = useFonts({
    PlusJakartaSans: require("../assets/font/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../assets/font/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Bold": require("../assets/font/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../assets/font/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    Appearance.setColorScheme("light");
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <RoutesContainer />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
