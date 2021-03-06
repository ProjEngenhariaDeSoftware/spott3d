import React, { Component } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { AsyncStorage } from 'react-native';

import Spotted from '../components/Spotted';
import Search from '../components/Search';
import Events from '../components/Event';
import Entertainment from '../components/Entertainment';
import Profile from '../components/Profile';
import Warnings from '../components/Warnings';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: null,
      routes: [
        {
          key: 'spotted',
          title: 'spotteds',
          icon: require('./../../assets/images/spotted.png'),
          color: '#EC5D73'
        },
        {
          key: 'event',
          title: 'eventos',
          icon: require('./../../assets/images/eventos.png'),
          color: '#5AD0BA'
        },
        {
          key: 'warnings',
          title: 'avisos',
          icon: require('./../../assets/images/avisos.png'),
          color: '#738A98'
        },
        {
          key: 'entertainment',
          title: 'diversos',
          icon: require('./../../assets/images/entretenimento.png'), //Vinicius arruma esse icone
          color: '#00B6D9'
        },
        {
          key: 'search',
          title: 'pesquisar',
          icon: 'search',
          color: '#29434e'
        },
        {
          key: 'profile',
          title: 'perfil',
          icon: 'person',
          color: '#2b4a69'
        },
      ],
    };
  };
  async componentDidMount() {
    try {
      const index = await AsyncStorage.getItem('index');
      if (index !== null) {
        this.setState({ index: parseInt(index) });
      }
    } catch (error) { }
  }

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    spotted: Spotted,
    warnings: Warnings,
    event: Events,
    entertainment: Entertainment,
    search: Search,
    profile: Profile,
  });

  render() {
    return (
      this.state.index !== null ? 
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />: null
    );
  }
}
