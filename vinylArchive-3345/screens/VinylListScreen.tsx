import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { useIsFocused } from '@react-navigation/native';
import globalStyles, { Colors } from '../styles/globalStyles';
import { getImageFallback } from '../utils/imageUtils';

export default function VinylListScreen() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadVinyls = async () => {
      const json = await AsyncStorage.getItem('vinyls');
      if (json) {
        const savedVinyls: Vinyl[] = JSON.parse(json);
        setVinyls(savedVinyls);
      }
    };

    if (isFocused) {
      loadVinyls();
    }
  }, [isFocused]);

  const filteredVinyls = vinyls.filter(v =>
    v.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sideA.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sideB.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>

        <TextInput
          style={globalStyles.searchInput}
          placeholder="Cerca per titolo o artista..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredVinyls.length === 0 ? (
          <Text style={globalStyles.emptyText}>Nessun risultato trovato.</Text>
        ) : (
          <FlatList
            data={filteredVinyls}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (                
              <View style={styles.vinylItem}>
                <View style={styles.imageColumn}>
                  <Image
                    source={getImageFallback(item)}
                    style={styles.vinylImage}
                  />
                </View>
                <View style={styles.infoColumn}>
                  <Text style={globalStyles.vinylArtist}>{item.artist} ({item.year})</Text>
                  <Text style={globalStyles.vinylSide}>Lato A: {item.sideA.title}</Text>
                  <Text style={globalStyles.vinylSide}>Lato B: {item.sideB.title}</Text>
                  {item.isInJukebox && (
                    <Text style={globalStyles.jukeboxBadge}>🎵 In Jukebox</Text>
                  )}
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
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    justifyContent: "center",
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
    marginTop: 45,
  },
  infoColumn: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
});