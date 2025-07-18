import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import globalStyles, { Colors } from '../styles/globalStyles';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  'Edit Vinyl': { vinyl: Vinyl };
};

export default function RemoveVinylScreen() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // 2. Calcolo padding per Android
  const androidPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 0;

  useEffect(() => {
    if (isFocused) {
      loadVinyls();
    }
  }, [isFocused]);

  const loadVinyls = async () => {
    try {
      const json = await AsyncStorage.getItem('vinyls');
      if (json) {
        setVinyls(JSON.parse(json));
      }
    } catch (error) {
      console.error('Error loading vinyls:', error);
      Alert.alert('Errore', 'Impossibile caricare i vinili');
    }
  };

  const deleteVinyl = async (vinyl: Vinyl) => {
    Alert.alert(
      'Conferma eliminazione',
      `Vuoi davvero eliminare ${vinyl.artist}?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = vinyls.filter(v => v.id !== vinyl.id);
              setVinyls(updated);
              await AsyncStorage.setItem('vinyls', JSON.stringify(updated));
              Alert.alert('Successo', 'Vinile eliminato con successo');
            } catch (error) {
              console.error('Error deleting vinyl:', error);
              Alert.alert('Errore', 'Impossibile eliminare il vinile');
            }
          },
        },
      ]
    );
  };

  const filteredVinyls = vinyls.filter(v =>
    v.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sideA.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sideB.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* 3. Applica il padding personalizzato */}
      <View style={[globalStyles.container, { paddingBottom: androidPadding }]}>

        <TextInput
          style={globalStyles.searchInput}
          placeholder="Cerca per titolo o artista..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredVinyls.length === 0 ? (
          <Text style={globalStyles.emptyText}>
            {searchQuery ? 'Nessun risultato trovato.' : 'Nessun vinile salvato.'}
          </Text>
        ) : (
          <FlatList
            data={filteredVinyls}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.vinylItem}>
                <View style={globalStyles.vinylInfo}>
                  <Text style={globalStyles.vinylArtist}>{item.artist} ({item.year})</Text>
                  <Text style={globalStyles.vinylSide}>Lato A: {item.sideA.title}</Text>
                  <Text style={globalStyles.vinylSide}>Lato B: {item.sideB.title}</Text>
                  {item.isInJukebox && (
                    <Text style={globalStyles.jukeboxBadge}>🎵 In Jukebox</Text>
                  )}
                </View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Edit Vinyl', { vinyl: item })}
                    style={styles.editButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.editText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteVinyl(item)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  vinylItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  editButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  editText: {
    fontSize: 18,
    color: 'white',
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