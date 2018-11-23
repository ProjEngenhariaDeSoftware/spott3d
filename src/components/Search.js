import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

import { SearchBar, Icon } from 'react-native-elements'
import { FloatingAction } from 'react-native-floating-action';
import { View, Spinner, Thumbnail } from 'native-base'

import PostCard from '../components/PostCard';
import { Actions } from 'react-native-router-flux';

const actions = [{
  text: 'Pesquisar pessoas',
  icon: <Icon type="material-icons" size={23} color='#fff' name="person" />,
  name: 'bt_user',
  color: '#00B6D9',
  position: 2
}, {
  text: 'Pesquisar postagens',
  icon: <Icon type="entypo" size={23} color='#fff' name="news" />,
  name: 'bt_post',
  color: '#5AD0BA',
  position: 1
}];

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
      otherProfile: '',
      searching: 'Pesquisar postagens',
      showLoader: false,
      refreshing: false,
      search: false,
      filterUser: false,
      changeEmpty: false,
    }
  };

  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  async componentDidMount() {
    const photoURL = await AsyncStorage.getItem('photoURL');
    const displayName = await AsyncStorage.getItem('displayName');
    const mail = await AsyncStorage.getItem('email');
    this.setState({ username: displayName, userPhoto: photoURL, email: mail });
  };

  filterType = (item) => {
    if (this.state.filterUser) {
      return item.username.toLowerCase().includes(this.state.searchText.toLowerCase()) || item.email.toLowerCase().includes(this.state.searchText.toLowerCase());
    } else {
      return item.title.toLowerCase().includes(this.state.searchText.toLowerCase());
    }
  }

  searchType() {
    if (this.state.searchText.trim() !== '') {
      this.setState({ search: false, dataFilter: [], changeEmpty: false });
      if (this.state.filterUser) {
        this.filterUser()

      } else {
        this.filterPost();
      }
    }
  }

  async searchData() {
    const newData = this.state.dataSource.filter(item => this.filterType(item));
    this.setState({ dataFilter: newData, search: true, refreshing: false, changeEmpty: true});
  }

  renderHeader = () => {
    return (
      <SearchBar
        ref={search => this.search = search}
        platform='android'
        containerStyle={{ borderWidth: 1, borderColor: '#eceff1' }}
        placeholder={this.state.searching}
        cancelIcon={false}
        showLoading={this.state.refreshing}
        onChangeText={(text) => this.setState({ searchText: text })}
        value={this.state.searchText}
        onSubmitEditing={() => this.searchType()} />
    );
  };

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color='#DFDFE3' /></View> : null
    );
  };

  emptyData = () => {
    return (
      this.state.changeEmpty ? <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}><Text style={{ fontFamily: 'ProductSans', fontSize: 16 }}>{'\n\n\n Nenhum resultado encontrado.'}</Text></View> : null
    );
  }

  postDeleted() {
    this.handleRefresh();
  }

  handleRefresh = async () => {
    this.state.filterUser ? this.filterUser() : this.filterPost();
  };

  filterUser = async () => {
    try {
      this.setState({ refreshing: true });
      await fetch('https://api-spotted.herokuapp.com/api/user/')
        .then(res => res.json())
        .then(data => {
          this.setState({ dataSource: data });
        });
      this.searchData();
    } catch (error) { }
  }

  filterPost = async () => {
    this.setState({ refreshing: true });
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post')
        .then(res => res.json())
        .then(data => {
          this.setState({ dataSource: data });
        });
      this.searchData();
    } catch (error) {
    }

  }

  changeOtherProfile(email) {
    Actions.push('otherprofile', {email: email});
  }

  selectSubColorType(type) {
    switch (type) {
      case 'NEWS':
        return '#dee7ed';
      case 'NOTICE':
        return '#dee7ed';
      case 'EVENT_ACADEMIC':
        return '#ebf9f7';
      case 'ENTERTAINMENT':
        return '#e6fbff';
    }
  }

  selectColorType(type) {
    switch (type) {
      case 'NEWS':
        return '#738A98';
      case 'NOTICE':
        return '#738A98';
      case 'EVENT_ACADEMIC':
        return '#5AD0BA';
      case 'ENTERTAINMENT':
        return '#00B6D9';
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={this.state.dataFilter}
          extraData={this.state.search}
          renderItem={(item) => {
            return (
              this.state.filterUser ?
                <TouchableOpacity style={styles.item} activeOpacity={0.3} onPress={() => this.changeOtherProfile(item.item.email)}>
                  <View style={{ marginRight: '3%', marginLeft: '3%', marginBottom: '3%' }} >
                    <Thumbnail small source={{ uri: item.item.image }} />
                  </View>
                  <View style={{ flex: 1, flexWrap: 'wrap', }}>
                    <Text style={{ fontFamily: 'ProductSans', color: 'black' }}>{'@' + item.item.username + ' '}</Text>
                    <Text style={{ fontFamily: 'ProductSans', color: 'gray' }}>{item.item.email}</Text>
                  </View>
                </TouchableOpacity>
                :
                <PostCard
                  data={item}
                  subcolor={this.selectSubColorType(item.item.type)}
                  color={this.selectColorType(item.item.type)}
                  username={this.state.username}
                  userphoto={this.state.userPhoto}
                  email={this.state.email}
                  deleted={this.postDeleted.bind(this)}
                />
            )
          }}
          keyExtractor={(item, index) => index + ''}
          onEndReachedThreshold={1}
          onEndReached={(event) => this.hideLoader(event)}
          refreshing={this.state.refreshing}
          ListEmptyComponent={this.emptyData}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderLoader}
        />
        <FloatingAction
          actions={actions}
          color={'#29434e'}
          floatingIcon={<Icon type="material-community" size={25} color='#fff' name="filter" />}
          position="right"
          onPressItem={
            (name) => {
              if (name === 'bt_post') {
                this.setState({ filterUser: false, dataFilter: [], searching: 'Pesquisar postagens', changeEmpty: false});
              }
              if (name === 'bt_user') {
                this.setState({ filterUser: true, dataFilter: [], searching: 'Pesquisar pessoas', changeEmpty: false});

              }
            }
          }
          actionsPaddingTopBottom={0}
          overlayColor="rgba(0, 0, 0, 0.7)"
          visible={this.state.isActionButtonVisible}
          distanceToEdge={16}
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
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 8,
    margin: 2,
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
});