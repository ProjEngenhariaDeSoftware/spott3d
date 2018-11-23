import React, { Component } from 'react';
import FeedPost from './FeedPost'

export default class Event extends Component {

  render() {
    return (
      <FeedPost pageTitle = 'Evento' type = 'EVENT_ACADEMIC' color='#5AD0BA' subcolor='#ebf9f7'/>
    );
  }
}
