import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { MAX_JUKEBOX_VINYLS } from '../constants';
import { useIsFocused } from '@react-navigation/native';
import globalStyles, { Colors } from '../styles/globalStyles';

interface Props {
  navigation: any;
}

export default function AddVinylJukeboxScreen({ navigation }: Props) {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [selectedVinylId, setSelectedVinylId] = useState<string | null>(null);
  const [isJukeboxFull, setIsJukeboxFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadVinyls();
    }
  }, [isFocused]);

  const loadVinyls = async () => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem('vinyls');
      const vinylsFromStorage: Vinyl[] = json ? JSON.parse(json) : [];
      setVinyls(vinylsFromStorage);

      const inJukeboxCount = vinylsFromStorage.filter(v => v.isInJukebox).length;
      setIsJukeboxFull(inJukeboxCount >= MAX_JUKEBOX_VINYLS);
    } catch (error) {
      console.error('Errore nel caricare i vinili:', error);
      Alert.alert('Errore', 'Si è verificato un errore nel caricare i vinili');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedVinylId(selectedVinylId === id ? null : id);
  };

  const saveSelection = async () => {
    if (selectedVinylId === null) {
      Alert.alert('Errore', 'Seleziona un vinile da aggiungere o rimuovere dal jukebox.');
      return;
    }

    const selectedVinyl = vinyls.find(v => v.id === selectedVinylId);
    if (!selectedVinyl) return;

    try {
      if (!selectedVinyl.isInJukebox && isJukeboxFull) {
        Alert.alert(
          'Jukebox pieno',
          'Il jukebox ha raggiunto il limite massimo di vinili. Vuoi procedere con lo scambio?',
          [
            { text: 'Annulla', style: 'cancel' },
            { 
              text: 'Scambia', 
              onPress: () => navigation.navigate('Swap Vinyls', { vinylToAdd: selectedVinyl })
            }
          ]
        );
        return;
      }

      const updatedVinyls = vinyls.map(v =>
        v.id === selectedVinylId ? { ...v, isInJukebox: !v.isInJukebox } : v
      );

      await AsyncStorage.setItem('vinyls', JSON.stringify(updatedVinyls));
      
      const action = selectedVinyl.isInJukebox ? 'rimosso dal' : 'aggiunto al';
      Alert.alert('Successo', `Vinile ${action} jukebox con successo.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Errore nel salvare:', error);
      Alert.alert('Errore', 'Si è verificato un errore nel salvare le modifiche');
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={globalStyles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Text style={globalStyles.title}>Seleziona un vinile per il jukebox</Text>
      <Text style={globalStyles.subtitle}>
        Vinili nel jukebox: {vinyls.filter(v => v.isInJukebox).length}/{MAX_JUKEBOX_VINYLS}
      </Text>

      <FlatList
        data={vinyls}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const selected = item.id === selectedVinylId;
          return (
            <TouchableOpacity
              style={[
                globalStyles.listItem, 
                selected && styles.vinylItemSelected
              ]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.vinylArtist}>{item.artist} ({item.year})</Text>
              </View>
              <View style={styles.statusBadgeContainer}>
                <Text
                  style={[
                    globalStyles.statusBadge,
                    item.isInJukebox ? globalStyles.inJukebox : globalStyles.notInJukebox,
                  ]}
                >
                  {item.isInJukebox ? 'In jukebox' : 'Non in jukebox'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={globalStyles.emptyText}>
            Nessun vinile salvato. Aggiungi prima dei vinili alla tua collezione.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {selectedVinylId && (
        <TouchableOpacity 
          style={globalStyles.primaryButton} 
          onPress={saveSelection} 
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonText}>
            {vinyls.find(v => v.id === selectedVinylId)?.isInJukebox
              ? 'Rimuovi dal jukebox'
              : 'Aggiungi al jukebox'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  vinylItemSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  statusBadgeContainer: {
    marginLeft: 10,
  },
});