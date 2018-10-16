import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

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