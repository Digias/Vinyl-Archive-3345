import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';
import globalStyles, { Colors, Typography, PlatformSpecificStyles } from '../styles/globalStyles';

enum Step {
  SelectAddVinyl,
  SelectRemoveVinyl,
  Done,
}

type RootStackParamList = {
  Jukebox: undefined;
};

export default function SwapVinylsScreen() {
  const androidPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 0;
  const [step, setStep] = useState<Step>(Step.SelectAddVinyl);
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [vinylsInJukebox, setVinylsInJukebox] = useState<Vinyl[]>([]);
  const [selectedAddVinyl, setSelectedAddVinyl] = useState<Vinyl | null>(null);
  const [selectedRemoveVinyl, setSelectedRemoveVinyl] = useState<Vinyl | null>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const containerStyle = [ 
    globalStyles.container, 
    PlatformSpecificStyles.containerWithNavigationBar,
    { paddingBottom: androidPadding }
  ];

  useEffect(() => {
    const loadVinyls = async () => {
      const json = await AsyncStorage.getItem('vinyls');
      if (json) {
        const allVinyls: Vinyl[] = JSON.parse(json);
        setVinyls(allVinyls.filter(v => !v.isInJukebox));
        setVinylsInJukebox(allVinyls.filter(v => v.isInJukebox));
      }
    };

    if (isFocused) loadVinyls();
  }, [isFocused]);

  const doSwap = async () => {
    if (!selectedAddVinyl || !selectedRemoveVinyl) return;

    const json = await AsyncStorage.getItem('vinyls');
    if (!json) return;

    const allVinyls: Vinyl[] = JSON.parse(json);

    // Usa l'ID per trovare i vinili invece di titolo/artista
    const indexAdd = allVinyls.findIndex(v => v.id === selectedAddVinyl.id);
    const indexRemove = allVinyls.findIndex(v => v.id === selectedRemoveVinyl.id);

    if (indexAdd === -1 || indexRemove === -1) return;

    allVinyls[indexAdd].isInJukebox = true;
    allVinyls[indexRemove].isInJukebox = false;

    await AsyncStorage.setItem('vinyls', JSON.stringify(allVinyls));
    setStep(Step.Done);
  };

  if (step === Step.Done) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={containerStyle}>
          <Text style={globalStyles.title}>Scambio completato! 🎉</Text>

          <Pressable
            style={({ pressed }) => [
              globalStyles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setSelectedAddVinyl(null);
              setSelectedRemoveVinyl(null);
              setStep(Step.SelectAddVinyl);
            }}
          >
            <Text style={globalStyles.buttonText}>Fai un altro scambio</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('Jukebox')}
          >
            <Text style={globalStyles.buttonText}>Mostra Jukebox</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={containerStyle}>
        {step === Step.SelectAddVinyl && (
          <>
            <Text style={styles.title}>Seleziona un vinile da aggiungere al Jukebox</Text>
            <FlatList
              data={vinyls}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.vinylItem,
                    selectedAddVinyl?.id === item.id
                      ? styles.selectedItem
                      : null,
                  ]}
                  onPress={() => setSelectedAddVinyl(item)}
                >
                  {/* Mostra artista, anno e brani invece del titolo */}
                  <Text style={styles.vinylText}>{item.artist} ({item.year})</Text>
                  <Text style={styles.songText}>Lato A: {item.sideA.title}</Text>
                  <Text style={styles.songText}>Lato B: {item.sideB.title}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable
              style={({ pressed }) => [
                globalStyles.primaryButton,
                (!selectedAddVinyl || pressed) && styles.buttonDisabled,
              ]}
              onPress={() => selectedAddVinyl && setStep(Step.SelectRemoveVinyl)}
              disabled={!selectedAddVinyl}
            >
              <Text style={globalStyles.buttonText}>Avanti</Text>
            </Pressable>
          </>
        )}

        {step === Step.SelectRemoveVinyl && (
          <>
            <Text style={styles.title}>Seleziona un vinile da togliere dal Jukebox</Text>
            <FlatList
              data={vinylsInJukebox}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.vinylItem,
                    selectedRemoveVinyl?.id === item.id  // Usa ID per la selezione
                      ? styles.selectedItem
                      : null,
                  ]}
                  onPress={() => setSelectedRemoveVinyl(item)}
                >
                  {/* Mostra artista, anno e brani invece del titolo */}
                  <Text style={styles.vinylText}>{item.artist} ({item.year})</Text>
                  <Text style={styles.songText}>Lato A: {item.sideA.title}</Text>
                  <Text style={styles.songText}>Lato B: {item.sideB.title}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable
              style={({ pressed }) => [
                globalStyles.primaryButton,
                (!selectedRemoveVinyl || pressed) && styles.buttonDisabled,
              ]}
              onPress={doSwap}
              disabled={!selectedRemoveVinyl}
            >
              <Text style={globalStyles.buttonText}>Esegui scambio</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setStep(Step.SelectAddVinyl)}
            >
              <Text style={globalStyles.buttonText}>Indietro</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.cardTitle,
    marginBottom: 15,
  },
  vinylItem: {
    padding: 14,
    backgroundColor: Colors.cardBackground,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  vinylText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  songText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  selectedItem: {
    backgroundColor: Colors.primary,
  },
  button: {
    ...globalStyles.primaryButton,
    backgroundColor: Colors.cardBackground,
    marginVertical: 8,
  },
  secondaryButton: {
    backgroundColor: Colors.cardBackground,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
});