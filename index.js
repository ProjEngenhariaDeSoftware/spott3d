/** @format */
import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';


import Start from './src/components/Start';
import Home from './src/components/Home';
import Navbar from './src/components/Navbar';
import Register from './src/components/Register';
import AddSpotted from './src/components/AddSpotted';
import AddPost from './src/components/AddPost';
import AdmView from './src/components/AdmView';
import OtherProfile from './src/components/OtherProfile';

export default class Spotted extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Router>
          <Scene key="root">
            <Scene
              key="start"
              component={Start}
              title="Spotted++"
              initial={true}
              hideNavBar={true}
            />
            <Scene
              key="home"
              component={Home}
              title="Página inicial"
              hideNavBar={true}
            />
            <Scene
              key="register"
              component={Register}
              title="Quase lá"
            />
            <Scene
              key="addspotted"
              component={AddSpotted}
              title="Enviar novo spotted"
              hideNavBar={true}
            />
            <Scene
              key="aplicacoes"
              component={Navbar}
              hideNavBar={true}
            />
            <Scene
              key="adm"
              hideNavBar={true}
              component={AdmView}
            />
            <Scene
              key="addpost"
              title="Adicionar nova postagem"
              component={AddPost}
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
    flex: 1
  },
})

AppRegistry.registerComponent('spotted', () => Spotted);
