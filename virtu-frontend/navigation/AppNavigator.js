// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/shared/HomeScreen';

// Temporary dashboard screens (to be replaced)
import { Text, View } from 'react-native';

const Dummy = ({ role }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24 }}>{role} Home Page</Text>
  </View>
);

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Shared Home for onboarding or branding */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Role-specific dummy pages */}
        <Stack.Screen name="TrainerHome" children={() => <Dummy role="Trainer" />} />
        <Stack.Screen name="ClientHome" children={() => <Dummy role="Client" />} />
        <Stack.Screen name="AdminHome" children={() => <Dummy role="Admin" />} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
