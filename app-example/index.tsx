import { Text, View, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function Index() {
  return (
    <View>
      <Header />
      <Filter />
      <BusStops />
      <NavigationTab/>
    </View>
  );
}

const Header = () => {
  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.title}>Bus Stops</Text>
    </View>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    backgroundColor: '#0080ff',
  },
  title: {
    paddingLeft: 3,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const Filter = () => {
  return (
    <View style={filterStyle.container}>
      <TextInput style={filterStyle.textinput} 
                placeholder="Select Bus Stops or Buildings"/>
      <TouchableOpacity>
        <Text style={filterStyle.button}>FILTER</Text>
      </TouchableOpacity>
    </View>
  );
};

const filterStyle = StyleSheet.create({
  container: {
    paddingLeft: 3,
    paddingTop: 3,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  textinput: {
    paddingLeft: 6,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    width: '80%',
  },

  button: {
    backgroundColor: 'white',
    color: '#0008ff',
    fontSize: 20,
    paddingRight: 3,
  },

});

const BusStops = () => {
  const busStops = [
    { name: "University Town", shortName: "UTown", distance: 190 },
    { name: "Central Library", shortName: "CL", distance: 200 },
    { name: "Arts", shortName: "Arts", distance: 300 },
    { name: "Engineering", shortName: "Eng", distance: 400 },
    { name: "Science", shortName: "Sci", distance: 500},
  ];

  return (
    <View>
      {busStops.map((busStop) => (
        <BusStop
          key={busStop.shortName}
          name={busStop.name}
          shortName={busStop.shortName}
          distance={busStop.distance}
        />
      ))

      }
    </View>);
};

type BusStopProperties = {
  name: string;
  shortName: string;
  distance: number;
};

const BusStop = ({ name, shortName, distance }: BusStopProperties) => {
  return (
    <View className=''>
      <Button title='Fav' />
      <Text>BusStop</Text>
      <Button title='Refresh' />
    </View>
  );
}

const NavigationTab = () => {
  return (
    <View>
      <Text>NavigationTab</Text>
    </View>
  );
};