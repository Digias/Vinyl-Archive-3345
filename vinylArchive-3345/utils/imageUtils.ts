import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Vinyl } from '../types';

// Directory per le immagini
const IMAGE_DIR = FileSystem.documentDirectory + 'vinyls/';

// Crea la directory se non esiste
export const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
};

// Seleziona immagine dalla galleria
export const pickImage = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permesso negato', 'Permesso alla galleria non concesso');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  return result.canceled ? null : result.assets[0].uri;
};

// Scatta foto con la fotocamera
export const takePhoto = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permesso negato', 'Permesso alla fotocamera non concesso');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  return result.canceled ? null : result.assets[0].uri;
};

// Salva l'immagine e restituisce l'URI locale
export const saveImage = async (uri: string, vinylId: string): Promise<string> => {
  await ensureDirExists();
  const filename = `${vinylId}.jpg`;
  const destUri = IMAGE_DIR + filename;
  
  await FileSystem.copyAsync({
    from: uri,
    to: destUri,
  });
  
  return destUri;
};

// Elimina l'immagine associata a un vinile
export const deleteImage = async (imageUri: string) => {
  try {
    await FileSystem.deleteAsync(imageUri);
  } catch (error) {
    console.error("Errore eliminazione immagine:", error);
  }
};

// Fallback per immagini mancanti
export const getImageFallback = (vinyl: Vinyl) => {
  return vinyl.imageUri ? { uri: vinyl.imageUri } : require('../assets/vinyl_placeholder.png');
};