import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  AsyncStorage,
  Text
} from 'react-native';
import { Button, Icon, View, Spinner, Left } from 'native-base'
import PostCard from '../components/PostCard';
import ProgressBar from '../components/ProgressBar';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class PostList extends Component {

  constructor(props) {
    super();

    this.state = {
      isLoading: true,
      showLoader: false,
      userPhoto: '',
      username: '',
      refreshing: false,
      dataSource: [],
      color: props.color,
      subcolor: props.subcolor,
      modalVisibleStatus: false,
      pageTitle: props.pageTitle,
      type: props.type,
      email: "",
      description: "",


    }

  }

  async componentDidMount() {
    try {
      const photoURL = await AsyncStorage.getItem('photoURL');
      const displayName = await AsyncStorage.getItem('displayName');
      const mail = await AsyncStorage.getItem('email');
      await fetch('https://api-spotted.herokuapp.com/api/post')
        .then(res => res.json())
        .then(data => {

          const dataType = data.filter(post => post.type === this.state.type);
          this.setState({username: displayName, userPhoto: photoURL, refreshing: false, isLoading: false, dataSource: dataType, email: mail });
        });
    } catch (error) { }
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.state.color} /></View> : null
    );
  };

  showModalFunction(visible) {
    this.setState({ modalVisibleStatus: visible });
  }



  sendPost = async () => {
      try {
        await fetch('https://api-spotted.herokuapp.com/api/post', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            email: this.state.email,
            type: this.state.type,
            text: this.state.description,
          })
        }).then(res => {
          if (res.status == 200) {
            alert("Enviado com Sucesso!");
            this.componentDidMount();
            this.showModalFunction(!this.state.modalVisibleStatus);
          }

          else {
            alert("Falha ao Enviar!");
          }

        });
      } catch (error) {
       }
  };


  renderHeader = () => {
    return (
      <View style={styles.view}>

        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.modalVisibleStatus}
          onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >


          <Button transparent button onPress={() => { this.showModalFunction(!this.state.modalVisibleStatus) }}>
            <Icon type="MaterialCommunityIcons" name="close" style={{ fontSize: 25, color: this.state.color }} />
          </Button>
          <Text style={{ fontFamily: 'ProductSans', textAlign: 'center', fontWeight: 'bold', fontSize: 25, color: this.state.color }}>Adicionar  {this.state.pageTitle}</Text>
          <View style={{ alignItems: 'center', marginTop: 40 }}>



            <Text style={{ color: this.state.color }}>Título:</Text>
            <TextInput
              autoFocus
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              multiline={true}
              style={styles.textInput}
              onChangeText={(text) => { this.setState({ title: text }) }}
              placeholder="Digite o Título..."
              returnKeyType="send"
              blurOnSubmit={true}
            />

            <Text style={{ color: this.state.color }}>Descrição:</Text>
            <TextInput
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              multiline={true}
              style={styles.descriptionInput}
              onChangeText={(text) => { this.setState({ description: text }) }}
              placeholder="Digite a Descrição..."
              returnKeyType="send"
              blurOnSubmit={true}
            />


            <Text style={{ color: this.state.color }}>Local: </Text>
            <TextInput
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              multiline={true}
              style={styles.textInput}
              onChangeText={(text) => { this.setState({ location: text }) }}
              placeholder="Digite o Local ..."
              returnKeyType="send"
              blurOnSubmit={true}

            />


            <Button transparent style={{ alignContent: 'center', alignSelf: 'center' }} button onPress={() => { this.sendPost() }} >
              <Icon type="MaterialCommunityIcons" name="send" style={{ fontSize: 25, color: this.state.color, paddingLeft: 10 }} />
            </Button>


          </View>
        </Modal>

        <Button transparent button onPress={() => this.addPost()} >
          <Icon type="MaterialCommunityIcons" name="plus" style={{ fontSize: 25, color: this.state.color }} />
        </Button>
      </View>
    );
  };

  hideLoader = (e) => {
      e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true});
      try {
        await fetch('https://api-spotted.herokuapp.com/api/post')
          .then(res => res.json())
          .then(data => {
            const dataType = data.filter(post => post.type === this.state.type);
            this.setState({ refreshing: false, dataSource: dataType });
          });
      } catch (error) { }
  };

  addPost = () => {
    this.showModalFunction(!this.state.modalVisibleStatus);
  };

  renderEmptyData() {
    return (
      <View style={{alignItems: 'center', marginTop: 25 }}>
        <Text style={{ fontSize: 14, fontFamily: 'ProductSans Bold' }}>Desculpe mas não temos nada aqui :(</Text>
      </View>
    );
  }

  render() {
    return (
      this.state.isLoading ? <ProgressBar color={this.state.color} /> :

        <FlatList
          data={this.state.dataSource}
          renderItem={(item) => {
            return (
              <PostCard
              data={item}
              subcolor={this.state.subcolor}
              color={this.state.color}
              username={this.state.username}
              userphoto={this.state.userPhoto}
              email={this.state.email}
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
              colors={[this.state.color]}
            />
          }
          ListEmptyComponent={this.renderEmptyData}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderLoader}
        />
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: viewportWidth,
    backgroundColor: 'white'
  },
  progressBar: {
    flex: 1,
    height: viewportHeight,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  view: {
    flex: 0,
    width: viewportWidth,
    backgroundColor: '#fff',
    height: 40,
    elevation: 5,

  },
  textInput: {
    marginLeft: 8,
    marginBottom: 10,
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 45,
    width: "90%",
    fontFamily: 'ProductSans',

  },
  descriptionInput: {
    marginLeft: 8,
    marginBottom: 10,
    height: 120,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 30,
    width: "90%",
    fontFamily: 'ProductSans',

  },

  date: {
    marginLeft: 8,
    marginBottom: 10,
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 45,
    width: "90%",

  },


});
