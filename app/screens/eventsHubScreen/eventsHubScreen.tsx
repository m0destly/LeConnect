import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import UserContext from '@/app/userContext';

const EventsHubScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('LoginScreen');
  };

  const { user, clearUser } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>user id: {user.id}</Text>
      <Button title="Go to Details" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default EventsHubScreen;