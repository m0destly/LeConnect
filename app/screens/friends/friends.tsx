import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, FlatList, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase/compat';
import { EventProfile, EventProfileData } from '@/app/types.d';
import UserContext from '@/app/userContext';
import FriendRequestModalScreen from './friendReqModal';

const FriendsScreen = ({ navigation }) => {

    const { user } = useContext(UserContext);
    const [friendsProfiles, setFriendsProfiles] = useState(new Array<any>);
    const [friendRequests, setFriendRequests] = useState(new Array<any>);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            firebase.firestore()
                .collection('requests')
                .where('Receiver', '==', user.id)
                .onSnapshot(querySnapshot => {
                    const promises = querySnapshot.docs.map(documentSnapshot => {
                        const currSender = documentSnapshot.data().Sender;
                        const docID = documentSnapshot.id;
                        return obtainUserData(currSender).then(friend => {
                            return {
                                id: docID,
                                ...friend,
                            };
                        });
                    });

                    Promise.all(promises)
                        .then(results => {
                            setFriendRequests(results);
                        })
                        .catch(error => {
                            console.error('Error fetching friend requests:', error);
                        });
                });

        } catch (error: any) {
            Alert.alert('Error, ' + error.message);
        } finally {
            firebase.firestore()
                .collection('users')
                .where('User', '==', user.id)
                .onSnapshot(querySnapshot => {
                    const promises = []; // Array to store all promises for Firebase queries
                    querySnapshot.forEach(documentSnapshot => {
                        // for loop in here
                        for (const friends of documentSnapshot.data().Friends) {
                            const friendQuery = firebase.firestore()
                                .collection('users')
                                .where('User', '==', friends)
                                .get();
                            promises.push(friendQuery);
                        }

                    })
                    // Resolve all promises once all Firestore queries are complete
                    Promise.all(promises)
                        .then(querySnapshots => {
                            let profileArray = new Array<any>();
                            querySnapshots.forEach(querySnapshot => {
                                querySnapshot.forEach(documentSnapshot => {
                                    profileArray.push(documentSnapshot.data());
                                });
                            });

                            // Now profileArray should be populated with all friend profiles
                            setFriendsProfiles(profileArray);
                        })
                        .catch(error => {
                            console.error('Error fetching friends profiles:', error);
                        });
                });
        }

    }, []);

    // a function that gets the user data from back end
    const obtainUserData = async (id: String) => {
        try {
            let tempData = new Object;
            const snapshot = await firebase.firestore()
                .collection('users')
                .where('User', '==', id)
                .get();
            snapshot.forEach(documentSnapshot => {
                tempData = documentSnapshot.data();
            })
            return tempData;
        } catch (error: any) {
            console.log("Error fetching user data: ", error.message);
            return null;
        }
    }

    // need a onPress to view the friends request, launch modal?
    const showRequests = () => {
        setIsVisible(true);
    }

    const hideRequests = () => {
        setIsVisible(false);
    }

    const renderEventProfile = ({ item }) => {
        return (
            <EventProfile
                item={item}
                onPress={() => toProfile(item)}
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
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Friends</Text>
            <FriendRequestModalScreen
                visible={isVisible}
                onClose={hideRequests}
                navigation={navigation}
            />
            <View style={styles.flatListContainer}>
                <Button
                    title={`Pending Friend Requests: ${friendRequests.length}`}
                    titleStyle={{ marginHorizontal: 5 }}
                    onPress={showRequests}
                    icon={<Icon name="group-add" type="material" size={20} color="white" />}
                    buttonStyle={{
                        justifyContent: 'center',
                        borderRadius: 30,
                        marginBottom: 10,
                    }}
                />

                {friendsProfiles.length !== 0 ?
                    <FlatList
                        data={friendsProfiles}
                        renderItem={renderEventProfile}
                    /> : 
                    <View style={styles.noFriendsContainer}>
                        <Text style={styles.noFriendsText}>No friends yet...</Text>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        marginVertical: 30,
        alignSelf: 'center',
    },
    flatListContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    noFriendsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    noFriendsText: {
        textAlign: 'center',
        fontSize: 20,
    },
});

export default FriendsScreen;