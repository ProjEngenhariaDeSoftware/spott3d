import React, { Component } from 'react';

import FeedPost from './FeedPost';

export default class Entertainment extends Component {
  render() {
    return (
        <FeedPost pageTitle='Entretenimento' type='ENTERTAINMENT' color='#00B6D9' subcolor='#e6fbff'/>
    );
  }
}
