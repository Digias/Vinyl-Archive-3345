import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Vinyl } from '../types';

// Directory per le immagini
const IMAGE_DIR = FileSystem.documentDirectory + 'vinyls/';

/**
 * Assicura che la directory per le immagini esista. Se non esiste, la crea.
 * Questa funzione viene chiamata prima di qualsiasi operazione di salvataggio di file.
 */
export const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
};

/**
 * Apre la galleria di immagini del dispositivo per permettere all'utente di selezionare un'immagine.
 * Richiede i permessi per l'accesso alla galleria.
 * @returns {Promise<string | null>} L'URI dell'immagine selezionata o null se l'operazione viene annullata.
 */
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

/**
 * Avvia la fotocamera del dispositivo per permettere all'utente di scattare una foto.
 * Richiede i permessi per l'accesso alla fotocamera.
 * @returns {Promise<string | null>} L'URI della foto scattata o null se l'operazione viene annullata.
 */
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

/**
 * Salva un'immagine selezionata o scattata nella directory permanente dell'applicazione.
 * @param {string} uri L'URI temporaneo dell'immagine da salvare.
 * @param {string} vinylId L'ID del vinile a cui associare l'immagine, usato per creare un nome file univoco.
 * @returns {Promise<string>} L'URI locale permanente dell'immagine salvata.
 */
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

/**
 * Elimina il file di un'immagine associata a un vinile dal file system.
 * @param {string} imageUri L'URI dell'immagine da eliminare.
 */
export const deleteImage = async (imageUri: string) => {
  try {
    await FileSystem.deleteAsync(imageUri);
  } catch (error) {
    console.error("Errore eliminazione immagine:", error);
  }
};

/**
 * Fornisce un'immagine di fallback se un vinile non ha una copertina associata.
 * @param {Vinyl} vinyl L'oggetto vinile da controllare.
 * @returns Un oggetto sorgente immagine per il componente Image di React Native.
 * Contiene l'URI se l'immagine esiste, altrimenti un'immagine placeholder locale.
 */
export const getImageFallback = (vinyl: Vinyl) => {
  return vinyl.imageUri ? { uri: vinyl.imageUri } : require('../assets/vinyl_placeholder.png');
};