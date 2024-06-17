import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    // Implement your login logic here
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      console.log(response + '\n');
      // redirect to homepage
      navigation.navigate('LeConnect');

    } catch (error: any) {
      console.error('Sign-in Error:', error);
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', `Please enter a valid email.`);
      } else if (error.code === 'auth/missing-password') {
        Alert.alert('Error', `Please enter a password.`);
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'The email is not registered / The password is wrong.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    // Example: You might want to send the login credentials to your backend server for authentication
    // third case: successful, transit to static home page
  };

  const handleSignUp = () => {
    // navigation 
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LeConnect</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#ffffff"
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Time to Connect!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
        <Text style={styles.signUpText1}> 
          No account?{' '} 
          <Text style={styles.signUpText2}>Sign up here!</Text>
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
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  signUpBtn: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  signUpText1: {
    fontSize: 16,
  },
  signUpText2: {
    textDecorationLine: 'underline', 
    color:"blue",
    fontSize: 16,
  },
});

export default LoginScreen;