/** @format */
import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';


import Start from './src/components/start';
import Home from './src/components/home';
import Navbar from './src/components/navbar';


export default class Spotted extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Router>
          <Scene key="root">
            <Scene
              key="start"
              component={Start}
              title="Bem-vindo"
              initial={true}
            />
            <Scene
              key="home"
              component={Home}
              title="Página inicial"
              hideNavBar={true}
            />
            <View
              key="aplicacoes"
              component={Navbar}
              hideNavBar={true}
            />
          </Scene>
        </Router>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

AppRegistry.registerComponent('spotted', () => Spotted);
