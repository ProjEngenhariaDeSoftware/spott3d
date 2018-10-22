import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button,
  TouchableOpacity,
  Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';


export default class Start extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  async componentDidMount() {
    try {
      const isLogged = await AsyncStorage.getItem('isLogged');
      if (isLogged != null) {
        Actions.reset('home');
      }
    } catch (error) {}
  }

  googleLogin = async () => {
    try {
      await GoogleSignin.configure();
      const data = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      const currentUser = await firebase.auth().signInWithCredential(credential);

      await AsyncStorage.setItem('isLogged', 'true');
      await AsyncStorage.setItem('photoURL', currentUser.user.photoURL);
      await AsyncStorage.setItem('displayName', currentUser.user.displayName);
      await AsyncStorage.setItem('email', currentUser.user.email);

      Actions.jump('home');
      Actions.reset('home');
    } catch (error) { console.log(error)}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.box}>
            <Text style={styles.title} onPress={Actions.home}> Logo aqui, e algum texto abaixo </Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.box}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={this.googleLogin}
              activeOpacity={0.7}>
              <Image style={styles.googleLogo} source={require('./../../assets/images/google-icon.png')}></Image>
              <Text style={styles.googleText}>Entrar com o Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'ProductSans',
    fontSize: 22,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#333333'
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
})
