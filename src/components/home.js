import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.spotted}>
            <View style={styles.circleOut}>
              <View style={styles.circle}>
                <Text style={styles.title} onPress={Actions.aplicacoes}>
                  spotteds
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.news}>
            <View style={styles.circleOut}>
              <View style={styles.circle}>
                <Text style={styles.title} onPress={Actions.aplicacoes}>
                  notícias
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.notice}>
            <View style={styles.circleOut}>
              <View style={styles.circle}>
                <Text style={styles.title} onPress={Actions.aplicacoes}>
                  avisos
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.entertainment}>
            <View style={styles.circleOut}>
              <View style={styles.circle}>
                <Text style={styles.title} onPress={Actions.aplicacoes}>
                  entret
                </Text>
              </View>
            </View>
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
    backgroundColor: '#EC5D73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  news: {
    flex: 1,
    backgroundColor: '#00B6D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entertainment: {
    flex: 1,
    backgroundColor: '#5AD0BA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notice: {
    flex: 1,
    backgroundColor: '#738A98',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOut: {
    width: 137,
    height: 137,
    borderRadius: 137 / 2,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontStyle: 'italic',
  }
})