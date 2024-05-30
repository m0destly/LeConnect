import { Text, View, StyleSheet, TextInput, Button } from "react-native";

export default function Index() {
    return (
      <View className='bg-yello'>
        <Header />
        <Filter />
        <BusStops />
        <NavigationTab/>
      </View>
    );
}