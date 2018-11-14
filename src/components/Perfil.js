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
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Icon } from 'react-native-elements';
import { GoogleSignin } from 'react-native-google-signin';
import { Actions } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements'
import ProgressBar from '../components/ProgressBar';

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



export default class Perfil extends Component {

  constructor(props) {


    super();
    this.state = {

      userNotifications: [],
      userphoto: '',
      username: '',
      email: '',
      notification: false,
      notificationSize: 0,
      notificationVisibleStatus: false,
      configurationVisibleStatus: false,
      modalVisibleStatus: false,
      refreshing: false,
      color: '#00B6D9',
      transparent: false,
      showLoader: false,
      isLoading: true,
    };
  }

  async componentDidMount() {
    try {

      const photoURL = await AsyncStorage.getItem('photoURL');
      const email = await AsyncStorage.getItem('email');


      await fetch('https://api-spotted.herokuapp.com/api/user/' + email + '/notify')
        .then(res => res.json())
        .then(data => {
          const size = data.notifications.length;
          this.state.notification = size > 0;
          const newData = data.notifications;
          this.setState({ notificationSize: size, userphoto: photoURL, username: data.username, email: email, userNotifications: newData, isLoading: false });
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
    this.setState({ modalVisibleStatus: visible, configurationVisibleStatus: false, notificationVisibleStatus: false })
  }


  headerNotifications() {
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





  renderNotifications() {

    return (

      this.state.userNotifications.length > 0 ?

        <FlatList
          data={this.state.userNotifications}
          renderItem={({ item }) => {
            return (

              item.commenter !== this.state.email &&
              <View>

                <ListItem
                  containerStyle={{ marginLeft: 0 }}
                  title={'@' + item.commenter.username}
                  titleStyle={styles.title}
                  subtitle={<View style={styles.subtitleView}>
                    <Text >Mencionou você em um Comentário</Text>

                  </View>}
                  leftAvatar={{ source: { uri: item.commenter.image } }}
                >
                </ListItem>
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
          ListEmptyComponent={<View></View>}
          ListHeaderComponent={this.headerNotifications}
          ListFooterComponent={this.renderLoader}
          contentContainerStyle={{ width: viewportWidth }}
        /> : <View><Text>Nenhuma Notificação!</Text></View>);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.isLoading ? <ProgressBar color={this.state.color} /> :
        <View style={{flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: this.state.borderColor}}>
          <View style={styles.topView}>
            {this.iconNotification()}
          </View >
          <View style={styles.photoRow}>
            <View style={styles.profilepicWrap}>
              <Image source={{ uri: this.state.userphoto }} style={styles.profilepic} />
            </View>
          </View>
          </View>
          <View style={{flex: 1, paddingTop: 40, alignItems: 'center'}}>
          <Text style={{fontFamily: 'ProductSans Bold', fontSize: 24, color: this.state.color }}>Nome de usuário </Text>
          <Text style={{fontFamily: 'ProductSans', fontSize: 24, color: this.state.color }}>@{this.state.username}</Text>
          <Text style={{fontFamily: 'ProductSans Bold', fontSize: 24, color: this.state.color, paddingTop: 10 }}>E-mail </Text>
          <Text style={{fontFamily: 'ProductSans', fontSize: 24, color: this.state.color }}>{this.state.email}</Text>
          </View>
          </View>}
        <FloatingAction
          actions={actions}
          color={'rgba(0, 182, 217, 1)'}
          floatingIcon={<Icon type="material-community" size={25} color='#fff' name="settings-outline" />}
          position="right"
          onPressItem={
            (name) => {
              console.log(`Pressed action: ${name}`);
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
    borderRadius: 120,
    borderColor: 'rgba(4, 3, 2, 0.3)',
    borderWidth: 10,
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
  title: {
    fontFamily: 'ProductSans',
    color: 'black',
    fontSize: 14
  },
  subtitleView: {
    flexDirection: 'row',
    margin: 0.5
  },

});
