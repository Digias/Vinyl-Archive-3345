import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import globalStyles, { Colors } from '../styles/globalStyles';

type RootStackParamList = {
  'Login': undefined;
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Errore', 'Compila tutti i campi');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Errore', 'Le password non corrispondono');
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Dopo la registrazione, Firebase effettua l'accesso automatico.
      // Il listener onAuthStateChanged in App.tsx aggiornerà lo stato.
      Alert.alert(
        'Registrazione completata',
        'Il tuo account è stato creato con successo.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      let errorMessage = 'Si è verificato un errore. Riprova.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Questo indirizzo email è già registrato.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La password deve contenere almeno 6 caratteri.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'L\'indirizzo email non è valido.';
      }
      console.error('Errore di registrazione:', error);
      Alert.alert('Errore di registrazione', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.container, { padding: 20 }]}>
        <Text style={globalStyles.title}>Crea un account</Text>
        
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor={Colors.textTertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={globalStyles.input}
          placeholder="Password (almeno 6 caratteri)"
          placeholderTextColor={Colors.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={globalStyles.input}
          placeholder="Conferma Password"
          placeholderTextColor={Colors.textTertiary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[globalStyles.primaryButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Registrati</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hai già un account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={styles.loginLink}>Accedi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    marginRight: 5,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: Colors.primary,
  },
});
