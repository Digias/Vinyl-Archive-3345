import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Vinyl } from '../types';
import { MAX_JUKEBOX_VINYLS } from '../constants';
import globalStyles, { Typography } from '../styles/globalStyles';
import HeaderUserButton from '../components/HeaderUserButton';

type RootStackParamList = {
  Jukebox: undefined;
  'Add Vinyl to Jukebox': undefined;
  'Swap Vinyls': undefined;
  'Vinyl List': undefined;
  'Add New Vinyl': undefined;
  'Remove Vinyl': undefined;
  'Manage Vinyl': undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isJukeboxFull, setIsJukeboxFull] = useState(false);
  const [vinylStats, setVinylStats] = useState({ total: 0, inJukebox: 0 });

  useFocusEffect(
    React.useCallback(() => {
      checkJukeboxCapacity();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderUserButton navigation={navigation} />,
    });
  }, [navigation]);

  const checkJukeboxCapacity = async () => {
    try {
      const json = await AsyncStorage.getItem('vinyls');
      if (!json) {
        setIsJukeboxFull(false);
        setVinylStats({ total: 0, inJukebox: 0 });
        return;
      }
      
      const vinyls: Vinyl[] = JSON.parse(json);
      const inJukeboxCount = vinyls.filter(v => v.isInJukebox).length;
      
      setIsJukeboxFull(inJukeboxCount >= MAX_JUKEBOX_VINYLS);
      setVinylStats({ total: vinyls.length, inJukebox: inJukeboxCount });
    } catch (error) {
      console.error('Errore nel controllo jukebox:', error);
      setIsJukeboxFull(false);
      setVinylStats({ total: 0, inJukebox: 0 });
    }
  };

  const handleAddVinylToJukebox = () => {
    if (vinylStats.total === 0) {
      Alert.alert(
        'Nessun vinile',
        'Non hai ancora vinili nella tua collezione. Aggiungine alcuni prima di popolare il jukebox.',
        [
          { text: 'OK' },
          { text: 'Aggiungi vinile', onPress: () => navigation.navigate('Add New Vinyl') }
        ]
      );
      return;
    }

    if (isJukeboxFull) {
      Alert.alert(
        'Jukebox pieno',
        'Il jukebox è pieno, devi scambiare un vinile prima di aggiungerne un altro.',
        [
          { text: 'Annulla', style: 'cancel' },
          { text: 'Vai allo scambio', onPress: () => navigation.navigate('Swap Vinyls') },
        ]
      );
    } else {
      navigation.navigate('Add Vinyl to Jukebox');
    }
  };

  const buttons = [
    { 
      label: 'Il mio Jukebox', 
      onPress: () => navigation.navigate('Jukebox'),
      subtitle: `${vinylStats.inJukebox} vinili` 
    },
    { 
      label: 'Aggiungi Vinile a Jukebox', 
      onPress: handleAddVinylToJukebox,
      subtitle: isJukeboxFull ? 'Jukebox pieno' : 'Gestisci il tuo jukebox'
    },
    { 
      label: 'Scambia Vinili', 
      onPress: () => navigation.navigate('Swap Vinyls'),
      subtitle: 'Sostituisci vinili nel jukebox'
    },
    { 
      label: 'Tutti i miei Vinili', 
      onPress: () => navigation.navigate('Vinyl List'),
      subtitle: `${vinylStats.total} vinili totali`
    },
    { 
      label: 'Gestione Vinili', 
      onPress: () => navigation.navigate('Manage Vinyl'),
      subtitle: 'Aggiungi, rimuovi e backup'
    },
  ];

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.statsContainer}>
        <Text style={styles.appTitle}>🎵 Vinyl Jukebox</Text>
        <Text style={globalStyles.subtitle}>
          Collezione: {vinylStats.total} vinili | Jukebox: {vinylStats.inJukebox}/{MAX_JUKEBOX_VINYLS}
        </Text>
      </View>

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        {buttons.map(({ label, onPress, subtitle }) => (
          <TouchableOpacity
            key={label}
            style={globalStyles.card}
            onPress={onPress}
            activeOpacity={0.75}
          >
            <Text style={styles.mainButtonText}>{label}</Text>
            {subtitle && <Text style={globalStyles.buttonSubtitle}>{subtitle}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    ...Typography.title,
    marginBottom: 10,
  },
  mainButtonText: {
    ...Typography.cardTitle,
    textAlign: 'center',
  },
});