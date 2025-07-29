import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import globalStyles, { Colors } from '../styles/globalStyles';

type RootStackParamList = {
  'Register': undefined;
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Errore', 'Inserisci email e password');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Il listener onAuthStateChanged in App.tsx gestirà lo stato
      // e l'utente verrà reindirizzato alla schermata principale.
      navigation.goBack();
    } catch (error: any) {
      let errorMessage = 'Si è verificato un errore. Riprova.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Email o password non validi. Riprova.';
      }
      console.error('Errore di accesso:', error);
      Alert.alert('Errore di accesso', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.container, { padding: 20 }]}>
        <Text style={globalStyles.title}>Accedi al tuo account</Text>
        
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
          placeholder="Password"
          placeholderTextColor={Colors.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[globalStyles.primaryButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Accedi</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Non hai un account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.registerLink}>Registrati</Text>
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
  registerLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: Colors.primary,
  },
});
