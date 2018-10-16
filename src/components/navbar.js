import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import ScreenSpotted from '../components/Spotted';
import ScreenBusca from '../components/Busca';
import ScreenEventos from '../components/Eventos';
import ScreenEntrete from '../components/Entretenimentos';
import ScreenPerfil from '../components/Perfil';


export default class Navbar extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'spotted', title: 'Spotteds', icon: 'favorite-border', color: '#b52848' },
      { key: 'buscar', title: 'Buscar', icon: 'search', color: '#adadb1' },
      { key: 'eventos', title: 'Eventos', icon: 'event', color: '#738A98' },
      { key: 'diversos', title: 'Diversos', icon: 'movie-filter', color: '#179e8a' },
      { key: 'perfil', title: 'Perfil', icon: 'face', color: '#0086a7' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    spotted: ScreenSpotted,
    buscar: ScreenBusca,
    eventos: ScreenEventos,
    diversos: ScreenEntrete,
    perfil: ScreenPerfil,
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