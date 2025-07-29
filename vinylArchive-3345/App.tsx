import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { ActivityIndicator, View } from 'react-native';
import * as Updates from 'expo-updates';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseConfig';
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (isLoading) setIsLoading(false);
    });

    async function checkUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error('Errore aggiornamento OTA:', e);
      }
    }

    const androidSetup = async () => {
      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync(Colors.background);
        await NavigationBar.setButtonStyleAsync('light');
      }
    };

    checkUpdates();
    androidSetup();

    return () => {
      authUnsubscribe();
    };
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

  // Route iniziale: Home per tutti
  const initialRoute = 'Home';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          style="light"
          backgroundColor={Colors.background}
          translucent={false}
        />
        <Stack.Navigator
          initialRouteName={initialRoute}
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
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: '' }} 
          />
          <Stack.Screen 
            name="Jukebox" 
            component={JukeboxScreen} 
            options={{ title: '🎵 Jukebox' }}
          />
          <Stack.Screen 
            name="Vinyl List" 
            component={VinylListScreen} 
            options={{ title: 'Tutti i miei vinili' }}
          />
          <Stack.Screen 
            name="Swap Vinyls" 
            component={SwapVinylsScreen} 
            options={{ title: 'Scambia Vinili' }}
          />
          <Stack.Screen 
            name="Add Vinyl to Jukebox" 
            component={AddVinylJukeboxScreen} 
            options={{ title: 'Aggiungi al tuo Jukebox' }}
          />
          <Stack.Screen 
            name="Add New Vinyl" 
            component={AddNewVinylScreen} 
            options={{ title: 'Aggiungi Nuovo Vinile' }}
          />
          <Stack.Screen 
            name="Edit Remove Vinyl" 
            component={EditRemoveVinylScreen} 
            options={{ title: '✏️ Modifica o Elimina Vinile' }}
          />
          <Stack.Screen 
            name="Edit Vinyl" 
            component={EditVinylScreen}
            options={{ title: '✏️ Modifica Vinili' }}
          />
          <Stack.Screen 
            name="Manage Vinyl" 
            component={ManageVinylScreen} 
            options={{ title: '' }}
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
