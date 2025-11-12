import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebugInfo = () => {
  const {token, isAuth, authData, isLoading, fetchAuthDataDirectly} = useAuth();
  const [debugInfo, setDebugInfo] = React.useState({});

  const refreshDebugInfo = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('asmc_token');
      setDebugInfo({
        token: token ? `${token.substring(0, 20)}...` : 'null',
        storedToken: storedToken
          ? `${storedToken.substring(0, 20)}...`
          : 'null',
        isAuth,
        authData: authData ? JSON.stringify(authData, null, 2) : 'null',
        isLoading,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  React.useEffect(() => {
    refreshDebugInfo();
  }, [token, isAuth, authData, isLoading]);

  const handleRefreshAuth = async () => {
    try {
      console.log('🟢 [DEBUG] Manually refreshing auth data...');
      await fetchAuthDataDirectly();
      refreshDebugInfo();
    } catch (error) {
      console.log('🔴 [DEBUG] Failed to refresh auth data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Debug Info</Text>
        <TouchableOpacity
          onPress={refreshDebugInfo}
          style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Authentication State</Text>
          <Text style={styles.infoText}>
            Is Auth: {isAuth ? '✅ Yes' : '❌ No'}
          </Text>
          <Text style={styles.infoText}>
            Is Loading: {isLoading ? '⏳ Yes' : '✅ No'}
          </Text>
          <Text style={styles.infoText}>
            Token: {debugInfo.token || 'null'}
          </Text>
          <Text style={styles.infoText}>
            Stored Token: {debugInfo.storedToken || 'null'}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>User Data</Text>
          <Text style={styles.infoText}>
            {authData ? (
              <>
                Name: {authData.name || 'N/A'}
                {'\n'}
                Email: {authData.email || 'N/A'}
                {'\n'}
                ID: {authData._id || 'N/A'}
                {'\n'}
                Profile: {authData.profile ? '✅' : '❌'}
              </>
            ) : (
              '❌ No user data'
            )}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            onPress={handleRefreshAuth}
            style={styles.actionButton}>
            <Text style={styles.actionText}>🔄 Refresh Auth Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Last Updated</Text>
          <Text style={styles.infoText}>{debugInfo.timestamp || 'Never'}</Text>
        </View>

        {debugInfo.error && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Error</Text>
            <Text style={[styles.infoText, styles.errorText]}>
              {debugInfo.error}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
    maxHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 5,
  },
  refreshText: {
    fontSize: 18,
  },
  scrollView: {
    padding: 10,
  },
  infoSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  errorText: {
    color: '#d32f2f',
  },
  actionButton: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DebugInfo;
