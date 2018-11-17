import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  Text,
  Modal
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements'
import { FloatingAction } from 'react-native-floating-action';
import { View, Spinner, Thumbnail } from 'native-base'

import PostCard from '../components/PostCard';
import OtherProfile from '../components/OhterProfile';

const actions = [{
  text: 'Usuários',
  icon: <Icon type="material-icons" size={23} color='#fff' name="person" />,
  name: 'bt_user',
  color: '#00B6D9',
  position: 2
}, {
  text: 'Postagens',
  icon: <Icon type="entypo" size={23} color='#fff' name="news" />,
  name: 'bt_post',
  color: '#5AD0BA',
  position: 1
}];

export default class Search extends Component {
  constructor(props) {
    super();
    this._listViewOffset = 0
    this.state = {
      dataSource: [],
      dataFilter: [],
      searchText: "",
      username: '',
      userPhoto: '',
      email: '',
      otherProfile: '',
      openProfile: false,
      showLoader: false,
      refreshing: false,
      search: false,
      filterUser: false,
      isActionButtonVisible: true,
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
      this.setState({ search: false, dataFilter: [] });
      if (this.state.filterUser) {
        this.filterUser()

      } else {
        this.filterPost();
      }
    }
  }

  async searchData() {
    const newData = this.state.dataSource.filter(item => this.filterType(item));
    this.setState({ dataFilter: newData, search: true, refreshing: false });
  }

  renderHeader = () => {
    return (
      <SearchBar
        platform='android'
        containerStyle={{ borderWidth: 1, borderColor: '#eceff1' }}
        placeholder="Buscar"
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
      this.state.search ? <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}><Text style={{ fontFamily: 'ProductSans', fontSize: 16 }}>{'\n\n\n Nenhum resultado encontrado.'}</Text></View> : null
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

  showOtherProfile(visible) {
    this.setState({ openProfile: visible });
  }

  changeOtherProfile(profileEmail) {
    this.setState({ otherProfile: profileEmail, openProfile: true })
  }

  _onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      this.setState({ isActionButtonVisible: isActionButtonVisible })
    }
    this._listViewOffset = currentOffset
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={this.state.dataFilter}
          extraData={this.state.search}
          onScroll={this._onScroll}
          renderItem={(item) => {
            return (
              this.state.filterUser ?
                  <TouchableOpacity style={styles.item} activeOpacity={0.3} onPress={() => this.changeOtherProfile(item.item.email)}>
                    <View style={{ marginRight: '3%', marginBottom: '3%' }} >
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
                  subcolor={'#cfd8dc'}
                  color={'#29434e'}
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
          transparent={false}
          animationType={"slide"}
          visible={this.state.openProfile}
          onRequestClose={() => { this.showOtherProfile(!this.state.openProfile) }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <OtherProfile email={this.state.otherProfile} />
          </View>
        </Modal>
        <FloatingAction
          actions={actions}
          color={'#29434e'}
          floatingIcon={<Icon type="material-community" size={25} color='#fff' name="filter" />}
          position="right"
          onPressItem={
            (name) => {
              if (name === 'bt_post') {
                this.setState({ filterUser: false, dataFilter: [] });
              }
              if (name === 'bt_user') {
                this.setState({ filterUser: true, dataFilter: [] });

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
    margin: 2,
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
});