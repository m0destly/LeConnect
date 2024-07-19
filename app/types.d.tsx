import { Timestamp } from "firebase/firestore";
import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export interface EventData {
  Title: String;
  Category: Object[];
  Description: String;
  Time: Timestamp;
  id: String;
  Creator: String;
  Participants: String[];
  Location: String;
};

export const Event = ({item, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[eventStyles.eventContainer]}>
      <Text style={[eventStyles.eventTitle]}>
        {item.Title}
      </Text>
      <Text style={eventStyles.eventCategory}>
        Categories: {item.Category.join(', ')}
      </Text>
      <Text style={eventStyles.eventTime}>
        Time: {item.Time.toDate().toString().substring(0, 21)}
      </Text>
    </TouchableOpacity>
  );
};

export interface EventProfileData {
  Name: String;
  Pic: String;
};

export const EventProfile = ({item, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[eventProfileStyles.profileContainer]}>
      <Image
        source={{uri: item.Pic}}
        style={eventProfileStyles.profilePic}>
      </Image>
      <Text style={eventProfileStyles.profileName}>
        {item.Name}
      </Text>
    </TouchableOpacity>
  )
}

const eventStyles = StyleSheet.create({
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

const eventProfileStyles = StyleSheet.create({
  profileContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'grey',
    flexDirection: 'row',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    alignSelf: 'center',
  }, 
  profilePic: {
    width: 25,
    height: 25,
    borderRadius: 10,
    alignSelf: 'center',
  }
})