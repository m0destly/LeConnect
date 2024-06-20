import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/home/home';
import ProfileScreen from './screens/profile/profile';
import EventsHubScreen from './screens/eventsHubScreen/eventsHubScreen';
import CreateEventsScreen from './screens/createEvents/createEvents';

const Tab = createBottomTabNavigator();

const MainTabNavigator = ( navigation ) => {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: true }}
    >
    <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
    <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    <Tab.Screen
        name="Events Hub"
        component={EventsHubScreen}
        options={{
          title: 'Events Hub',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="calendar-multiple" size={size} color={color} />
          ),
        }}
      />
    <Tab.Screen
        name="Create Events"
        component={CreateEventsScreen}
        options={{
          title: 'Create Events',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="calendar-plus" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;