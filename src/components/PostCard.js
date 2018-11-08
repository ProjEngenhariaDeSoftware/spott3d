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
        this.subcolor = props.subcolor;
        this.color = props.color;
        this.state = {
            data: props.data,
            username: '',
            userphoto: '',
            email: '',
            newComment: "",
            modalVisibleStatus: false
        }
    }

    async componentDidMount() {
        try {
            const photoURL = await AsyncStorage.getItem('photoURL');
            const displayName = await AsyncStorage.getItem('displayName');
            const mail = await AsyncStorage.getItem('email');

            this.setState({ userphoto: photoURL, username: displayName, email: mail });


        } catch (error) { }
    }

    renderImage() {
        return (
            <CardItem cardBody>
                <ProgressiveImage
                    thumbnailSource={{ uri: this.data.item.image }}
                    source={{ uri: this.data.item.image }}
                    style={{ width: viewportWidth, height: 170 }}
                    resizeMode="contain" />
            </CardItem>
        );
    }

    renderCard() {
        return (
            // <Card style={{ marginLeft: 0, flex: 0, width: viewportWidth }}>
            //     <CardItem>
            //         <Left style={{ flex: 0.8 }}>
            //             <Thumbnail small source={{ uri: this.state.userphoto }} />
            //             <Body>
            //                 <Text note style={styles.defaultText}>Data: {this.data.item.datetime}</Text>
            //             </Body>
            //         </Left>
            //         <Right style={{ flex: 0.2 }}>
            //             <Icon type="MaterialIcons" name="report" button onPress={() => alert("Cliquei em denunciar")} />
            //         </Right>
            //     </CardItem>

            //     {this.data.item.image ? this.renderImage() : this.renderText()}

            //     <CardItem>
            //         <Left>
            //             <Button transparent>
            //                 <Icon name="chatbubbles" style={{ fontSize: 10, color: 'grey' }} />
            //                 <Text note style={styles.iconText}> {this.data.item.comments.length} Comentários</Text>

            //             </Button>
            //         </Left>
            //         {this.state.email == this.data.item.email &&
            //             <Right>
            //                 <Icon type="MaterialCommunityIcons" name="delete" button onPress={() => alert(this.data.item.username)} />
            //             </Right>}
            //     </CardItem>
            // </Card>

            <Card style={{ marginBottom: 1, flex: 1 }}>
                <CardItem style={{ backgroundColor: this.subcolor }}>
                    <Left style={{ flex: 2 }}>
                        <Body style={{ justifyContent: 'center', margin: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
                                <Icon style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }} type="MaterialIcons" name="pin-drop" />
                                <Text style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
                                    {/* {this.data.item.location != '' ? ' ' + this.data.item.location.toUpperCase() : 'Desconhecido'} */}
                                    Sem Local
                            </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
                                <Icon style={styles.datetime} type="MaterialIcons" name="verified-user" />
                                <Text style={styles.datetime}>
                                    {/* {this.data.item.course != '' ? ' ' + this.data.item.course : 'Desconhecido'} */}
                                    {this.data.item.email}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
                                <Icon style={styles.datetime} type="MaterialIcons" name="access-time" />
                                <Text style={styles.datetime}>
                                    {' ' + this.data.item.datetime}
                                </Text>
                            </View>
                        </Body>
                    </Left>
                    <Right style={{ flex: 1 }}>
                        <Icon type="MaterialCommunityIcons" name="alert-box" />
                    </Right>
                </CardItem>
                <Body>
                    <Body style={{ flex: 1 }}>
                        {this.renderText()}
                        {this.renderImage()}
                    </Body>
                </Body>
                <CardItem>
                    <Left>
                        <Button transparent onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
                            <Icon type="MaterialCommunityIcons" name="comment-text-multiple" style={styles.comments} />
                            <Text note style={styles.comments}> {this.data.item.comments.length == 0 ? 'Adicionar comentário' : this.data.item.comments.length + ' comentário(s)'}</Text>
                        </Button>
                    </Left>
                    {this.state.email == this.data.item.email &&
                        <Right>
                            <Icon type="MaterialCommunityIcons" name="delete" button onPress={() => this.deletePost()} />
                        </Right>}
                </CardItem>
            </Card>
        );
    }

    deletePost = async () => {
        const id = this.data.item.id;
        await fetch('https://api-spotted.herokuapp.com/api/post/id/' + id, {
            method: 'delete'
          });
          alert("Post deletado atualize o feed!");
    };


    renderComments() {
        return (
            <FlatList
                data={this.state.data.item.comments}
                extraData={this.state}
                keyExtractor={item => item.id + ''}
                onEndReachedThreshold={1}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.item}>
                            <ListItem
                                containerStyle={{ marginLeft: 0 }}
                                title={'@' + item.commenter.username}
                                titleStyle={styles.userComment}
                                subtitle={<View style={styles.subtitleView}>
                                    <Text style={styles.text}>{item.comment}</Text>
                                </View>}
                                leftAvatar={{ source: { uri: item.commenter.image } }}
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

    sendComment = async () => {
		try {
			let usersMentioned = this.state.newComment.match(/@\w+/g).map(e => e.substr(1));
			const nickname = await AsyncStorage.getItem('username');

            const id = this.data.item.id;
            console.log(usersMentioned);
            console.log(nickname);
            console.log(id);

			await fetch('https://api-spotted.herokuapp.com/api/post/' + id + '/comment', {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userMentioned: usersMentioned,
					comment: this.state.newComment,
					commenter: {
						email: this.state.email,
						username: nickname,
						image: this.state.userphoto
					}
				})
			}).then(a => {
				this.data.item.comments.push({
					comment: this.state.newComment,
					commenter: {
						username: nickname,
						image: this.state.userphoto
					}
				});
			});
		} catch (error) {
            console.log(error);
         }
    }

    renderFooter(userphoto) {
        return (
            <View style={{ flexDirection: 'row', width: viewportWidth, margin: 2 }}>
                <Thumbnail small source={{ uri: userphoto }} style={{ marginStart: 18 }} />
                <TextInput
                    autoFocus
                    keyboardType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline={true}
                    style={styles.input}
                    onChangeText={(text) => { this.setState({ newComment: text }) }}
                    placeholder=" Adicionar comentário..."
                    returnKeyType="send"
                />
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 19, fontFamily: 'ProductSans', backgroundColor: this.color, borderColor: '#e7e7e7', borderWidth: 0.5, borderRadius: 10, width: "15%", height: 40, marginRight: 4 }}
                    onPress={() => this.sendComment()}
                    activeOpacity={0.8}>
                    <Text style={styles.inputText}>
                        enviar
        	  			</Text>
                </TouchableOpacity>
            </View>
        );
    }

    showModalFunction(visible) {
        this.setState({ modalVisibleStatus: visible });
    }

    renderText() {
        return (
            <CardItem>
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
                    {this.renderCard()}
                    <Modal
                        transparent={false}
                        animationType={"slide"}
                        visible={this.state.modalVisibleStatus}
                        onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View>
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
    item: {
        backgroundColor: 'white',
        margin: 2
    },
    box: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    datetime: {
        fontFamily: 'ProductSans',
        fontSize: 13,
        color: 'gray',
        margin: 1
    },
    comments: {
        fontFamily: 'ProductSans',
        fontSize: 13,
        color: 'gray',
        margin: 5
    },
    comment: {
        fontFamily: 'ProductSans',
        fontSize: 12,
        color: 'gray',
        margin: 1
    },
    subtitleView: {
        flexDirection: 'row',
        margin: 0.5
    },
    input: {
        marginLeft: 4,
        margin: 2,
        height: 40,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 10,
        width: '68%',
        fontFamily: 'ProductSans'
    },
    inputText: {
        fontFamily: 'ProductSans',
        color: 'white',
        fontSize: 14
    },
    userComment: {
        fontFamily: 'ProductSans',
        color: 'black',
        fontSize: 14
    },
    postText: {
        fontFamily: 'ProductSans',
        textAlign: 'justify',
        margin: 5,
        fontSize: 16
    }
});
