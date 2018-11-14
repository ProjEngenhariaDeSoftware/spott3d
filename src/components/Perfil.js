import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  Text,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Icon as IconBase, Button as ButtonBase, Card, CardItem } from 'native-base'
import { Icon, Button } from 'react-native-elements';
import { GoogleSignin } from 'react-native-google-signin';
import { Actions } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements';
import PostCard from '../components/PostCard';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');



export default class Perfil extends Component {

  constructor(props) {


    super();
    this.state = {
      userNotifications: [],
      posts: [],
      userphoto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgTajOSQOEn79tT6EqTxU2ngWkZeoi2Ft8frau_vQII6x4PPKh',
      username: '',
      email: '',
      notification: false,
      notificationSize: 0,
      notificationVisibleStatus: false,
      configurationVisibleStatus: false,
      postVisibleStatus: false,
      modalVisibleStatus: false,
      refreshing: false,
      color: '#00B6D9',
      transparent: false,
      showLoader: false,
    };
  }

  async componentDidMount() {
    try {

      const photoURL = await AsyncStorage.getItem('photoURL');
      const displayName = await AsyncStorage.getItem('displayName');
      const email = await AsyncStorage.getItem('email');


      await fetch('https://api-spotted.herokuapp.com/api/user/' + 'hemillainy.santos@ccc.ufcg.edu.br' + '/notify')
        .then(res => res.json())
        .then(data => {
          const notVisualized = data.notification.filter((item) => { return !item.visualized });
          const size = notVisualized.length;
          this.state.notification = size > 0;
          const newData = data.notifications;
          this.setState({ notificationSize: size, userphoto: photoURL, username: displayName, email: email, userNotifications: newData });
        });



    } catch (error) { }

  }

  fetch = async () => {
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post')
        .then(res => res.json())
        .then(data => {
          this.setState({ refreshing: false, posts: data });
        });
    } catch (error) { }

    this.fetch();
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
        <Icon size={26} color={this.state.color} type="MaterialIcons" name={this.state.notification ? "notifications-active" : "notifications-none"} button onPress={() => this.buttonNotification(!this.state.notificationVisibleStatus)} />
      </View>
    );
  }

  handleRefresh = () => {
    this.componentDidMount();
  };

  buttonNotification(visible) {
    this.setState({ transparent: false, modalVisibleStatus: visible, notification: false, notificationVisibleStatus: visible })
  }

  buttonConfigurations(visible) {
    this.setState({ transparent: true, modalVisibleStatus: visible, configurationVisibleStatus: visible })
  }
  renderConfigurations() {
    return (

      <View>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start' }} onPress={() => this.showModal(false)}>
        </TouchableOpacity>
        <View style={styles.configurations}>
          <Button
            icon={
              <Icon
                type="material-icons"
                size={23} color='#fff'
                name="edit"
              />
            }
            buttonStyle={{ width: viewportWidth, backgroundColor: '#00B6D9', elevation: 0 }}
            title='Editar nome de usuário'
          />
          <Button
            icon={
              <Icon
                type="material-icons"
                size={23} color='#fff'
                name="edit"
              />
            }
            buttonStyle={{ width: viewportWidth, backgroundColor: '#00B6D9', elevation: 0 }}
            title='Editar curso                     '
          />
          <Button
            icon={
              <Icon
                type="material-icons"
                size={23} color='#fff'
                name="report"
              />
            }
            buttonStyle={{ width: viewportWidth, backgroundColor: '#00B6D9', elevation: 0 }}
            title='Visualizar denúncias     '
          />
          <Button
            icon={
              <Icon
                type="material-community"
                size={23} color='#fff'
                name="logout"
              />
            }
            buttonStyle={{ width: viewportWidth, backgroundColor: '#00B6D9', elevation: 0 }}
            title='Sair da conta                  '
            onPress={() => this.googleLogout()}
          />
        </View>
      </View>
    );
  }

  showModal(visible) {
    this.setState({ modalVisibleStatus: visible, configurationVisibleStatus: false, notificationVisibleStatus: false })
  }

  showPost(visible) {
    this.setState({ postVisibleStatus: visible })
  }


  headerNotifications() {

    this.setVisualized();
    return (
      <View>
        <Text style={{ color: '#00B6D9', textAlign: 'center', fontFamily: 'ProductSans', fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Notificações</Text>
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

  getPostById = async (id) => {

    const post = await this.state.posts.filter((item) => {
      return item.id.includes(id);
    });


    return post;


  }


  setVisualized = async () => {
    const notVisualized = this.state.userNotifications.filter((item) => { return !item.visualized });


    notVisualized.forEach(element => {

      try {

        element.visualized = true;

        await fetch('https://api-spotted.herokuapp.com/api/user/' + this.state.email + '/notify', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(element)
        }).then(a => {

        });

      } catch (error) {
      }

    });


  }


  renderNotifications() {

    return (


      <FlatList
        data={this.state.userNotifications}
        renderItem={({ item }) => {
          return (

            item.commenter !== this.state.email &&
            <View>
              <TouchableOpacity activeOpacity={0.9} onPress={() => this.showPost(!this.state.postVisibleStatus)}>

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

                    <Text></Text>

                    <Modal
                      transparent={this.state.transparent}
                      animationType={"slide"}
                      visible={this.state.postVisibleStatus}
                      onRequestClose={() => { this.showPost(!this.state.postVisibleStatus) }} >
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <PostCard
                          data={this.getPostById(item.publicationId)}
                          subcolor={'#cfd8dc'}
                          color={'#29434e'}
                          username={this.state.username}
                          userphoto={this.state.userPhoto}
                          email={this.state.email}
                          deleted={this.postDeleted.bind(this)}
                        />
                      </View>


                    </Modal>

                  </View>}
                  leftAvatar={{ source: { uri: item.commenter.image } }}
                >
                </ListItem>
              </TouchableOpacity>
            </View>

          );
        }}
        keyExtractor={item => item.id + ''}
        onEndReachedThreshold={1}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            colors={["#00B6D9"]}
          />
        }
        onEndReached={(event) => this.hideLoader(event)}
        ListEmptyComponent={<Text style={{ fontFamily: 'ProductSans', textAlign: 'center', marginTop: 200, fontSize: 25 }}> Nenhuma Notificação!</Text>}
        ListHeaderComponent={this.headerNotifications}
        ListFooterComponent={this.renderLoader}
        contentContainerStyle={{ width: viewportWidth }}
      />);
  }




  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          {this.iconNotification()}
          <Icon type="material-community" size={26} color='#00B6D9' name="settings-outline" button onPress={() => this.buttonConfigurations(!this.state.configurationVisibleStatus)} />
        </View >

        <View style={styles.photoRow}>
          <TouchableOpacity activeOpacity={0.75} style={styles.profilepicWrap} onPress={() => alert("Cliquei na photo")}>
            <Image source={{ uri: this.state.userphoto }} style={styles.profilepic} />
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionContainer}>
          <Text styles={styles.textDescription}>Nome de usuário: {this.state.username}</Text>
          <Text styles={styles.textDescription}>Email: {this.state.email}</Text>
        </View>
        <View style={{ flex: 0.2 }}>
        </View>
        <Modal
          transparent={this.state.transparent}
          animationType={"slide"}
          visible={this.state.modalVisibleStatus}
          onRequestClose={() => { this.showModal(!this.state.modalVisibleStatus) }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              {this.state.notificationVisibleStatus ? this.renderNotifications() : this.renderConfigurations()}
            </View>
          </View>

        </Modal>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderRadius: 120,
    borderColor: '#5bd7ed',
    borderWidth: 8,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 120,
    borderColor: '#fff',
    borderWidth: 2
  },
  descriptionContainer: {
    flex: 0.3,
    width: viewportWidth,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderRadius: 10
  },
  textDescription: {
    fontSize: 8,
    color: 'gray',
    fontFamily: 'ProductSans',
    textAlign: 'center'
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
