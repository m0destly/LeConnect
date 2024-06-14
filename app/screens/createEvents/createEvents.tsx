import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CreateEventsScreen = ({ navigation }) => {

  const submitEvent = () => {
    navigation.navigate('Login');
  };

  const [title, onChangeTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [categories, setCategories] = useState([
    { label: 'Study', value: 'study' },
    { label: 'Eat', value: 'eat' },
    { label: 'Sports', value: 'sports' },
    { label: 'Others', value: 'others' },
  ]);

  const [description, onChangeDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTitle}
            value={title}
            maxLength={50}
            placeholder="Enter title here..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categories</Text>
          <DropDownPicker
            style={styles.dropdown}
            multiple={true}
            min={0}
            max={5}
            open={open}
            value={value}
            items={categories}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setCategories}
            placeholder={'Select categories...'}
            mode="BADGE"
            badgeDotColors={["#34495E", "#E74C3C", "#3498DB", "#2ECC71", "#F1C40F"]}
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
            onConfirm={setSelectedDate}
            onCancel={hideDatePicker}
          />
          <Text style={styles.selectedDateText}>Selected: {selectedDate.toLocaleString()}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            onChangeText={onChangeDescription}
            value={description}
            placeholder="Enter description here..."
            maxLength={500}
            multiline={true}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitEvent}>
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
