import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import {StatusBar} from 'react-native';

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginContainer from '../containers/Login';
import ForgotPasswordContainer from '../containers/ForgotPassword';
import axiosInterceptor, {axios} from '../helpers/axios';
import defaultStyles from '../styles/styles';

import HomeContainer from '../containers/Home';
import {baseUrl} from '../helpers/constants';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EventsContainer from '../containers/Events';
import ActivitiesContainer from '../containers/Activities';
import ActivityContainer from '../containers/Activity';
import EventDetailContainer from '../containers/EventDetail';
import HallsContainer from '../containers/Halls';
import HallDetailContainer from '../containers/HallDetail';
// import ProfileContainer from '../containers/Profile';
import Header from '../components/common/Header';
import ProfileContainer from '../containers/Profile';
import ChangePassword from '../containers/ChangePassword';
import PaymentHistory from '../containers/PaymentHistory';
import EnrolledActivity from '../containers/EnrolledActivity';
import BookedActivity from '../containers/BookedActivity';
import BookedEvents from '../containers/BookedEvents';
import MembershipFee from '../containers/MembershipFee';
import PaymentScreen from '../containers/PaymentScreen';
import RenewPlan from '../containers/RenewPlan';
import EditProfile from '../containers/EditProfile';
import Profile from '../containers/Profile';
import BookingActivity from '../containers/BookingActivity';
import BookingForm from '../containers/BookingForm';
import BookedHalls from '../containers/BookedHalls';
import WebViewContainer from '../containers/WebView';
import {useAuth} from '../contexts/AuthContext';
import {
  useNavigationConfig,
  getTabBarStyle,
  getSafeAreaStyle,
} from '../helpers/navigationUtils';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = ({route}) => ({
  tabBarIcon: ({focused, color, size}) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'home';
      return <MaterialIcons name={iconName} size={size} color={color} />;
    } else if (route.name === 'Events') {
      iconName = 'event';
      return <MaterialIcons name={iconName} size={size} color={color} />;
    } else if (route.name === 'Activities') {
      iconName = 'directions-run';
      return <MaterialIcons name={iconName} size={size} color={color} />;
    } else if (route.name === 'Halls') {
      iconName = 'school';
      return <MaterialIcons name={iconName} size={size} color={color} />;
    } else if (route.name === 'Profile') {
      iconName = 'user';
      return <FontAwesome5 name={iconName} size={size} color={color} />;
    }
  },
  headerShown: true,
  tabBarActiveTintColor: '#000',
  tabBarInactiveTintColor: 'gray',
  tabBarLabelStyle: {
    fontFamily: 'PlusJakartaSans-Regular', // Change to your custom font family
    fontSize: 13, // Customize the font size as needed
  },
  tabBarStyle: {
    height: 60,
  },
});

const PublicNavigator = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginContainer} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordContainer} />
  </Stack.Navigator>
);

const PrivateNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen
      name="TabNavigator"
      options={{
        headerShown: false,
      }}
      component={TabNavigator}
    />

    <Stack.Screen
      name="ActivityDetail"
      component={ActivityContainer}
      options={{
        headerShown: true,
        header: () => <Header showBack={true} />,
      }}
    />
    <Stack.Screen
      name="EventDetail"
      component={EventDetailContainer}
      options={{
        headerShown: true,
        header: () => <Header showBack={true} />,
      }}
    />
    <Stack.Screen
      name="ActivityBooking"
      component={BookingActivity}
      options={{
        headerShown: true,
        header: () => <Header showBack={true} />,
      }}
    />
    <Stack.Screen
      name="BookingForm"
      component={BookingForm}
      options={{
        headerShown: true,
        header: () => <Header showBack={true} />,
      }}
    />

    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Edit Profile" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Change Password" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="PaymentHistory"
      component={PaymentHistory}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Payment History" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="EnrolledActivity"
      component={EnrolledActivity}
      options={{
        headerShown: true,
        header: () => (
          <Header
            showBack={true}
            title="Enrolled Activity"
            showProfile={false}
          />
        ),
      }}
    />
    <Stack.Screen
      name="BookedActivity"
      component={BookedActivity}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Booked Activity" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="BookedEvents"
      component={BookedEvents}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Booked Events" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="BookedHalls"
      component={BookedHalls}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Booked Halls" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="HallDetail"
      component={HallDetailContainer}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Halls" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="MembershipFee"
      component={MembershipFee}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Membership" showProfile={false} />
        ),
      }}
    />
    <Stack.Screen
      name="PaymentScreen"
      component={PaymentScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="RenewPlan"
      component={RenewPlan}
      options={{
        headerShown: true,
        header: () => <Header showBack={true} title="Renew Plan" />,
      }}
    />
    <Stack.Screen
      name="WebView"
      component={WebViewContainer}
      options={{
        headerShown: true,
        header: () => (
          <Header showBack={true} title="Booking" showProfile={false} />
        ),
      }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const navConfig = useNavigationConfig();

  const dynamicScreenOptions = ({route}) => ({
    ...screenOptions({route}),
    tabBarStyle: getTabBarStyle(navConfig),
  });

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={dynamicScreenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{
          headerShown: true,
          header: () => <Header showLogout={true} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsContainer}
        options={{
          header: () => <Header showLogout={true} />,
        }}
      />
      <Tab.Screen
        name="Halls"
        component={HallsContainer}
        options={{
          header: () => <Header showLogout={true} />,
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesContainer}
        options={{
          header: () => <Header showLogout={true} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileContainer}
        options={{
          header: () => <Header showLogout={true} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function RoutesContainer() {
  const {isAuth, isLoading} = useAuth();
  const navConfig = useNavigationConfig();

  console.log(
    '[RoutesContainer] Rendered. isAuth:',
    isAuth,
    'isLoading:',
    isLoading,
    'Navigation Config:',
    navConfig,
  );

  // Add effect to log when isAuth changes
  useEffect(() => {
    console.log('[RoutesContainer] isAuth changed to:', isAuth);
    if (isAuth) {
      console.log(
        '[RoutesContainer] User is authenticated, showing private screens',
      );
    } else {
      console.log(
        '[RoutesContainer] User is not authenticated, showing login screen',
      );
    }
  }, [isAuth]);

  if (isLoading) {
    console.log('[RoutesContainer] Loading state, showing loading screen');
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  console.log('[RoutesContainer] Rendering navigation. isAuth:', isAuth);

  return (
    <View style={getSafeAreaStyle(navConfig)}>
      <NavigationContainer>
        {isAuth ? (
          <SafeAreaView
            style={[
              {
                flex: 1,
                backgroundColor: '#fafafa',
                paddingTop:
                  Platform.OS === 'android' ? StatusBar.currentHeight : 0,
              },
            ]}>
            <PrivateNavigator />
          </SafeAreaView>
        ) : (
          <PublicNavigator />
        )}
      </NavigationContainer>
      <Toast
        position="bottom"
        bottomOffset={
          navConfig.needsBottomPadding ? navConfig.bottomPadding + 20 : 20
        }
      />
    </View>
  );
}
