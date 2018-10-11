import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  render() {
    return (
      <View>
        <View style={styles.spotted}>
          <Button title="Spotteds" onPress={Actions.start} />
        </View>
        <View style={styles.spotted}>
          <Button title="Notícias" />
        </View>
        <View style={styles.spotted}>
          <Button title="Avisos" />
        </View>
        <View style={styles.spotted}>
          <Button title="Entretenimento" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#333333'
  },
  spotted: {
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
  }
})