import React, { useEffect } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import HeaderUserButton from '../components/HeaderUserButton';
import { exportBackupToFile, importBackupFromFile } from '../utils/LocalBackup';
import globalStyles, { Colors, Typography } from '../styles/globalStyles';
import { canPerformBackup } from '../utils/authUtils';

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
  
  const handleBackupAction = (action: () => void) => {
    if (!canPerformBackup()) {
      Alert.alert(
        'Funzione riservata',
        'Devi essere autenticato per effettuare il backup e ripristino',
        [
          { 
            text: 'Registrati', 
            onPress: () => navigation.navigate('Register') 
          },
          { 
            text: 'Accedi', 
            onPress: () => navigation.navigate('Login') 
          },
          { 
            text: 'Annulla', 
            style: 'cancel'
          }
        ]
      );
      return;
    }
    action();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderUserButton navigation={navigation} />,
    });
  }, [navigation]);

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
      onPress: () => handleBackupAction(exportBackupToFile),
      subtitle: 'Salva una copia dei tuoi dati',
      color: Colors.cardBackground
    },
    { 
      label: 'Ripristina Backup', 
      onPress: () => handleBackupAction(importBackupFromFile),
      subtitle: 'Carica dati da un backup',
      color: Colors.cardBackground
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