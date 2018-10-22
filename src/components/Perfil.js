import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import { Container, Icon, Left, Right, Grid, Row, Text } from 'native-base';
import { GoogleSignin } from 'react-native-google-signin';
import { Actions } from 'react-native-router-flux';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class Perfil extends Component {

  constructor(props) {
    super();
    this.state = {
      userphoto: 'https://avatars2.githubusercontent.com/u/29696054?s=400&u=4e8a04635bdc34bef2d407581ad1532eabbdef22&v=4',
      username: 'brunop.meneses',
      email: 'Ciência da Computação',
      notification: true,
      color: 'red'
    };
  }

  async componentDidMount() {
    try {
      const photoURL = await AsyncStorage.getItem('photoURL');
      const displayName = await AsyncStorage.getItem('displayName');
      const email = await AsyncStorage.getItem('email');

      this.setState({ userphoto: photoURL, username: displayName, email: email });

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
  iconNotification() {
    return (
      <Icon style={{ fontSize: 23, color: this.state.color }} type="MaterialIcons" name={this.state.notification ? "notifications-active" : "notifications-none"} button onPress={() => this.notificacao()} />
    );
  }
  notificacao() {
    this.state.notification ? alert("Notificações: BLA BLA BLA") : alert("Não possui mais Notificações")
    this.setState({ notification: false, color: '#00B6D9' })
  }

  render() {
    return (
      <View style={styles.container}>
        <Grid>
          <Row style={styles.topView}>
            <Left>
              {this.iconNotification()}
            </Left>
            <Right>
              <Icon type="MaterialCommunityIcons" style={{ fontSize: 23, color: '#00B6D9' }} name="settings-outline" button onPress={() => alert("Cliquei em configurações")} />
            </Right>
          </Row >

          <Row style={styles.photoRow}>
            <TouchableOpacity activeOpacity={0.75} style={styles.profilepicWrap} onPress={() => alert("Cliquei na photo")}>
              <Image source={{ uri: this.state.userphoto }} style={styles.profilepic} />
            </TouchableOpacity>
          </Row>
          <Row style={styles.descriptionRow}>
            <View style={styles.descriptionContainer}>
              <Text styles={styles.title}>Nome de usuário: {this.state.username}</Text>
              <Text styles={styles.title}>Email: {this.state.email}</Text>
            </View>
          </Row>
          <Row>
            <View style={{ width: viewportWidth, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={this.googleLogout}
                activeOpacity={0.7}>
                <Image style={styles.googleLogo} source={require('./../../assets/images/google-icon.png')}></Image>
                <Text style={styles.googleText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  topView: {
    // flex: 0.2,  
    width: viewportWidth,
    marginTop: 10,
    padding: 20,
    height: 10,
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoRow: {
    justifyContent: 'center',
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
  descriptionRow: {
    justifyContent: 'center',
    width: viewportWidth,
    height: 180,
  },
  descriptionContainer: {
    width: viewportWidth - 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    //elevation: 5,
    borderRadius: 10
  },
  title: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'ProductSans',
    textAlign: 'justify'
  },
  welcome: {
    fontSize: 40,
    fontFamily: 'ProductSans',
    color: '#fff',
    textAlign: 'center',
    margin: 10,
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
  }
});
