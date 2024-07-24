import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const ModalScreen = ({ visible, onClose, setImage, setFileName }) => {

  const choosePicture = async () => {
    const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setFileName(uuidv4());
        onClose();
      }
    }
  };

  const takePicture = async () => {
    const status = await ImagePicker.requestCameraPermissionsAsync();
    if (status) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setFileName(uuidv4());
        onClose();
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Mode</Text>

          <TouchableOpacity style={styles.actionButton} onPress={takePicture}>
            <MaterialCommunityIcons name="camera" size={40} color="white" />
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={choosePicture}>
            <MaterialCommunityIcons name="image" size={40} color="white" />
            <Text style={styles.buttonText}>Choose Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#FF4136',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ModalScreen;