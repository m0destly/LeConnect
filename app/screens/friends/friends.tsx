import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, Alert, FlatList, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase/compat';
import { EventProfile, EventProfileData } from '@/app/types.d';
import UserContext from '@/app/userContext';
import FriendRequestModalScreen from './friendReqModal';

const FriendsScreen = ({ navigation }) => {

    const { user } = useContext(UserContext);
    const [friendsProfiles, setFriendsProfiles] = useState(new Array<any>);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        firebase.firestore()
            .collection('users')
            .where('User', '==', user.id)
            .onSnapshot(querySnapshot => {
                const promises = []; // Array to store all promises for Firebase queries
                querySnapshot.forEach(documentSnapshot => {
                    // console.log("Array from backend: ", documentSnapshot.data().Friends);
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
                                // console.log("DocumentSnapshot: ", documentSnapshot.data());
                            });
                        });

                        // Now profileArray should be populated with all friend profiles
                        setFriendsProfiles(profileArray);
                    })
                    .catch(error => {
                        console.error('Error fetching friends profiles:', error);
                    });
            });
        // console.log("friendsProfiles ", friendsProfiles);

    }, []);

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
            <Button
                title="Manage Friend Request"
                onPress={showRequests}
                icon={<Icon name="group-add" type="material" size={20} color="white" />}
            />
            <FriendRequestModalScreen
                visible={isVisible}
                onClose={hideRequests}
                navigation={navigation}
                
            />
            <View style={styles.flatListContainer}>
                <FlatList
                    data={friendsProfiles}
                    renderItem={renderEventProfile}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flatListContainer: {
        marginTop: 40,
        justifyContent: 'center'
    }
});

export default FriendsScreen;