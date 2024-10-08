import 'react-native-gesture-handler'; 
import React, {useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import UserManagement from './admin/screens/UserManagement';
import DishManagement from './admin/screens/DishManagement';
import IngredientManagement from './admin/screens/IngredientManagement';
import Login from './admin/screens/Login';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ headerShown: false }} // Hide the header
      />
      <Stack.Screen 
        name="Drawer" 
        component={DrawerNavigator} 
        options={{ headerShown: false }} // Hide the header for Drawer Navigator
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate back to the login screen when the component is mounted
    navigation.replace('Login');
  }, [navigation]);

  return null; // This screen doesn't render anything
};

const DrawerNavigator = ({navigation}) => {
  
  return(
  <Drawer.Navigator
    initialRouteName="UserManagement"
    screenOptions={{
      drawerStyle: {
        backgroundColor: '#f0f0f0',
        width: 350,
      },
      drawerActiveTintColor: '#e91e63',
      drawerInactiveTintColor: '#000',
      drawerLabelStyle: {
        fontSize: 18,
      },
    }}
  >
    <Drawer.Screen
      name="User Management"
      component={UserManagement}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Icon name="people" size={size} color={focused ? '#e91e63' : '#000'} />
        ),
      }}
    />
    <Drawer.Screen
      name="Dish Management"
      component={DishManagement}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Icon name="restaurant" size={size} color={focused ? '#e91e63' : '#000'} />
        ),
      }}
    />
    <Drawer.Screen
      name="Ingredient Management"
      component={IngredientManagement}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Icon name="leaf" size={size} color={focused ? '#e91e63' : '#000'} />
        ),
      }}
    />
    <Drawer.Screen
        name="Log Out"
        component={LogoutScreen} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon name="log-out" size={size} color={focused ? '#e91e63' : '#000'} />
          ),
          drawerItemStyle: { height: 60 }, 
          title: 'Log Out', 
        }}
      />
  </Drawer.Navigator>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Display both panels side by side
    backgroundColor: '#fff',
  },
  panel: {
    flex: 1,
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
});
