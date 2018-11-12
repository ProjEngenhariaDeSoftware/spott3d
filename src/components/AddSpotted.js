import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Picker
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import LZString from 'lz-string';

const options = {
  title: 'Opções',
  cancelButtonTitle: 'Cancelar',
  chooseFromLibraryButtonTitle: 'Escolha uma imagem da sua galeria',
  takePhotoButtonTitle: 'Tire uma foto',
  mediaType: 'photo',
  maxWidth: 800,
  quality: 1
};

export default class AddSpotted extends Component {

  constructor(props) {
    super();
    this.state = {
      course: null,
      location: null,
      text: null,
      image: null,
      sendImage: null,
      sending: false
    };    
  }

  selectPhoto = () => {
     ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        alert('Algo de errado aconteceu');
      } else {
        const source = { uri: response.uri };
        let sourceData = 'data:image/jpeg;base64,' + response.data;
        //sourceData = LZString.compress(sourceData);
        this.setState({ image: source, sendImage: sourceData });
      } 
    });
  }

  submitSpotted = async () => {
    try {
      this.setState({ sending: true });
      await fetch('https://api-spotted.herokuapp.com/api/spotted', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          location: this.state.location,
          course: this.state.course,
          text: this.state.text,
          image: this.state.sendImage
        })
      }).then(res => {
        console.error(res);
        Actions.pop();
      });
    } catch(error) {
      this.setState({ sending: false });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, margin: 15}}>
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
                  onValueChange={(itemValue, itemIndex) => this.setState({ course: itemValue })}>
                  <Picker.Item label="Desconhecido" value="Desconhecido" />
                  <Picker.Item label="Ciência da Computação" value="Ciência da Computação" />
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
                underlineColorAndroid="transparent"
                numberOfLines={4}
                multiline={true}
                style={styles.textArea}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
              />
              <View style={{ alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                <Image style={styles.imagePreview} source={this.state.image != null ? this.state.image : null } />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ margin: 10, flexDirection: 'row', position: 'absolute', bottom: 0 }}>
            <View style={styles.row}>
              <View>
                <TouchableOpacity
                  style={styles.submit}
                  onPress={this.selectPhoto}
                  activeOpacity={0.8}>
                  <Text style={styles.text}>
                    adicionar imagem
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.submit}
                onPress={this.submitSpotted}
                activeOpacity={0.8}
                disabled={this.state.sending}>
                <Text style={styles.text}>
                  enviar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dadada'
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
  imagePreview: {
    width: 140,
    height: 140,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2
  },
  row: {
    flex: 1,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    color: '#EC5D73',
    fontSize: 17,
    fontFamily: 'ProductSans',
    marginLeft: 5,
    margin: 3
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'ProductSans',
    margin: 3
  },
  course: {
    height: 40,
    width: 330,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'gray',
    fontSize: 17,
    fontFamily: 'ProductSans',
    elevation: 3,
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
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    margin: 5,
    width: 330,
    height: 40,
  },
  textArea: {
    color: 'gray',
    fontSize: 17,
    fontFamily: 'ProductSans',
    backgroundColor: 'white',
    borderColor: '#e7e7e7',
    borderWidth: 2,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    margin: 5,
    width: 330,
    height: 120,
  },
  submit: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans',
    backgroundColor: '#EC5D73',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 30,
    elevation: 3,
    width: 160,
    height: 40,
    margin: 3
  },
  image: {
    height: 150,
    margin: 150,
    borderRadius: 30,
    margin: 5
  }
});
