import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_STORAGE } from '@/FirebaseConfig';
import OptionsModal from './modal';

const NewProfileScreen = ({ navigation }) => {

  const { user } = useContext(UserContext);
  const [name, getName] = useState('');
  const [age, getAge] = useState(new Number);
  const [gender, getGender] = useState('');
  const [contact, getContact] = useState('');
  const [bio, getBio] = useState('');
  const [image, setImage] = useState(
    'https://i.pinimg.com/originals/28/8f/ab/288fab24c0f04e41ccd3c134161dcc1c.jpg');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  
  
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

  //-------test for image start --------------------------------
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFileName(result.assets[0].fileName);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    console.log(result.assets[0].uri);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFileName(result.assets[0].fileName);
    }
  };
  
  const uploadFileToFirebase = async (fileUri, fileName) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const reference = FIREBASE_STORAGE.ref(fileName);
      const task = reference.put(blob);
  
      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
  
      await task;
  
      return await reference.getDownloadURL();

    } catch (error: any) {
      console.error('Error uploading file: ', error.message);
      throw error;
    }
  };

  //------test for image end ----------------------------------------
  
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

        <Text style={styles.label}>Picture: (Optional)</Text>
        <Image 
          resizeMode='contain'
          style={styles.image}
          source={{
            uri: image,
          }}
        />

        <SafeAreaView style={{ flex: 1 }}>
          <OptionsModal />
        </SafeAreaView>

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
  image: {
    width: 200,
    height: 200,
  },
});

export default NewProfileScreen;