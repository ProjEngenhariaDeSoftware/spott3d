import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  AsyncStorage,
  Image,
  Text
} from 'react-native';
import { Button, Icon, View, Spinner, Left } from 'native-base'
import ImagePicker from 'react-native-image-picker';
import PostCard from '../components/PostCard';
import ProgressBar from '../components/ProgressBar';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const options = {
  mediaType: 'photo',
  maxWidth: 800,
  quality: 1
};

export default class PostList extends PureComponent {

  constructor(props) {
    super();

    this.state = {
      isLoading: true,
      showLoader: false,
      sendPost: false,
      refreshing: false,
      modalVisibleStatus: false,
      userPhoto: '',
      username: '',
      dataSource: [],
      color: props.color,
      subcolor: props.subcolor,
      pageTitle: props.pageTitle,
      type: props.type,
      email: "",
      description: "",
      sendImage: null,
      image: null,

    }

  }

  async componentDidMount() {
    try {
      const photoURL = await AsyncStorage.getItem('photoURL');
      const displayName = await AsyncStorage.getItem('displayName');
      const mail = await AsyncStorage.getItem('email');

      await this.refreshingData();

      this.setState({ username: displayName, userPhoto: photoURL, email: mail, isLoading: false, });
    } catch (error) { }
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.state.color} /></View> : null
    );
  };

  async showModalFunction(visible) {
    this.setState({ modalVisibleStatus: visible });
  }



  sendPost = async () => {
    this.setState({ sendPost: true });
    const email = this.state.email;
    const type = this.state.type;
    const text = this.state.description;
    const image = this.state.sendImage;
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email: email,
          type: type,
          text: text,
          image: image,
        })
      }).then(res => {
        if (res.status == 200) {
          this.handleRefresh();
          this.showModalFunction(!this.state.modalVisibleStatus);
          this.setState({ sendPost: false });
        }

        else {
          alert("Falha ao Enviar!");
          console.log(res.status);
        }

      });
    } catch (error) {
    }
  };

  cameraImage = () => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        alert('Algo de errado aconteceu');
      } else {
        const source = { uri: response.uri };
        const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ image: source, sendImage: sourceData.uri });
      }
    });
  }

  galleryImage = () => {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.error) {
        alert('Algo de errado aconteceu');
      } else if (!response.didCancel) {
        const source = { uri: response.uri };
        const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ image: source, sendImage: sourceData.uri });
      }
    });
  }


  renderHeader = () => {
    return (
      <View style={styles.view}>
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.modalVisibleStatus}
          onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row' }}>
              <Button transparent button onPress={() => { this.showModalFunction(!this.state.modalVisibleStatus) }}>
                <Icon type="MaterialCommunityIcons" name="chevron-left" style={{ fontSize: 30, color: this.state.color }} />
              </Button>
              <Text style={{ fontFamily: 'ProductSans Bold', textAlign: 'center', fontSize: 25, color: this.state.color, paddingTop: 8 }}>Adicionar  {this.state.pageTitle}</Text>
            </View>
            <View style={{ alignItems: 'center', paddingTop: 40, paddingLeft: -1 }}>
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
                returnKeyType="next"
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
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 10 }}>
                <Button transparent button onPress={() => { this.galleryImage() }} >
                  <Icon type="MaterialCommunityIcons" name="image-plus" style={{ fontSize: 25, color: this.state.color }} />
                </Button>
                <Button transparent button onPress={() => { this.cameraImage() }} >
                  <Icon type="MaterialCommunityIcons" name="camera" style={{ fontSize: 25, color: this.state.color }} />
                </Button>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <View style={styles.badgeIconView}>
                  {(this.state.image !== null) ? <Text style={styles.badge} onPress={() => { this.removeImage() }}>X</Text> : <View style={styles.imagePreview} />}
                  <Image style={styles.imagePreview} source={this.state.image !== null ? this.state.image : null} />
                </View>
              </View>
              <Button transparent disabled={this.state.sendPost} style={{ alignSelf: 'center' }} button onPress={() => { this.sendPost() }} >
                <Icon type="MaterialCommunityIcons" name="send" style={{ fontSize: 25, color: this.state.color, paddingLeft: 10 }} />
              </Button>
            </View>
          </View>
        </Modal>
        <Button transparent style={{ justifyContent: 'center', alignSelf: 'flex-end' }} button onPress={() => this.addPost()} >
          <Icon type="MaterialCommunityIcons" name="plus" style={{ fontSize: 25, color: this.state.color }} />
        </Button>
      </View>
    );
  };

  removeImage = () => {
    this.setState({ image: null, sendImage: null });
  }

  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    this.refreshingData();
  };

  refreshingData = async () => {
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post')
        .then(res => res.json())
        .then(data => {
          const dataType = data.filter(post => post.type === this.state.type).sort((a, b) => b.id - a.id);
          this.setState({ refreshing: false, dataSource: dataType });
        });
    } catch (error) { }
  }

  addPost = () => {
    this.showModalFunction(!this.state.modalVisibleStatus);
  };

  renderEmptyData() {
    return (
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontFamily: 'ProductSans' }}>{'Desculpe, \nmas não temos nada aqui :('}</Text>
      </View>
    );
  }

  postDeleted() {
    this.handleRefresh();
  }

  render() {
    return (
      this.state.isLoading ? <ProgressBar color={this.state.color} /> :

        <FlatList
          data={this.state.dataSource}
          contentContainerStyle={{ paddingLeft: 1, paddingRight: 1, paddingBottom: 1, backgroundColor: this.state.color }}
          initialNumToRender={10}
          keyExtractor={item => item.id + ''}
          renderItem={(item) => {
            return (
              <PostCard
                data={item}
                subcolor={this.state.subcolor}
                color={this.state.color}
                username={this.state.username}
                userphoto={this.state.userPhoto}
                email={this.state.email}
                deleted={this.postDeleted.bind(this)}
              />
            )
          }}
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
    flex: 1,
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
  imagePreview: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'flex-start',
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
});
