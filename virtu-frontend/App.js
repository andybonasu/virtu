import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomePage from './screens/HomePage';
import CreateBaseCourseScreen from './screens/CreateBaseCourseScreen';
import ClientListScreen from './screens/ClientListScreen';
import CourseEditorScreen from './screens/CourseEditorScreen';





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="HomePage" component={HomePage} />
    <Stack.Screen name="CreateBaseCourse" component={CreateBaseCourseScreen} />
    <Stack.Screen name="ClientList" component={ClientListScreen}  />
    <Stack.Screen name="CourseEditor" component={CourseEditorScreen} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}
