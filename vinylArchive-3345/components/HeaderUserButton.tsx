// components/HeaderUserButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { isUserAuthenticated } from '../utils/authUtils';

interface HeaderUserButtonProps {
  navigation: NavigationProp<any>;
}

const HeaderUserButton: React.FC<HeaderUserButtonProps> = ({ navigation }) => {
  const handlePress = () => {
    const isAuthenticated = isUserAuthenticated();

    const options = isAuthenticated
      ? ['Logout', 'Annulla']
      : ['Accedi', 'Registrati', 'Annulla'];

    Alert.alert(
      'Account',
      'Scegli un\'opzione',
      options.map((option, index) => ({
        text: option,
        style: option === 'Annulla' ? 'cancel' : 'default',
        onPress: () => {
          if (option === 'Accedi') {
            navigation.navigate('Login');
          } else if (option === 'Registrati') {
            navigation.navigate('Register');
          } else if (option === 'Logout') {
            signOut(auth).catch(error => {
              Alert.alert('Errore', error.message);
            });
          }
        }
      })),
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 15 }}>
      <Text style={{ fontSize: 18 }}>👤</Text>
    </TouchableOpacity>
  );
};

export default HeaderUserButton;