/** @format */
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';


import Start from './src/components/start';
import Home from './src/components/home';
import Navbar from './src/components/navbar';


export default class Spotted extends Component {
  render() {
    return (
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
          />
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('spotted', () => Spotted);
