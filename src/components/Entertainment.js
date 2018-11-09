import React, { Component } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';

import PostList from '../components/PostList';

export default class Entertainment extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        <PostList pageTitle='Entretenimento' type='ENTERTAINMENT' color='#00B6D9'></PostList>
      </KeyboardAvoidingView>
    );
  }
}
