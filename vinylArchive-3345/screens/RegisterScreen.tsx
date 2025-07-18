import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { performLogin } from '../utils/authUtils';
import globalStyles, { Colors } from '../styles/globalStyles';
import { NavigationProp } from '@react-navigation/native';

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

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Errore', 'Compila tutti i campi');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Errore', 'Le password non corrispondono');
      return;
    }

    await performLogin(); // Fake registration
    navigation.goBack();
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
          placeholder="Password"
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
          style={globalStyles.primaryButton}
          onPress={handleRegister}
        >
          <Text style={globalStyles.buttonText}>Registrati</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hai già un account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
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
});