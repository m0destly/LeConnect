import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import firebase from 'firebase/compat';
import UserContext from '@/app/userContext';

const ProfileScreen = ({ navigation }) => {

  const { user } = useContext(UserContext);
  const [userData, getUserData] = useState<userProfile>();
  const [isEditing, setIsEditing] = useState(false);
  const [docID, getDocID] = useState('');

  type userProfile = {
    Name: String;
    Age: Number;
    Gender: String;
    Contact: String;
    Bio: String;
    User: String;
    Pic: String;
  };

  const retrieveProfile = async () => {
    try {
      await firebase.firestore()
        .collection('users')
        .where('User', '==', user.id)
        .onSnapshot(querySnapshot => {
          let profile: userProfile;
            querySnapshot.forEach(documentSnapshot => {
              getDocID(documentSnapshot.id);
              profile = documentSnapshot.data();
            });
          getUserData(profile);
        });
    } catch (error: any) {
      Alert.alert("Error", "Too Bad" + error.message);
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
      DocID: docID,
    });
  };
  
  useEffect(() => {
    retrieveProfile();
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePic}>
          <View style={styles.profileDetails}>
            <View style={styles.profileField}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>{userData?.Name}</Text>
            </View>
            <View style={styles.profileField}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.text}>{userData?.Contact}</Text>
            </View>
            <View style={styles.profileField}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.text}>{userData?.Gender}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
    width: '50%',
  },
  image: {
    width: 150,
    height: 150,
    marginLeft: 20,
    borderRadius: 75,
  },
});

export default ProfileScreen;