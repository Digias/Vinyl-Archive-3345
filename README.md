# 🎵 Vinyl Jukebox App

Una app React Native (Expo + TypeScript) per gestire la tua collezione di vinili con un jukebox virtuale. Archivia, organizza e gestisci la tua collezione di dischi in vinile con un'interfaccia intuitiva e funzionale.

---

## ✨ Caratteristiche Principali

- **Gestione Collezione Vinili**: Aggiungi, modifica e rimuovi vinili dalla tua collezione
- **Jukebox Virtuale**: Crea una selezione speciale fino a 80 vinili nel tuo jukebox
- **Scambio Vinili**: Sostituisci facilmente i vinili nel jukebox quando è pieno
- **Backup e Ripristino**: Salva e ripristina la tua collezione (funzione premium)
- **Autenticazione Utente**: Sistema di registrazione e login con Firebase
- **Gestione Immagini**: Aggiungi foto ai tuoi vinili scattandole o scegliendole dalla galleria
- **Interfaccia Moderna**: Design scuro e intuitivo con navigazione fluida

---

## 📱 Schermate

- **Home**: Panoramica della collezione e accesso rapido a tutte le funzioni
- **Il mio Jukebox**: Visualizza e gestisci i vinili nel tuo jukebox
- **Tutti i miei Vinili**: Esplora l'intera collezione
- **Aggiungi Vinile**: Inserisci nuovi vinili con tutti i dettagli
- **Gestione Vinili**: Modifica, elimina o esegui backup dei tuoi vinili
- **Scambia Vinili**: Sostituisci vinili quando il jukebox è pieno
- **Login/Registrazione**: Sistema di autenticazione per utenti premium

---

## 🔧 Tecnologie Utilizzate

- **React Native** con Expo
- **TypeScript** per la type safety
- **Firebase Authentication** per l'autenticazione
- **AsyncStorage** per la persistenza dati locale
- **Expo ImagePicker** per la gestione delle immagini
- **React Navigation** per la navigazione tra schermate
- **JSZip** per la funzionalità di backup/ripristino

---

## 🚀 Installazione e Avvio

1. Clona il repository
   ```bash
   git clone <repository-url>
   cd vinyl-jukebox-app
   ```

2. Installa le dipendenze
   ```bash
   npm install
   ```

3. Avvia il progetto
   ```bash
   npx expo start
   ```

4. Usa l'app Expo Go sul tuo dispositivo mobile per scansionare il QR code

---

## 🎯 Funzionalità Dettagliate

### Gestione Vinili
- Aggiungi nuovi vinili con artista, anno, lati A/B e immagine
- Modifica vinili esistenti
- Elimina vinili dalla collezione
- Ricerca vinili per artista o titolo

### Jukebox Virtuale
- Limite di 80 vinili nel jukebox
- Aggiungi/rimuovi vinili dal jukebox
- Sistema di scambio quando il jukebox è pieno

### Autenticazione
- Registrazione con email e password
- Login con autenticazione Firebase
- Funzionalità premium per utenti registrati

### Backup e Ripristino
- Esporta l'intera collezione in formato ZIP
- Importa collezioni da backup precedenti
- Funzione disponibile solo per utenti autenticati

---

## 🔐 Limitazioni Account Gratuito

Gli utenti non registrati possono salvare fino a 30 vinili. Per sbloccare tutte le funzionalità e rimuovere i limiti, è necessario creare un account.

---

## 📞 Supporto

Per problemi o domande, apri una issue sul repository o contattaci tramite email.

---

*Divertiti a organizzare la tua collezione di vinili! 🎶*
