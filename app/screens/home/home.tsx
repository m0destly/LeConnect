import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableHighlight, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, query, getDocs, addDoc, setDoc, doc, QuerySnapshot } from 'firebase/firestore';
import firestore from 'firebase/compat/app';
import firebase from 'firebase/compat/app';

const HomeScreen = ({ navigation }) => {

  // start
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Get a collection reference
        const collectionRef = firebase.firestore().collection('events');

        // Get all documents in the collection
        const querySnapshot = await collectionRef.get();

        // Extract document data
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id, // Include document ID
          ...doc.data() // Include document data
        }));

        // Update the state with the retrieved documents
        setDocuments(docs);
      } catch (err : any) {
        // Update the state with the error
        setError(err);
      } finally {
        // Update the loading state to false
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);
  // end

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
            onValueChange={setSelectedFilter}
          >
            <Picker.Item label="Time" value="Time" />
            <Picker.Item label="Categories" value="Categories" />
            <Picker.Item label="Distance" value="Distance" />
          </Picker>
        </View>
      </View>
      <View style={styles.eventsContainer}>
        {/* start */}
        {documents.length > 0 ? (
          <FlatList
            data={documents}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text>Title: {item.Title}</Text> 
                <Text>Categories: {item.Category}</Text> 
              </View>
            )}
          />
        ) : (
          <Text>No documents found</Text>
        )}
        {/* end */}
      </View>
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
  eventsContainer: {

  },
});

export default HomeScreen;