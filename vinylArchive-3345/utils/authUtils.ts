import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { MAX_VINYL_FREE } from '../constants'; // Assicurati che questo file esista

/**
 * Controlla in tempo reale se l'utente è autenticato con Firebase.
 * @returns {boolean} True se l'utente è loggato, altrimenti false.
 */
export const isUserAuthenticated = () => {
  return auth.currentUser !== null;
};

/**
 * Controlla se l'utente può salvare altri vinili.
 * Gli utenti autenticati non hanno limiti.
 * Gli utenti non autenticati hanno un limite definito in MAX_VINYL_FREE.
 * @returns {Promise<boolean>} True se l'utente può salvare, altrimenti false.
 */
export const canSaveMoreVinyls = async () => {
  // Controlla lo stato di autenticazione reale da Firebase
  if (isUserAuthenticated()) {
    return true;
  }

  // La logica per gli utenti non autenticati rimane la stessa
  const vinylsJSON = await AsyncStorage.getItem('vinyls');
  const vinyls = vinylsJSON ? JSON.parse(vinylsJSON) : [];
  return vinyls.length < MAX_VINYL_FREE;
};

/**
 * Verifica se l'utente è considerato "premium" (in questo caso, semplicemente autenticato).
 * @returns {boolean} True se l'utente è autenticato.
 */
export const isPremiumUser = () => {
  return isUserAuthenticated();
};

/**
 * Verifica se l'utente può eseguire backup/ripristino
 * @returns {boolean} True se l'utente è autenticato
 */
export const canPerformBackup = () => {
  return isUserAuthenticated();
};