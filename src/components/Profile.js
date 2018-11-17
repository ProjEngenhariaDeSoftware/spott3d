import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  Dimensions,
  Text,
  Modal,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Icon } from 'react-native-elements';
import { GoogleSignin } from 'react-native-google-signin';
import { Actions } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements';
import PostCard from './PostCard';
import ProgressBar from './ProgressBar'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const actions = [{
  text: 'Editar nome de usuário',
  icon: <Icon type="material-icons" size={23} color='#fff' name="edit" />,
  name: 'bt_accessibility',
  color: '#5AD0BA',
  position: 4
}, {
  text: 'Editar curso',
  icon: <Icon type="material-icons" size={23} color='#fff' name="edit" />,
  name: 'bt_language',
  color: '#00B6D9',
  position: 3
}, {
  text: 'Visualizar Denúncias',
  icon: <Icon type="material-icons" size={23} color='#fff' name="report" />,
  name: 'bt_report',
  color: '#738A98',
  position: 2
}, {
  text: 'Sair da conta',
  icon: <Icon type="material-community" size={23} color='#fff' name="logout" />,
  name: 'bt_exit',
  color: '#EC5D73',
  position: 1
}];

export default class Profile extends Component {

  constructor(props) {


    super();
    this.state = {
      posts: [],
      postNotify: undefined,
      userNotifications: [],
      userphoto: '',
      username: '',
      email: '',
      notification: false,
      notificationSize: 0,
      notificationVisibleStatus: false,
      postVisibleStatus: false,
      modalVisibleStatus: false,
      refreshing: false,
      color: '#0086a7',
      transparent: false,
      showLoader: false,
      isLoading: true,
    };
  }


  //   } catch (error) { }

  // }

  async componentDidMount() {
    try {

      const photoURL = await AsyncStorage.getItem('photoURL');
      const email = await AsyncStorage.getItem('email');

      await fetch('https://api-spotted.herokuapp.com/api/user/email/' + email)
        .then(res => res.json())
        .then(data => {

          this.setState({ username: data.username });
        });


      await fetch('https://api-spotted.herokuapp.com/api/notification/' + email)
        .then(res => res.json())
        .then(data => {
          const notVisualized = data.filter((item) => { return !item.visualized });
          const size = notVisualized.length;
          const notification = size > 0;
          const newData = data.sort((a,b) => {return b.id - a.id });
          this.setState({ notificationSize: size, userphoto: photoURL, email: email, userNotifications: newData, isLoading: false, notification: notification });
        });


    } catch (error) { }

  }

  googleLogout = async () => {
    try {
      await GoogleSignin.configure();
      await GoogleSignin.signOut();
      await AsyncStorage.clear();
      Actions.reset('start');
    } catch (error) { }
  }

  iconNotification = () => {
    return (
      <View style={styles.badgeIconView}>
        {this.state.notification ? <Text style={styles.badge}>{this.state.notificationSize}</Text> : null}
        <Icon size={26} color='#fff' type="MaterialIcons" name={this.state.notification ? "notifications-active" : "notifications-none"} button onPress={() => this.buttonNotification(!this.state.notificationVisibleStatus)} />
      </View>
    );
  }

  handleRefresh = () => {
    this.componentDidMount();
  };

  buttonNotification(visible) {
    this.setState({ transparent: false, modalVisibleStatus: visible, notification: false, notificationVisibleStatus: visible })
  }

  showModal(visible) {
    if (this.state.notificationVisibleStatus)
      this.setVisualized();
    this.setState({ modalVisibleStatus: visible, notificationVisibleStatus: false })
  }

  async showPost(visible, itemId) {

    if (visible) {
      await fetch('https://api-spotted.herokuapp.com/api/post/id/' + itemId)
        .then(res => res.json())
        .then(data => {
          this.setState({ postVisibleStatus: visible, postNotify: { item: data } });
        });
    }
    else
      this.setState({ postVisibleStatus: visible });
  }


  headerNotifications() {

    return (
      <View>
        <Text style={{ color: '#0086a7', textAlign: 'center', fontFamily: 'ProductSans', fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Notificações</Text>
      </View>
    );
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.state.color} /></View> : null
    );
  };


  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  postDeleted() {
    this.handleRefresh();
  }

  setVisualized() {
    const notVisualized = this.state.userNotifications.filter((item) => { return !item.visualized });
    var notificationsVisualized = [];
    this.state.userNotifications.forEach((element) => {
      const notificationItem = {
        id: element.id,
        publicationType: element.publicationType,
        publicationId: element.publicationId,
        commenter: element.commenter,
        markedEmail: element.markedEmail,
        visualized: true
      };
      notificationsVisualized.push(notificationItem);
    });

    this.setState({ userNotifications: notificationsVisualized, notificationSize: 0, notification: false });

    try {
      notVisualized.forEach(element => {
        element.visualized = true;
        fetch('https://api-spotted.herokuapp.com/api/notification/' + element.id, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(element)
        });


      });
    } catch (error) {
    }


  }

  renderNotifications() {



    return (

      <View style={{ flex: 1 }}>

        <Modal

          animationType={"slide"}
          visible={this.state.postVisibleStatus}
          onRequestClose={() => { this.showPost(!this.state.postVisibleStatus) }} >

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: viewportWidth, height: viewportHeight }}>

            <PostCard
              data={this.state.postNotify}
              subcolor={'#cfd8dc'}
              color={'#29434e'}
              username={this.state.username}
              userphoto={this.state.userphoto}
              email={this.state.email}
              renderWithComments={true}
              deleted={this.postDeleted.bind(this)}
            />

          </View>


        </Modal>

        <FlatList
          data={this.state.userNotifications}
          renderItem={({ item }) => {
            return (

              item.commenter !== this.state.email &&
              <TouchableOpacity activeOpacity={0.9} onPress={() => this.showPost(!this.state.postVisibleStatus, item.publicationId)}>

                <ListItem
                  containerStyle={{ marginLeft: 0 }}
                  title={'@' + item.commenter.username}
                  titleStyle={{
                    fontFamily: 'ProductSans',
                    color: item.visualized ? 'black' : '#00B6D9',
                    fontSize: 14
                  }}
                  subtitle={<View style={styles.subtitleView}>
                    <Text >Mencionou você em um Comentário</Text>


                  </View>}
                  leftAvatar={{ source: { uri: item.commenter.image } }}
                >
                </ListItem>



              </TouchableOpacity>

            );
          }}
          keyExtractor={item => item.id + ''}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              colors={["#0086a7"]}
            />
          }
          onEndReached={(event) => this.hideLoader(event)}
          ListEmptyComponent={<Text style={{ fontFamily: 'ProductSans', textAlign: 'center', marginTop: 200, fontSize: 25 }}> Nenhuma Notificação!</Text>}
          ListHeaderComponent={this.headerNotifications}
          ListFooterComponent={this.renderLoader}
          contentContainerStyle={{ width: viewportWidth }}

        />
      </View>);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.isLoading ? <ProgressBar color={this.state.color} /> :
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: this.state.color }}>
              <View style={styles.topView}>
                {this.iconNotification()}
              </View >
              <View style={styles.photoRow}>
                <View style={styles.profilepicWrap}>
                  <Image source={{ uri: this.state.userphoto }} style={styles.profilepic} />
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: '1%', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: 'gray' }}>Nome de usuário </Text>
              <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: this.state.color }}>@{this.state.username}</Text>
              <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: 'gray', paddingTop: 10 }}>E-mail </Text>
              <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: this.state.color }}>{this.state.email}</Text>
            </View>
          </View>}
        <FloatingAction
          actions={actions}
          color={'#0086a7'}
          floatingIcon={<Icon type="material-community" size={25} color='#fff' name="settings-outline" />}
          position="right"
          onPressItem={
            (name) => {
              if (name === 'bt_exit') {
                this.googleLogout();
              }
            }
          }
          actionsPaddingTopBottom={0}
          overlayColor="rgba(0, 0, 0, 0.7)"

          distanceToEdge={16}
        />
        <Modal
          transparent={this.state.transparent}
          animationType={"slide"}
          visible={this.state.modalVisibleStatus}
          onRequestClose={() => { this.showModal(!this.state.modalVisibleStatus) }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              {this.state.notificationVisibleStatus ? this.renderNotifications() : null}
            </View>
          </View>

        </Modal>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  badgeIconView: {
    position: 'relative',
    padding: 5
  },
  badge: {
    fontFamily: 'ProductSans',
    fontSize: 10,
    color: '#fff',
    position: 'absolute',
    textAlign: 'center',
    height: 15,
    width: 15,
    zIndex: 10,
    top: 1,
    right: 1,
    padding: 1,
    backgroundColor: 'red',
    borderRadius: 15 / 2,
  },
  configurations: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00B6D9',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: viewportWidth,
  },
  topView: {
    flex: 0,
    width: viewportWidth,
    padding: 20,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoRow: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: viewportWidth,
    height: 180,
  },

  profilepicWrap: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    borderColor: '#fff',
    borderWidth: 8,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 120,
    // borderColor: '#fff',
    // borderWidth: 2
  },
  descriptionContainer: {
    flex: 0.3,
    width: viewportWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#5bd7ed',
    elevation: 2,
    borderRadius: 10
  },
  textDescription: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'ProductSans Bold',
    textAlign: 'center',

  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: 'white',
    borderColor: '#e7e7e7',
    borderWidth: 0.5,
  },
  googleLogo: {
    width: 26,
    height: 26,
    marginRight: 5,
  },
  googleText: {
    color: 'gray',
    fontFamily: 'ProductSans',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  subtitleView: {
    flexDirection: 'row',
    margin: 0.5
  },

});
