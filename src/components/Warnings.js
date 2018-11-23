import React, { Component } from 'react';
import FeedPost from '../components/FeedPost'
import { View} from 'react-native';
import {Container, Tab, Tabs} from 'native-base';



export default class Warnings extends Component {
  constructor(props) {
    super();
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'avisos' },
        { key: 'second', title: 'notícias' },
      ]
    }
  }
  render() {
    return (

      <Container>
            <Tabs initialPage={0} tabContainerStyle={{ height: '8%'}}>
              <Tab heading="avisos" tabStyle={{backgroundColor: '#738A98'}} textStyle={{color: 'white', fontFamily: 'ProductSans'}} 
              activeTabStyle={{backgroundColor: '#738A98'}} activeTextStyle={{color: '#fff', fontFamily: 'ProductSans'}} >
                <View style={{flex: 1}}>
                <FeedPost pageTitle = 'Aviso'  type = "NOTICE" color='#738A98' subcolor='#dee7ed'/>
                        
                </View>
              </Tab>
              <Tab heading="notícias" tabStyle={{backgroundColor: '#738A98'}} textStyle={{color: 'white', fontFamily: 'ProductSans'}} 
              activeTabStyle={{backgroundColor: '#738A98'}} activeTextStyle={{color: '#fff', fontFamily: 'ProductSans'}}>
                <View style={{flex: 1}}>
                <FeedPost pageTitle = 'Notícia' type = 'NEWS' color='#738A98' subcolor='#dee7ed' />
                </View>
              </Tab>
            </Tabs>
          </Container>

    
    );
  }
}





