import React, { Component } from 'react';
import {
  StyleSheet,
  RefreshControl,
  AsyncStorage,
  FlatList,
  Text
} from 'react-native';
import { SearchBar } from 'react-native-elements'
import { View, Spinner } from 'native-base'

import PostCard from '../components/PostCard';
import ProgressBar from '../components/ProgressBar';


export default class Search extends Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: [],
      dataFilter: [],
      searchText: "",
      username: '',
      userPhoto: '',
      email: '',
      isLoading: false,
      showLoader: false,
      refreshing: false,
      search: false,
    }
  };

  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  async componentDidMount() {
    const photoURL = await AsyncStorage.getItem('photoURL');
    const displayName = await AsyncStorage.getItem('displayName');
    const mail = await AsyncStorage.getItem('email');

    this.fetch();

    this.setState({ username: displayName, userPhoto: photoURL, email: mail, isLoading: false, });
  };

  fetch = async () => {
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post')
        .then(res => res.json())
        .then(data => {
          this.setState({ refreshing: false, dataSource: data });
        });
    } catch (error) { }
  }

  searchData = async () => {
    this.setState({ search: false })
    console.log(this.state.searchText)
    const data = this.state.dataSource;
    const newData = await data.filter((item) => {
      return item.title.toLowerCase().includes(this.state.searchText.toLowerCase());
    });
    this.setState({ dataFilter: newData, search: true })
  }

  renderHeader = () => {
    return (
      <SearchBar
      ref={search => this.search = search}
      platform='android'
      containerStyle={{borderWidth: 1, borderColor: '#eceff1'}}
      placeholder="Buscar"
      onChangeText={(text) => this.setState({ searchText: text })}
      value={this.state.searchText}
      onSubmitEditing={() => this.searchData()} />
    );
  };

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color='#DFDFE3' /></View> : null
    );
  };

  emptyData = () => {
    return (
      this.state.search ? <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}><Text style={{ fontFamily: 'ProductSans', fontSize: 16 }}>{'\n\n\n Nenhum resultado encontrado.'}</Text></View> : null
    );
  }

  postDeleted() {
    this.handleRefresh();
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    this.fetch();
  };

  render() {
    return (
      <View style={{ flex: 1 , backgroundColor: '#fff'}}>
        <FlatList
          data={this.state.dataFilter}
          extraData={this.state.search}
          renderItem={(item) => {
            return (
              <PostCard
                data={item}
                subcolor={'#cfd8dc'}
                color={'#29434e'}
                username={this.state.username}
                userphoto={this.state.userPhoto}
                email={this.state.email}
                renderWithComments={true}
                deleted={this.postDeleted.bind(this)}
              />
            )
          }}
          keyExtractor={item => item.id + ''}
          onEndReachedThreshold={1}
          onEndReached={(event) => this.hideLoader(event)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              colors={['#29434e']}
            />
          }
          ListEmptyComponent={this.emptyData}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderLoader}
        />
      </View>
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