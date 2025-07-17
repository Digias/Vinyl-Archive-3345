# 🎵 33⁄45 Vinyl Archive

Una app React Native (Expo + TypeScript) per gestire la tua collezione di vinili e il Jukebox personale, con funzionalità di scambio vinili e navigazione semplice e intuitiva.

---

## 🧩 Caratteristiche principali

- **Visualizza la tua collezione di vinili**  
  Mostra i vinili disponibili che non sono ancora nel Jukebox.

- **Gestisci il Jukebox**  
  Visualizza i vinili attualmente presenti nel Jukebox.

- **Scambia vinili tra collezione e Jukebox**  
  Scegli un vinile da aggiungere e uno da rimuovere per mantenere sempre aggiornata la tua selezione.

- **Navigazione fluida**  
  Naviga tra la schermata principale, Jukebox e la schermata di scambio con comandi chiari.

- **Persistenza dati locale**  
  I vinili e lo stato del Jukebox sono salvati in locale usando `AsyncStorage`.

- **Design moderno e responsivo**  
  Interfaccia scura, con pulsanti arrotondati e rispettosa delle aree sicure dei dispositivi (SafeAreaView).

---

## 📱 Funzionamento dettagliato

### Schermata di scambio vinili (`SwapVinylsScreen`)

1. **Seleziona un vinile da aggiungere al Jukebox**  
   - Viene mostrata la lista dei vinili **non ancora** nel Jukebox.  
   - Tocca un vinile per selezionarlo.  
   - Premi **Avanti** per confermare.

2. **Seleziona un vinile da rimuovere dal Jukebox**  
   - Viene mostrata la lista dei vinili già presenti nel Jukebox.  
   - Tocca un vinile per selezionarlo.  
   - Premi **Esegui scambio** per completare lo scambio.

3. **Schermata di conferma**  
   - Conferma dello scambio con messaggio "Scambio completato! 🎉".  
   - Pulsanti per fare un altro scambio o tornare alla Home o Jukebox.

### Gestione dati

- I dati della collezione e del Jukebox sono caricati da `AsyncStorage` ad ogni apertura della schermata di scambio.  
- Lo scambio aggiorna lo stato `isInJukebox` dei vinili salvati.

### Navigazione

- Usa `@react-navigation/native` per la navigazione tra le schermate `Home`, `Jukebox` e `SwapVinylsScreen`.

---

## 💻 Struttura del progetto

- `types.ts`  
  Definizione tipi, ad esempio `Vinyl` con proprietà come `title`, `artist`, `isInJukebox`.

- `SwapVinylsScreen.tsx`  
  Schermata principale per lo scambio di vinili, con gestione step, selezione e persistenza.

- `HomeScreen.tsx`, `JukeboxScreen.tsx`  
  Altre schermate (non mostrate qui) per la gestione e visualizzazione della collezione.

- `AsyncStorage`  
  Utilizzato per memorizzare la lista dei vinili e lo stato del Jukebox in locale.

---

## 🎨 Stile e UX

- Tema scuro (#121212 background) per un look moderno e meno affaticante per gli occhi.  
- Pulsanti arrotondati con ombre leggere per profondità visiva.  
- Margini e padding generosi per facilità d’uso anche su schermi piccoli.  
- Uso di `SafeAreaView` e padding bottom per evitare sovrapposizioni con i tasti di navigazione Android.

---

## 🛠️ Dipendenze principali

- **React Native** con Expo  
- `@react-navigation/native` (navigazione)  
- `@react-native-async-storage/async-storage` (persistenza dati)  
- TypeScript per tipizzazione sicura

---

## 🚀 Come avviare l’app

1. Clona il repo  
2. Esegui `npm install` o `yarn` per installare le dipendenze  
3. Avvia Expo con `expo start`  
4. Usa un emulatore o un dispositivo reale per testare

---

## 📩 Contatti

Per suggerimenti, domande o contributi, sentiti libero di contattarmi!

---

*Divertiti a scambiare i tuoi vinili preferiti! 🎶*


### Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

3. Update the app

   ```bash
   eas update --branch main --message "... your message here ..."
   ```
