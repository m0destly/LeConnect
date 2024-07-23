import React, { useState, useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import UserContext from '@/app/userContext';
import firebase from 'firebase/compat';

const LoginScreen = ({ navigation }) => {

  const { user, saveUser, clearUser } = useContext(UserContext);
  
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    // Implement your login logic here
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      const currUser = response.user;
      console.log(currUser);
      if (currUser) {
        const userData = {
          id: currUser.uid,
        };
        saveUser(userData);
        resetLogin();
        // to get the document
        const documentSnapshot = await firebase.firestore()
          .collection('users')
          .where('User', '==', currUser.uid)
          .get();
        if (!documentSnapshot.empty) {
          navigation.navigate('LeConnect');
        } else {
          navigation.navigate('NewProfile');
          Alert.alert('Error:', 'Create your profile to proceed');
        }
      }
    } catch (error: any) {
      clearUser();
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

  const resetLogin = () => {
    usernameRef.current.clear();
    passwordRef.current.clear();
    setUsername('');
    setPassword('');
  }

  const handleSignUp = () => {
    // navigation 
    navigation.navigate('Register');
  };

  const forgetPassword = () => {
    navigation.navigate('ResetPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LeConnect</Text>
      <View style={styles.inputView}>
        <TextInput
          ref={usernameRef}
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#ffffff"
          onChangeText={setUsername}
          autoCapitalize='none'
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          ref={passwordRef}
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          onChangeText={setPassword}
          secureTextEntry={true}
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

      <TouchableOpacity style={styles.signUpBtn} onPress={forgetPassword}>
        <Text style={styles.signUpText1}> 
          Forgot password?{' '} 
          <Text style={styles.signUpText2}>Reset here!</Text>
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