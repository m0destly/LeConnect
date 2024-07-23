import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, ImageBackground, Alert, ScrollView, FlatList, Platform, Linking } from 'react-native';
import firebase from 'firebase/compat/app';
import UserContext from '@/app/userContext';
import { EventProfile, EventProfileData } from '@/app/types.d';

const EventPage = ({ route, navigation }) => {

  const { user } = useContext(UserContext);
  const { Title, Category, Time, id, Description, Creator, Participants, Location } = route.params;
  const [isCreator, setIsCreator] = useState(false);
  const [index, setIndex] = useState(-1);
  const [canJoin, setCanJoin] = useState(false);
  const [clean, setClean] = useState('');
  const [participants, setParticipants] = useState(new Array<any>());
  const [creatorFields, setCreatorFields] = useState(new Object);

  useEffect(() => {
    try {
      Participants.push("-1");
      firebase
        .firestore()
        .collection('users')
        .where('User', 'in', Participants)
        .onSnapshot(querySnapshot => {
          const participantsData = new Array<any>();
          querySnapshot.forEach(documentSnapshot => {
            if (!documentSnapshot.data().empty) {
              participantsData.push(documentSnapshot.data());
            }
          });
          setParticipants(participantsData);
        });

        firebase
        .firestore()
        .collection('users')
        .where('User', '==', Creator)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            setCreatorFields(documentSnapshot.data());
          })
        });
    } catch (error: any) {
      Alert.alert('Error, ' + error.message);
    } finally {
      Creator === user.id ? setIsCreator(true) : setIsCreator(false);
      // query if participant has joined
      // if not, do nth
      // if joined, setIsJoined(true)
      // if isJoined true, button becomes unjoin
      // unjoin => setIsJoined(false)
      const initial = Participants.indexOf(user.id);
      if (initial === -1) {
        setCanJoin(true);
      }
      setIndex(initial);
      cleanLocation();
    }
  }, [canJoin]);

  const cleanLocation = () => {
    if (Platform.OS === 'android') {
      setClean(Location.replaceAll(' ', '+').replaceAll(',', '%2C').replaceAll('|', '%7C'));
    } else {
      setClean(Location.replaceAll(' ', '+'));
    }
  };

  const openDirections = () => {
    const url = Platform.OS === 'android'
      ? `https://www.google.com/maps/dir/?api=1&destination=${clean}`
      : `http://maps.apple.com/?daddr=${clean}`;
    console.log(clean);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', "Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const joinEvent = async () => {
    try {
      Participants.push(user.id);
      await firebase.firestore()
        .collection("events")
        .doc(id)
        .update({
          Participants: Participants,
        })
        .then(() => {
          Alert.alert('Successfully joined event!');
        });
      setCanJoin(false);
    } catch (error: any) {
      Alert.alert('error');
      console.log(error.message);
    }
  };

  const unjoinEvent = async () => {
    try {
      Participants.splice(index, 1);
      await firebase.firestore()
        .collection("events")
        .doc(id)
        .update({
          Participants: Participants,
        })
        .then(() => {
          Alert.alert('Successfully left event!');
        });
      setCanJoin(true);
    } catch (error: any) {
      Alert.alert('error');
      console.log(error.message);
    }
  };

  const renderEventProfile = ({ item }) => {
    return (
      <EventProfile
        item={item}
        onPress={() => item.User == user.id
          ? Alert.alert("Stop!", "Please view your own profile from the Profile tab")
          : toProfile(item)}
      />
    );
  };

  const toProfile = (item: EventProfileData) => {
    navigation.navigate('DisplayProfile', {
      Name: item.Name,
      Age: item.Age,
      Gender: item.Gender,
      Contact: item.Contact,
      Bio: item.Bio,
      User: item.User,
      Pic: item.Pic,
      PicName: item.PicName,
    })
  }

  return (
      //<ScrollView>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>{Title}</Text>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.timeHeader}>Time</Text>
              <Text style={styles.time}>{Time}</Text>
            </View>

            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.timeHeader}>Location</Text>
              <Text style={styles.time}>{Location}</Text>
              <Button
                title='Get Directions'
                onPress={openDirections}
              />
            </View>

            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.timeHeader}>Creator</Text>
              <TouchableOpacity
              onPress={() => 
                Creator === user.id 
                  ? Alert.alert("Stop!", "Please view your own profile from the Profile tab") 
                  : creatorFields}
                style={[styles.profileCreatorContainer]}>
                <Image
                  source={{ uri: creatorFields.Pic }}
                  style={styles.profilePic}>
                </Image>
                <Text style={styles.profileName}>
                  {creatorFields.Name}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.descriptionTitle}>Description</Text>
            <ScrollView style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{Description}</Text>
            </ScrollView>


            <View style={styles.footer}>
              <Button
                title={canJoin ? 'Join Event!' : 'Leave Event!'}
                onPress={canJoin ? joinEvent : unjoinEvent}
                disabled={isCreator}
              />
            </View>
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.profileHeader}>Participants</Text>
            <FlatList
              data={participants}
              renderItem={renderEventProfile}
            />
          </View>
        </View>
      //</ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  container: {
    flex: 5,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    alignSelf: 'center',
  },
  timeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    backgroundColor: 'black',
    borderRadius: 20,
    paddingLeft: 10,
    borderLeftWidth: 10,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    //paddingHorizontal: 20, 
    borderRadius: 10,
    marginBottom: 20,
    maxHeight: 200,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
  },
  descriptionText: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
    padding: 15,
  },
  footer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  profileContainer: {
    flex: 1.2,
  },
  profileHeader: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold'
  },
  profileCreatorContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'grey',
    flexDirection: 'row',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    alignSelf: 'center',
    color: 'white'
  },
  profilePic: {
    width: 25,
    height: 25,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default EventPage;