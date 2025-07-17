// __tests__/HomeScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native'; // Importa screen
import HomeScreen from '../screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalBackup from '../utils/LocalBackup';

// Mock di Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.setPrototypeOf(
    {
      Alert: {
        ...RN.Alert,
        alert: jest.fn(),
      },
    },
    RN
  );
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
  });

  it('mostra i bottoni principali', async () => {
    render(<HomeScreen />);
    
    // Usa screen per le query
    expect(screen.getByText('Il mio Jukebox')).toBeTruthy();
    expect(screen.getByText('Aggiungi Vinile a Jukebox')).toBeTruthy();
    expect(screen.getByText('Scambia Vinili')).toBeTruthy();
    expect(screen.getByText('Tutti i miei Vinili')).toBeTruthy();
    expect(screen.getByText('Aggiungi Nuovo Vinile')).toBeTruthy();
  });

  it('mostra il menu di backup quando premuto', async () => {
    render(<HomeScreen />);
    
    // Usa screen.getByText
    fireEvent.press(screen.getByText('Gestisci Dati ▼'));
    
    await waitFor(() => {
      expect(screen.getByText('Effettua Backup')).toBeTruthy();
      expect(screen.getByText('Ripristina Backup')).toBeTruthy();
    });
  });

  it('chiama exportBackup quando premuto', async () => {
    render(<HomeScreen />);
    
    fireEvent.press(screen.getByText('Gestisci Dati ▼'));
    fireEvent.press(screen.getByText('Effettua Backup'));
    
    await waitFor(() => {
      expect(LocalBackup.exportBackupToFile).toHaveBeenCalled();
    });
  });

  it('gestisce jukebox pieno', async () => {
    // Simula jukebox pieno
    const fullJukebox = Array(80).fill({ 
      title: 'Vinyl', 
      artist: 'Artist', 
      isInJukebox: true 
    });
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(fullJukebox));
    
    render(<HomeScreen />);
    
    fireEvent.press(screen.getByText('Aggiungi Vinile a Jukebox'));
    
    // Verifica che Alert.alert sia stato chiamato
    await waitFor(() => {
      const Alert = require('react-native').Alert;
      expect(Alert.alert).toHaveBeenCalledWith(
        'Jukebox pieno',
        'Il jukebox è pieno, devi scambiare un vinile prima di aggiungerne un altro.',
        expect.any(Array)
      );
    });
  });

  it('naviga allo scambio quando jukebox pieno', async () => {
    const fullJukebox = Array(80).fill({ isInJukebox: true });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(fullJukebox));
    
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('Aggiungi Vinile a Jukebox'));
    
    // Simula la pressione sul pulsante "Vai allo scambio"
    const Alert = require('react-native').Alert;
    const alertMock = Alert.alert as jest.Mock;
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
      
      // Simula la pressione sul secondo pulsante (Vai allo scambio)
      const callback = alertMock.mock.calls[0][2];
      if (callback && callback[1] && callback[1].onPress) {
        callback[1].onPress();
      }
    });
    
    // Verifica la navigazione
    const navigation = require('@react-navigation/native').useNavigation();
    expect(navigation.navigate).toHaveBeenCalledWith('Swap Vinyls');
  });
});