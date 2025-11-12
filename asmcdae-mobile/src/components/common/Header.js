import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';

export default function Header({
  title,
  showLogout = false,
  showBack = false,
  showProfile = true,
}) {
  const navigate = useNavigation();
  const {authData, logout} = useAuth();

  const handleLogout = async () => {
    console.log('handleLogout: Logging out users');
    await logout();
    // Force navigation reset to Login
    // navigate.reset({
    //   index: 0,
    //   routes: [{name: 'Login'}],
    // });
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={Platform.OS === 'android'}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Back Button */}
          {showBack && (
            <TouchableOpacity
              onPress={() => {
                if (navigate.canGoBack()) {
                  navigate.goBack();
                } else {
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
                    ],
                  });
                }
              }}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity
              style={styles.leftSection}
              onPress={() =>
                navigate.navigate('TabNavigator', {screen: 'Profile'})
              }>
              <Image
                source={{
                  uri: authData?.profile || 'https://via.placeholder.com/50',
                }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.greetingText}>Hello,</Text>
                <Text style={styles.userText}>{authData?.name || 'Guest'}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Logout Button */}
          {showLogout && (
            <TouchableOpacity
              onPress={() => handleLogout()}
              style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingText: {
    fontFamily: 'PlusJakartaSans',
    fontSize: 14,
  },
  userText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'right',
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  logoutButton: {
    marginLeft: 10,
    padding: 5,
  },
});
