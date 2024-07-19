import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_STORAGE } from '@/FirebaseConfig';
import ModalScreen from './modal';

const NewProfileScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [age, setAge] = useState(new Number);
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(
    'https://i.pinimg.com/originals/28/8f/ab/288fab24c0f04e41ccd3c134161dcc1c.jpg'
  );
  const [fileName, setFileName] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handlePress = () => {
    if (
      name.trim().length !== 0 &&
      gender.trim().length !== 0 &&
      contact.trim().length !== 0 &&
      bio.trim().length !== 0 &&
      age.toString().trim().length !== 0
    ) {
      makeNewProfile();
    } else {
      Alert.alert('Error', 'Please fill in all fields to proceed.');
    }
  };

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const uploadFileToFirebase = async (fileUri, fileName) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const reference = FIREBASE_STORAGE.ref(fileName);
      const task = reference.put(blob);

      task.on('state_changed', (taskSnapshot) => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      await task;

      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Error uploading file: ', error.message);
      throw error;
    }
  };

  const makeNewProfile = async () => {
    try {
      const downloadURL = await uploadFileToFirebase(image, fileName);
      await firebase.firestore().collection('users').add({
        Name: name,
        Age: age,
        Gender: gender,
        Contact: contact,
        Bio: bio,
        User: user.id,
        Pic: downloadURL,
        PicName: fileName,
        Friends: new Array<String>()
      }).then(() => {
        console.log("fileName: " + fileName);
        console.log("downloadURL: " + downloadURL);
      });
      Alert.alert('Success', 'You have created your account successfully!');
      navigation.popToTop();
      navigation.navigate('LeConnect');
    } catch (error: any) {
      Alert.alert('Error', 'Unable to create profile. ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={age.toString()}
          onChangeText={(text) => setAge(Number(text))}
          keyboardType="numeric"
          placeholder="Enter your age"
        />

        <Text style={styles.label}>Gender:</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          placeholder="Enter your gender"
        />

        <Text style={styles.label}>Contact:</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter your contact"
        />

        <Text style={styles.label}>Bio:</Text>
        <TextInput
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          multiline={true}
          placeholder="Write a short bio"
        />

        <Text style={styles.label}>Picture: (Compulsory)</Text>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: image }}
        />
        
        <TouchableOpacity style={styles.changePicButton} onPress={showModal}>
          <Text style={styles.buttonText}>Change Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handlePress}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>

        <ModalScreen
          visible={isVisible}
          onClose={hideModal}
          setImage={setImage}
          setFileName={setFileName}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  container: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 75,
    marginVertical: 20,
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  changePicButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewProfileScreen;
