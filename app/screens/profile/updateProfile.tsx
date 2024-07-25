import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import firebase from 'firebase/compat';
import ModalScreen from './modal';
import { FIREBASE_STORAGE } from '@/FirebaseConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Icon } from 'react-native-elements';

const UpdateProfileScreen = ({ route, navigation }) => {
  const { Name, Age, Gender, Contact, Bio, DocID, Pic, PicName } = route.params;

  const [name, setName] = useState(Name);
  const [age, setAge] = useState(Age);
  const [contact, setContact] = useState(Contact);
  const [bio, setBio] = useState(Bio);
  const [image, setImage] = useState(Pic);
  const [fileName, setFileName] = useState(PicName);
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(Gender);
  const [gender, setGender] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);

  const updateProfile = async () => {
    try {
      if (fileName !== PicName) {
        const downloadURL = await uploadFileToFirebase(image, fileName);
        await firebase.firestore().collection('users').doc(DocID).update({
          Name: name,
          Age: age,
          Gender: value,
          Contact: contact,
          Bio: bio,
          Pic: downloadURL,
          PicName: fileName,
        });
      } else {
        await firebase.firestore().collection('users').doc(DocID).update({
          Name: name,
          Age: age,
          Gender: value,
          Contact: contact,
          Bio: bio,
          Pic: Pic,
          PicName: fileName,
        });
      }

      Alert.alert("Success", "Your details have been updated!");
      navigation.pop();
    } catch (error: any) {
      Alert.alert("Error", "Failed to update details: " + error.message);
    }
  };

  const handlePress = () => {
    if (name.trim().length !== 0 &&
      age.trim().length !== 0 &&
      contact.trim().length !== 0 &&
      bio.trim().length !== 0) {
      updateProfile();
    } else {
      Alert.alert("Error", "You cannot leave any field empty");
    }
  }

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const uploadFileToFirebase = async (fileUri, fileName) => {
    try {
      const deleteOriginal = () => {
        FIREBASE_STORAGE.ref(PicName).delete().then(() => {
          console.log("Original file deleted successfully");
        }).catch((error: any) => {
          console.log("Original file cannot be deleted");
        });
      }
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const reference = FIREBASE_STORAGE.ref(fileName);
      const task = reference.put(blob);

      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
      task.then((snapshot) => deleteOriginal());

      await task;
      return await reference.getDownloadURL();
    } catch (error: any) {
      console.error('Error uploading file: ', error.message);
      throw error;
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
          maxLength={50}
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
          placeholder={value}
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
          maxLength={100}
        />

        <Text style={styles.label}>Bio:</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          multiline={true}
          placeholder="Tell others about yourself"
          keyboardType='default'
          textAlignVertical='top'
          maxLength={200}
        />

        <Text style={styles.label}>Profile Picture:</Text>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: image }}
        />
        
        <Button
          onPress={showModal}
          buttonStyle={{ borderRadius: 30, marginBottom: 5 }}
          title='Change Picture'
          titleStyle={{ marginHorizontal: 5 }}
          icon={<Icon name="perm-media" type="material" size={20} color="white" />}
        />

        <Button
          onPress={handlePress}
          buttonStyle={{ borderRadius: 30, backgroundColor: 'green' }}
          title='Update Profile'
          titleStyle={{ marginHorizontal: 5}}
          icon={<Icon name="update" type="material" size={20} color="white" />}
        />

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
  dropdown: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
});

export default UpdateProfileScreen;