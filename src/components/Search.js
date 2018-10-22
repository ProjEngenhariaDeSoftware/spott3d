import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  RefreshControl,
  FlatList
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { View, Spinner } from 'native-base'

import PostCard from '../components/PostCard';
import ProgressBar from '../components/ProgressBar';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class Search extends Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: [{
        key: '0',
        userphoto: 'https://avatars3.githubusercontent.com/u/12588175',
        title: 'Evento Roadsec',
        local: 'UFCG',
        date: '45 de Outubro de 2018',
        image: false,
        text: 'O Roadsec é o maior evento hacker da América Latina, durante o evento são apresentadas diversas palestras e oficinas de hacking, segurança da informação, ti e tecnologia em geral, além é claro de reunir profissionais, empresas e pessoas com o mesmo interesse, ou seja, como o Roadsec acaba sendo uma ótima forma de conhecer pessoas com os mesmos interesses que você, ou quem sabe até mesmo conseguir uma vaga de emprego ou simplesmente um networking.',
        coments: '320'
      }],
      isLoading: true,
      showLoader: true,
      refreshing: false,
    }
  };

  hideLoader = () => {
    setTimeout(() => {
      this.setState({ showLoader: false })
    }, 1);
  };

  componentDidMount() {
    var self = this;
    setTimeout(function () {
      self.setState({ isLoading: true, refreshing: false });
    }, 1);
  };

  renderHeader() {
    return (
      <SearchBar
      platform="android"
      cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
      placeholder='Buscar'
      onChange={(text) => {
      }}/>
    );
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color='#DFDFE3' /></View> : null
    );
  };

  handleRefresh = () => {
    
  };

  render() {
    return (
      <FlatList
      data={this.state.dataSource}
      renderItem={(item) => {
        return (
          this.state.isLoading ? <ProgressBar color='#DFDFE3'/> : <PostCard data={item} />
        )
      }}
      keyExtractor={item => item.key}
      onEndReachedThreshold={1}
      onEndReached={(event) => this.hideLoader(event)}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          colors={['#DFDFE3']}
        />
      }
      ListHeaderComponent={this.renderHeader}
      ListFooterComponent={this.renderLoader}
    />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFDFE3',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
});