import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';
import { Button } from 'react-native-elements';


const ProfileScreen = ({ navigation, route }) => {

  const { user } = route.params;
  const [userData, getUserData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [docID, getDocID] = useState('');
  const currUser = firebase.auth().currentUser;
  const [isPressed, setIsPressed] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  const [message, setMessaage] = useState('');

  type userProfile = {
    Name: String;
    Age: Number;
    Gender: String;
    Contact: String;
    Bio: String;
    User: String;
    Pic: String;
    PicName: String;
  };

  const retrieveProfile = async () => {
    try {
      await firebase.firestore()
        .collection('users')
        .where('User', '==', user.id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
              getDocID(documentSnapshot.id);
              getUserData(documentSnapshot.data());
            });
        });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleEditPress = () => {
    navigation.navigate('UpdateProfile', {
      Name: userData?.Name,
      Age: userData?.Age,
      Gender: userData?.Gender,
      Contact: userData?.Contact,
      Bio: userData?.Bio,
      Pic: userData?.Pic,
      PicName: userData?.PicName,
      DocID: docID,
    });
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPW && newPassword !== '' && confirmPW !== '') {
      currUser?.updatePassword(newPassword)
        .then(() => {
          setMessaage('');
          setConfirmPW('');
          setNewPassword('');
          setIsPressed(false);
          Alert.alert('Update successful', 'Your password has been changed');
        })
        .catch((error) => {
          setMessaage(error.message);
        })

    } else {
      setMessaage('Passwords do not match / Cannot be empty');
    }
  }
  
  useEffect(() => {
    retrieveProfile();
  }, []);
  
  return (
    
      <ScrollView contentContainerStyle={styles.scrollViewContents}>
        <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.profilePic}>
            <View style={styles.profileDetails}>
              <View style={styles.profileField}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.text}>{userData?.Name}</Text>
              </View>
              <View style={styles.profileField}>
                <Text style={styles.label}>Gender:</Text>
                <Text style={styles.text}>{userData?.Gender}</Text>
              </View>
              <View style={styles.profileField}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.text}>{userData?.Age}</Text>
              </View>
              <View style={styles.profileField}>
                <Text style={styles.label}>Contact:</Text>
                <Text style={styles.text}>{userData?.Contact}</Text>
              </View>
              <View style={styles.profileField}>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.text}>{userData?.Bio}</Text>
              </View>
            </View>
            <Image
              source={{ uri: userData?.Pic }}
              style={styles.image}
            />
          </View>
          <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        <Button
          title='Change Password'
          onPress={() => setIsPressed(!isPressed)}
          buttonStyle={styles.changePassword}
        />
        <View style={styles.passwordContainer}>
          {isPressed && (
            <View>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                placeholder="New Password"
                onChangeText={setNewPassword}
                secureTextEntry={true}
              />
              <TextInput
                style={styles.passwordInput}
                value={confirmPW}
                placeholder="Confirm Password"
                onChangeText={setConfirmPW}
                secureTextEntry={true}
                
              />
              <Button
                title='Confirm'
                onPress={handleChangePassword}
                buttonStyle={styles.confirm}
              />
            </View>
          )}
          {message && (
            <View>
              <Text> {message} </Text>
            </View>
          )}
        </View>
      </View>
      </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollViewContents: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1, 
  },
  profilePic: {
    flexDirection:'row',
    alignItems: 'center',
  },
  profileField: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 100,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    //fontWeight: 'bold',
    width: '50%',
  },
  image: {
    width: 150,
    height: 150,
    marginLeft: 20,
    borderRadius: 75,
  },
  passwordContainer: {
    padding: 20,
  },
  changePassword: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  confirm: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  passwordInput: {
    fontSize: 20,
    padding: 5,
  }
});

export default ProfileScreen;