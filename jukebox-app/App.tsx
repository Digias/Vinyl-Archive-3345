import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

import HomeScreen from './screens/HomeScreen';
import JukeboxScreen from './screens/JukeboxScreen';
import VinylListScreen from './screens/VinylListScreen';
import SwapVinylsScreen from './screens/SwapVinylsScreen';
import AddVinylJukeboxScreen from './screens/AddVinylJukeboxScreen';
import AddNewVinylScreen from './screens/AddNewVinylScreen';
import EditRemoveVinylScreen from './screens/EditRemoveVinylScreen';
import ManageVinylScreen from './screens/ManageVinylScreen';
import EditVinylScreen from './screens/EditVinylScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    async function checkUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert('Aggiornamento disponibile', 'Scaricamento aggiornamento...');
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error(e);
      }
    }
    checkUpdate();
  }, []);
  
  // Imposta il colore della navigation bar su Android
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#121212');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          style="light"
          backgroundColor="#121212"
          translucent={false}
        />
        <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#e0e0e0',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          // Aggiunge padding appropriato per Android
          contentStyle: {
            backgroundColor: '#121212',
          },
          // Disabilita il comportamento translucent su Android
          ...(Platform.OS === 'android' && {
            headerStatusBarHeight: 0,
          }),
        }}
      >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Stack.Screen name="Jukebox" component={JukeboxScreen} />
          <Stack.Screen name="Vinyl List" component={VinylListScreen} />
          <Stack.Screen name="Swap Vinyls" component={SwapVinylsScreen} />
          <Stack.Screen name="Add Vinyl to Jukebox" component={AddVinylJukeboxScreen} />
          <Stack.Screen name="Add New Vinyl" component={AddNewVinylScreen} />
          <Stack.Screen name="Edit Remove Vinyl" component={EditRemoveVinylScreen} />
          <Stack.Screen name="Edit Vinyl" component={EditVinylScreen} />
          <Stack.Screen name="Manage Vinyl" component={ManageVinylScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}