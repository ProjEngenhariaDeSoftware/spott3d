import React, { Component } from 'react';

import PostList from '../components/PostList';

export default class Entertainment extends Component {
  render() {
    return (
        <PostList pageTitle='Entretenimento' type='ENTERTAINMENT' color='rgba(0, 182, 217, 1)' subcolor='#e6fbff'></PostList>
    );
  }
}
