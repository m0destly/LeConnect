import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/login/login';
import RegisterScreen from './screens/register/register';
import MainTabNavigator from './MainTabNavigation';
import EventPage from './screens/home/eventPage';
import UpdateProfileScreen from './screens/profile/updateProfile';
import NewProfileScreen from './screens/profile/newProfile';
import HistoryScreen from './screens/eventsHubScreen/history';
import { UserProvider } from './userContext';
import ResetPasswordScreen from './screens/login/resetPassword';
import MapsScreen from './screens/maps/mapsScreen';
import PushNotifications from './notifications';
import DisplayProfileScreen from './screens/profile/displayProfile';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <UserProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Notifications" component={PushNotifications} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="LeConnect" component={MainTabNavigator} />
          <Stack.Screen name="EventPage" component={EventPage} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="NewProfile" component={NewProfileScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Maps" component={MapsScreen} />
          <Stack.Screen name="DisplayProfile" component={DisplayProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default MyStack;