import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


export default class Perfil extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Perfil
        </Text>
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
    color: '#fff',
    textAlign: 'center',
    margin: 10,
  },
});