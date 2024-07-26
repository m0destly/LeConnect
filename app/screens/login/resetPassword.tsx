import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import firebase from 'firebase/compat';
import { Button } from "react-native-elements";

const ResetPasswordScreen = ({navigation} : any) => {
    const [email, setEmail] = useState('');

    const sendEmailVerification = () => {
        firebase.auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert('Sent', 'Password reset email sent successfully.');
            })
            .catch((error) => {
                if (error.code === 'auth/missing-email') {
                    Alert.alert('Error', 'Please enter an email address.');
                } else if (error.code === 'auth/invalid-email') {
                    Alert.alert('Error', 'Please enter a valid email.');
                } else {
                    Alert.alert('Error', error.message);
                }
            });
    } 
    
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Reset Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button
                buttonStyle={styles.button}
                title='Send Email Verification'
                onPress={sendEmailVerification}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 10,
    },
});

export default ResetPasswordScreen;
