import React, { Component } from "react";
import {
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    TextInput,
    Modal,
} from "react-native";

import { Card, CardItem, Left, Right, Body, Thumbnail, Icon, Button, View } from 'native-base'
import { ListItem } from 'react-native-elements'
import ProgressiveImage from '../components/ProgressiveImage';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class PostCard extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.state = {
            data: props.data,
            username: props.username,
            userphoto: props.userphoto,
            newComment: "",
            modalVisibleStatus: false
        }
        this.componentDidMount();
    }

    async componentDidMount() {
        try {
            const photoURL = await AsyncStorage.getItem('photoURL');
            const displayName = await AsyncStorage.getItem('displayName');

            this.setState({ userphoto: photoURL, username: displayName });


        } catch (error) { }
    }

    renderImage() {
        return (
            <CardItem cardBody>
                <ProgressiveImage
                    thumbnailSource={{ uri: this.data.item.imageurl }}
                    source={{ uri: this.data.item.imageurl }}
                    style={{ width: viewportWidth, height: 170 }}
                    resizeMode="contain" />
            </CardItem>
        );
    }

    renderCard(widthCard) {
        return (
            <Card style={{ marginLeft: 0, flex: 0, width: widthCard }}>
                <CardItem>
                    <Left style={{ flex: 0.8 }}>
                        <Thumbnail small source={{ uri: this.data.item.userphoto }} />
                        <Body>
                            <Text style={styles.titleText}>{this.data.item.title}</Text>
                            <Text note style={styles.defaultText}>Local: {this.data.item.local}</Text>
                            <Text note style={styles.defaultText}>Data: {this.data.item.date}</Text>
                        </Body>
                    </Left>
                    <Right style={{ flex: 0.2 }}>
                        <Icon type="MaterialIcons" name="report" button onPress={() => alert("Cliquei em denunciar")} />
                    </Right>
                </CardItem>

                {this.data.item.image ? this.renderImage() : this.renderText()}

                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon name="chatbubbles" style={{ fontSize: 10, color: 'grey' }} />
                            <Text note style={styles.iconText}> {this.data.item.coments.length} Comentários</Text>

                        </Button>
                    </Left>
                    {this.state.username == this.data.item.username &&
                        <Right>
                            <Icon type="MaterialCommunityIcons" name="delete" button onPress={() => alert(this.data.item.username)} />
                        </Right>}
                </CardItem>
            </Card>
        );
    }


    renderComments() {
        return (
            <FlatList
                data={this.state.data.item.coments}
                extraData={this.state}
                keyExtractor={item => item.coment}
                onEndReachedThreshold={1}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.item}>
                            <ListItem
                                containerStyle={{ marginLeft: 0 }}
                                title={item.userid}
                                titleStyle={styles.userComment}
                                subtitle={<View style={styles.subtitleView}>
                                    <Text style={styles.text}>{item.coment}</Text>
                                </View>}
                                leftAvatar={{ source: { uri: item.userphoto } }}
                            >
                            </ListItem>
                        </View>
                    );
                }}
                contentContainerStyle={{ width: viewportWidth }}
                ListHeaderComponent={this.renderCard(viewportWidth)}
                ListFooterComponent={this.renderFooter(this.state.userphoto)}
            />

        );
    }

    sendComment(comment) {
        // this.state.data.item.coments.push({ coment: comment, userid: this.state.username, userphoto: this.state.userphoto });
        // console.log(coment);
    }

    renderFooter(userphoto) {
        return (
            <View style={{ flexDirection: 'row', width: viewportWidth }}>
                <Thumbnail small source={{ uri: userphoto }} style={{ marginStart: 18 }} />
                <TextInput
                    autoFocus
                    keyboardType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline={true}
                    style={styles.textInput}
                    onChangeText={(text) => { this.setState({ newComment: text }) }}
                    placeholder="Digite seu comentário..."
                    returnKeyType="send"
                    blurOnSubmit={true}
                    onSubmitEditing={this.sendComment(this.state.newComment)}
                />
                <Button transparent small style={{ marginLeft: 8, fontFamily: 'ProductSans' }} onPress={() => { this.sendComment(this.state.newComment) }}>
                    <Text>Enviar</Text>
                </Button>
            </View>
        );
    }

    showModalFunction(visible) {
        this.setState({ modalVisibleStatus: visible });
    }

    renderText() {
        return (
            <CardItem bordered>
                <Body>
                    <Text style={styles.postText}>{this.data.item.text}</Text>
                </Body>
            </CardItem>
        );
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
                <View>
                    {this.renderCard(viewportWidth)}
                    <Modal
                        transparent={false}
                        animationType={"slide"}
                        visible={this.state.modalVisibleStatus}
                        onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.ModalInsideView}>
                                {this.renderComments()}
                            </View>
                        </View>

                    </Modal>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    titleText: {
        fontFamily: 'ProductSans',
        fontWeight: 'bold',
        fontSize: 12
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 2,
        paddingTop: 2
    },
    textInput: {
        marginLeft: 8,
        marginBottom: 10,
        height: 40,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 45,
        width: "70%",
        fontFamily: 'ProductSans'
    },

    userComment: {
        fontFamily: 'ProductSans',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12
    },

    defaultText: {
        fontFamily: 'ProductSans',
        fontSize: 10
    },

    postText: {
        fontFamily: 'ProductSans',
        textAlign: 'justify',
        margin: 5,
        fontSize: 14
    },

    iconText: {
        color: 'gray',
        fontFamily: 'ProductSans',
        fontSize: 10,
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10
    },
});

