import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableHighlight, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, query, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  // initialize service
  const db = getFirestore();
  // collction reference
  const colRef = collection(db, 'events');
  // get collection data
  const events = [];
  getDocs(colRef)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        events.push({ ...doc.data(), id: doc.id })
      })
      console.log(events);
    })
    .catch(err => {
      console.log(err.message)
    })

  const saveData = () => {
    navigation.navigate('LoginScreen');
  };

  const [selectedFilter, setSelectedFilter] = useState('');
  const [data, onChangeData] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Sort by:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            dropdownIconColor={'black'}
            selectedValue={selectedFilter}
            onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          >
            <Picker.Item label="Time" value="Time" />
            <Picker.Item label="Categories" value="Categories" />
            <Picker.Item label="Distance" value="Distance" />
          </Picker>
        </View>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={onChangeData}
        value={data}
        placeholder="Enter something"
      />
      <Button title="Save input" onPress={saveData} />
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
});

export default HomeScreen;