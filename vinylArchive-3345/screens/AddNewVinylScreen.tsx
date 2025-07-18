import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vinyl } from '../types';
import { takePhoto, pickImage, saveImage } from '../utils/imageUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import uuid from 'react-native-uuid';
import globalStyles, { Colors } from '../styles/globalStyles';
import { canSaveMoreVinyls } from '../utils/authUtils';

interface Props {
  navigation: any;
}

export default function AddNewVinylScreen({ navigation }: Props) {
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [sideATitle, setSideATitle] = useState('');
  const [sideBTitle, setSideBTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const saveVinyl = async () => {
    // Controlla se l'utente può aggiungere altri vinili
    const canSaveMore = await canSaveMoreVinyls();
    if (!canSaveMore) {
      Alert.alert(
        'Limite raggiunto',
        'Hai raggiunto il limite massimo di 30 vinili senza account',
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

    if (
      !artist.trim() ||
      !sideATitle.trim() ||
      !sideBTitle.trim()
    ) {
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }

    if (year.trim()) {
      const yearNum = parseInt(year.trim(), 10);
      const currentYear = new Date().getFullYear();

      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        Alert.alert('Errore', `L'anno deve essere compreso tra 1900 e ${currentYear}`);
        return;
      }
    }

    try {
      const newVinyl: Vinyl = {
        id: uuid.v4().toString(),
        artist: artist.trim(),
        year: year.trim() ? year.trim() : null,
        sideA: { title: sideATitle.trim() },
        sideB: { title: sideBTitle.trim() },
        isInJukebox: false,
      };

      if (imageUri) {
        newVinyl.imageUri = await saveImage(imageUri, newVinyl.id);
      }

      const json = await AsyncStorage.getItem('vinyls');
      const vinyls: Vinyl[] = json ? JSON.parse(json) : [];

      const isDuplicate = vinyls.some(v => 
        v.artist.toLowerCase() === newVinyl.artist.toLowerCase() &&
        v.sideA.title.toLowerCase() === newVinyl.sideA.title.toLowerCase() &&
        v.sideB.title.toLowerCase() === newVinyl.sideB.title.toLowerCase() &&
        v.year === newVinyl.year
      );

      if (isDuplicate) {
        Alert.alert('Errore', 'Questo vinile esiste già nella tua collezione');
        return;
      }

      vinyls.push(newVinyl);
      await AsyncStorage.setItem('vinyls', JSON.stringify(vinyls));

      Alert.alert('Successo', 'Vinile aggiunto con successo', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Errore nel salvare il vinile:', error);
      Alert.alert('Errore', 'Si è verificato un errore nel salvare il vinile');
    }
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
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Sezione immagine */}
        <View style={globalStyles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={globalStyles.image} />
          ) : (
            <View style={globalStyles.imagePlaceholder}>
              <Text style={globalStyles.imageText}>Nessuna immagine</Text>
            </View>
          )}
          <View style={globalStyles.imageButtonsContainer}>
            <TouchableOpacity
              style={globalStyles.imageButton}
              onPress={handleTakePhoto}>
              <Text style={globalStyles.imageButtonText}>Scatta foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.imageButton}
              onPress={handlePickImage}>
              <Text style={globalStyles.imageButtonText}>Scegli dalla galleria</Text>
            </TouchableOpacity>
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
          onPress={saveVinyl}
          activeOpacity={0.85}
        >
          <Text style={globalStyles.buttonText}>Salva vinile</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}