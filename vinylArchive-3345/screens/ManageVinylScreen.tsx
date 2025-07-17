import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { exportBackupToFile, importBackupFromFile } from '../utils/LocalBackup';
import globalStyles, { Colors, Typography } from '../styles/globalStyles';

type RootStackParamList = {
  'Add New Vinyl': undefined;
  'Edit Remove Vinyl': undefined;
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function ManageVinylScreen({ navigation }: Props) {
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
