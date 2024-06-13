import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login/login';
import RegisterScreen from './screens/register/register';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigation';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    //<NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LeConnect" component={MainTabNavigator}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
    //</NavigationContainer>
  );
};

export default MyStack;