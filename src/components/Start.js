import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
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
      console.warn(JSON.stringify(currentUser.user.toJSON()));
      this.setState(currentUser.user);
      //console.warn(JSON.stringify(this.state));
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{ width: 312, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.googleLogin}
          disabled={this.state.isSigninInProgress} />
        <Icon.Button style={styles.button} name="google" backgroundColor="#ff0000" onPress={Actions.home}>
          Logar com o Google
        </Icon.Button>
        <Text> </Text>
        <Icon.Button style={styles.button} name="facebook" backgroundColor="#3b5998" onPress={Actions.home}>
          Logar com o Facebook
        </Icon.Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddffff',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#333333',
  },
  button: {
    width: 300,
    textAlign: 'center',
    borderRadius: 45,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,
  }

})