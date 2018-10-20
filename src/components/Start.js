import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import firebase from 'react-native-firebase';


export default class Start extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  googleLogin = async () => {
    try {
      await GoogleSignin.configure();
      const data = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      const currentUser = await firebase.auth().signInWithCredential(credential);

      await AsyncStorage.setItem('photoURL', currentUser.user.photoURL);
      await AsyncStorage.setItem('displayName', currentUser.user.displayName);
      await AsyncStorage.setItem('email', currentUser.user.email);

      console.warn(JSON.stringify(currentUser.user.toJSON()));
      Actions.jump('home');
      Actions.reset('home');
    } catch (error) { }
  }

  googleLogout = async () => {
    try {
      await GoogleSignin.configure();
      await GoogleSignin.signOut();
      await AsyncStorage.clear();
      console.warn('feito');
    } catch (error) { }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.box}>
            <Text style={styles.title}> Registre-se abaixo </Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.box}>
            <GoogleSigninButton
              style={{ width: 312, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this.googleLogin}
              disabled={this.state.isSigninInProgress} />
            <Text></Text>
            <Button title="Deslogar do Google" onPress={this.googleLogout} />
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
    backgroundColor: '#ddffff',
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
  }
})