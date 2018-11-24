import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  Dimensions,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Icon } from 'react-native-elements';
import { Item } from 'native-base';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements';
import PostCard from './PostCard';
import SpottedCard from './SpottedCard';
import ProgressBar from './ProgressBar'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const actions = [{
  text: 'Editar nome de usuário',
  icon: <Icon type="material-icons" size={23} color='#fff' name="edit" />,
  name: 'bt_user',
  color: '#00B6D9',
  position: 2
},
// {
//   text: 'Editar curso',
//   icon: <Icon type="material-icons" size={23} color='#fff' name="edit" />,
//   name: 'bt_curse',
//   color: '#5AD0BA',
//   position: 3
// },
// {
//   text: 'Visualizar Denúncias',
//   icon: <Icon type="material-icons" size={23} color='#fff' name="report" />,
//   name: 'bt_report',
//   color: '#738A98',
//   position: 2
// },
{
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
      postNotifyType: undefined,
      userNotifications: [],
      userphoto: '',
      username: '',
      email: '',
      newUserName: '',
      validationColor: 'gray',
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
      isInvalid: false,
      isValid: false,
      editVisibleStatus: false,
    };
  }

  async componentDidMount() {
    try {

      const [photoURL, email, user] = await Promise.all([
        AsyncStorage.getItem('photoURL'),
        AsyncStorage.getItem('email'),
        AsyncStorage.getItem('username')
      ]);

      await fetch('https://api-spotted.herokuapp.com/api/notification/' + email)
        .then(res => res.json())
        .then(data => {
          const notVisualized = data.filter((item) => { return !item.visualized });
          const size = notVisualized.length;
          const notification = size > 0;
          const newData = data.sort((a, b) => { return b.id - a.id });
          this.setState({ username: user, notificationSize: size, userphoto: photoURL, email: email, userNotifications: newData, isLoading: false, notification: notification });
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

  showEdit(visible) {
    this.setState({ editVisibleStatus: visible, isInvalid: false, isValid: false, newUserName: false, validationColor: 'gray' })
  }

  showModal(visible) {
    if (this.state.notificationVisibleStatus)
      this.setVisualized();
    this.setState({ modalVisibleStatus: visible, notificationVisibleStatus: false })
  }

  async showPost(visible, itemId, itemType) {

    if (visible) {



      type = itemType == 'spotted' ? 'spotted': 'post';

      if (itemType == 'spotted') {
        await fetch('https://api-spotted.herokuapp.com/api/spotted/' + itemId)
          .then(res => res.json())
          .then(data => {
            this.setState({ postVisibleStatus: visible, postNotify: {item: data}, postNotifyType: type });
          });
      }

      else {
        await fetch('https://api-spotted.herokuapp.com/api/post/id/' + itemId)
          .then(res => res.json())
          .then(data => {
            this.setState({ postVisibleStatus: visible, postNotify: { item: data }, postNotifyType: type });
          });
      }

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
          animationIn='slideInUp'
          animationInTiming={700}
          animationOut="slideOutDown"
          animationOutTiming={700}
          backdropTransitionOutTiming={700}
          isVisible={this.state.postVisibleStatus}
          avoidKeyboard={true}
          style={{ flex: 1, marginLeft: 0, marginTop: 0, marginBottom: 0, marginRight: 0 }}
          onBackButtonPress={() => { this.showPost(!this.state.postVisibleStatus) }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: viewportWidth, height: viewportHeight, backgroundColor: '#fff' }}>

            {this.state.postNotifyType == 'post' ?
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

              :

              <SpottedCard
                data={this.state.postNotify}
                color={'#EC5D73'}
                subcolor={'#FAEAEA'}
                renderWithComments={true}
              />


            }

          </View>
        </Modal>
        <FlatList
          data={this.state.userNotifications}
          renderItem={({ item }) => {
            return (

              item.commenter !== this.state.email &&
              <TouchableOpacity activeOpacity={0.9} onPress={() => this.showPost(!this.state.postVisibleStatus, item.publicationId, item.publicationType)}>

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

  async sendNewUserName() {

    const newUserName = this.state.newUserName;
    const email = this.state.email;
    if (newUserName.trim() !== '' && !newUserName.includes('@')) {

      await fetch('https://api-spotted.herokuapp.com/api/user', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUserName,
          email: email
        })
      }).then(async res => {
        if (res.status == 200) {
          await AsyncStorage.setItem("username", newUserName);
          this.setState({ username: newUserName, validationColor: 'green', isValid: true, isInvalid: false })
        }
        else {
          this.setState({ validationColor: 'red', isValid: false, isInvalid: true })
        }

      });
    } else {
      this.setState({ validationColor: 'red', isValid: false, isInvalid: true })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.isLoading ? <ProgressBar color={this.state.color} /> :
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1.1, backgroundColor: this.state.color }}>
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
              // else if (name === 'bt_report') {
              //   Actions.adm();
              // }
              else if (name === 'bt_user') {
                this.showEdit(!this.state.editVisibleStatus);
              }
            }
          }
          actionsPaddingTopBottom={0}
          overlayColor="rgba(0, 0, 0, 0.7)"
          distanceToEdge={16}
        />
        <Modal
          animationIn='slideInUp'
          animationInTiming={700}
          animationOut="slideOutDown"
          animationOutTiming={700}
          backdropTransitionOutTiming={700}
          isVisible={this.state.modalVisibleStatus}
          avoidKeyboard={true}
          style={{ flex: 1, marginLeft: 0, marginTop: 0, marginBottom: 0, marginRight: 0 }}
          onBackButtonPress={() => { this.showModal(!this.state.modalVisibleStatus) }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <View>
              {this.state.notificationVisibleStatus ? this.renderNotifications() : null}
            </View>
          </View>
        </Modal>
        <Modal
          animationIn='slideInRight'
          animationInTiming={700}
          animationOut="slideOutRight"
          animationOutTiming={500}
          backdropTransitionOutTiming={400}
          isVisible={this.state.editVisibleStatus}
          avoidKeyboard={true}
          onBackButtonPress={() => { this.showEdit(!this.state.editVisibleStatus) }}
          onBackdropPress={() => { this.showEdit(!this.state.editVisibleStatus) }} >
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5 }}>
            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, padding: 10 }}>Editar nome de usuário</Text>
            <Item style={{ marginLeft: 5, marginRight: 5, marginTop: 10, alignItems: 'center', borderRadius: 5, borderWidth: 1 }} success={this.state.isValid} error={this.state.isInvalid}>
              <TextInput
                keyboardType="default"
                autoCorrect={false}
                autoCapitalize="none"
                textContentType='username'
                maxLength={25}
                style={{ padding: 1, marginLeft: 1, flex: 1 }}
                onChangeText={(text) => { this.setState({ newUserName: text }) }}
                placeholder="Novo nome de usuário"
                returnKeyType="send"
                onSubmitEditing={() => this.sendNewUserName()}
              />
              <Icon type="material-community" size={25} color={this.state.validationColor} name="account-check" />
            </Item>
            <TouchableOpacity style={{ marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', width: 40, borderRadius: 5 }} onPress={() => { this.sendNewUserName() }}>
              <Icon type="material-community" size={25} name='check-circle-outline' color={this.state.validationColor} />
            </TouchableOpacity>

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
    width: viewportWidth,
    padding: '3%',
    flexDirection: 'row',
  },
  photoRow: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: viewportWidth,
    height: (viewportWidth * 0.45),
  },

  profilepicWrap: {
    width: (viewportWidth * 0.45),
    height: (viewportWidth * 0.45),
    borderRadius: (viewportWidth * 0.45) / 2,
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
