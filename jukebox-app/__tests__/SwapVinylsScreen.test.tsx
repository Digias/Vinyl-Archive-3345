// __tests__/SwapVinylsScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SwapVinylsScreen from '../screens/SwapVinylsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockVinyls = [
  { title: 'Album1', artist: 'Artist1', isInJukebox: false },
  { title: 'Album2', artist: 'Artist2', isInJukebox: true },
  { title: 'Album3', artist: 'Artist3', isInJukebox: true }
];

describe('SwapVinylsScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockVinyls));
  });

  it('permette di selezionare un vinile da aggiungere e uno da rimuovere', async () => {
    render(<SwapVinylsScreen />);
    
    // Step 1: Seleziona vinile da aggiungere
    const addButton = await screen.findByText('Album1 - Artist1');
    fireEvent.press(addButton);
    
    const nextButton = screen.getByText('Avanti');
    fireEvent.press(nextButton);
    
    // Step 2: Seleziona vinile da rimuovere
    const removeButton = await screen.findByText('Album2 - Artist2');
    fireEvent.press(removeButton);
    
    const swapButton = screen.getByText('Esegui scambio');
    fireEvent.press(swapButton);
    
    // Verifica schermata di completamento
    await waitFor(() => {
      expect(screen.getByText('Scambio completato! 🎉')).toBeTruthy();
    });
  });

  it('permette di tornare indietro', async () => {
    render(<SwapVinylsScreen />);
    
    // Seleziona vinile da aggiungere
    const addButton = await screen.findByText('Album1 - Artist1');
    fireEvent.press(addButton);
    
    fireEvent.press(screen.getByText('Avanti'));
    
    // Torna indietro
    fireEvent.press(screen.getByText('Indietro'));
    
    await waitFor(() => {
      expect(screen.getByText('Seleziona un vinile da aggiungere al Jukebox')).toBeTruthy();
    });
  });
});