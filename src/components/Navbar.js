import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { AsyncStorage } from 'react-native';

import Spotted from '../components/Spotted';
import Search from '../components/Search';
import Events from '../components/Event';
import Entertainment from '../components/Entertainment';
import Perfil from '../components/Perfil';
import Warnings from '../components/Warnings';


export default class Navbar extends Component {

  async componentDidMount() {
    try {
      const index = await AsyncStorage.getItem('index');
      if (index != null) {
        this.setState({ index: parseInt(index) });
      }
    } catch (error) { }
  }

  state = {
    index: 0,
    routes: [
      {
        key: 'spotted',
        title: 'Spotteds',
        icon: 'favorite-border',
        color: '#EC5D73'
      },
      {
        key: 'event',
        title: 'Eventos',
        icon: 'event',
        color: '#5AD0BA'
      },
      {
        key: 'warnings',
        title: 'Avisos',
        icon: 'event',
        color: '#738A98'
      },
      {
        key: 'entertainment',
        title: 'Diversos',
        icon: 'movie-filter',
        color: '#00B6D9'
      },
      {
        key: 'search',
        title: 'Pesquisar',
        icon: 'search',
        color: '#adadb1'
      },
      {
        key: 'perfil',
        title: 'Perfil',
        icon: 'face',
        color: '#0086a7'
      },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    spotted: Spotted,
    warnings: Warnings,
    event: Events,
    entertainment: Entertainment,
    search: Search,
    perfil: Perfil,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}
