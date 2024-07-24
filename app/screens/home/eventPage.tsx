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
      if (error.code !== 'invalid-argument') {
        Alert.alert('Error, ' + error.message);
      }
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
    <View style={styles.overlay}>
      <View style={styles.eventContainer}>

        <Text style={styles.title}>{Title}</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Time</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.field}>{Time}</Text>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Location</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.field}>{Location}</Text>
          </View>
          <Button
            title='Get Directions'
            onPress={openDirections}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Creator</Text>
          <TouchableOpacity
            onPress={() =>
              Creator === user.id
                ? Alert.alert("Stop!", "Please view your own profile from the Profile tab")
                : creatorFields}
            style={styles.profileCreatorContainer}>
            <Image
              source={{ uri: creatorFields.Pic }}
              style={styles.profilePic}>
            </Image>
            <Text style={styles.profileName}>
              {creatorFields.Name}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Description</Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{Description}</Text>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Button
            title={canJoin ? 'Join Event!' : 'Leave Event!'}
            onPress={canJoin ? joinEvent : unjoinEvent}
            disabled={isCreator}
          />
        </View>
      </View>

      <View style={styles.profileContainer}>
        <Text style={styles.fieldHeader}>Participants</Text>
        {Participants.length > 0 ?
          <FlatList
            data={participants}
            renderItem={renderEventProfile}
          /> :
          <Text style={{fontSize: 20}}>
            Be the first to join this event!
          </Text>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  eventContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  fieldHeader: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  field: {
    fontSize: 18,
    color: 'white',
    borderLeftWidth: 10,
    padding: 5,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    marginBottom: 10,
    maxHeight: 150,
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
    flex: 1.5,
    padding: 20,
  },
  profileCreatorContainer: {
    flexDirection: 'row',
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'grey',
    marginBottom: 10,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    alignSelf: 'center',
    color: 'yellow'
  },
  profilePic: {
    width: 25,
    height: 25,
    borderRadius: 10,
    alignSelf: 'center',
  },
  fieldContainer: {
    flexDirection: 'column',
  }
});

export default EventPage;