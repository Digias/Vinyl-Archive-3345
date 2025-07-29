import React, { useState, useCallback } from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { exportBackupToFile, importBackupFromFile } from '../utils/LocalBackup';
import globalStyles, { Colors, Typography } from '../styles/globalStyles';
import { isUserAuthenticated } from '../utils/authUtils';

type RootStackParamList = {
  'Add New Vinyl': undefined;
  'Edit Remove Vinyl': undefined;
  'Login': undefined;
  'Register': undefined;
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function ManageVinylScreen({ navigation }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(isUserAuthenticated());
  
  // useFocusEffect si attiva ogni volta che la schermata viene visualizzata
  useFocusEffect(
    useCallback(() => {
      // Controlla lo stato di autenticazione corrente e aggiorna l'UI
      setIsAuthenticated(isUserAuthenticated());
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false); // Aggiorna lo stato immediatamente
      Alert.alert('Logout effettuato', 'Sei stato disconnesso con successo.');
    } catch (error) {
      console.error("Errore durante il logout: ", error);
      Alert.alert("Errore", "Non è stato possibile effettuare il logout. Riprova.");
    }
  };

  const buttons = [
    { 
      label: 'Aggiungi Nuovo Vinile', 
      onPress: () => navigation.navigate('Add New Vinyl'),
      subtitle: 'Espandi la tua collezione'
    },
    { 
      label: 'Modifica o Elimina Vinile', 
      onPress: () => navigation.navigate('Edit Remove Vinyl'),
      subtitle: 'Modifica oppure elimina vinili dalla collezione'
    },
    { 
      label: 'Effettua Backup', 
      onPress: exportBackupToFile,
      subtitle: 'Salva una copia dei tuoi dati',
      color: Colors.success
    },
    { 
      label: 'Ripristina Backup', 
      onPress: importBackupFromFile,
      subtitle: 'Carica dati da un backup',
      color: Colors.danger
    },
  ];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Text style={globalStyles.title}>Gestione Vinili</Text>
      
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        {buttons.map(({ label, onPress, subtitle, color }) => (
          <TouchableOpacity
            key={label}
            style={[globalStyles.card, { backgroundColor: color || Colors.cardBackground }]}
            onPress={onPress}
            activeOpacity={0.75}
          >
            <Text style={styles.buttonText}>{label}</Text>
            {subtitle && <Text style={globalStyles.buttonSubtitle}>{subtitle}</Text>}
          </TouchableOpacity>
        ))}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    ...Typography.cardTitle,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
});
