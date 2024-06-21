import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import UserContext from '@/app/userContext';
import firebase from 'firebase/compat';

const EventsHubScreen = ({ navigation }) => {
  
  const { user, clearUser } = useContext(UserContext);
  const [eachEvent, setEachEvent] = useState([]);

  const handlePress = () => {
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    const myEvents = async () => {
      await firebase
        .firestore()
        .collection('events')
        .where('Creator', "==", user.id)
        // .orderBy('Time', 'asc')
        // orderBy and where conflict
        // https://stackoverflow.com/questions/56614131/firestore-orderby-and-where-conflict
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

    myEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User ID: {user.id}</Text>
      <Button title="Go to Details" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default EventsHubScreen;