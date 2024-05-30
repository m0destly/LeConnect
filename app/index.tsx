import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login/login';
import HomeScreen from './screens/home/home';
import RegisterScreen from './screens/register/register';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default MyStack;