import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Register extends Component {

  constructor(props) {
    super();
    this.state = {
      photoURL: '',
      displayName: '',
      email: '',
      username: ''
    };
  }

  async componentDidMount() {
    try {
      const photo = await AsyncStorage.getItem('photoURL');
      let name = await AsyncStorage.getItem('displayName');
      const userEmail = await AsyncStorage.getItem('email');

      const names = name.split(' ');
      name = names[0] + ' ' + names[1];

      this.setState({ photoURL: photo, displayName: name, email: userEmail });
    } catch (error) { }
  }

  submitUser = async () => {
    try {
      await AsyncStorage.setItem('username', this.state.username);
      await fetch('http://api-spotted.herokuapp.com/api/user', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email: this.state.email,
          username: this.state.username.toLowerCase()
        })
      }).then(a => {
        Actions.reset('home');
      });
    } catch (error) {}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.box}>
            <View style={styles.circleOut}>
              <View style={styles.photo}>
                <Image style={styles.photo} source={{ uri: this.state.photoURL }}></Image>
              </View>
            </View>
            <Text style={styles.textName}> Olá, {this.state.displayName} </Text>
            <Text style={styles.text}> Para prosseguir, informe um nickname </Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.box}>
            <View style={styles.button}>
              <TextInput
                placeholder='@nickname'
                style={styles.input}
                onChangeText={(username) => this.setState({ username })}
                value={this.state.username}
              />
            </View>
            <TouchableOpacity
              style={styles.submit}
              onPress={this.submitUser}
              activeOpacity={0.8}>
              <Text style={styles.text}>
                entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#5AD0BA',
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
  circleOut: {
    margin: 25,
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 18,
    borderColor: '#a7a7a7',
    borderWidth: 0.8
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textName: {
    margin: 5,
    color: '#EC5D73',
    fontSize: 22,
    fontFamily: 'ProductSans',
    textAlign: 'justify'
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ProductSans',
    textAlign: 'justify'
  },
  button: {
    width: 300,
    padding: 5
  },
  input: {
    color: 'gray',
    fontSize: 20,
    fontFamily: 'ProductSans',
    backgroundColor: 'white',
    borderColor: '#e7e7e7',
    borderWidth: 2,
    borderRadius: 30,
    elevation: 2,
    padding: 10,
    margin: 5
  },
  submit: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans',
    backgroundColor: '#EC5D73',
    borderColor: '#e7e7e7',
    borderWidth: 0.5,
    borderRadius: 30,
    elevation: 2,
    padding: 10,
    width: 180,
    margin: 10
  }

});
