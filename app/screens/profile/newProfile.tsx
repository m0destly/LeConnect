import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';

const NewProfileScreen = ({ navigation }) => {

  const { user } = useContext(UserContext);
  const [name, getName] = useState('');
  const [age, getAge] = useState(new Number);
  const [gender, getGender] = useState('');
  const [contact, getContact] = useState('');
  const [bio, getBio] = useState('');

  const handlePress = () => {
    if (name.trim().length != 0 && 
        gender.trim().length != 0 &&
        contact.trim().length != 0 &&
        bio.trim().length != 0 && 
        age.toString().trim().length != 0) {
        makeNewProfile();
    } else {
        Alert.alert("Error", "Please fill in all fields to proceed.");
    }
  };
  
  const makeNewProfile = async () => {
    try {
      await firebase.firestore().collection('users').add({
        Name: name,
        Age: age,
        Gender: gender,
        Contact: contact,
        Bio: bio,
        User: user.id,
      });
      Alert.alert("Success", "You have created your account successfully!");
      navigation.popToTop();
      navigation.navigate('LeConnect');
    } catch (error: any) {
      Alert.alert("Error", "Unable to create profile." + error.message);
    }
  };

  return (
    <ScrollView>
        <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
            style={styles.input}
            value={name}
            onChangeText={getName}
        />
        
        <Text style={styles.label}>Age:</Text>
        <TextInput
            style={styles.input}
            value={age.toString()} 
            onChangeText={(text) => getAge(Number(text))}
            keyboardType="numeric"
        />
        
        <Text style={styles.label}>Gender:</Text>
        <TextInput
            style={styles.input}
            value={gender}
            onChangeText={getGender}
        />
        
        <Text style={styles.label}>Contact:</Text>
        <TextInput
            style={styles.input}
            value={contact}
            onChangeText={getContact}
        />
        
        <Text style={styles.label}>Bio:</Text>
        <TextInput
            style={styles.input}
            value={bio}
            onChangeText={getBio}
            multiline={true}
        />
        
        <Button title="Update Profile" onPress={handlePress} />
        </View>
    </ScrollView>
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

export default NewProfileScreen;