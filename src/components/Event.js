import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


export default class Event extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Eventos Acadêmicos
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
    backgroundColor: '#738A98',
  },
  welcome: {
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    margin: 10,
  },
});