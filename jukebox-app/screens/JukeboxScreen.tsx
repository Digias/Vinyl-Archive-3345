import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,
  Platform,
  Image,
  StyleSheet, // Aggiunto per gli stili locali
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { useIsFocused } from '@react-navigation/native';
import globalStyles, { Colors } from '../styles/globalStyles';
import { getImageFallback } from '../utils/imageUtils'; // Import aggiuntivo

export default function JukeboxScreen() {
  const [jukeboxVinyls, setJukeboxVinyls] = useState<Vinyl[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadJukeboxVinyls = async () => {
      try {
        const json = await AsyncStorage.getItem('vinyls');
        if (json) {
          const allVinyls: Vinyl[] = JSON.parse(json);
          const jukeboxOnly = allVinyls.filter(v => v.isInJukebox);
          setJukeboxVinyls(jukeboxOnly);
        }
      } catch (error) {
        console.error('Error loading jukebox vinyls:', error);
        Alert.alert('Errore', 'Impossibile caricare i vinili del jukebox');
      }
    };
    
    if (isFocused) {
      loadJukeboxVinyls();
    }
  }, [isFocused]);

  const removeFromJukebox = async (vinyl: Vinyl) => {
    Alert.alert(
      'Conferma rimozione',
      `Sei sicuro di voler rimuovere "${vinyl.artist} - ${vinyl.sideA.title}" dal jukebox?`,
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Rimuovi',
          style: 'destructive',
          onPress: async () => {
            try {
              const json = await AsyncStorage.getItem('vinyls');
              if (!json) return;

              const allVinyls: Vinyl[] = JSON.parse(json);
              const updatedVinyls = allVinyls.map(v => 
                v.id === vinyl.id ? { ...v, isInJukebox: false } : v
              );

              await AsyncStorage.setItem('vinyls', JSON.stringify(updatedVinyls));
              
              setJukeboxVinyls(prev => prev.filter(v => v.id !== vinyl.id));
              
              Alert.alert('Vinile rimosso', `"${vinyl.artist}" è stato rimosso dal jukebox.`);
            } catch (error) {
              console.error('Error removing vinyl from jukebox:', error);
              Alert.alert('Errore', 'Impossibile rimuovere il vinile dal jukebox');
            }
          }
        }
      ]
    );
  };

  const filteredVinyls = jukeboxVinyls.filter(v =>
    v.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sideA.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sideB.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>🎵 Jukebox</Text>

        <TextInput
          style={globalStyles.searchInput}
          placeholder="Cerca per titolo o artista..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredVinyls.length === 0 ? (
          <Text style={globalStyles.emptyText}>
            {searchQuery ? 'Nessun risultato trovato.' : 'Il jukebox è vuoto.'}
          </Text>
        ) : (
          <FlatList
            data={filteredVinyls}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 100 }} 
            renderItem={({ item }) => (
              <View style={styles.vinylItem}>
                {/* Colonna immagine */}
                <View style={styles.imageColumn}>
                  <Image
                    source={getImageFallback(item)}
                    style={styles.vinylImage}
                  />
                </View>

                {/* Colonna informazioni */}
                <View style={styles.infoColumn}>
                  <Text style={globalStyles.vinylArtist}>
                    {item.artist} ({item.year})
                  </Text>
                  <Text style={globalStyles.vinylSide}>Lato A: {item.sideA.title}</Text>
                  <Text style={globalStyles.vinylSide}>Lato B: {item.sideB.title}</Text>
                </View>

                {/* Pulsante di rimozione */}
                <TouchableOpacity
                  onPress={() => removeFromJukebox(item)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Stili locali per il layout migliorato
const styles = StyleSheet.create({
  vinylItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignItems: 'center',
  },
  imageColumn: {
    width: 120,
    height: 120,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinylImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  infoColumn: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 18,
    color: 'white',
  },
});