import React, { Component } from 'react';
import SpottedList from '../components/SpottedList';


export default class Spotted extends Component {
  constructor(props) {
    super();
    this.posts = [];
    this.state = {
      dataSource: this.posts
    }
  }

  render() {
    return (
      <SpottedList 
        dataPosts={this.state.dataSource} 
        color='#EC5D73'
        subcolor='#FAEAEA'
      >
      </SpottedList>
    );
  }
}
