import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.spotted}>
            <Button title="spotted" />
          </View>
          <View style={styles.news}>
            <Button title="notícias" />
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.notice}>
            <Button title="avisos" />
          </View>
          <View style={styles.entertainment}>
            <Button title="entretenimento" />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spotted: {
    flex: 1,
    backgroundColor: '#ffda76',
    justifyContent: 'center',
    alignItems: 'center',
  },
  news: {
    flex: 1,
    backgroundColor: '#e88d60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entertainment: {
    flex: 1,
    backgroundColor: '#d14de8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notice: {
    flex: 1,
    backgroundColor: '#ff6585',
    justifyContent: 'center',
    alignItems: 'center',
  }
})