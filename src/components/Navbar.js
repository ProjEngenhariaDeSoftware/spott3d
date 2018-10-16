import React, { Component } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import Spotted from '../components/Spotted';
import Search from '../components/Search';
import Events from '../components/Event';
import Entertainment from '../components/Entertainment';
import Perfil from '../components/Perfil';
import Warnings from '../components/Warnings';


export default class Navbar extends Component {
  state = {
    index: 0,
    routes: [
      {
        key: 'spotted',
        title: 'Spotteds',
        icon: 'favorite-border',
        color: '#b52848'
      },
      {
        key: 'event',
        title: 'Eventos',
        icon: 'event',
        color: '#738A98'
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
        color: '#179e8a'
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