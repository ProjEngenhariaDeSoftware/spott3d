import React, { Component } from 'react';
import PostList from '../components/PostList'

export default class Event extends Component {

  render() {
    return (
      <PostList pageTitle = 'Evento' type = 'EVENT_ACADEMIC' color='#5AD0BA'></PostList>
    );
  }
}
