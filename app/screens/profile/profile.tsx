import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
// import { userProfile } from '@/app/types.d'; 
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';

const ProfileScreen = ({ navigation }) => {
  
  const { user } = useContext(UserContext);
  const [name, getName] = useState('');
  const [age, getAge] = useState();
  const [gender, getGender] = useState('');
  const [contact, getContact] = useState('');
  const [bio, getBio] = useState('');
  const [profile, setProfile] = useState({
    Name: '',
    Age: '',
    Gender: '',
    Contact: '',
    Bio: '',
  });
  
  const handlePress = () => {
    navigation.navigate('LoginScreen');
  };
  
  const updateProfile = async () => {
    try {
      await firebase.firestore().collection('users').add({
        Name: name,
        Age: age,
        Gender: gender,
        Contact: contact,
        Bio: bio,
      });
      Alert.alert("Success", "Your details have been updated!");

    } catch (error: any) {
      Alert.alert("Error", "Failed to update details" + error.message);
    }
  };

  // const retrieveProfile = async () => {
  //   try {
  //     await firebase.firestore()
  //       .collection('users')
  //       .doc(user.id)
  //       .get()
  //       .then(documentSnapshot => {
  //         getProfile(documentSnapshot.data());
  //       });
  //     getName(profile.Name);
  //     getAge(profile.Age);
  //     getGender(profile?.Gender);
  //     getContact(profile?.Contact);
  //     getBio(profile?.Bio);
  //   } catch (error: any) {
  //     Alert.alert("Error", "Too Bad");
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={profile.Name}
        onChangeText={(text) => setProfile({ ...profile, Name: text })}
      />
      
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={profile.Age}
        onChangeText={(text) => setProfile({ ...profile, Age: text })}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Gender:</Text>
      <TextInput
        style={styles.input}
        value={profile.Gender}
        onChangeText={(text) => setProfile({ ...profile, Gender: text })}
      />
      
      <Text style={styles.label}>Contact:</Text>
      <TextInput
        style={styles.input}
        value={profile.Contact}
        onChangeText={(text) => setProfile({ ...profile, Contact: text })}
      />
      
      <Text style={styles.label}>Bio:</Text>
      <TextInput
        style={styles.input}
        value={profile.Bio}
        onChangeText={(text) => setProfile({ ...profile, Bio: text })}
        multiline
      />
      
      <Button title="Update Profile" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
export default ProfileScreen;