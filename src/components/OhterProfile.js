import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
} from 'react-native';

import ProgressBar from './ProgressBar'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class OtherProfile extends PureComponent {

    constructor(props) {
        super();
        this.state = {
            userphoto: '',
            username: '',
            email: props.email,
            color: '#0086a7',
            isLoading: true,
        };
    }

    async componentDidMount() {
        try {

            await fetch('https://api-spotted.herokuapp.com/api/user/email/' + this.state.email)
                .then(res => res.json())
                .then(data => {
                    this.setState({ username: data.username, userphoto: data.image, isLoading: false});
                });

        } catch (error) { }

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {this.state.isLoading ? <ProgressBar color={this.state.color} /> :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: this.state.color }}>
                            <View style={styles.topView}>
                            </View >
                            <View style={styles.photoRow}>
                                <View style={styles.profilepicWrap}>
                                    <Image source={{ uri: this.state.userphoto }} style={styles.profilepic} />
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: '1%', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: 'gray' }}>Nome de usuário </Text>
                            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: this.state.color }}>@{this.state.username}</Text>
                            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: 'gray', paddingTop: 10 }}>E-mail </Text>
                            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: this.state.color }}>{this.state.email}</Text>
                        </View>
                    </View>
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    topView: {
        flex: 0,
        width: viewportWidth,
        padding: 20,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    photoRow: {
        flex: 0.4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: viewportWidth,
        height: 180,
    },

    profilepicWrap: {
        width: 180,
        height: 180,
        borderRadius: 180 / 2,
        borderColor: '#fff',
        borderWidth: 8,
    },
    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 120,
        // borderColor: '#fff',
        // borderWidth: 2
    },
});
