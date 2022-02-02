import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ListScreen from '../screens/ListScreen';
import DetailScreen from '../screens/DetailScreen';

const PrincipalStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

function Home() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="List" component={ListScreen} />
        <HomeStack.Screen name="Detail" options={{ headerShown: true }} component={DetailScreen} />
      </HomeStack.Navigator>
    );
  }

const Routes = () => {
    return (
            <NavigationContainer>
                <PrincipalStack.Navigator screenOptions={{ headerShown: false }}>
                    <PrincipalStack.Screen  name="Login" component={LoginScreen} />
                    <PrincipalStack.Screen  name="CryptoList" component={Home} />
                </PrincipalStack.Navigator>
            </NavigationContainer>
    )
}

export default Routes;