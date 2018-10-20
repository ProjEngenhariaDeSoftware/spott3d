import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import { Actions } from 'react-native-router-flux';


export default class Perfil extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  googleLogout = async () => {
    try {
      await GoogleSignin.configure();
      await GoogleSignin.signOut();
      await AsyncStorage.clear();
      Actions.reset('start');
    } catch (error) {}
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Perfil
        </Text>
        <View>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={this.googleLogout}
            activeOpacity={0.7}>
            <Image style={styles.googleLogo} source={require('./../../assets/images/google-icon.png')}></Image>
            <Text style={styles.googleText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B6D9',
  },
  welcome: {
    fontSize: 40,
    fontFamily: 'ProductSans',
    color: '#fff',
    textAlign: 'center',
    margin: 10,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: 'white',
    borderColor: '#e7e7e7',
    borderWidth: 0.5,
  },
  googleLogo: {
    width: 26,
    height: 26,
    marginRight: 5
  },
  googleText: {
    color: 'gray',
    fontFamily: 'ProductSans',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10
  }
});
