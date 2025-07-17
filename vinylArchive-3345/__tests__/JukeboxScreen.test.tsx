import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native'; // Aggiungi screen qui
import JukeboxScreen from '../screens/JukeboxScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockVinyls = [
  {
    title: 'Jukebox Item',
    artist: 'Artist',
    year: '2000',
    isInJukebox: true
  }
];

describe('JukeboxScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockVinyls));
  });

  it('mostra i vinili nel jukebox', async () => {
    render(<JukeboxScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Jukebox Item')).toBeTruthy(); // Usa screen
      expect(screen.getByText('Rimuovi dal Jukebox')).toBeTruthy();
    });
  });

  it('rimuove un vinile dal jukebox', async () => {
    render(<JukeboxScreen />);
    
    await waitFor(() => {
      const removeButton = screen.getByText('Rimuovi dal Jukebox');
      fireEvent.press(removeButton);
    });
    
    // Verifica che AsyncStorage sia stato aggiornato
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    
    // Verifica che il vinile sia stato rimosso dallo stato
    await waitFor(() => {
      expect(screen.queryByText('Jukebox Item')).toBeNull(); // Usa screen
    });
  });

  it('filtra i vinili durante la ricerca', async () => {
    render(<JukeboxScreen />);
    
    const searchInput = screen.getByPlaceholderText('Cerca per titolo o artista...');
    fireEvent.changeText(searchInput, 'nonexistent');
    
    await waitFor(() => {
      expect(screen.queryByText('Jukebox Item')).toBeNull(); // Usa screen
    });
  });
});