import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView, FlatList, Platform, Linking } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase/compat/app';
import UserContext from '@/app/userContext';
import { EventProfile, EventProfileData } from '@/app/types.d';

const EventPage = ({ route, navigation }) => {

  const { user } = useContext(UserContext);
  const { Title, Time, id, Description, Creator, Participants, Location } = route.params;
  const [isCreator, setIsCreator] = useState(false);
  const [index, setIndex] = useState(-1);
  const [canJoin, setCanJoin] = useState(false);
  const [clean, setClean] = useState('');
  const [participants, setParticipants] = useState(new Array<any>());
  const [creatorFields, setCreatorFields] = useState(new Object);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // obtain the Creator
      firebase
        .firestore()
        .collection('users')
        .where('User', '==', Creator)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            setCreatorFields(documentSnapshot.data());
            console.log("Document: ", documentSnapshot.data());
          })
        });
      
      // obtain all the data of the participants
      firebase
        .firestore()
        .collection('users')
        .where('User', 'in', Participants)
        .onSnapshot(querySnapshot => {
          const participantsData = new Array<any>();
          querySnapshot.forEach(documentSnapshot => {
            if (!documentSnapshot.data().empty) {
              participantsData.push(documentSnapshot.data());
            }
          });
          setParticipants(participantsData);
        });

    } catch (error: any) {
      // handles the case where Participants array is empty in the bggining
      if (error.code !== 'invalid-argument') {
        Alert.alert('Error, ' + error.message);
      }

    } finally {
      Creator === user.id ? setIsCreator(true) : setIsCreator(false);
      // query if participant has joined
      // if not, do nth
      // if joined, setIsJoined(true)
      // if isJoined true, button becomes unjoin
      // unjoin => setIsJoined(false)
      const initial = Participants.indexOf(user.id);
      // initial === -1 refers to user.id not found in the array
      if (initial === -1) {
        setCanJoin(true);
      }
      setIndex(initial);
      cleanLocation();
    }
  }, [canJoin]);

  const cleanLocation = () => {
    if (Platform.OS === 'android') {
      setClean(Location.replaceAll(' ', '+').replaceAll(',', '%2C').replaceAll('|', '%7C'));
    } else {
      setClean(Location.replaceAll(' ', '+'));
    }
  };

  const openDirections = () => {
    const url = Platform.OS === 'android'
      ? `https://www.google.com/maps/dir/?api=1&destination=${clean}`
      : `http://maps.apple.com/?daddr=${clean}`;
    console.log(clean);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', "Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const joinEvent = async () => {
    try {
      Participants.push(user.id);
      await firebase.firestore()
        .collection("events")
        .doc(id)
        .update({
          Participants: Participants,
        })
        .then(() => {
          Alert.alert('Successfully joined event!');
        });
      setCanJoin(false);
    } catch (error: any) {
      Alert.alert('error');
      console.log(error.message);
    }
  };

  const unjoinEvent = async () => {
    try {
      Participants.splice(index, 1);
      await firebase.firestore()
        .collection("events")
        .doc(id)
        .update({
          Participants: Participants,
        })
        .then(() => {
          Alert.alert('Successfully left event!');
        });
      setCanJoin(true);
    } catch (error: any) {
      Alert.alert('error');
      console.log(error.message);
    }
  };

  const renderEventProfile = ({ item }) => {
    return (
      <EventProfile
        item={item}
        onPress={() => item.User == user.id
          ? Alert.alert("Stop!", "Please view your own profile from the Profile tab")
          : toProfile(item)}
      />
    );
  };

  const toProfile = (item: EventProfileData) => {
    navigation.navigate('DisplayProfile', {
      Name: item.Name,
      Age: item.Age,
      Gender: item.Gender,
      Contact: item.Contact,
      Bio: item.Bio,
      User: item.User,
      Pic: item.Pic,
      PicName: item.PicName,
    })
  };

  const handleConfirm = async () => {
    await firebase
      .firestore()
      .collection('events')
      .doc(id)
      .delete()
      .then(() => {
        closeModal();
        navigation.pop();
        Alert.alert('Success', 'Event deleted successfully');
      })
      .catch(
        (err) => Alert.alert('Error', `Failed to delete event: ${err}`)
      )
  }

  // opens the modal
  const openModal = () => {
    setIsVisible(true);
  }

  const closeModal = () => {
    setIsVisible(false);
  }

  return (
    <View style={styles.overlay}>
      <View style={{ flex: 1, marginLeft: 20 }}>
        <ScrollView contentContainerStyle={{
        }} horizontal={true}>
          <Text style={styles.title}>{Title}</Text>
        </ScrollView>
      </View>

      <View style={styles.eventContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Time</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.field}>{Time}</Text>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Location</Text>
          <ScrollView style={styles.descriptionContainer} horizontal={true}>
            <Text style={styles.field}>{Location}</Text>
          </ScrollView>
          <Button
            title='Directions'
            onPress={openDirections}
            icon={<Icon 
              name='place'
              type='material'
              color='white' />
            }
            titleStyle={{ marginHorizontal: 5 }}
            buttonStyle={{
              borderRadius: 30
            }}
          />

        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Creator</Text>
          <TouchableOpacity
            onPress={() =>
              Creator === user.id
                ? Alert.alert("Stop!", "Please view your own profile from the Profile tab")
                : toProfile(creatorFields)}
            style={styles.profileCreatorContainer}>
            <Image
              source={{ uri: creatorFields.Pic }}
              style={styles.profilePic}>
            </Image>
            <Text style={styles.profileName}>
              {creatorFields.Name}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldHeader}>Description</Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{Description}</Text>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Button
            title={isCreator 
              ? 'Delete Event' 
              : (canJoin 
                  ? 'Join Event' 
                  : 'Leave Event')}
            onPress={isCreator 
              // shows the modal if is a creator
              ? openModal 
              : (canJoin 
                  ? joinEvent 
                  : unjoinEvent)}
            titleStyle={{ marginHorizontal: 5 }}
            buttonStyle={isCreator 
              ? { backgroundColor: 'red', borderRadius: 30 } 
              : (canJoin ? {backgroundColor: 'green', borderRadius: 30} 
                : {backgroundColor: 'orange', borderRadius: 30})}
            icon={ isCreator 
              ? <Icon name="delete" type="material" size={20} color="white"/>
              : (canJoin
                ? <Icon name="person-add-alt-1" type="material" size={20} color="white"/>
                : <Icon name="person-remove-alt-1" type="material" size={20} color="white"/>
              )
            }
          />
        </View>

        <Text style={styles.fieldHeader}>Participants</Text>
        {Participants.length > 0 ?
          <FlatList
            data={participants}
            renderItem={renderEventProfile}
          /> :
          <Text style={{ fontSize: 20 }}>
            Be the first to join this event!
          </Text>
        }

        <Modal
          transparent={true}
          visible={isVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Are you sure you want to delete this event?</Text>

              <View style={styles.buttonContainer}>
                <Button
                  title='Yes'
                  onPress={handleConfirm}
                  icon={<Icon
                    name='done'
                    type='material'
                    color='white' />
                  }
                  titleStyle={{ 
                    marginHorizontal: 5,
                    color: 'white' 
                  }}
                  buttonStyle={{
                    backgroundColor: 'red',
                    borderRadius: 30,
                    width: 80
                  }}
                />

                <Button
                  title='No'
                  onPress={closeModal}
                  icon={<Icon
                    name='close'
                    type='material'
                    color='white' 
                  />}
                  titleStyle={{ 
                    marginHorizontal: 5,
                    color: 'white'
                   }}
                  buttonStyle={{
                    backgroundColor: 'green',
                    borderRadius: 30,
                    width: 80
                  }}
                />

              </View>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  eventContainer: {
    flex: 10,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  fieldContainer: {
    flexDirection: 'column',
  },
  fieldHeader: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  field: {
    fontSize: 18,
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    marginBottom: 10,
    maxHeight: 150,
  },
  descriptionText: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
    padding: 15,
  },
  profileCreatorContainer: {
    flexDirection: 'row',
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'grey',
    marginBottom: 10,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    alignSelf: 'center',
    color: 'white',
  },
  profilePic: {
    width: 25,
    height: 25,
    borderRadius: 10,
    alignSelf: 'center',
  },
  footer: {
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default EventPage;