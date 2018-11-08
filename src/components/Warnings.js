import React, { Component } from 'react';
import PostList from '../components/PostList'
import { View} from 'react-native';
import {Container, Tab, Tabs} from 'native-base';



export default class Warnings extends Component {
  constructor(props) {
    super();
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Avisos' },
        { key: 'second', title: 'Notícias' },
      ]
    }
  }
  render() {
    return (

      <Container>
            <Tabs initialPage={0} tabContainerStyle={{ height: '8%'}}>
              <Tab heading="Avisos" tabStyle={{backgroundColor: '#738A98'}} textStyle={{color: 'white', fontFamily: 'ProductSans'}} 
              activeTabStyle={{backgroundColor: '#738A98'}} activeTextStyle={{color: 'white'}} >
                <View >
                <PostList pageTitle = 'Aviso'  type = "NOTICE" color='#adadb1'></PostList>
                        
                </View>
              </Tab>
              <Tab heading="Notícias" tabStyle={{backgroundColor: '#738A98'}} textStyle={{color: 'white'}} 
              activeTabStyle={{backgroundColor: '#738A98'}} activeTextStyle={{color: 'white'}}>
                <View>
                <PostList pageTitle = 'Notícia' type = 'NEWS' color='#adadb1'></PostList>
                </View>
              </Tab>
            </Tabs>
          </Container>

    
    );
  }
}





