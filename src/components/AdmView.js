import React, { Component } from 'react';
import { View, Text, Dimensions,FlatList,RefreshControl } from 'react-native';
import { Container, Tab, Tabs, Card, CardItem, Left, Body, Thumbnail, Icon, Spinner } from 'native-base';
import ProgressBar from './ProgressBar';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class AdmView extends Component {
  constructor(props) {
    super();

    this.color = '#0086a7';

    this.state = {
      refreshing: false,
      isLoading: true,
      showLoader: false,
      postReports: [],
      spottedReports: [],
      index: 0,
      routes: [
        { key: 'first', title: 'spotteds' },
        { key: 'second', title: 'posts' },
      ]
    }
  }

  async componentDidMount() {
    try {
      await this.refreshingPostData();
      await this.refreshingSpottedData();
      this.setState({isLoading: false, });
    } catch (error) { }
  }

  renderEmptyData() {
    return (
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Text style={{ fontSize: 18, fontFamily: 'ProductSans' }}>{'\n\n\n\n\nDesculpe, \nmas não temos nada aqui :(\n\n\nAproveite e adicione um novo!'}</Text>
      </View>
    );
  }

  _handleRefresh = (type) => {
    this.setState({ refreshing: true });

   if (type === 'post'){
    this.refreshingPostData().then(() => {
      this.setState({refreshing: false});
    });
  }

  else{
    this.refreshingSpottedData().then(() => {
      this.setState({refreshing: false});
    });
  }

  }

  refreshingPostData = async () => {
    try {
      await fetch('https://api-spotted.herokuapp.com/api/post/hidden/')
        .then(res => res.json())
        .then(data => {
          this.setState({postReports: data });
        }); 
    } catch (error) { }
  }

  refreshingSpottedData = async () => {
    try {
       await fetch('https://api-spotted.herokuapp.com/api/spotted/hidden')
        .then(res => res.json())
        .then(data => {
          this.setState({spottedReports: data });
        }); 


    } catch (error) { }
  }


  hideLoader = (e) => {
    e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
  };

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={this.color} /></View> : null
    );
  };

  renderList (list,type){
    return (
      this.state.isLoading ? <ProgressBar color={this.color} /> :
    
    <FlatList
      data={list}
      initialNumToRender={10}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={(item) => {
        return (
         this.renderCardDenuncia(item)
        );
      }}

      onEndReachedThreshold={1}
      onEndReached={(event) => this.hideLoader(event)}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh(type)}
          colors={[this.color]}
        />
      }
      ListEmptyComponent={this.renderEmptyData}
      ListFooterComponent={this.renderLoader}
    />

    );
  }


  renderCardDenuncia(item) {


    /*
   <View style={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1, height:6 }}>
      <Card style={{ marginBottom: 1, flex: 1}}>

        <CardItem style={{ backgroundColor: '#0086a7' }}>
          <View style={{ flexDirection: 'column', flex: 2, alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             
              <Thumbnail small source={{ uri: item.user.image }} />
             
              <View style={{ flexDirection: 'column', alignItems: 'flex-start', margin: 1 }}>
                <Text style={{ margin: 1, marginBottom: 0, alignItems: 'flex-end', fontFamily: 'ProductSans', fontSize: 16, color: this.color }}>{item.title.toUpperCase()}</Text>
              </View>
           
            </View>
          </View>

        </CardItem>

        <Body>
          <Body style={{ flex: 1, alignItems: 'flex-start' }}>
            <Text>Teste 2</Text>
          </Body>
        </Body>

      </Card>
    </View>
    */

    return (

      <View style={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1, height:6 }}>
     
    </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: viewportWidth }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0086a7', elevation: 2, width: viewportWidth }}>
          <Text style={{ padding: 10, fontFamily: 'ProductSans', textAlign: 'center', fontSize: 24, color: 'white' }}>Visualizar Denúncias</Text>
        </View>

        <Container>
            <Tabs initialPage={0} tabContainerStyle={{ height: '8%'}}>
              <Tab heading="spotteds" tabStyle={{backgroundColor: '#738A98'}} textStyle={{color: 'white', fontFamily: 'ProductSans'}} 
              activeTabStyle={{backgroundColor: '#738A98'}} activeTextStyle={{color: '#fff', fontFamily: 'ProductSans'}} >
                <View style={{flex: 1}}>
                        {this.renderList(this.state.spottedReports,'spotted')}                
                </View>
              </Tab>
              <Tab heading="posts" tabStyle={{backgroundColor: '#738A98'}} textStyle={{color: 'white', fontFamily: 'ProductSans'}} 
              activeTabStyle={{backgroundColor: '#738A98'}} activeTextStyle={{color: '#fff', fontFamily: 'ProductSans'}}>
                <View style={{flex: 1}}>
               
                </View>
              </Tab>
            </Tabs>
          </Container>




      </View>
    );
  }
}
