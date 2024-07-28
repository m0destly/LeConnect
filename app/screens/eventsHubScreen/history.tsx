import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import UserContext from '@/app/userContext';
import firebase from 'firebase/compat';
import { EventData, Event } from '@/app/types.d';

const HistoryScreen = ({ navigation }) => {
  
  const { user } = useContext(UserContext);
  const [eachEvent, setEachEvent] = useState([]);
  const [joinedEvent, setJoinedEvent] = useState([]);

  // a function that helps navigate to the Event Page
  const toEvent = (item: EventData) => {
    navigation.navigate('EventPage', {
      Title: item.Title,
      Time: item.Time.toDate().toString().substring(0, 21),
      id: item.id,
      Description: item.Description,
      Creator: item.Creator,
      Participants: item.Participants,
      Location: item.Location
    });
  };

  // Renders each item in the flatlist
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
      firebase
        .firestore()
        .collection('events')
        .where('Creator', "==", user.id)
        .where('Time', '<', new Date())
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
      firebase
        .firestore()
        .collection('events')
        .where('Participants', "array-contains", user.id)
        .where('Time', '<', new Date())
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
      <View style={styles.flatListContainer}>
        <Text style={styles.title}>Events Created By Me</Text>
        <FlatList
          data={eachEvent}
          renderItem={renderEvent}

        />
      </View>
      
      <View style={styles.flatListContainer}>
        <Text style={styles.title}>Events Joined</Text>
        <FlatList
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
    marginBottom: 10,
  },
  flatListContainer: {
    flex: 1,
  },
});

export default HistoryScreen;