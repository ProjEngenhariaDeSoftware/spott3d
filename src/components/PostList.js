import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  Text
} from 'react-native';
import { Button, Icon, View, Spinner, Left } from 'native-base'
import PostCard from '../components/PostCard';
import ProgressBar from '../components/ProgressBar';
import DatePicker from 'react-native-datepicker'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class PostList extends Component {
  constructor(props) {
    super();
    // this.posts = [
    //     {
    //       key: '0',
    //       userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5',
    //       title: 'Semana acadêmica',
    //       local: 'UFCG',
    //       date: 'de 22 a 24 de Outubro de 2018',
    //       image: true,
    //       imageurl: 'http://www.computacao.ufcg.edu.br/_/rsrc/1373053918398/departamento/informes/iisemanaacademicadacomputacaoufcg/Captura%20de%20Tela%202013-07-05%20%C3%A0s%2016.50.58.png',
    //       coments: '12',
    //     },

    //     {
    //       key: '2',
    //       userphoto: 'https://avatars1.githubusercontent.com/u/28960913',
    //       title: 'Python Nordeste',
    //       local: 'UFCG',
    //       date: 'de 26 a 29 de Outubro de 2018',
    //       image: true,
    //       imageurl: 'http://paraibacvb.com.br/wp-content/uploads/2018/03/pythonnordeste2018destaque.png',
    //       coments: '115',
    //     },
    //     {
    //       key: '3',
    //       userphoto: 'https://avatars2.githubusercontent.com/u/28992235',
    //       title: 'Mãe Hemi faz você passar em tudo!',
    //       local: 'UFCG',
    //       date: 'de 05 a 10 de Novembro de 2018',
    //       image: true,
    //       imageurl: 'https://joaobidu.com.br/wp-content/uploads/2016/08/pano-preto-em-cima-vela-vermela-acesa-e-cartas-de-taro-espalhadas-550x367.jpg',
    //       coments: '220',
    //     },

    //     {
    //       key: '4',
    //       userphoto: 'https://avatars2.githubusercontent.com/u/29614366',
    //       title: 'Venha aprender com o melhor!',
    //       local: 'UFCG',
    //       date: '30 de Outubro de 2018',
    //       image: true,
    //       imageurl: 'https://i.ytimg.com/vi/AKvzS0mMy-c/maxresdefault.jpg',
    //       coments: '150',
    //     },
    //     {
    //       key: '5',
    //       userphoto: 'https://avatars0.githubusercontent.com/u/23560337',
    //       title: 'Melhor evento do mundo!',
    //       local: 'UFCG',
    //       date: '30 de Outubro de 2018',
    //       image: true,
    //       imageurl: 'https://t.tudocdn.net/319345',
    //       coments: '320',
    //     },
    //     {
    //       key: '6',
    //       userphoto: 'https://avatars3.githubusercontent.com/u/12588175',
    //       title: 'Evento Roadsec',
    //       local: 'UFCG',
    //       date: '45 de Outubro de 2018',
    //       image: false,
    //       text: 'O Roadsec é o maior evento hacker da América Latina, durante o evento são apresentadas diversas palestras e oficinas de hacking, segurança da informação, ti e tecnologia em geral, além é claro de reunir profissionais, empresas e pessoas com o mesmo interesse, ou seja, como o Roadsec acaba sendo uma ótima forma de conhecer pessoas com os mesmos interesses que você, ou quem sabe até mesmo conseguir uma vaga de emprego ou simplesmente um networking.',
    //       coments: '320'
    //     }
    //   ]

    this.state = {
      isLoading: true,
      showLoader: true,
      refreshing: false,
      dataSource: props.dataPosts,
      colorDetail: props.color,
      modalVisibleStatus: false,
      pageTitle: props.pageTitle,
      title: "",
      description: "",
      location: "",
      date: new Date(),


    }

  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.state.colorDetail} /></View> : null
    );
  };

  showModalFunction(visible) {
    this.setState({ modalVisibleStatus: visible });
  }



  sendPost(post) {

    post = { 
      title: this.state.title,
      description: this.state.description,
      location: this.state.location,
      date: this.state.date
    }
    // this.state.data.item.coments.push({ coment: comment, userid: this.state.username, userphoto: this.state.userphoto });
    // console.log(coment);
    
  }


  renderHeader = () => {
    return (
      <View style={styles.view}>

        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.modalVisibleStatus}
          onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >


           <Button transparent button onPress={() => { this.showModalFunction(!this.state.modalVisibleStatus) }}>
              <Icon type="MaterialCommunityIcons" name="close" style={{ fontSize: 25, color: this.state.colorDetail }} />
            </Button>
            <Text style={{fontFamily:'ProductSans',textAlign:'center', fontWeight: 'bold',fontSize:25, color:this.state.colorDetail}}>Adicionar  {this.state.pageTitle}</Text>
          <View style={{ alignItems: 'center', marginTop: 40 }}>

           

            <Text style={{color:this.state.colorDetail}}>Título:</Text>
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

            <Text style={{color:this.state.colorDetail}}>Descrição:</Text>
            <TextInput
              autoFocus
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


            <Text style={{color:this.state.colorDetail}}>Local: </Text>
            <TextInput
              autoFocus
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

            <Text style={{color:this.state.colorDetail}}>Data:</Text>
            <DatePicker
              style={styles.date}
              date={this.state.date}
              mode="date"
              placeholder="Selecione a Data"
              format="DD/MM/YYYY"
              minDate={new Date()}
              maxDate="23/09/2024"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{

                dateInput: {
                  borderWidth: 0,
                  shadowOpacity: 0.0
                },
                dateText: {
                  fontFamily: 'ProductSans'
                }

              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />


            <Button transparent button onPress={() => { this.sendPost() }}>
              <Icon type="MaterialCommunityIcons" name="send" style={{ fontSize: 25, color: this.state.colorDetail, paddingLeft:10}} />
            </Button>
      

          </View>
        </Modal>

        <Button transparent button onPress={() => this.addPost()}> 
          <Icon type="MaterialCommunityIcons" name="plus" style={{ fontSize: 25, color: this.state.colorDetail }} />
        </Button>
      </View>
    );
  };

  hideLoader = () => {
    setTimeout(() => {
      this.setState({ showLoader: false })
    }, 1);
  };

  componentDidMount() {
    var self = this;
    setTimeout(function () {
      self.setState({ isLoading: false, refreshing: false });
    }, 1);
  };

  handleRefresh = () => {
    const newData = this.state.dataSource.slice();
    newData.unshift({
      key: '' + Math.random(),
      userphoto: 'https://sites.google.com/site/matheusgr/_/rsrc/1454169440563/config/customLogo.gif?revision=5',
      title: 'Sad :(',
      local: 'Natal-RN',
      date: '17 a 22 de Outubro de 2018',
      image: true,
      imageurl: 'data:image/png;base64,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',
      coments: '' + (Math.floor(Math.random() * (1000 - 0 + 1)) + 0),
    });

    var self = this;
    this.setState({ refreshing: true },
      () => {
        setTimeout(function () {
          self.setState({ refreshing: false, dataSource: newData });
        }, 1);
      });
  };

  addPost = () => {
    this.showModalFunction(!this.state.modalVisibleStatus);
  };

  render() {
    return (
      this.state.isLoading ? <ProgressBar color={this.state.colorDetail} /> :

        <FlatList
          data={this.state.dataSource}
          renderItem={(item) => {
            return (
              <PostCard data={item} />
            )
          }}
          keyExtractor={item => item.key}
          onEndReachedThreshold={1}
          onEndReached={(event) => this.hideLoader(event)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              colors={[this.state.colorDetail]}
            />
          }
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
    fontFamily: 'ProductSans'
  },
  descriptionInput: {
    marginLeft: 8,
    marginBottom: 10,
    height: 120,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 30,

    width: "90%",
    fontFamily: 'ProductSans'
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
