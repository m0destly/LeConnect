import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image, TouchableOpacity, LogBox } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { FIREBASE_STORAGE } from '@/FirebaseConfig';
import ModalScreen from './modal';
import initialImage from '../../../assets/images/initial-profile.jpg';

const NewProfileScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [gender, setGender] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);
  const [contact, setContact] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(Image.resolveAssetSource(initialImage).uri);
  const [fileName, setFileName] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    console.log("original " + image);
  }, [])

  const handlePress = () => {
    if (
      name.trim().length !== 0 &&
      value.trim().length !== 0 &&
      contact.trim().length !== 0 &&
      bio.trim().length !== 0 &&
      age.trim().length !== 0
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
    } catch (error: any) {
      console.error('Error uploading file: ', error.message);
      throw error;
    }
  };

  const makeNewProfile = async () => {
    try {
      console.log("CHeck " + image);
      const downloadURL = await uploadFileToFirebase(image, fileName);
      await firebase.firestore().collection('users').add({
        Name: name,
        Age: age,
        Gender: value,
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
    } catch (error : any) {
      if (error.code === 'storage/invalid-root-operation') {
        Alert.alert('Error', 'Please add a new profile picture to proceed.');
      } else {
        Alert.alert('Error', 'Unable to create profile. Please try again later.' + error.message);
      }
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
          value={age}
          onChangeText={(input) => setAge(input.replace(/[^1234567890]/g, ''))}
          keyboardType="number-pad"
          placeholder="Enter your age"
          maxLength={3}
        />

        <Text style={styles.label}>Gender:</Text>
        <DropDownPicker
          style={styles.dropdown}
          multiple={false}
          open={open}
          value={value}
          items={gender}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setGender}
          placeholder={'Select gender'}
          mode="SIMPLE"
        />

        <Text style={styles.label}>Contact:</Text>
        <TextInput
          style={styles.bioInput}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter your contact information"
          multiline={true}
          keyboardType='default'
          textAlignVertical='top'
        />

        <Text style={styles.label}>Bio:</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell others about yourself"
          multiline={true}
          keyboardType='default'
          textAlignVertical='top'
        />

        <Text style={styles.label}>Picture: (Compulsory)</Text>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{uri: image}}
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
  bioInput: {
    height: 80,
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
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
});

export default NewProfileScreen;
