import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Vinyl } from '../types';
import JSZip from 'jszip';
import uuid from 'react-native-uuid';

export async function exportBackupToFile() {
  try {
    const json = await AsyncStorage.getItem('vinyls');
    const vinyls: Vinyl[] = json ? JSON.parse(json) : [];

    // Crea directory temporanea
    const backupDir = FileSystem.cacheDirectory + 'vinyl_backup_' + Date.now() + '/';
    await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });

    // Crea sottodirectory per le immagini
    const imagesDir = backupDir + 'images/';
    await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

    // Processa ogni vinile
    const processedVinyls = [];
    for (const vinyl of vinyls) {
      let imageFilename = null;

      if (vinyl.imageUri) {
        try {
          // Genera nome file univoco
          const extension = vinyl.imageUri.split('.').pop() || 'jpg';
          imageFilename = `${uuid.v4()}.${extension}`;
          const destPath = imagesDir + imageFilename;

          // Copia l'immagine
          await FileSystem.copyAsync({
            from: vinyl.imageUri,
            to: destPath,
          });
        } catch (error) {
          console.warn("Errore copia immagine:", vinyl.imageUri, error);
        }
      }

      processedVinyls.push({
        ...vinyl,
        // Salva percorso relativo
        imageUri: imageFilename ? `images/${imageFilename}` : null
      });
    }

    // Salva JSON
    const jsonPath = backupDir + 'vinyls.json';
    await FileSystem.writeAsStringAsync(jsonPath, JSON.stringify(processedVinyls, null, 2));

    // Crea ZIP con JSZip
    const zip = new JSZip();

    // Aggiungi tutti i file della directory al ZIP
    const addDirectoryToZip = async (dirPath: string, zip: JSZip) => {
      const items = await FileSystem.readDirectoryAsync(dirPath);

      for (const item of items) {
        const itemPath = `${dirPath}${item}`;
        const itemInfo = await FileSystem.getInfoAsync(itemPath);

        if (itemInfo.isDirectory) {
          const newFolder = zip.folder(item);
          if (newFolder) {
            await addDirectoryToZip(`${itemPath}/`, newFolder);
          }
        } else {
          const content = await FileSystem.readAsStringAsync(itemPath, {
            encoding: FileSystem.EncodingType.Base64,
          });
          zip.file(item, content, { base64: true });
        }
      }
    };

    await addDirectoryToZip(backupDir, zip);

    // Genera ZIP
    const zipContent = await zip.generateAsync({
      type: 'base64',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    // Salva ZIP
    const zipPath = FileSystem.cacheDirectory + `vinyl_backup_${Date.now()}.zip`;
    await FileSystem.writeAsStringAsync(zipPath, zipContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Condividi
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Errore', 'Condivisione non disponibile');
      return;
    }

    await Sharing.shareAsync(zipPath, {
      mimeType: 'application/zip',
      dialogTitle: 'Esporta Backup Vinili',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    Alert.alert('Errore esportazione', errorMessage);
  }
}

export async function importBackupFromFile() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/zip',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    if (!result.assets || result.assets.length === 0 || !result.assets[0].uri) {
      Alert.alert('Errore', 'File non selezionato correttamente.');
      return;
    }

    const zipUri = result.assets[0].uri;

    const extractDir = FileSystem.cacheDirectory + 'extracted_backup_' + Date.now() + '/';
    await FileSystem.makeDirectoryAsync(extractDir, { intermediates: true });

    // Leggi ZIP
    const zipContent = await FileSystem.readAsStringAsync(zipUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(zipContent, { base64: true });

    // Estrai tutti i file con gestione corretta delle promesse
    const writePromises: Promise<void>[] = [];

    loadedZip.forEach((relativePath, file) => {
      if (!file.dir) {
        const filePath = `${extractDir}${relativePath}`;
        const dirPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);

        const promise = (async () => {
          await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });

          const content = await file.async('base64');
          await FileSystem.writeAsStringAsync(filePath, content, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })();

        writePromises.push(promise);
      }
    });

    await Promise.all(writePromises);

    // Verifica esistenza file JSON
    const jsonPath = extractDir + 'vinyls.json';
    const fileInfo = await FileSystem.getInfoAsync(jsonPath);
    if (!fileInfo.exists) {
      throw new Error("File 'vinyls.json' non trovato nel backup");
    }

    // Leggi JSON
    const content = await FileSystem.readAsStringAsync(jsonPath);
    const vinyls: Vinyl[] = JSON.parse(content);

    // Crea directory immagini permanente
    const appImagesDir = FileSystem.documentDirectory + 'vinyl_images/';
    await FileSystem.makeDirectoryAsync(appImagesDir, { intermediates: true });

    // Processa immagini
    for (const vinyl of vinyls) {
      if (vinyl.imageUri) {
        try {
          const oldPath = extractDir + vinyl.imageUri;
          const filename = vinyl.imageUri.split('/').pop()!;
          const newPath = appImagesDir + filename;

          await FileSystem.copyAsync({
            from: oldPath,
            to: newPath,
          });

          // Aggiorna percorso
          vinyl.imageUri = newPath;
        } catch (error) {
          console.warn("Errore importazione immagine:", vinyl.imageUri, error);
          vinyl.imageUri = null;
        }
      }
    }

    await AsyncStorage.setItem('vinyls', JSON.stringify(vinyls));
    Alert.alert('Backup Importato ✅', 'Dati e immagini ripristinati con successo!');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    Alert.alert('Errore importazione', errorMessage);
  }
}