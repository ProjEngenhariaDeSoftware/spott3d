import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  Text,
  Modal
} from 'react-native';

import { SearchBar } from 'react-native-elements'
import { FloatingAction } from 'react-native-floating-action';
import { View, Spinner, Thumbnail, Icon } from 'native-base'

import PostCard from '../components/PostCard';
import OtherProfile from '../components/OtherProfile';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFDFE3',
  },
  iconsSearch: {
    color: '#fff',
    fontSize: 25
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 8,
    margin: 2,
  },
});

const actions = [{
  text: 'Pesquisar pessoas',
  icon: <Icon type="MaterialIcons" style={styles.iconsSearch} name="person" />,
  name: 'bt_user',
  color: '#00B6D9',
  position: 2
}, {
  text: 'Pesquisar postagens',
  icon: <Icon type="Entypo" style={styles.iconsSearch} name="news" />,
  name: 'bt_post',
  color: '#5AD0BA',
  position: 1
}, {
  text: 'Pesquisar tags',
  icon: <Icon type="MaterialCommunityIcons" style={styles.iconsSearch} name="tag-multiple" />,
  name: 'bt_tags',
  color: '#EC5D73',
  position: 3
}
];

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
      type: 'post',
      showLoader: false,
      refreshing: false,
      search: false,
      openProfile: false,
      changeEmpty: false,
    }
  };

  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  async componentDidMount() {
    const [photoURL, displayName, email] = await Promise.all([
      AsyncStorage.getItem('photoURL'),
      AsyncStorage.getItem('displayName'),
      AsyncStorage.getItem('email'),
    ]);
    this.setState({ username: displayName, userPhoto: photoURL, email: email });
  };

  filterType = (item) => {
    switch (this.state.type) {
      case 'user':
        return item.username.toLowerCase().includes(this.state.searchText.toLowerCase()) || item.email.toLowerCase().includes(this.state.searchText.toLowerCase());
      case 'post':
        return item.title.toLowerCase().includes(this.state.searchText.toLowerCase());
      case 'tag':
        return item.postFlag !== null ? item.postFlag.toLowerCase().includes(this.state.searchText.toLowerCase()) : false;
    }
  }

  searchType() {
    if (this.state.searchText.trim() !== '') {
      this.setState({ search: false, dataFilter: [], changeEmpty: false });
      switch (this.state.type) {
        case 'user':
          this.filterUser();
          break;
        case 'post':
          this.filterPost();
          break;
        case 'tag':
          this.filterTag();
          break;
      }
    }
  }

  async searchData() {
    const newData = this.state.dataSource.filter(item => this.filterType(item));
    this.setState({ dataFilter: newData, search: true, refreshing: false, changeEmpty: true });
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

  handleRefresh = () => {
    switch (this.state.type) {
      case 'post':
        this.filterPost();
        break;
      case 'user':
        this.filterUser();
        break;
      case 'tag':
        this.filterTag();
        break;
    }
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

  filterTag = async () => {
    this.setState({ refreshing: true });
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post/type/NOTICE')
        .then(res => res.json())
        .then(data => {
          this.setState({ dataSource: data });
        });
      this.searchData();
    } catch (error) {
    }
  }

  showOtherProfile(visible) {
    this.setState({ openProfile: visible });
  }

  changeOtherProfile(profileEmail) {
    this.setState({ otherProfile: profileEmail, openProfile: true })
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
              this.state.type === 'user' ?
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

        <Modal
          visible={this.state.openProfile}
          animationType={"slide"}
          onRequestClose={() => { this.showOtherProfile(!this.state.openProfile) }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2b4a69' }}>
            <OtherProfile
              emailPerfil={this.state.otherProfile}
              emailLogged={this.state.email}
              usernameLogged={this.state.username}
              userphotoLogged={this.state.userPhoto} />
          </View>
        </Modal>
        <FloatingAction
          actions={actions}
          color={'#29434e'}
          floatingIcon={<Icon type="Foundation" style={styles.iconsSearch} name="filter" />}
          position="right"
          onPressItem={
            (name) => {
              if (name === 'bt_post') {
                this.setState({ type: 'post', dataFilter: [], searching: 'Pesquisar postagens', changeEmpty: false });
              }
              else if (name === 'bt_user') {
                this.setState({ type: 'user', dataFilter: [], searching: 'Pesquisar pessoas', changeEmpty: false });
              }
              else if (name === 'bt_tags') {
                this.setState({ type: 'tag', dataFilter: [], searching: 'Pesquisar tag', changeEmpty: false });
              }
            }
          }
          actionsPaddingTopBottom={0}
          overlayColor="rgba(0, 0, 0, 0.7)"
          visible={this.state.isActionButtonVisible}
          distanceToEdge={16}
        />
      </View >
    );
  }
}
