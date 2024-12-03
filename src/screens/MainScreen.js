import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Feather } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import InsightScreen from './InsightScreen';
import HomeScreen from './HomeScreen';
import GrowthScreen from './GrowthScreen';

import axios from 'axios';

const Tab = createMaterialTopTabNavigator();

function TabNavigator({ cif }) {
  return (
    <Tab.Navigator
      initialRouteName="Transaksi"
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen 
        name="Insight" 
        component={InsightScreen} 
        initialParams={{ cif }} 
      />
      <Tab.Screen 
        name="Transaksi" 
        component={HomeScreen} 
        initialParams={{ cif }} 
      />
      <Tab.Screen 
        name="Growth" 
        component={GrowthScreen} 
        initialParams={{ cif }} 
      />
    </Tab.Navigator>
  );
}

export default function MainScreen( {route} ) {
  const cif = route?.params?.cif; // Retrieve the cif passed during navigation
  const [data, setData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (cif) {
      axios.get(`http://10.63.110.70:5000/user?cif=${cif}`)
        .then((response) => {
          const fullName = response.data.user.name; // assuming the full name is returned in the name field
          // Split the name by space and get the first two words
          const nameParts = fullName.split(' ').slice(0, 2).join(' ');
          setData({...response.data, name: nameParts }); // Store the response data in state
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error);
        });
    }
  }, [cif]);

  const handleLogout = () => {
    axios.post('http://10.63.110.70:5000/logout')
      .then((response) => {
        console.log('Logout successful:', response.data.message);
  
        // Navigate to FirstScreen
        navigation.navigate('First');  // Change this to navigate instead of reset
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };  

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Image
          source={require('/Users/66371/Documents/Kompre/project-kompre/assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require('/Users/66371/Documents/Kompre/project-kompre/assets/person.png')}
          style={styles.profilePic}
        />
        {/* Display the fetched data or a default greeting */}
        <Text style={styles.greeting}>{data ? `Hai, ${data.name}!` : 'Loading...'}</Text>
        <View style={styles.iconContainer}>
          <Feather name="bell" size={24} color="black" style={styles.icon} />
          <Feather name="bookmark" size={24} color="black" style={styles.icon} />
          <Feather name="grid" size={24} color="black" style={styles.icon} />
        </View>
      </View>

      <TabNavigator cif={cif}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#000000',
    fontWeight: '500',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  tabBar: {
    backgroundColor: '#FFFF',
    borderRadius: 50,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  tabIndicator: {
    backgroundColor: '#dbeb5b',
    height: '80%',
    width: '30%',
    marginHorizontal: '2%',
    marginBottom: '11%',

    borderRadius: 50,
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '500',
  },
});