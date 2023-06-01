import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import WaitressScreen from './components/WaitressScreen';
import AdminScreen from './components/AdminScreen';
import ClientScreen from './components/ClientScreen';
import CookerScreen from './components/CookerScreen';
import CashierScreen from './components/CashierScreen';
import CleanerScreen from './components/CleanerScreen';
import OrderScreen from './components/OrderScreen';
import FinishedScreen from './components/FinishedScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Waitress" component={WaitressScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Client" component={ClientScreen} />
        <Stack.Screen name="Cooker" component={CookerScreen} />
        <Stack.Screen name="Cashier" component={CashierScreen} />
        <Stack.Screen name="Cleaner" component={CleanerScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="Finished" component={FinishedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;