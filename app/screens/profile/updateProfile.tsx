import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';

const UpdateProfileScreen = ({ route, navigation }) => {
  
  const { user } = useContext(UserContext);
  const { Name, Age, Gender, Contact, Bio, DocID } = route.params;
  const [name, getName] = useState(Name);
  const [age, getAge] = useState(Age);
  const [gender, getGender] = useState(Gender);
  const [contact, getContact] = useState(Contact);
  const [bio, getBio] = useState(Bio);
  
  const updateProfile = async () => {
    try {
      await firebase.firestore()
        .collection('users')
        .doc(DocID)
        .update({
            Name: name,
            Age: age,
            Gender: gender,
            Contact: contact,
            Bio: bio,
        })
        .then(() => {
            Alert.alert("Success", "Your details have been updated!");
        })
        navigation.pop();
    } catch (error: any) {
      Alert.alert("Error", "Failed to update details" + error.message);
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
        
        <Button title="Update Profile" onPress={updateProfile} />
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

export default UpdateProfileScreen;