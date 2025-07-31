import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import globalStyles, { Colors, PlatformSpecificStyles } from '../styles/globalStyles';
import { takePhoto, pickImage, saveImage, deleteImage } from '../utils/imageUtils';

interface Props {
  navigation: any;
  route: any;
}

export default function EditVinylScreen({ navigation, route }: Props) {
  const androidPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 0;
  const { vinyl } = route.params;
  const [artist, setArtist] = useState(vinyl.artist || '');
  const [year, setYear] = useState(vinyl.year?.toString() || '');
  const [sideATitle, setSideATitle] = useState(vinyl.sideA.title || '');
  const [sideBTitle, setSideBTitle] = useState(vinyl.sideB.title || '');
  const [imageUri, setImageUri] = useState<string | null>(vinyl.imageUri || null);
  const containerStyle = [
    globalStyles.container,
    PlatformSpecificStyles.containerWithNavigationBar,
    { paddingBottom: androidPadding }
  ];

  useEffect(() => {
    navigation.setOptions({
      title: 'Modifica vinile',
    });
  }, []);

  const updateVinyl = async () => {
    if (!artist.trim() || !sideATitle.trim() || !sideBTitle.trim()) {
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }

    if (year.trim()) {
      const yearNum = parseInt(year.trim(), 10);
      const currentYear = new Date().getFullYear();

      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        Alert.alert(
          'Errore',
          `L'anno deve essere compreso tra 1900 e ${currentYear}`
        );
        return;
      }
    }

    try {
      const updatedVinyl: Vinyl = {
        ...vinyl,
        artist: artist.trim(),
        year: year.trim() ? year.trim() : null,
        sideA: { title: sideATitle.trim() },
        sideB: { title: sideBTitle.trim() },
      };

      // Gestione immagine
      if (imageUri && imageUri !== vinyl.imageUri) {
        // Elimina vecchia immagine
        if (vinyl.imageUri) await deleteImage(vinyl.imageUri);
        // Salva nuova immagine
        updatedVinyl.imageUri = await saveImage(imageUri, vinyl.id);
      } else if (!imageUri && vinyl.imageUri) {
        // Elimina immagine esistente
        await deleteImage(vinyl.imageUri);
        updatedVinyl.imageUri = undefined;
      }

      const json = await AsyncStorage.getItem('vinyls')
      const vinyls: Vinyl[] = json ? JSON.parse(json) : [];

      // Update the vinyl in the array
      const updatedVinyls = vinyls.map(v =>
        v.id === vinyl.id ? updatedVinyl : v
      );

      await AsyncStorage.setItem('vinyls', JSON.stringify(updatedVinyls));

      Alert.alert('Successo', 'Vinile modificato con successo', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Errore nella modifica del vinile:', error);
      Alert.alert('Errore', 'Si è verificato un errore nella modifica del vinile');
    }
  };

  const removeImage = () => {
    Alert.alert(
      "Rimuovi immagine",
      "Sei sicuro di voler rimuovere l'immagine?",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Rimuovi",
          onPress: () => {
            setImageUri(null);
            // Feedback aggiuntivo (opzionale)
            Alert.alert('Immagine rimossa', "L'immagine è stata rimossa con successo", [
              { text: 'OK' }
            ]);
          }
        }
      ]
    );
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setImageUri(uri);
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImageUri(uri);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={containerStyle}>
        <KeyboardAwareScrollView>
          {/* Sezione immagine - Modificata per mostrare correttamente il placeholder */}
          <View style={globalStyles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={globalStyles.image} />
            ) : (
              <View style={globalStyles.imagePlaceholder}>
                <Text style={globalStyles.imageText}>Nessuna immagine</Text>
              </View>
            )}

            <View style={globalStyles.imageButtonsContainer}>
              {/* Mostra pulsanti di aggiunta SOLO quando non c'è immagine */}
              {!imageUri ? (
                <>
                  <TouchableOpacity
                    style={[globalStyles.imageButton, { backgroundColor: Colors.primary }]}
                    onPress={handleTakePhoto}>
                    <Text style={globalStyles.imageButtonText}>Scatta foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.imageButton, { backgroundColor: Colors.primary }]}
                    onPress={handlePickImage}>
                    <Text style={globalStyles.imageButtonText}>Scegli foto</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // Mostra pulsante rimuovi quando c'è un'immagine
                <TouchableOpacity
                  style={[globalStyles.imageButton, { backgroundColor: Colors.danger }]}
                  onPress={removeImage}>
                  <Text style={globalStyles.imageButtonText}>Rimuovi</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TextInput
            placeholder="Artista"
            value={artist}
            onChangeText={setArtist}
            style={globalStyles.input}
            placeholderTextColor={Colors.textTertiary}
            autoCapitalize="words"
          />
          <TextInput
            placeholder="Anno (es. 1970)"
            value={year}
            onChangeText={setYear}
            style={globalStyles.input}
            keyboardType="numeric"
            placeholderTextColor={Colors.textTertiary}
            maxLength={4}
          />

          <Text style={globalStyles.sectionTitle}>Lato A</Text>
          <TextInput
            placeholder="Titolo canzone"
            value={sideATitle}
            onChangeText={setSideATitle}
            style={globalStyles.input}
            placeholderTextColor={Colors.textTertiary}
            autoCapitalize="words"
          />

          <Text style={globalStyles.sectionTitle}>Lato B</Text>
          <TextInput
            placeholder="Titolo canzone"
            value={sideBTitle}
            onChangeText={setSideBTitle}
            style={globalStyles.input}
            placeholderTextColor={Colors.textTertiary}
            autoCapitalize="words"
          />

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={updateVinyl}
            activeOpacity={0.85}
          >
            <Text style={globalStyles.buttonText}>Aggiorna vinile</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}