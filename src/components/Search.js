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
      dataSource: [],
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