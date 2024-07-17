import React, { useState } from 'react';
import { Text, Button, View, Linking, Alert, TextInput, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const MapsScreen = () => {
    const [dirty, setDirty] = useState('');
    const [clean, setClean] = useState('');
    
    // event creator
    const openMaps = () => {
        const url = Platform.OS === 'android'
            ? 'https://maps.google.com'
            : 'http://maps.apple.com?daddr=';
        Linking.openURL(url);
    }
    // user
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
    // event creator
    const setLocation = () => {
        if (!dirty) {
            setClean('');
            Alert.alert('Error', 'Please enter a location.');
            return;
        }
        if (Platform.OS === 'android') {
            setClean(dirty.replaceAll(' ', '+').replaceAll(',', '%2C'));
        } else {
            setClean(dirty.replaceAll(' ', '+'));
        }
        
    };

    return (
        <View style={styles.container}>
            <Text>Please enter an address retrieved from {Platform.OS === 'android' ? 'Google Maps' : 'Apple Maps'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Location"
                value={dirty}
                onChangeText={setDirty}
            />
            <Button title={Platform.OS === 'android' ? 'Open Google Maps' : 'Open Apple Maps'} onPress={openMaps} />
            <Button title="Set Location" onPress={setLocation} />
            {clean ? <Button title="Get Directions" onPress={openDirections} /> : <></>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
});

export default MapsScreen;

// import React from "react";
// import MapView from 'react-native-maps';
// import {StyleSheet, View} from 'react-native';

// const MapsScreen = () => {
//     return (
//         <View style={{flex: 1}}>
//             <MapView 
//                 style={StyleSheet.absoluteFill} 
//                 showsUserLocation={true}
//                 showsMyLocationButton={true}
//             />
//         </View>
//     )
// }

// export default MapsScreen;