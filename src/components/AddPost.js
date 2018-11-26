import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Dimensions,
    Picker,
    Text,
    Alert,
    View,
    TouchableOpacity
} from 'react-native';
import { Icon, Spinner, Thumbnail } from 'native-base'
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/pt-br'
import { Actions } from 'react-native-router-flux';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const options = {
    title: null,
    cancelButtonTitle: 'Cancelar',
    chooseFromLibraryButtonTitle: 'Escolha uma imagem da sua galeria',
    takePhotoButtonTitle: 'Tire uma foto',
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
            startDateExibition: 'Ínicio do evento',
            endDateExibition: 'Fim do evento',
            title: '',
            flag: null,
            warningTitle: false,
            warningDate: false,
            warningTag: false,
        };
    };

    removeImage = () => {
        this.setState({ image: null, sendImage: null })
    }

    sendPost = async () => {

        const email = this.state.email;
        const type = this.state.type;
        const text = this.state.description;
        const image = this.state.sendImage;
        const title = this.state.title;
        const flag = this.state.flag;
        const startEvent = this.state.startDate;
        const endEvent = this.state.endDate;

        this.setState({ sendPost: true });
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
                    this.props.add();
                    Actions.pop();
                }

                else {
                    const showAlert = () => { Alert.alert('', 'Não foi possível adicionar a nova postagem. Por favor, verifique sua conexão com a internet e tente novamente.') };
                    showAlert();
                    this.setState({ sendPost: false });
                }

            });
        } catch (error) {
        }
    };

    // cameraImage = () => {
    //     ImagePicker.launchCamera(options, (response) => {
    //         if (response.error) {
    //             alert('Algo de errado aconteceu');
    //         } else if (!response.didCancel) {
    //             const source = { uri: response.uri };
    //             const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
    //             this.setState({ image: source, sendImage: sourceData.uri });
    //         }
    //     });
    // }

    // galleryImage = () => {
    //     ImagePicker.launchImageLibrary(options, (response) => {
    //         if (response.error) {
    //             alert('Algo de errado aconteceu');
    //         } else if (!response.didCancel) {
    //             const source = { uri: response.uri };
    //             const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
    //             this.setState({ image: source, sendImage: sourceData.uri });
    //         }
    //     });
    // }

    _showDateTimePicker = (define) => {
        define === 'start' ? this.setState({ isDateTimePickerVisible: true, start: true, end: false }) : this.setState({ isDateTimePickerVisible: true, start: false, end: true });
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false, start: false, end: false });

    _handleDatePicked = (datetime) => {
        const date = moment(datetime).format('DD-MM-YYYY HH:mm:ss');
        const dateExibition = moment(datetime).format('ddd[,] DD [de] MMM [de] YYYY [ás] HH:mm');
        if (this.state.start) {
            this.setState({ startDate: date, startDateExibition: dateExibition })
        } else if (this.state.end) {
            this.setState({ endDate: date, endDateExibition: dateExibition })

        }
        this._hideDateTimePicker();
    };

    selectPhoto = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.error) {
                alert('Algo de errado aconteceu');
            } else if (!response.didCancel) {
                const source = { uri: response.uri };
                const sourceData = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ image: source, sendImage: sourceData.uri });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { backgroundColor: this.state.color }]}>
                    <Text style={styles.title}>Adicionar  {this.state.pageTitle.toLowerCase()}</Text>
                </View>
                <View style={styles.subContainer}>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: this.state.color }]}>Título</Text>
                        <TextInput
                            keyboardType="default"
                            autoCorrect={false}
                            autoCapitalize="none"
                            style={styles.input}
                            onChangeText={(text) => { this.setState({ title: text }) }}
                            placeholder="Digite o título..."
                            returnKeyType="next"
                            value={this.state.title}
                        />
                    </View>
                    {this.state.type === 'NOTICE' &&
                        <View style={styles.row}>
                            <Text style={[styles.label, { color: this.state.color }]}>Tag</Text>
                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={this.state.flag}
                                    style={{ height: 40, width: '100%', color: 'gray' }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ flag: itemValue })}>
                                    <Picker.Item label="Selecione" color={this.state.color} value={null} />
                                    <Picker.Item label="Achado" color={this.state.color} value="achado" />
                                    <Picker.Item label="Perdido" color={this.state.color} value="perdido" />
                                    <Picker.Item label="Bolsa de auxílio" color={this.state.color} value="bolsa de auxílio" />
                                    <Picker.Item label="Informação" color={this.state.color} value="informação" />
                                    <Picker.Item label="Outros" color={this.state.color} value="outros" />
                                </Picker>
                            </View>
                        </View>
                    }
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: this.state.color }]}>Descrição</Text>
                        <TextInput
                            keyboardType="default"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            multiline={true}
                            numberOfLines={4}
                            style={styles.textArea}
                            onChangeText={(text) => { this.setState({ description: text }) }}
                            placeholder="Digite a descrição..."
                            value={this.state.text}
                            returnKeyType="default"
                        />
                    </View>
                    {this.state.type === 'EVENT_ACADEMIC' &&
                        <View style={styles.row}>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                mode='datetime'
                                locale='pt_BR'
                                minimumDate={new Date()}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                            <TouchableOpacity activeOpacity={0.8} style={styles.dateButton} onPress={() => { this._showDateTimePicker('start') }} >
                                <Text style={styles.selectDate}>{this.state.startDateExibition}</Text>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Icon type="MaterialCommunityIcons" name="calendar-clock" style={{ fontSize: 25, color: this.state.color }} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={styles.dateButton} onPress={() => { this._showDateTimePicker('end') }} >
                                <Text style={styles.selectDate}>{this.state.endDateExibition}</Text>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Icon type="MaterialCommunityIcons" name="calendar-clock" style={{ fontSize: 25, color: this.state.color }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.imageArea}>
                        <View style={styles.badgeIconView}>
                            {(this.state.image !== null) ? <Text style={styles.badge} onPress={() => { this.removeImage() }}>X</Text> : <View style={styles.imagePreview} />}
                            <Thumbnail square large style={{ borderRadius: 10 }} source={this.state.image != null ? this.state.image : null} />
                        </View>
                    </View>
                </View>
                {this.state.sendPost ? <Spinner style={{ alignSelf: 'center', position: 'absolute', bottom: 8, }} color={this.state.color} /> :
                    <View style={styles.footerArea}>
                        <TouchableOpacity
                            style={[styles.submit, { backgroundColor: this.state.color }]}
                            onPress={this.selectPhoto}
                            activeOpacity={0.8}>
                            <Text style={styles.text}>
                                adicionar imagem
                                    </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submit, { backgroundColor: this.state.color }]}
                            onPress={this.sendPost}
                            activeOpacity={0.8}>
                            <Text style={styles.text}>
                                enviar
                                </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2ebef'
    },
    subContainer: {
        flex: 1,
        margin: 15,
        alignItems: 'center'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,

    },
    title: {
        fontFamily: 'ProductSans',
        fontSize: 22,
        color: '#fff'
    },
    row: {
        margin: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    imageArea: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 5
    },
    label: {
        fontSize: 17,
        fontFamily: 'ProductSans',
        marginLeft: 5,
        margin: 3
    },
    dateArea: {
        width: (viewportWidth * 0.95),
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        margin: 3

    },
    selectDate: {
        fontFamily: 'ProductSans',
        fontSize: 17,
        color: 'gray',
        marginVertical: 4
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
        width: (viewportWidth * 0.95),
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
        width: (viewportWidth * 0.95),
        height: 120,
        textAlignVertical: 'top'

    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        elevation: 3,
        padding: 10,
        margin: 6,
        borderWidth: 2,
        borderColor: '#e7e7e7',
        backgroundColor: '#fff',
        width: (viewportWidth * 0.95),
        height: 40,
    },
    picker: {
        height: 40,
        width: (viewportWidth * 0.95),
        borderRadius: 10,
        backgroundColor: 'white',
        color: 'gray',
        fontSize: 17,
        fontFamily: 'ProductSans',
        elevation: 3,
        borderColor: '#e7e7e7',
        borderWidth: 2,
        margin: 5,
        justifyContent: 'center'
    },
    imagePreview: {
        width: 140,
        height: 140,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2
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
    submit: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 20,
        fontFamily: 'ProductSans',
        borderColor: 'white',
        borderWidth: 1.5,
        borderRadius: 30,
        elevation: 3,
        width: 160,
        height: 40,
        margin: 3
    },
    footerArea: {
        justifyContent: 'space-between',
        padding: 13,
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        width: viewportWidth
    }
});
