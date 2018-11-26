import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
    FlatList
} from 'react-native';

import { Tab, Tabs, Icon } from 'native-base';

import ProgressBar from './ProgressBar'
import PostCard from './PostCard';
const { width: viewportWidth } = Dimensions.get('window');

export default class OtherProfile extends PureComponent {

    constructor(props) {
        super();
        this.state = {
            data: [],
            userphoto: '',
            username: '',
            email: props.emailPerfil,
            emailLogged: props.emailLogged,
            usernameLogged: props.usernameLogged,
            userphotoLogged: props.userphotoLogged,
            color: '#2b4a69',
            isLoading: true,
            postsLoading: true
        };
    }

    async componentDidMount() {
        try {
            await fetch('https://api-spotted.herokuapp.com/api/user/email/' + this.state.email)
                .then(res => res.json())
                .then(data => {
                    this.setState({ username: data.username, userphoto: data.image, isLoading: false });
                });
        } catch (error) { }

    }

    getPosts = async () => {
        if (this.state.postsLoading) {
            try {
                await fetch('https://api-spotted.herokuapp.com/api/post/user/' + this.state.email)
                    .then(res => res.json())
                    .then(data => {
                        this.setState({ data: data, postsLoading: false });
                    });

                    
                } catch (error) { };
        }
    }

    hideLoader = (e) => {
        e.distanceFromEnd === 0 ? this.setState({ showLoader: true }) : this.setState({ showLoader: false });
    };

    selectSubColorType(type) {
        switch (type) {
            case 'NEWS':
                return '#dee7ed';
            case 'NOTICE':
                return '#dee7ed';
            case 'EVENT_ACADEMIC':
                return '#ebf9f7';
            case 'ENTERTAINMENT':
                return '#e6fbff';
        }
    }

    selectColorType(type) {
        switch (type) {
            case 'NEWS':
                return '#738A98';
            case 'NOTICE':
                return '#738A98';
            case 'EVENT_ACADEMIC':
                return '#5AD0BA';
            case 'ENTERTAINMENT':
                return '#00B6D9';
        }
    }

    emptyData = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}><Text style={{ fontFamily: 'ProductSans', fontSize: 16 }}>{'\nInfelizmente ele não postou nada :('}</Text></View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading ? <ProgressBar color='#fff' /> :
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 195 }}>
                            <View style={styles.photoRow}>
                                <View style={styles.profilepicWrap}>
                                    <Image source={{ uri: this.state.userphoto }} style={styles.profilepic} />
                                </View>
                            </View>
                            <View style={{ margin: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'ProductSans', fontSize: 25, color: '#fff' }}>@{this.state.username}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Tabs initialPage={0} onChangeTab={() => this.getPosts()} tabContainerStyle={{ height: 40 }}>
                                <Tab heading="Dados Pessoais" tabStyle={{ backgroundColor: '#2b4a69' }} textStyle={{ color: 'white', fontFamily: 'ProductSans' }}
                                    activeTabStyle={{ backgroundColor: '#2b4a69' }} activeTextStyle={{ color: '#fff', fontFamily: 'ProductSans' }} >
                                    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
                                        <View style={styles.info}>
                                            <Icon type='MaterialCommunityIcons' name='email' style={{ color: '#2b4a69', fontSize: 16 }} />
                                            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: '#2b4a69' }}> E-mail: </Text>
                                            <Text style={{ fontFamily: 'ProductSans', fontSize: 16, color: 'gray' }}>{this.state.email}</Text>
                                        </View>
                                    </View>
                                </Tab>
                                <Tab heading="Postagens" tabStyle={{ backgroundColor: '#2b4a69' }} textStyle={{ color: 'white', fontFamily: 'ProductSans' }}
                                    activeTabStyle={{ backgroundColor: '#2b4a69' }} activeTextStyle={{ color: '#fff', fontFamily: 'ProductSans' }}>
                                    {this.state.postsLoading ? <ProgressBar color={this.state.color} /> :
                                        <FlatList
                                            data={this.state.data}
                                            renderItem={(item) => {
                                                return (
                                                    <PostCard
                                                        data={item}
                                                        subcolor={this.selectSubColorType(item.item.type)}
                                                        color={this.selectColorType(item.item.type)}
                                                        username={this.state.usernameLogged}
                                                        userphoto={this.state.userphotoLogged}
                                                        email={this.state.emailLogged}
                                                    />
                                                )
                                            }}
                                            keyExtractor={(item, index) => index + ''}
                                            onEndReachedThreshold={1}
                                            onEndReached={(event) => this.hideLoader(event)}
                                            ListEmptyComponent={this.emptyData}
                                        />
                                    }
                                </Tab>
                            </Tabs>
                        </View>
                    </View>
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    topView: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 5,
    },
    photoRow: {
        marginTop: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: viewportWidth,
        height: 140,
    },
    info: {
        flexDirection: 'row',
        // elevation: 3,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: (viewportWidth * 0.95),
        height: 40,
    },
    profilepicWrap: {
        width: 130,
        height: 130,
        borderRadius: 130 / 2,
        borderColor: '#fff',
        borderWidth: 4,
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
