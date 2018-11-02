import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl
} from 'react-native';
import { Button, Icon, View, Spinner } from 'native-base';
import SpottedCard from '../components/SpottedCard';
import ProgressBar from '../components/ProgressBar';
import { Actions } from 'react-native-router-flux';

export default class SpottedList extends Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: props.dataPosts,
      colorDetail: props.color,
      spotteds: [],
      isLoading: true,
      refreshing: false,
    }
  }

  renderLoader = () => {
    return (
      this.state.showLoader ? <View><Spinner color={'#EC5D73'} /></View> : null
    );
  };

  addButton = () => {
    return (
      <View style={styles.view}>
        <Button transparent button onPress={this.addPost}>
          <Icon type="MaterialCommunityIcons" name="plus" style={{ fontSize: 25, color: '#EC5D73' }} />
        </Button>
      </View>
    );
  };

  async componentDidMount() {
    let request = [];
    let posts = [];
    try {
      await fetch('https://api-spotted.herokuapp.com/api/spotted')
        .then(res => res.json())
        .then(data => {
          request = data;
          request.forEach(spotted => {
            if (spotted.visible) {
              posts.push(spotted);
            }
          });
          this.state.spotteds = posts.sort((a, b) => b.id - a.id);
          this.setState({ isLoading: false });
          console.warn(data);
        });
    } catch (error) { }

  };

  addPost = () => {
    Actions.jump('addspotted');
  };

  handleRefresh = async () => {
    this.componentDidMount();
  }

  render() {
    return (
      this.state.isLoading ? <ProgressBar color={'#EC5D73'} /> :
        <FlatList
          data={this.state.spotteds}
          renderItem={(item) => {
            return (
              <SpottedCard data={item} />
            )
          }}
          keyExtractor={item => item.id}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              colors={['#EC5D73']}
            />
          }
          ListHeaderComponent={this.addButton}
          ListFooterComponent={this.renderLoader}
        />
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 0,
    backgroundColor: '#fff',
    height: 40,
    elevation: 5,
  }
});
