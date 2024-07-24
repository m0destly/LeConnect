import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Alert, Modal, Image, FlatList, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase/compat';
import { TouchableOpacity } from 'react-native';
import { EventProfileData } from '../../types.d'
import UserContext from '@/app/userContext';

const FriendRequestModalScreen = ({ navigation, visible, onClose }) => {

    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState(new Array<any>());
    // use on snapshot to obtain requests where receiver is curr user
    useEffect(() => {
        try {
            firebase.firestore()
                .collection('requests')
                .where('Receiver', '==', user.id)
                .onSnapshot(querySnapshot => {
                    const friendRequestsFromDB = new Array<any>();
                    querySnapshot.forEach(documentSnapshot => {
                        const currSender = documentSnapshot.data().Sender;
                        const docID = documentSnapshot.id;
                        console.log(currSender);
                        console.log(docID);
                        obtainUserData(currSender).then(friend => {
                            console.log("Profile " + friend);
                            friendRequestsFromDB.push({
                                id: docID,
                                ...friend,
                            });
                        });
                    });
                    setFriendRequests(friendRequestsFromDB);
                });

        } catch (error: any) {
            Alert.alert('Error, ' + error.message);
        }
    }, [])

    // a function that gets the user data from back end
    const obtainUserData = async (id: String) => {
        let tempData = new Object;
        const snapshot = await firebase.firestore()
            .collection('users')
            .where('User', '==', id)
            .get();
        snapshot.forEach(documentSnapshot => {
            tempData = documentSnapshot.data();
        })
        console.log("TempData: " + tempData);
        return tempData;
    }

    const acceptFriendRequest = async (sender: String, receiver: String, docID: string) => {
        // add friend
        // delete the request
        await firebase.firestore()
            .collection('requests')
            .doc(docID)
            .delete()
            .then(() => {
                console.log("Successfully deleted");
            })
            .catch((error) => {
                console.log("Error removing document: ", error.message);
            })
        addFriend(sender, receiver);
        addFriend(receiver, sender);
        Alert.alert("Friend request accepted");
    }

    const addFriend = async (sender: String, receiver: String) => {
        // updates the friend's array of the current logged in user
        let docID = '';
        let FriendsArray = new Array<String>();
        try {
            // retrieves the friends array for the user currently logged in 
            const querySnapshot = await firebase.firestore()
                .collection('users')
                .where('User', '==', sender)
                .get();

            querySnapshot.forEach(documentSnapshot => {
                docID = documentSnapshot.id;
                FriendsArray = documentSnapshot.data().Friends;
            })

            // add to friends array
            FriendsArray.push(receiver);

            // upload the new friends array
            await firebase.firestore().collection('users').doc(docID).update({
                Friends: FriendsArray,
            });
            // Alert.alert("Success!");
        } catch (error: any) {
            Alert.alert("Error", error.message)
        }
    };

    // removs from requests colleection
    const rejectFriendRequest = async (docID: string) => {
        await firebase.firestore()
            .collection('requests')
            .doc(docID)
            .delete()
            .then(() => {
                console.log("Successfully deleted");
                Alert.alert("Friend request rejected");
            })
            .catch((error) => {
                console.log("Error removing document: ", error.message);
            })
    }

    const renderRequest = ({ item }) => {
        return (
            <View style={styles.requestBlock}>
                <TouchableOpacity
                    onPress={() => toProfile(item)}
                    style={styles.requestContainer}>
                    <Image
                        source={{ uri: item.Pic }}
                        style={styles.requestPic}>
                    </Image>
                    <Text style={styles.requestName}>
                        {item.Name}
                    </Text>
                </TouchableOpacity>
                <View style={styles.requestButtonContainer}>
                    <Button
                        onPress={() => acceptFriendRequest(item.User, user.id, item.id)}
                        icon={<Icon name="check-circle-outline" type="material" size={20} color="green" />}
                        type={'clear'}
                    />
                    <Button
                        onPress={() => rejectFriendRequest(item.id)}
                        icon={<Icon name="highlight-off" type="material" size={20} color="red" />}
                        type={'clear'}
                    />
                </View>
            </View>
        )
    }

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
        onClose();
    }

    return (
        <Modal
            visible={visible}
            onDismiss={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>My Friend Requests</Text>
                    <FlatList
                        data={friendRequests}
                        renderItem={renderRequest}
                    />
                    <TouchableOpacity 
                        style={styles.modalCancel}
                        onPress={onClose}>
                        <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalCancel: {
        backgroundColor: "#A30000",
        borderRadius: 10,
        padding: 10,
    },
    modalCancelText: {
        fontSize: 20,
        color: 'white',
    },
    requestBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
    },
    requestContainer: {
        padding: 5,
        flexDirection: 'row',
    },
    requestButtonContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },
    requestName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
        alignSelf: 'center',
    },
    requestPic: {
        width: 25,
        height: 25,
        borderRadius: 10,
        alignSelf: 'center',
    }
});

export default FriendRequestModalScreen;