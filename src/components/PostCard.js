import React, { PureComponent } from "react";
import {
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Image,
    Modal,
} from "react-native";
import { Card, CardItem, Left, Right, Body, Thumbnail, Text, Icon, Button, View } from 'native-base';
import OtherProfile from '../components/OhterProfile';
//import ProgressiveImage from '../components/ProgressiveImage';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class PostCard extends PureComponent {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.subcolor = props.subcolor;
        this.color = props.color;
        this.state = {
            data: props.data,
            userPhoto: props.userphoto,
            username: props.username,
            author: '',
            otherProfile: '',
            email: props.email,
            newComment: "",
            modalVisibleStatus: false,
            openProfile: false,
            refreshing: false,
            send: false,
        }
    }

    async componentDidMount() {
        this.setState({ author: this.state.data.item.user });
    }

    renderImage() {
        return (
            <CardItem cardBody>
                <View style={{ alignItems: 'center' }}>
                    <Image source={{ uri: this.data.item.image }}
                        style={{ width: viewportWidth, height: viewportHeight - 30 }}
                    />
                </View>
            </CardItem>
        );
    }

    renderCard() {
        return (
            <Card style={{ marginBottom: 1, flex: 1 }}>
                <CardItem style={{ backgroundColor: this.subcolor }}>
                    <View style={{ flexDirection: 'column', flex: 2, alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.changeOtherProfile(this.state.author.email)} >
                                <Thumbnail small source={{ uri: this.state.author.image }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
                                <Text style={{ alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color }}>{this.data.item.title.toUpperCase()}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <Icon style={styles.datetime} type="MaterialIcons" name="access-time" />
                                    <Text style={styles.datetime}>
                                        {' ' + this.data.item.datetime}
                                    </Text>
                                </View>
                            </View>
                            <Right>
                                <Icon type="MaterialCommunityIcons" name="alert-box" style={{ fontSize: 24, color: this.color }} />
                            </Right>
                        </View>
                    </View>
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
                    {this.state.author.email === this.state.email &&
                        <Right>
                            <Icon type="MaterialCommunityIcons" name="delete" style={{ fontSize: 24, color: this.color }} button onPress={() => this.deletePost()} />
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
        this.props.deleted();
    };

    refreshingData = async () => {
        this.setState({ refreshing: true });
        try {
            await fetch('https://api-spotted.herokuapp.com/api/post/id/' + this.state.data.item.id)
                .then(res => res.json())
                .then(newData => {
                    const newItemData = { "item": newData };
                    this.setState({ data: newItemData, refreshing: false });
                });
        } catch (erro) { }
    };

    changeOtherProfile(profileEmail) {
        this.setState({ otherProfile: profileEmail, openProfile: true })
    }

    renderComments() {
        return (
            <FlatList
                ref={(list) => this.commentsFlatList = list}
                data={this.state.data.item.comments}
                extraData={this.state.send}
                keyExtractor={item => item.id + ''}
                contentContainerStyle={{ paddingLeft: 1, paddingRight: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshingData}
                        colors={[this.color]}
                    />
                }
                onEndReachedThreshold={1}
                renderItem={({ item }) => {
                    return (
                        < View style={styles.item} >
                            <TouchableOpacity style={{marginRight: '3%', marginBottom: '3%'}} activeOpacity={0.3} onPress={() => this.changeOtherProfile(item.commenter.email)}>
                                <Thumbnail small source={{ uri: item.commenter.image }} />
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexWrap: 'wrap', }}>
                                <TouchableOpacity activeOpacity={0.3} onPress={() => this.changeOtherProfile(item.commenter.email)}>
                                    <Text style={{ fontFamily: 'ProductSans Bold', color: 'black' }}>{'@' + item.commenter.username + ' '}</Text>
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'ProductSans', color: 'gray'}}>{item.comment}</Text>
                            </View>
                        </ View>
                        // <View style={styles.item}>
						// 	<ListItem
						// 		containerStyle={{ margin: 1 }}
						// 		title={'@' + item.commenter.username}
						// 		titleStyle={styles.userComment}
						// 		subtitle={
						// 			<View style={styles.subtitleView}>
						// 				<Text style={styles.comment}>{item.comment}</Text>
						// 			</View>
						// 		}
						// 		leftAvatar={{ source: { uri: item.commenter.image } }}
						// 	>
						// 	</ListItem>
						// </View>
                    );
                }}
                // onContentSizeChange={() => this.commentsFlatList.scrollToEnd({animated: true})}
                // onLayout={() => this.commentsFlatList.scrollToEnd({animated: true})}             
                ListHeaderComponent={this.renderCard()}
                ListFooterComponent={this.renderFooter()}
            />

        );
    }

    sendComment = async () => {
        try {
            let usersMentioned = this.state.newComment;
            if (usersMentioned.indexOf('@') != -1) {
                usersMentioned = this.state.newComment.match(/@\w+/g).map(e => e.substr(1));
            } else {
                usersMentioned = [];
            }

            console.log(usersMentioned);
            const id = this.data.item.id;
            const email = this.state.email;
            const username = this.state.username;
            const userphoto = this.state.userPhoto
            const newComment = this.state.newComment;

            await fetch(`https://api-spotted.herokuapp.com/api/post/${id}/comment`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usersMentioned: usersMentioned,
                    comment: newComment,
                    commenter: {
                        image: userphoto,
                        username: username,
                        email: email
                    }
                })
            }).then(a => {
                this.data.item.comments.push({
                    id: a.id,
                    userMentioned: usersMentioned,
                    comment: newComment,
                    commenter: {
                        email: email,
                        username: username,
                        image: userphoto
                    }
                });
                this.setState({ newComment: '', send: true });
            });
            this.commentsFlatList.scrollToEnd();
            this.setState({ send: false });
        } catch (error) {
        }
    }

    handleInputChange = newComment => {
        this.setState({ newComment });
    };

    renderFooter() {
        return (
            <View style={{ flexDirection: 'row', width: viewportWidth, margin: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Thumbnail small source={{ uri: this.state.userPhoto }} />
                <TextInput
                    keyboardType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline={true}
                    style={styles.input}
                    value={this.state.newComment}
                    onChangeText={this.handleInputChange}
                    placeholder=" Adicionar comentário..."
                    returnKeyType="send"
                    onSubmitEditing={this.sendComment}
                />
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 19, fontFamily: 'ProductSans', backgroundColor: this.color, borderColor: '#e7e7e7', borderWidth: 0.5, borderRadius: 10, width: "13%", height: 40, marginRight: 4 }}
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

    showOtherProfile(visible) {
        this.setState({ openProfile: visible });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.color, paddingLeft: 1, paddingRight: 1, paddingBottom: 1 }}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
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
                        <Modal
                            transparent={false}
                            animationType={"slide"}
                            visible={this.state.openProfile}
                            onRequestClose={() => { this.showOtherProfile(!this.state.openProfile) }} >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <OtherProfile email={this.state.otherProfile} />
                            </View>
                        </Modal>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 2,
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
        width: '75%',
        fontFamily: 'ProductSans'
    },
    inputText: {
        fontFamily: 'ProductSans',
        color: 'white',
        fontSize: 14,
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
