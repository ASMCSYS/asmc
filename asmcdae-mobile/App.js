import React, {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import RoutesContainer from './src/routes';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Appearance, ActivityIndicator, View} from 'react-native';
import {queryClient} from './src/lib/queryClient';
import {AuthProvider} from './src/contexts/AuthContext';

export default function App() {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

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
