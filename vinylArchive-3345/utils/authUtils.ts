// authUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_VINYL_FREE } from '../constants';

export const checkAuthStatus = async () => {
  const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
  return isAuthenticated === 'true';
};

export const canSaveMoreVinyls = async () => {
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) return true;

  const vinylsJSON = await AsyncStorage.getItem('vinyls');
  const vinyls = vinylsJSON ? JSON.parse(vinylsJSON) : [];
  return vinyls.length < MAX_VINYL_FREE;
};

export const performLogin = async () => {
  await AsyncStorage.setItem('isAuthenticated', 'true');
};

export const performLogout = async () => {
  await AsyncStorage.removeItem('isAuthenticated');
};