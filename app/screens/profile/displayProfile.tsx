import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, ScrollView, Text, StyleSheet, Image } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import UserContext from '@/app/userContext';
import firebase from 'firebase/compat';

const DisplayProfileScreen = ({ navigation, route }) => {
    const { user } = useContext(UserContext);
    const { Name, Age, Gender, Contact, Bio, User, Pic } = route.params;
    const [friendMessage, setFriendMessage] = useState('Add friend');
    const [isFriend, setIsFriend] = useState(false);
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        try {
            firebase.firestore().collection('users')
                .where('User', '==', user.id)
                .where('Friends', 'array-contains', User)
                .onSnapshot(friendsSnapshot => {
                    if (!friendsSnapshot.empty) {
                        setFriendMessage('Already friends');
                        setDisable(true);
                        setIsFriend(true);
                    }
                });
            firebase.firestore().collection('requests')
                .where('Sender', '==', user.id)
                .where('Receiver', '==', User)
                .onSnapshot(duplicateSnapshot => {
                    if (!duplicateSnapshot.empty) {
                        setFriendMessage('Friend request pending');
                        setDisable(true);
                    }
                });

        } catch (error: any) {
            Alert.alert('Error, ' + error.message);
        }

    }, []);

    // create a generic function instead
    // need to handle delete documents in 'requests' collection 
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

    // Deletes request from A to B 
    const deleteRequest = async (sender: String, receiver: String) => {
        let docID = '';
        const querySnapshot = await firebase.firestore()
            .collection('requests')
            .where('Sender', '==', sender)
            .where('Receiver', '==', receiver)
            .get();
        querySnapshot.forEach(documentSnapshot => {
            docID = documentSnapshot.id;
        })
        await firebase.firestore()
            .collection('requests')
            .doc(docID)
            .delete()
            .then(() => {
                console.log("Deleted Successfully");
            })
            .catch((error) => {
                console.log("Error removing document: ", error.message);
            })
    }

    // send friend req
    const sendReq = async (sender: String, receiver: String) => {
        // have to make sure that the request is not present
        try {
            // check if friend request from receiver to sender exists
            const querySnapshot = await firebase.firestore()
                .collection('requests')
                .where('Sender', '==', receiver)
                .where('Receiver', '==', sender)
                .get();
            if (querySnapshot.empty) {
                // submit friend request
                addRequestToFirebase(sender, receiver);
                Alert.alert('Friend request sent');

            } else {
                // delete friend request, make friends
                deleteRequest(receiver, sender);
                addFriend(sender, receiver);
                addFriend(receiver, sender);
                Alert.alert(`You and ${Name} are now friends!`);
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    }

    const addRequestToFirebase = async (sender: String, receiver: String) => {
        await firebase.firestore().collection('requests').add({
            Sender: sender,
            Receiver: receiver,
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContents}>
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePic}>
                        <View style={styles.profileDetails}>
                            <View style={styles.profileField}>
                                <Text style={styles.label}>Name:</Text>
                                <Text style={styles.text}>{Name}</Text>
                            </View>
                            <View style={styles.profileField}>
                                <Text style={styles.label}>Gender:</Text>
                                <Text style={styles.text}>{Gender}</Text>
                            </View>
                            <View style={styles.profileField}>
                                <Text style={styles.label}>Age:</Text>
                                <Text style={styles.text}>{Age}</Text>
                            </View>
                            {isFriend ? 
                                <View style={styles.profileField}>
                                    <Text style={styles.label}>Contact:</Text>
                                    <Text style={styles.text}>{Contact}</Text>
                                </View> : 
                                <View style={styles.profileField}>
                                    <Text style={styles.label}>Contact:</Text>
                                    <Text style={styles.notFriendText}>Add {Name} as a friend to find out!</Text>
                                </View> }
                            <View style={styles.profileField}>
                                <Text style={styles.label}>Bio:</Text>
                                <Text style={styles.text}>{Bio}</Text>
                            </View>
                        </View>
                        <Image
                            source={{ uri: Pic }}
                            style={styles.image}
                        />
                    </View>
                    <Button
                        title={friendMessage}
                        titleStyle={{marginHorizontal: 5}}
                        onPress={() => sendReq(user.id, User)}
                        buttonStyle={{borderRadius: 30}}
                        icon={friendMessage === 'Friend request pending' 
                            ? <Icon name='hourglass-full' type='material' color='white' size={20}/>
                            : friendMessage === 'Already friends' 
                            ? <Icon name='people' type='material' color='white' size={20}></Icon>
                            : <Icon name='person-add' type='material' color='white' size={20}/>}
                        disabled={disable}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContents: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    profileContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    profileDetails: {
        flex: 1,
    },
    profilePic: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileField: {
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
    },
    notFriendText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    image: {
        width: 150,
        height: 150,
        marginLeft: 20,
        borderRadius: 75,
    },
});

export default DisplayProfileScreen;