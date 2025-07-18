import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { ActivityIndicator, View } from 'react-native';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import JukeboxScreen from './screens/JukeboxScreen';
import VinylListScreen from './screens/VinylListScreen';
import SwapVinylsScreen from './screens/SwapVinylsScreen';
import AddVinylJukeboxScreen from './screens/AddVinylJukeboxScreen';
import AddNewVinylScreen from './screens/AddNewVinylScreen';
import EditRemoveVinylScreen from './screens/EditRemoveVinylScreen';
import ManageVinylScreen from './screens/ManageVinylScreen';
import EditVinylScreen from './screens/EditVinylScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { Colors } from './styles/globalStyles';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Controlla aggiornamenti
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeApp();
    
    // Imposta il colore della navigation bar su Android
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.background);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.background 
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          style="light"
          backgroundColor={Colors.background}
          translucent={false}
        />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerTitleAlign: 'center',
            contentStyle: {
              backgroundColor: Colors.background,
            },
            ...(Platform.OS === 'android' && {
              headerStatusBarHeight: 0,
            }),
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Stack.Screen name="Jukebox" component={JukeboxScreen} />
          <Stack.Screen name="Vinyl List" component={VinylListScreen} />
          <Stack.Screen name="Swap Vinyls" component={SwapVinylsScreen} />
          <Stack.Screen 
            name="Add Vinyl to Jukebox" 
            component={AddVinylJukeboxScreen} 
          />
          <Stack.Screen name="Add New Vinyl" component={AddNewVinylScreen} />
          <Stack.Screen 
            name="Edit Remove Vinyl" 
            component={EditRemoveVinylScreen} 
            options={{ title: 'Modifica o Elimina Vinile' }}
          />
          <Stack.Screen name="Edit Vinyl" component={EditVinylScreen} />
          <Stack.Screen 
            name="Manage Vinyl" 
            component={ManageVinylScreen} 
            options={{ title: 'Gestione Vinili' }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Accedi' }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Registrati' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}