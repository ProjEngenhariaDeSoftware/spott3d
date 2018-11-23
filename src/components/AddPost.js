import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Image,
    Dimensions,
    Picker,
    AsyncStorage,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native';
import { Button, Icon, View, Spinner } from 'native-base'
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const options = {
    mediaType: 'photo',
    maxWidth: 800,
    quality: 1
};

export default class AddPost extends Component {
    constructor(props) {
        super();
        this.state = {
            pageTitle: props.pageTitle,
            email: props.email,
            type: props.type,
            color: props.color,
            image: null,
            sendImage: null,
            startDate: null,
            endDate: null,
            sendPost: false,
            isDateTimePickerVisible: false,
            start: false,
            end: false,
            description: '',
            startDateExibition: '',
            endDateExibition: '',
            title: '',
            flag: null,


        };
    };

    removeImage = () => {
        this.setState({ image: null, sendImage: null })
    }

    sendPost = async () => {
        this.setState({ sendPost: true });
        const email = this.state.email;
        const type = this.state.type;
        const text = this.state.description;
        const image = this.state.sendImage;
        const title = this.state.title;
        const flag = this.state.flag;
        const startEvent = this.state.startDate;
        const endEvent = this.state.endDate;
        try {
            await fetch('https://api-spotted.herokuapp.com/api/post', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    user: {
                        email: email,
                    },
                    type: type,
                    text: text,
                    image: image,
                    postFlag: flag,
                    startDate: startEvent,
                    endDate: endEvent
                })
            }).then(async res => {
                if (res.status == 200) {
                    await AsyncStorage.setItem('refreshing', 'true');
                    Actions.pop()
                }

                else {
                    const showAlert = () => {Alert.alert('', 'Não foi possível adicionar a nova postagem. Por favor, verifique sua conexão com a internet e tente novamente.')};
                    showAlert();
                    this.setState({ sendPost: false });
                }

            });
        } catch (error) {
        }
    };

    cameraImage = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.error) {
                alert('Algo de errado aconteceu');
            } else if (!response.didCancel) {
                const source = { uri: response.uri };
                const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ image: source, sendImage: sourceData.uri });
            }
        });
    }

    galleryImage = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                alert('Algo de errado aconteceu');
            } else if (!response.didCancel) {
                const source = { uri: response.uri };
                const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ image: source, sendImage: sourceData.uri });
            }
        });
    }

    _showDateTimePicker = (define) => {
        define === 'start' ? this.setState({ isDateTimePickerVisible: true, start: true, end: false }) : this.setState({ isDateTimePickerVisible: true, start: false, end: true });
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false, start: false, end: false });

    _handleDatePicked = (datetime) => {
        const date = moment(datetime).format('DD-MM-YYYY HH:mm:ss')
        if (this.state.start) {
            this.setState({ startDate: date })
        } else if (this.state.end) {
            this.setState({ endDate: date })

        }
        this._hideDateTimePicker();
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#fff' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.color, elevation: 2 }}>
                    <Text style={{ padding: 10, fontFamily: 'ProductSans', textAlign: 'center', fontSize: 24, color: '#fff' }}>Adicionar  {this.state.pageTitle}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', paddingTop: 40, }}>
                    <Text style={{ fontFamily: 'ProductSans', color: this.state.color, alignSelf: 'flex-start', marginLeft: '6%', fontSize: 17 }}>Título</Text>
                    <TextInput
                        keyboardType="default"
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={{
                            margin: 5,
                            color: 'gray',
                            backgroundColor: 'white',
                            height: 40,
                            elevation: 3,
                            borderColor: this.state.color,
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 10,
                            width: "90%",
                            fontFamily: 'ProductSans',
                        }}
                        onChangeText={(text) => { this.setState({ title: text }) }}
                        placeholder="Digite o Título..."
                        returnKeyType="next"
                        blurOnSubmit={true}
                    />
                    {this.state.type === 'NOTICE' &&
                        <View style={{ width: viewportWidth, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'ProductSans', marginTop: 8, marginBottom: 6, color: this.state.color, alignSelf: 'flex-start', marginLeft: '6%', fontSize: 17 }}>Tag</Text>
                            <View style={{ width: '90%', backgroundColor: 'white', color: this.state.color, borderRadius: 10, borderWidth: 1, elevation: 3, borderColor: this.state.color }}>
                                <Picker
                                    selectedValue={this.state.flag}
                                    style={{ flex: 1, padding: 19, color: 'gray' }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ flag: itemValue })}>
                                    <Picker.Item label="Selecione" color={this.state.color} value={null} />
                                    <Picker.Item label="Outros" color={this.state.color} value="outros" />
                                    <Picker.Item label="Achado" color={this.state.color} value="achado" />
                                    <Picker.Item label="Bolsa" color={this.state.color} value="bolsa" />
                                    <Picker.Item label="Informação" color={this.state.color} value="informação" />
                                    <Picker.Item label="Perdido" color={this.state.color} value="perdido" />
                                </Picker>
                            </View>
                        </View>
                    }
                    <Text style={{ fontFamily: 'ProductSans', color: this.state.color, alignSelf: 'flex-start', marginTop: '3%', marginLeft: '6%', fontSize: 17 }}>Descrição</Text>
                    <TextInput
                        keyboardType="default"
                        autoCorrect={false}
                        autoCapitalize="none"
                        multiline={true}
                        numberOfLines={4}
                        style={{
                            color: 'gray',
                            fontFamily: 'ProductSans',
                            backgroundColor: 'white',
                            borderColor: this.state.color,
                            borderWidth: 1,
                            borderRadius: 10,
                            elevation: 3,
                            textAlignVertical: 'top',
                            padding: 10,
                            margin: 5,
                            width: '90%',
                            height: 120,
                        }}
                        onChangeText={(text) => { this.setState({ description: text }) }}
                        placeholder="Digite a Descrição..."
                        returnKeyType="default"
                    />
                    {this.state.type === 'EVENT_ACADEMIC' ?
                        <View style={{ alignSelf: 'flex-start', paddingLeft: 10 }}>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                mode='datetime'
                                locale='pt_BR'
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                            <Button transparent button onPress={() => { this._showDateTimePicker('start') }} >
                                <Icon type="MaterialIcons" name="event-available" style={{ fontSize: 25, color: this.state.color }} />
                                <Text style={{ fontFamily: 'ProductSans', color: this.state.color }}>Ínicio do evento: {this.state.startDate}</Text>
                            </Button>

                            <Button transparent button onPress={() => { this._showDateTimePicker('end') }} >
                                <Icon type="MaterialIcons" name="event-busy" style={{ fontSize: 25, color: this.state.color }} />
                                <Text style={{ fontFamily: 'ProductSans', color: this.state.color }}>Fim do evento: {this.state.endDate}</Text>
                            </Button>
                        </View>
                        : null}

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 29 }}>
                        <Text style={{ fontFamily: 'PorductSans', color: this.state.color, textAlignVertical: 'center' }}>Adicionar imagem:</Text>
                        <Button transparent button onPress={() => { this.galleryImage() }} >
                            <Icon type="MaterialCommunityIcons" name="image-plus" style={{ fontSize: 25, color: this.state.color }} />
                        </Button>
                        <Button transparent button onPress={() => { this.cameraImage() }} >
                            <Icon type="MaterialCommunityIcons" name="camera" style={{ fontSize: 25, color: this.state.color }} />
                        </Button>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={styles.badgeIconView}>
                            {(this.state.image !== null) ? <Text style={styles.badge} onPress={() => { this.removeImage() }}>X</Text> : <View style={styles.imagePreview} />}
                            <Image style={styles.imagePreview} source={this.state.image !== null ? this.state.image : null} />
                        </View>
                    </View>
                    {this.state.sendPost ? <Spinner style={{position: 'absolute', bottom: 8,}} color={this.state.color} /> : <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'ProductSans',
                            backgroundColor: this.state.color,
                            borderColor: 'white',
                            borderWidth: 1.5,
                            borderRadius: 30,
                            elevation: 3,
                            width: 160,
                            height: 40,
                            margin: 3,
                            position: 'absolute',
                            bottom: 8,
                        }}
                        onPress={this.sendPost}
                        activeOpacity={0.8}>
                        <Text style={styles.text}>
                            adicionar
                        </Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imagePreview: {
        width: (viewportWidth * 0.25),
        height: (viewportWidth * 0.25),
        borderRadius: 5,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'flex-start',
    },
    badgeIconView: {
        position: 'relative',
        padding: 5
    },
    badge: {
        fontFamily: 'ProductSans',
        fontSize: 10,
        color: '#fff',
        position: 'absolute',
        textAlign: 'center',
        height: 15,
        width: 15,
        zIndex: 10,
        top: 1,
        right: 1,
        padding: 1,
        backgroundColor: 'red',
        borderRadius: 15 / 2,
    },
    text: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'ProductSans',
        margin: 3
    },
});
