import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, TextInput, ScrollView } from 'react-native';
import firebase from 'firebase/compat';
import { Button, Icon } from 'react-native-elements';


const ProfileScreen = ({ navigation, route }) => {

  const { user } = route.params;
  const [userData, getUserData] = useState();
  const [docID, getDocID] = useState('');
  const currUser = firebase.auth().currentUser;
  const [isPressed, setIsPressed] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  const [message, setMessage] = useState('');

  const retrieveProfile = async () => {
    try {
      firebase.firestore()
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
          setMessage('');
          setConfirmPW('');
          setNewPassword('');
          setIsPressed(false);
          Alert.alert('Update successful', 'Your password has been changed');
        })
        .catch((error) => {
          if (error.code === 'auth/weak-password') {
            setMessage('Password should be at least 6 characters');
          } else {
            setMessage(error.message);
          };
        })

    } else if (newPassword === '' || confirmPW === '') {
      setMessage('Passwords cannot be empty');
    } else {
      setMessage('Passwords do not match');
    }
  }

  const openPassword = () => {
    setIsPressed(true);
  }

  const closePassword = () => {
    setMessage('');
    setIsPressed(false);
  }

  useEffect(() => {
    retrieveProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContents}>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
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
          <Button
            title="Edit Profile"
            titleStyle={{ marginHorizontal: 5 }}
            icon={<Icon name="edit" type="material" size={20} color="white"/>}
            buttonStyle={{borderRadius: 30}}
            onPress={handleEditPress}
          />

        </View>
        <Button
          title='Change Password'
          titleStyle={{marginHorizontal: 5}}
          onPress={() => isPressed ? closePassword() : openPassword()}
          buttonStyle={styles.changePassword}
          icon={<Icon name="lock-reset" type="material" size={20} color="white"/>}
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
                titleStyle={{marginHorizontal: 5}}
                icon={<Icon name='check-circle-outline' type='material' color='white' size={20}/>}
              />
            </View>
          )}
          {message && (
            <View style={styles.messageContainer}>
              <Text style={{textAlign: 'center'}}> {message} </Text>
            </View>
          )}
        </View>
        <Button
          title='Log Out'
          titleStyle={{marginHorizontal: 5}}
          onPress={() => navigation.popToTop()}
          buttonStyle={styles.logout}
          icon={<Icon name="logout" type="material" size={20} color="white"/>}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContents: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginVertical: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  image: {
    width: 150,
    height: 150,
    marginLeft: 20,
    borderRadius: 75,
  },
  passwordContainer: {
    padding: 10,
  },
  changePassword: {
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 30,
    width: 300,
  },
  confirm: {
    backgroundColor: 'green',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 20,
    width: 300,
  },
  passwordInput: {
    fontSize: 20,
    padding: 5,
  },
  messageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 10,
    width: '80%'
  },
  logout: {
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 30,
    width: 300,
    marginBottom: 30,
  }
});

export default ProfileScreen;