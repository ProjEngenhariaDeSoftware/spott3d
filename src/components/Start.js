import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';


export default class Start extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  };

  async componentDidMount() {
    try {
      this.setState({ loading: false });
      const isLogged = await AsyncStorage.getItem('isLogged');
      if (isLogged === 'true') {
        const email = await AsyncStorage.getItem('email');

        let data = null;
        await fetch('https://api-spotted.herokuapp.com/api/user/email/' + email)
          .then(res => res.json())
          .then(r => {
            data = r;
          })
          .catch(a => { });
        if (data != null) {
          await AsyncStorage.setItem('username', data.username);
          Actions.reset('home');
        }
      }
      if (isLogged === 'false') {
        Actions.reset('register');
      }
    } catch (error) { }
  }

  googleLogin = async () => {
    try {
      await GoogleSignin.configure();
      this.setState({ loading: true });
      const data = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      const currentUser = await firebase.auth().signInWithCredential(credential);

      await AsyncStorage.setItem('isLogged', 'true');
      await AsyncStorage.setItem('photoURL', currentUser.user.photoURL);
      await AsyncStorage.setItem('displayName', currentUser.user.displayName);
      await AsyncStorage.setItem('email', currentUser.user.email);

      const email = await AsyncStorage.getItem('email');

      let userData = null;
      await fetch('https://api-spotted.herokuapp.com/api/user/email/' + email)
        .then(res => res.json())
        .then(dat => {
          userData = dat;
        })
        .catch(a => { });

      if (userData == null) {
        Actions.reset('register');
      } else {
        await AsyncStorage.setItem('username', userData.username);
        Actions.reset('home');
      }

    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.box}>
            <Text style={styles.title}> Logo aqui, e algum texto abaixo </Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.box}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={this.googleLogin}
              activeOpacity={0.8}>
              <Image style={styles.googleLogo} source={require('./../../assets/images/google-icon.png')}></Image>
              <Text style={styles.googleText}>{this.state.loading ? 'Aguarde...' : 'Entrar com o Google'}</Text>
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
