import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput,  ScrollView, Alert, Linking, Platform, LogBox } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firebase from 'firebase/compat/app';
import UserContext from '@/app/userContext';

const CreateEventsScreen = () => {

  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [categories, setCategories] = useState([
    { label: 'Study', value: 'Study' },
    { label: 'Eat', value: 'Eat' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Others', value: 'Others' },
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
        Participants: [],
        Location: location
      });
      Alert.alert("Success", "Event created successfully!");
      resetEvents();
    } catch (error: any) {
      Alert.alert("Error", "Failed to create event: " + error.message);
    }
  };

  const sendToBackEnd = async () => {
    if (title.trim().length === 0 ||
      value.length === 0 ||
      location.trim().length === 0 ||
      description.trim().length === 0) {
      Alert.alert("Error", "Do not leave any fields empty.");
    } else if (selectedDate.valueOf() < new Date().valueOf()) {
      Alert.alert("Error", "Event must be set to current time or later.")
    } else {
      createEvents();
    }
  };

  const resetEvents = () => {
    setTitle('');
    setOpen(false);
    setValue([]);
    setCategories([
      { label: 'Study', value: 'Study' },
      { label: 'Eat', value: 'Eat' },
      { label: 'Sports', value: 'Sports' },
      { label: 'Others', value: 'Others' },
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
            placeholder="Enter title here"
            placeholderTextColor='#C7C7CD'
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
            placeholder={'Select categories'}
            mode="SIMPLE"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date & Time</Text>

          <Button
            onPress={showDatePicker}
            buttonStyle={{ borderRadius: 30 }}
            title='Pick Date and Time'
            titleStyle={{ marginHorizontal: 5 }}
            icon={<Icon name="edit-calendar" type="material" size={20} color="white" />}
          />

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
            style={[styles.input, styles.inputLocation]}
            onChangeText={setLocation}
            value={location}
            placeholder='Paste location from Maps here'
            placeholderTextColor='#C7C7CD'
            maxLength={150}
            multiline={true}
            textAlignVertical='top'
          />

          <Button
            title={Platform.OS === 'android' ? 'Open Google Maps' : 'Open Apple Maps'}
            onPress={openMaps}
            icon={<Icon
              name='map-search-outline'
              type='material-community'
              color='white' />
            }
            titleStyle={{ marginHorizontal: 5 }}
            buttonStyle={{
              borderRadius: 30,
              marginTop: 10,
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputDescription]}
            onChangeText={setDescription}
            value={description}
            placeholder="Enter description here"
            placeholderTextColor='#C7C7CD'
            maxLength={500}
            multiline={true}
            textAlignVertical='top'
            keyboardType='default'
          />
        </View>

        <Button
          onPress={sendToBackEnd}
          buttonStyle={{ borderRadius: 30, backgroundColor: 'green' }}
          title='Submit'
          titleStyle={{ marginHorizontal: 5 }}
          icon={<Icon name="upload" type="material" size={20} color="white" />}
        />
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
  selectedDateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  inputLocation: {
    height: 80,
  },
  inputDescription: {
    height: 200,
  }
});

export default CreateEventsScreen;