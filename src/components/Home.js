import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {

  async openSpotted() {
    try {
      await AsyncStorage.setItem('index', '0');
      Actions.jump('aplicacoes');
    } catch (error) {}
  }

  async openEvent() {
    try {
      await AsyncStorage.setItem('index', '1');
      Actions.jump('aplicacoes');
    } catch (error) {}
  }

  async openWarnings() {
    try {
      await AsyncStorage.setItem('index', '2');
      Actions.jump('aplicacoes');
    } catch (error) {}
  }

  async openEntertainment() {
    try {
      await AsyncStorage.setItem('index', '3');
      Actions.jump('aplicacoes');
    } catch (error) {}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.spotted}>
            <View style={styles.circleOut}>
              <TouchableOpacity onPress={this.openSpotted} activeOpacity={0.7}>
                <View style={styles.circle}>
                  <Text style={styles.title}>
                    spotteds
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.event}>
            <View style={styles.circleOut}>
              <TouchableOpacity onPress={this.openEvent} activeOpacity={0.7}>
                <View style={styles.circle}>
                  <Text style={styles.title}>
                    eventos
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.warnings}>
            <View style={styles.circleOut}>
              <TouchableOpacity onPress={this.openWarnings} activeOpacity={0.7}>
                <View style={styles.circle}>
                  <Text style={styles.title}>
                    avisos
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.entertainment}>
            <View style={styles.circleOut}>
              <TouchableOpacity onPress={this.openEntertainment} activeOpacity={0.7}>
                <View style={styles.circle}>
                  <Text style={styles.title}>
                    diversos
                  </Text>
                </View>
              </TouchableOpacity>
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
  event: {
    flex: 1,
    backgroundColor: '#5AD0BA',
    justifyContent: 'center',
    alignItems: 'center'
  },
  entertainment: {
    flex: 1,
    backgroundColor: '#00B6D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warnings: {
    flex: 1,
    backgroundColor: '#CDDAE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOut: {
    width: 137,
    height: 137,
    borderRadius: 137 / 2,
    backgroundColor: '#DFDFE3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 18,
    borderColor: '#e7e7e7',
    borderWidth: 0.8
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
    fontFamily: 'ProductSans'
  }
})
