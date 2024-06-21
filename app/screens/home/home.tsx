import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableHighlight, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, query, getDocs, addDoc, setDoc, doc, QuerySnapshot, Timestamp } from 'firebase/firestore';
import firestore from 'firebase/compat/app';
import firebase from 'firebase/compat/app';
import LoginScreen from '../login/login';
import eventPage from './eventPage'
import UserContext from '@/app/userContext';

const HomeScreen = ({ navigation }) => {
  
  const { user, clearUser } = useContext(UserContext);
  const [eachData, setEachData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  
  useEffect(() => {
    const test = async () => {
      try {
        const result = await firebase
          .firestore()
          .collection("events")
          .orderBy('TimeCreated', 'asc')
          .onSnapshot(querySnapshot => {
            const eventsFromDatabase = [];

            querySnapshot.forEach(documentSnapshot => {
              eventsFromDatabase.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
              });
            });
            console.log(eventsFromDatabase);
            setEachData(eventsFromDatabase);
        });

      } catch (error: any) {
        Alert.alert('error is' + error.message());
      }
    };

    test();
  }, []);

  type EventData = {
    Title: String;
    Category: Object[]; 
    Description: String; 
    TimeCreated: Timestamp;
    id: String;
  };

  type EventProps = {
    item: EventData;
    backgroundColor: String;
    textColor: String;
  }

  const Event = ({ item }: EventProps) => {

    const toEvent = () => {
      // handles the logic when you press onto each event
      // enter event page: see user created + description
      navigation.navigate('EventPage', {
        Title: item.Title,
        Category: item.Category,
        TimeCreated: item.TimeCreated.toDate().toString().substring(0, 24),
        id: item.id,
        Description: item.Description,
      });
    };

    return (
      <TouchableOpacity
        onPress={toEvent}
        style={[styles.eventContainer]}>
        <Text style={[styles.eventTitle]}>
          {item.Title}
        </Text>
        <Text style={styles.eventCategory}>
          Categories: {item.Category.join(', ')}
        </Text>
        <Text style={styles.eventTime}>
          Time: {item.TimeCreated.toDate().toString().substring(0, 24)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEvent = ({item} : {item: EventData}) => {
    return (
      <Event
        item={item}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen {user.id}</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Sort by:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            dropdownIconColor={'black'}
            selectedValue={selectedFilter}
            onValueChange={setSelectedFilter}
          >
            <Picker.Item label="Time" value="Time" />
            <Picker.Item label="Categories" value="Categories" />
            <Picker.Item label="Distance" value="Distance" />
          </Picker>
        </View>
      </View>
      <View>
      </View>
      <FlatList 
        data={eachData}
        renderItem={renderEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginTop: 10,
  },
  filterText: {
    fontSize: 16,
  },
  pickerContainer: {
    justifyContent: 'center',
    width: 160,
    height: 10
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  eventContainer: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#b5dafe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  eventCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;