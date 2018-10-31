import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image,
  TextInput,
  Picker,
  CheckBox
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class AddSpotted extends Component {

  constructor(props) {
    super();
    this.state = {
      haveImage: false,
      course: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.circle}>
            <Image style={styles.googleLogo} source={require('./../../assets/images/google-icon.png')}></Image>
          </View> 
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Local em que foi visto(a)</Text>
            <TextInput
              placeholder='BG, CAA, Praça de Alimentação...'
              style={styles.input}
              onChangeText={(location) => this.setState({ location })}
              value={this.state.location}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Curso</Text>
            <TouchableOpacity style={styles.course} activeOpacity={0.8}>
              <Picker
                selectedValue={this.state.course}
                style={{ height: 40, width: 320, color: 'gray' }}
                onValueChange={(itemValue, itemIndex) => this.setState({course: itemValue})}>
                <Picker.Item label="Desconhecido" value="Desconhecido" />
                <Picker.Item label="Ciências da Computação" value="Ciências da Computação" />
                <Picker.Item label="Eng. Elétrica" value="Eng. Elétrica" />
              </Picker>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Mensagem</Text>
            <TextInput
              placeholder='Abra seu coração'
              style={styles.input}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />
          </View>
        </View>
        <View style={styles.row}>
          <CheckBox
            value={this.state.haveImage}
            onValueChange={() => this.setState({haveImage: !this.state.haveImage })}
          />
          <Text style={{ margin: 5 }}>Checkbox para imagem, adicionar campo</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.submit}
            onPress={this.submitUser}
            activeOpacity={0.8}>
            <Text style={styles.text}>
              entrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EC5D73'
  },
  circle: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    elevation: 40
  },
  googleLogo: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    margin: 3
  },
  label: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'ProductSans',
    marginLeft: 5,
    margin:3
  },
  text: {
    color: 'gray',
    fontSize: 17,
    fontFamily: 'ProductSans',
    margin:3
  },
  course: {
    height: 40, 
    width: 330,
    borderRadius: 50,
    backgroundColor: 'white',
    color: 'gray',
    fontSize: 17,
    fontFamily: 'ProductSans',
    elevation: 5,
    borderColor: '#e7e7e7',
    borderWidth: 2,
    margin: 5
  },
  input: {
    color: 'gray',
    fontSize: 17,
    fontFamily: 'ProductSans',
    backgroundColor: 'white',
    borderColor: '#e7e7e7',
    borderWidth: 2,
    borderRadius: 30,
    elevation: 5,
    padding: 10,
    margin: 5,
    width: 330,
		height: 40,
  },
   submit: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans',
    backgroundColor: 'white',
    borderColor: '#e7e7e7',
    borderWidth: 0.5,
    borderRadius: 30,
    elevation: 20,
    width: 180,
    height: 40,
    margin: 5
  }
  
});
