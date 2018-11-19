import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  TextInput,
  AsyncStorage,
  Image,
  Text
} from 'react-native';
import { Button, Icon, View, Spinner } from 'native-base'
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { FloatingAction } from 'react-native-floating-action';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
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
    this._listViewOffset = 0
    this.state = {
      isLoading: true,
      showLoader: false,
      sendPost: false,
      refreshing: false,
      modalVisibleStatus: false,
      isActionButtonVisible: true,
      isDateTimePickerVisible: false,
      start: false,
      end: false,
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
      startDate: null,
      endDate: null,
      startDateExibition: '',
      endDateExibition: '',
    }

  }

  async componentDidMount() {
    try {
      const photoURL = await AsyncStorage.getItem('photoURL');
      const displayName = await AsyncStorage.getItem('displayName');
      const mail = await AsyncStorage.getItem('email');
      const user = await AsyncStorage.getItem('username');
	

      await this.refreshingData();

      this.setState({ username:user, userPhoto: photoURL, email: mail, isLoading: false, });
    } catch (error) { }
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.state.color} /></View> : null
    );
  };

  async showModalFunction(visible) {
    this.setState({ modalVisibleStatus: visible, sendPost: !visible, sendImage: null, image: null  });
  }



  sendPost = async () => {
    this.setState({ sendPost: true });
    const email = this.state.email;
    const type = this.state.type;
    const text = this.state.description;
    const image = this.state.sendImage;
    const title = this.state.title;
    const startEvent = this.state.startDate;
    const endEvent = this.state.endDate;
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          title: title,
          user: {
            email: email,
          },
          type: type,
          text: text,
          image: image,
          startDate: startEvent,
          endDate: endEvent
        })
      }).then(res => {
        if (res.status == 200) {
          this.handleRefresh();
          this.showModalFunction(!this.state.modalVisibleStatus);
          this.setState({ sendPost: false});
        }

        else {
          alert("Falha ao Enviar!");
        }

      });
    } catch (error) {
    }
  };

  cameraImage = () => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        alert('Algo de errado aconteceu');
      } else if (!response.didCancel) {
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

  _showDateTimePicker = (define) => {
    define === 'start' ? this.setState({ isDateTimePickerVisible: true, start: true, end: false }) : this.setState({ isDateTimePickerVisible: true, start: false, end: true });
  }

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false, start: false, end: false });

  _handleDatePicked = (datetime) => {
    // moment.locale("pt-br"); FUTURO
    const date = moment(datetime).format('DD-MM-YYYY HH:mm:ss')
    if (this.state.start) {
      // this.setState({startDateExibition: moment(datetime).format('LLLL')}); FUTURO
      this.setState({ startDate: date })
    } else if (this.state.end) {
      // this.setState({endDateExibition: moment(datetime).format('LLLL')}); FUTURO
      this.setState({ endDate: date })

    }
    this._hideDateTimePicker();
  };

  renderModal = () => {
    return (
      <Modal
        animationIn='slideInUp'
        animationInTiming={800}
        animationOut="slideOutDown"
        animationOutTiming={800}
        backdropTransitionOutTiming={800}
        isVisible={this.state.modalVisibleStatus}
        avoidKeyboard={true}
        style={{flex: 1, marginLeft: 0, marginTop: 0, marginBottom: 0, marginRight: 0}}
        onBackButtonPress={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
        <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#fff' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 2 }}>
            <Text style={{ padding: 10, fontFamily: 'ProductSans Bold', textAlign: 'center', fontSize: 24, color: this.state.color }}>Adicionar  {this.state.pageTitle}</Text>
          </View>
          <View style={{ alignItems: 'center', paddingTop: 40,}}>
            <Text style={{ fontFamily: 'ProductSans' ,color: this.state.color, alignSelf: 'flex-start', marginLeft: '6%', fontSize: 17 }}>Título</Text>
            <TextInput
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
            <Text style={{ fontFamily: 'ProductSans', color: this.state.color, alignSelf: 'flex-start', marginLeft: '6%', fontSize: 17 }}>Descrição</Text>
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
            {this.state.type === 'EVENT_ACADEMIC' ?
              <View style={{ alignSelf: 'flex-start', paddingLeft: 10 }}>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  mode='datetime'
                  locale='pt_BR'
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDateTimePicker}
                />
                <Button transparent button onPress={() => { this._showDateTimePicker('start') }} >
                  <Icon type="MaterialIcons" name="event-available" style={{ fontSize: 25, color: this.state.color }} />
                  <Text style={{ fontFamily: 'ProductSans', color: this.state.color }}>Ínicio do evento: {this.state.startDate}</Text>
                </Button>

                <Button transparent button onPress={() => { this._showDateTimePicker('end') }} >
                  <Icon type="MaterialIcons" name="event-busy" style={{ fontSize: 25, color: this.state.color }} />
                  <Text style={{ fontFamily: 'ProductSans', color: this.state.color }}>Fim do evento: {this.state.endDate}</Text>
                </Button>
              </View>
              : null}

            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 29 }}>
              <Text style={{ fontFamily: 'PorductSans',color: this.state.color, textAlignVertical: 'center' }}>Adicionar imagem:</Text>
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
      </Modal >
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
      await fetch('https://api-spotted.herokuapp.com/api/post/type/' + this.state.type)
        .then(res => res.json())
        .then(data => {
          this.setState({ refreshing: false, dataSource: data });
        });
    } catch (error) { }
  }

  addPost = () => {
    this.showModalFunction(!this.state.modalVisibleStatus);
  };

  renderEmptyData() {
    return (
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontFamily: 'ProductSans' }}>{'Desculpe, \nmas não temos nada aqui :(\n\n\nAproveite e adicione um novo!'}</Text>
      </View>
    );
  }

  postDeleted() {
    this.handleRefresh();
  }

  _onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    const buttonVisible = direction === 'up'
    if (buttonVisible !== this.state.isActionButtonVisible) {
      this.setState({ isActionButtonVisible: buttonVisible })
    }
    this._listViewOffset = currentOffset
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.isLoading ? <ProgressBar color={this.state.color} /> :
          <FlatList
            ref={(list) => this.commentsFlatList = list}
            data={this.state.dataSource}
            initialNumToRender={10}
            onScroll={this._onScroll}
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
                onRefresh={this.handleRefresh}
                colors={[this.state.color]}
              />
            }
            ListEmptyComponent={this.renderEmptyData}
            ListFooterComponent={this.renderLoader}
          />}
        <FloatingAction
          color={this.state.color}
          floatingIcon={<Icon type="MaterialCommunityIcons" style={{ color: '#fff' }} name="plus" />}
          position="right"
          visible={this.state.isActionButtonVisible}
          showBackground={false}
          onPressMain={this.addPost}
          overlayColor="#F2F2F2"
          distanceToEdge={16}
        />
        {this.renderModal()}
      </View>
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
    borderRadius: 10,
    width: "90%",
    fontFamily: 'ProductSans',

  },
  descriptionInput: {
    marginLeft: 8,
    marginBottom: 10,
    height: 120,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    fontFamily: 'ProductSans',

  },
  imagePreview: {
    width: (viewportWidth*0.4),
    height: (viewportWidth*0.4),
    borderRadius: 5,
    resizeMode: 'contain',
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
