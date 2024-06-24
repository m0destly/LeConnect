import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import UserContext from '@/app/userContext';

const RegisterScreen = ({ navigation }) => {
  const { saveUser } = useContext(UserContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      const newUser = response.user;
      if (newUser) {
        const userData = {
          id: newUser.uid,
        };
        saveUser(userData);
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('NewProfile');
      }
    } catch (error: any) {
      console.error('Sign-up Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already exists.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Please enter a password of at least 6 characters.');
      } else if (error.code === 'auth/missing-password' || 
                error.code === 'auth/missing-email' ||
                error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Please enter a valid email/password.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LeConnect</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          placeholderTextColor="#ffffff"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Get Connected!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleGoToLogin}>
        <Text style={styles.loginText1}>
          Already have an account?{' '}
          <Text style={styles.loginText2}>Login here!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#003f5c',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  signUpBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  signUpText: {
    color: 'white',
  },
  loginBtn: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText1: {
    fontSize: 16,
  },
  loginText2: {
    textDecorationLine: 'underline',
    color: "blue",
    fontSize: 16,
  },
});

export default RegisterScreen;