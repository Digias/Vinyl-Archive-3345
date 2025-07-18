import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { performLogin } from '../utils/authUtils';
import globalStyles, { Colors, Typography } from '../styles/globalStyles';

type RootStackParamList = {
  'Register': undefined;
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Inserisci email e password');
      return;
    }

    await performLogin();
    navigation.goBack();
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
          style={globalStyles.primaryButton}
          onPress={handleLogin}
        >
          <Text style={globalStyles.buttonText}>Accedi</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Non hai un account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
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
  }
});