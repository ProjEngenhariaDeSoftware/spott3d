import React, { Component } from 'react';
import PostList from '../components/PostList';

export default class Entertainment extends Component {
  render() {
    return (
      <PostList pageTitle = 'Entretenimento' type = 'ENTERTAINMENT' color='#00B6D9'></PostList>
    );
  }
}