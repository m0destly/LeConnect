import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import UserContext from '@/app/userContext';
import firebase from 'firebase/compat';
import LoginScreen from '../login/login';
import { EventData, Event } from '@/app/types.d';
import EventPage from '../home/eventPage';
import useTailwind from 'tailwind-rn';
const EventsHubScreen = ({ navigation }) => {
  
  const { user, clearUser } = useContext(UserContext);
  const [eachEvent, setEachEvent] = useState([]);
  const [joinedEvent, setJoinedEvent] = useState([]);

  const handlePress = () => {
    navigation.navigate('LoginScreen');
  };

  const toEvent = (item: EventData) => {
    navigation.navigate('EventPage', {
      Title: item.Title,
      Category: item.Category,
      Time: item.Time.toDate().toString().substring(0, 21),
      id: item.id,
      Description: item.Description,
      Creator: item.Creator,
      Participants: item.Participants,
    });
  };

  const renderEvent = ({item}) => {
    return (
      <Event
        item={item}
        onPress={() => toEvent(item)}
      />
    );
  };

  useEffect(() => {
    const myEvents = async () => {
      await firebase
        .firestore()
        .collection('events')
        .where('Creator', "==", user.id)
        .orderBy('Time', 'asc')
        .onSnapshot(querySnapshot => {
          const myEventsDatabase = [];

          querySnapshot.forEach(documentSnapshot => {
            myEventsDatabase.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            });
          });
          setEachEvent(myEventsDatabase);
        });
    };

    const joinedEvents = async () => {
      await firebase
        .firestore()
        .collection('events')
        .where('Participants', "array-contains", user.id)
        .orderBy('Time', 'asc')
        .onSnapshot(querySnapshot => {
          const joinedEventsDatabase = [];

          querySnapshot.forEach(documentSnapshot => {
            joinedEventsDatabase.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            });
          });
          setJoinedEvent(joinedEventsDatabase);
        });
    };
    
    myEvents();
    joinedEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events Created By Me</Text>
      <View style={styles.flatListContainer}>
        <FlatList
          style={styles.flatList}
          data={eachEvent}
          renderItem={renderEvent}

        />
      </View>
      <Text style={styles.title}>Events Joined</Text>
      <View style={styles.flatListContainer}>
        <FlatList
          style={styles.flatList}
          data={joinedEvent}
          renderItem={renderEvent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
  },
  flatListContainer: {
    height: '40%',
  },
  flatList: {
    height: 300,
  },
});

export default EventsHubScreen;