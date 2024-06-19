import React from 'react';
import { View, Text, StyleSheet, Button, ImageBackground } from 'react-native'

const EventPage = ({ route, navigation }) => {
  
  const { Title, Category, TimeCreated, Description } = route.params;

  return (
    <ImageBackground
      source={require('../../../assets/images/join-event.jpeg')}
      style={styles.background}
      resizeMode='cover'
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{Title}</Text>
          <Text style={styles.time}>{TimeCreated}</Text>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{Description}</Text>
          </View>
          
          <View style={styles.footer}>
            <Button
              title='Join Event!'
              onPress={() => navigation.navigate('LeConnect')}
              color='#0079D3' 
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', 
  },
  time: {
    fontSize: 18,
    marginBottom: 10,
    color: 'lightgrey',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 20,
    height: 350,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
  },
  descriptionText: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
  },
  footer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
});

export default EventPage;