// __tests__/VinylListScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VinylListScreen from '../screens/VinylListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockVinyls = [
  {
    title: 'Thriller',
    artist: 'Michael Jackson',
    year: '1982',
    sideA: { title: 'Wanna Be Starting Something' },
    sideB: { title: 'Thriller' },
    isInJukebox: false
  },
  {
    title: 'Back in Black',
    artist: 'AC/DC',
    year: '1980',
    sideA: { title: 'Hells Bells' },
    sideB: { title: 'Back in Black' },
    isInJukebox: true
  }
];

describe('VinylListScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockVinyls));
  });

  it('carica e mostra i vinili correttamente', async () => {
    const { getByText, findByText } = render(<VinylListScreen />);
    
    await waitFor(() => {
      expect(getByText('Tutti i miei vinili')).toBeTruthy();
      expect(findByText('Thriller')).toBeTruthy();
      expect(findByText('Back in Black')).toBeTruthy();
    });
  });

  it('filtra i vinili durante la ricerca', async () => {
    const { getByPlaceholderText, queryByText, getByText } = render(<VinylListScreen />);
    
    const searchInput = getByPlaceholderText('Cerca per titolo o artista...');
    fireEvent.changeText(searchInput, 'thrill');
    
    await waitFor(() => {
      expect(getByText('Thriller')).toBeTruthy();
      expect(queryByText('Back in Black')).toBeNull();
    });
    
    fireEvent.changeText(searchInput, 'ac/dc');
    
    await waitFor(() => {
      expect(getByText('Back in Black')).toBeTruthy();
      expect(queryByText('Thriller')).toBeNull();
    });
  });

  it('mostra messaggio quando non ci sono risultati', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const { getByText } = render(<VinylListScreen />);
    
    await waitFor(() => {
      expect(getByText('Nessun risultato trovato.')).toBeTruthy();
    });
  });
});