import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Start extends Component {

  constructor(props) {
    super(props);
    timePassed = false;
  };

  render() {
    /*setTimeout(() => {
      this.props.timePassed = true
    }, 1000);
    if (!this.props.timePassed) {
      return (
        <View>
          <Text>Aguarde...</Text>
        </View>
      )
    } else {*/
    return (
      <View style={styles.container}>
        <Text style={styles.title} onPress={Actions.home}>
          Clique aqui
        </Text>
      </View>
    )
  }
  //}
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
    color: '#333333'
  },
})