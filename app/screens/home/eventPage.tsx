import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Alert, FlatList } from 'react-native';
import firebase from 'firebase/compat/app';
import UserContext from '@/app/userContext';

const EventPage = ({ route, navigation }) => {
  
  const { user } = useContext(UserContext);
  const { Title, Category, Time, id, Description, Creator, Participants } = route.params;
  const [isCreator, setIsCreator] = useState(false);
  const [index, setIndex] = useState(-1);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
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
    setIndex(Participants.indexOf(user.id));
  }, []);

  const joinEvent = async () => {
    try {
      await displayProfile();
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
      await displayProfile();
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

  const displayProfile = async () => {
    // [userProfile1, userProfile2, userProfile2]
    const participantsData = new Array<any>();
    Participants.forEach((participantID: String) => {
      const snapshot = firebase.firestore()
        .collection("users")
        .where('User', '==', participantID)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            participantsData.push(doc.data());
            console.log("Each item: ", doc.data());
          })
        });
    });
    console.log("Participants DATA: " + participantsData);
  }

  const toProfile = async (userID: String) => {
    navigation.navigate('ProfileScreen', {
      userID: userID,
    })
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/join-event.jpeg')}
      style={styles.background}
      resizeMode='cover'
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{Title}</Text>
        <View style={{flexDirection: 'row'}}>
        <Text style={styles.timeHeader}>Time: </Text>
          <Text style={styles.time}>{Time}</Text>
        </View>
        <Text style={styles.descriptionTitle}>Description</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{Description}</Text>
          </View>
          
          <View style={styles.footer}>
            <Button
              title={canJoin ? 'Join Event!' : 'Leave Event!'}
              onPress={canJoin ? joinEvent : unjoinEvent}
              disabled={isCreator}
            />
          </View>
        </View>
        <View>
          {/* flatlist for all the participants in the event */}
          <Text>Participants</Text>
          {/* <FlatList
            data={Participants}
            renderItem={}
          /> */}
        </View>
      </View>
    </ImageBackground>
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
    flex: 1,
    justifyContent: 'flex-start', 
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', 
  },
  timeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 18,
    marginBottom: 10,
    color: 'lightgrey',
    backgroundColor: 'black',
    borderRadius: 20,
    paddingLeft: 10,
    borderLeftWidth: 10,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)', 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 20,
    height: 350,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
  },
  descriptionText: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
  },
  footer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
});

export default EventPage;
