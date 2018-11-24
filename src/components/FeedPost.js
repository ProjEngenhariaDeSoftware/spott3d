import React, { PureComponent } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  AsyncStorage,
  Text
} from 'react-native';
import { Icon, View, Spinner } from 'native-base'
import { FloatingAction } from 'react-native-floating-action';
import PostCard from './PostCard';
import ProgressBar from './ProgressBar';
import { Actions } from 'react-native-router-flux';

export default class FeedPost extends PureComponent {

  constructor(props) {
    super();
    this.color = props.color;
    this.subcolor = props.subcolor;
    this.type = props.type;
    this.pageTitle = props.pageTitle
    this.state = {
      isLoading: true,
      showLoader: false,
      refreshing: false,
      modalVisibleStatus: false,
      userPhoto: '',
      username: '',
      dataSource: [],
      email: "",
    }

  }

  async componentDidMount() {
    try {
      const [photoURL, mail, user] = await Promise.all([
        AsyncStorage.getItem('photoURL'),
        AsyncStorage.getItem('email'),
        AsyncStorage.getItem('username')
      ]);
      await this.refreshingData();
      this.setState({ username: user, userPhoto: photoURL, email: mail, isLoading: false, });
    } catch (error) { }
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.color} /></View> : null
    );
  };

  removeImage = () => {
    this.setState({ image: null, sendImage: null });
  }

  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };
  
  _handleRefresh = () => {
    this.setState({ refreshing: true });
    this.refreshingData().then(() => {
      this.setState({refreshing: false});
    });
  }

  refreshingData = async () => {
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post/type/' + this.type)
        .then(res => res.json())
        .then(data => {
          this.setState({dataSource: data });
        });
    } catch (error) { }
  }

  renderEmptyData() {
    return (
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontFamily: 'ProductSans' }}>{'Desculpe, \nmas não temos nada aqui :(\n\n\nAproveite e adicione um novo!'}</Text>
      </View>
    );
  }

  postDeleted() {
    this._handleRefresh();
  }

  addPost = async () => {
    Actions.push('addpost',{
      color: this.color,
      type: this.type,
      pageTitle: this.pageTitle,
      email: this.state.email
    });

    const sendSucess = await AsyncStorage.getItem('refreshing');
    sendSucess === 'true' ? this._handleRefresh : console.log('nada adicionado');

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.isLoading ? <ProgressBar color={this.color} /> :
          <FlatList
            data={this.state.dataSource}
            initialNumToRender={10}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={(item) => {
              return (
                <PostCard
                  data={item}
                  subcolor={this.subcolor}
                  color={this.color}
                  username={this.state.username}
                  userphoto={this.state.userPhoto}
                  email={this.state.email}
                  renderWithComments={false}
                  deleted={this.postDeleted.bind(this)}
                />
              )
            }}
            onEndReachedThreshold={1}
            onEndReached={(event) => this.hideLoader(event)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._handleRefresh}
                colors={[this.color]}
              />
            }
            ListEmptyComponent={this.renderEmptyData}
            ListFooterComponent={this.renderLoader}
          />}
        <FloatingAction
          color={this.color}
          floatingIcon={<Icon type="MaterialCommunityIcons" style={{ color: '#fff' }} name="plus" />}
          position="right"
          showBackground={false}
          onPressMain={() => this.addPost()}
          overlayColor="#F2F2F2"
          distanceToEdge={16}
        />
      </View>
    );
  }
}
