import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Alert, Linking, Platform, LogBox
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firebase from 'firebase/compat/app';
import UserContext from '@/app/userContext';

const CreateEventsScreen = ({ navigation }) => {

  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [categories, setCategories] = useState([
    { label: 'Study', value: 'study' },
    { label: 'Eat', value: 'eat' },
    { label: 'Sports', value: 'sports' },
    { label: 'Others', value: 'others' },
  ]);
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [location, setLocation] = useState('');

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const createEvents = async () => {
    try {
      await firebase.firestore().collection('events').add({
        Title: title,
        Category: value,
        Description: description,
        Time: selectedDate,
        Creator: user.id,
        Participants: new Array<String>(),
        Location: location
      });
      Alert.alert("Success", "Event created successfully!");
      resetEvents();
      //navigation.goBack(); // Navigate back after successful creation
    } catch (error: any) {
      Alert.alert("Error", "Failed to create event: " + error.message);
    }
  };

  const sendToBackEnd = async () => {
    if (title.trim().length == 0 ||
      value.length == 0 || location.trim().length == 0) {
      Alert.alert("Error", "Do not leave any fields empty");
    } else {
      createEvents();
    }
  };

  const resetEvents = () => {
    setTitle('');
    setOpen(false);
    setValue([]);
    setCategories([
      { label: 'Study', value: 'study' },
      { label: 'Eat', value: 'eat' },
      { label: 'Sports', value: 'sports' },
      { label: 'Others', value: 'others' },
    ]);
    setDescription('');
    setSelectedDate(new Date());
    setDatePickerVisibility(false);
    setLocation('');
  };

  const openMaps = () => {
    const url = Platform.OS === 'android'
      ? 'https://maps.google.com'
      : 'http://maps.apple.com?daddr=';
    Linking.openURL(url);
  }

  return (
    <ScrollView>
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            maxLength={50}
            placeholder="Enter title here..."
          />
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Categories</Text>
          <DropDownPicker
            style={styles.dropdown}
            multiple={true}
            min={1}
            max={5}
            open={open}
            value={value}
            items={categories}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setCategories}
            placeholder={'Select categories...'}
            mode="SIMPLE"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
            <Text style={styles.dateButtonText}>Pick Date & Time</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={(date) => {
              setSelectedDate(date);
              hideDatePicker();
            }}
            onCancel={hideDatePicker}
          />
          <Text style={styles.selectedDateText}>Selected: {selectedDate.toString().substring(0, 21)}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLocation}
            value={location}
            placeholder='Paste location here...'
          />
          <TouchableOpacity style={styles.dateButton} onPress={openMaps}>
            <Text style={styles.dateButtonText}>Open Maps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            onChangeText={setDescription}
            value={description}
            placeholder="Enter description here..."
            maxLength={500}
            multiline={true}
            blurOnSubmit={true}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={sendToBackEnd}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  inputContainer: {
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  dateButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedDateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    height: 170,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateEventsScreen;