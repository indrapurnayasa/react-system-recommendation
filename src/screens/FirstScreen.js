import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ButtonWithText = ({ iconName, text, buttonStyle }) => (
  <View style={styles.buttonWithText}>
    <TouchableOpacity style={[styles.button, buttonStyle]}>
      <Icon name={iconName} size={25} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.buttonText}>{text}</Text>
  </View>
);

export default function FirstScreen({ navigation }) {
  return (
    <View style={styles.container}>
      

      {/* Decorative Shapes */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      {/* Header and Logo */}
      <View style={styles.header}>
        <Image
          source={require('/Users/66371/Documents/Kompre/project-kompre/assets/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <ButtonWithText iconName="wallet" text="E-Wallet" buttonStyle={styles.buttonEwallet} />
        <ButtonWithText iconName="scan" text="QRIS" buttonStyle={styles.buttonQris} />
        <ButtonWithText iconName="card" text="Tapcash" buttonStyle={styles.buttonTapcash} />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('UsernamePasswordLogin')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  timeText: {
    fontWeight: 'bold',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    marginLeft: 8,
  },
  topCircle: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    backgroundColor: 'teal',
    borderRadius: 100,
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 100,
    height: 100,
    backgroundColor: 'yellow',
    borderRadius: 50,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginTop: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 250,
  },
  button: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    height: 63,
    width: 63,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEwallet: {
    backgroundColor: '#71dbd3',
  },
  buttonQris: {
    backgroundColor: '#eebb3c',
  },
  buttonTapcash: {
    backgroundColor: '#ee853f',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#71dbd3',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 40,
  },
  loginButtonText: {
    color: '#0e0e0e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 20,
  },
  buttonWithText: {
    alignItems: 'center',
  },
  headphonesIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

