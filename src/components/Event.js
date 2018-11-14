import React, { Component } from 'react';
import PostList from '../components/PostList'

export default class Event extends Component {

  render() {
    return (
      <PostList pageTitle = 'Evento' type = 'EVENT_ACADEMIC' color='rgba(90, 208, 186, 1)' subcolor='#ebf9f7'></PostList>
    );
  }
}
