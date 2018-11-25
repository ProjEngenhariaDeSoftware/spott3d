import React, { PureComponent } from "react";
import {
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Modal,
} from "react-native";
import { Card, CardItem, Left, Body, Thumbnail, Right, Text, Icon, View } from 'native-base';
// import Modal from 'react-native-modal';
import OtherProfile from './OtherProfile';
import moment from 'moment';
import ImageScale from 'react-native-scalable-image';
import 'moment/locale/pt-br'
import Dialog, { ScaleAnimation, DialogContent } from 'react-native-popup-dialog';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class PostCard extends PureComponent {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.subcolor = props.subcolor;
        this.color = props.color;
        this.renderWithComments = props.renderWithComments;
        this.state = {
            data: props.data,
            userPhoto: props.userphoto,
            username: props.username,
            author: '',
            otherProfile: '',
            email: props.email,
            newComment: "",
            modalVisibleStatus: false,
            showModalOptions: false,
            openProfile: false,
            refreshing: false,
            openImage: false,
            send: false,
            heightInput: 40,
            tagColor: this.color,
            delete: true
        }
    }

    async componentDidMount() {
        this.setState({ author: this.state.data.item.user });
    }

    renderImage() {
        return (
            <CardItem cardBody >
                <TouchableOpacity activeOpacity={0.9} onLongPress={() => this.setState({ openImage: true })} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)} onPressOut={() => this.setState({ openImage: false })}>
                    <ImageScale source={{ uri: this.data.item.image }}
                        resizeMode='contain'
                        width={(viewportWidth - 6)}
                    />
                </TouchableOpacity>
            </CardItem>
        );
    }

    returnTimeString(date) {
        let newDate = moment(date, "DD-MM-YYYY HH:mm:ss");
        newDate.locale('pt-br');
        return newDate.fromNow().toLowerCase();
    }

    returnDateEventString(start, end) {
        let startDate = moment(start, "DD-MM-YYYY HH:mm:ss");
        let endDate = moment(end, "DD-MM-YYYY HH:mm:ss");
        return ' De ' + startDate.format('DD[/]MM[/]YY ') + 'até ' + endDate.format('DD[/]MM[/]YY');
    }

    tagStyle() {
        let color;
        switch (this.data.item.postFlag) {
            case 'achado':
                color = '#32cb00';
                break;
            case 'perdido':
                color = '#ff3d00';
                break;
            case 'informação':
                color = '#40c4ff';
                break;
            case 'bolsa':
                color = '#ff6e40';
                break;
            case 'outros':
                color = '#7c4dff';
                break;
        }
        return { borderRadius: 15, backgroundColor: color, paddingLeft: 5, paddingRight: 5, height: 18, width: null, margin: 1, alignItems: 'center', justifyContent: 'center' }
    }

    modalOptions() {
        return (
            <Modal
                transparent={true}
                animationType={"fade"}
                visible={this.state.showModalOptions}
                onRequestClose={() => { this.setState({ showModalOptions: false }) }}>
                <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { this.setState({ showModalOptions: false }) }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 15, alignItems: 'flex-start' }}>
                        <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ showModalOptions: false })} >
                            <Icon type="MaterialCommunityIcons" name="alert-box" style={{ fontSize: 18, color: this.color }} />
                            <Text style={{ fontFamily: 'ProductSans', fontSize: 18, color: this.color }}> Denunciar</Text>
                        </TouchableOpacity>
                        {this.state.author.email === this.state.email &&
                            <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'center' }} onPress={() => this.deletePost()} >
                                <Icon type="MaterialCommunityIcons" name="delete" style={{ fontSize: 18, color: this.color }} />
                                <Text style={{ fontFamily: 'ProductSans', fontSize: 18, color: this.color }}> Excluir</Text>
                            </TouchableOpacity>}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    renderCard() {
        return (
            <Card style={{ marginBottom: 1, flex: 1 }}>
                <CardItem style={{ backgroundColor: this.subcolor }}>
                    <View style={{ flexDirection: 'column', flex: 2, alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.9} style={{ marginRight: 4 }} onPress={() => this.changeOtherProfile(this.state.author.email)} >
                                <Thumbnail small source={{ uri: this.state.author.image }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', margin: 1 }}>
                                <Text style={{ margin: 1, marginBottom: 0, alignItems: 'flex-end', fontFamily: 'ProductSans', fontSize: 16, color: this.color }}>{this.data.item.title.toUpperCase()}</Text>
                                {
                                    this.data.item.type === 'EVENT_ACADEMIC' &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={{ fontSize: 12, color: 'gray', marginLeft: 1 }} type="MaterialCommunityIcons" name="calendar-clock" />
                                        <Text style={{ fontFamily: 'ProductSans', fontSize: 12, textAlign: 'justify', color: 'gray' }}>
                                            {this.returnDateEventString(this.data.item.startDate, this.data.item.endDate)}
                                        </Text>
                                    </View>
                                }
                                {
                                    this.data.item.type === 'NOTICE' &&
                                    <View
                                        style={this.tagStyle()}
                                    >
                                        <Text style={{ fontFamily: 'ProductSans', fontSize: 11, color: '#fff' }}>{this.data.item.postFlag}</Text>
                                    </View>
                                }

                            </View>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: 1, right: 1 }} onPress={() => this.setState({ showModalOptions: true })}>
                        <Icon type="SimpleLineIcons" name="options-vertical" style={{ padding: 10, fontSize: 16, color: this.color }} />
                    </TouchableOpacity>
                </CardItem>
                <Body>
                    <Body style={{ flex: 1, alignItems: 'flex-start' }}>
                        {this.renderText()}
                        {this.renderImage()}
                    </Body>
                </Body>
                <CardItem>
                    <Left>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
                            <Icon type="MaterialCommunityIcons" name="comment-text-multiple" style={styles.comments} />
                            <Text style={styles.comments}> {this.data.item.comments.length == 0 ? 'Adicionar comentário' : this.data.item.comments.length + ' comentário(s)'}</Text>
                        </TouchableOpacity>
                    </Left>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon style={styles.datetime} type="MaterialIcons" name="access-time" />
                        <Text style={styles.datetime}>
                            {'Postado ' + this.returnTimeString(this.data.item.datetime)}
                        </Text>
                    </View>
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

    verifyComment(value) {
        if (this.state.username != null && value.commenter.username === this.state.username) {
            return true;
        } else {
            return false;
        }
    }

    deleteComment(value) {
        try {
            this.setState({ delete: false });
            this.data.item.comments.splice(this.data.item.comments.findIndex(item => item.id == value.id), 1);
            this.renderComments(this.data);
            fetch('https://api-spotted.herokuapp.com/api/comment/' + value.id, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(res => {
                this.setState({ delete: true });
            });
        } catch (error) { }
    }

    renderComments() {
        return (
            <View style={{ flex: 1 }}>
                < FlatList
                    ref={ref => this.commentsFlatList = ref}
                    data={this.state.data.item.comments}
                    extraData={this.state.send}
                    keyExtractor={item => item.id + ''}
                    contentContainerStyle={{ paddingLeft: 1, paddingRight: 1, backgroundColor: '#fff' }}
                    onContentSizeChange={() => this.commentsFlatList.scrollToEnd({ animated: true })}
                    onLayout={() => this.commentsFlatList.scrollToEnd({ animated: true })}
                    refreshControl={
                        < RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshingData}
                            colors={[this.color]}
                        />
                    }
                    onEndReachedThreshold={1}
                    renderItem={({ item }) => {
                        return (
                            < View style={styles.item} >
                                <TouchableOpacity style={{ marginRight: '3%', marginBottom: '3%' }} activeOpacity={0.9} onPress={() => this.changeOtherProfile(item.commenter.email)}>
                                    <Thumbnail small source={{ uri: item.commenter.image }} />
                                </TouchableOpacity>
                                <View style={{ flex: 1, flexWrap: 'wrap', }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.9} onPress={() => this.changeOtherProfile(item.commenter.email)}>
                                        <Text style={{ fontFamily: 'ProductSans', color: 'black', fontSize: 14 }}>{'@' + item.commenter.username + ' '}</Text>
                                        <Icon style={{ fontSize: 9, color: 'gray' }} type="MaterialIcons" name="access-time" />
                                        <Text style={{ fontFamily: 'ProductSans', fontSize: 9, color: 'gray', margin: 1 }}>{' ' + this.returnTimeString(item.datetime)}</Text>
                                        {this.verifyComment(item) && this.state.delete ?
                                            <Right onPress={() => this.deleteComment(item)}>
                                                <Icon onPress={() => this.deleteComment(item)} style={{ fontSize: 17, color: '#ef5350' }} type="MaterialCommunityIcons" name="comment-remove-outline" />
                                            </Right>
                                            : null}
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: 'ProductSans', color: 'gray', fontSize: 14 }}>{item.comment}</Text>
                                </View>
                            </ View>
                        );
                    }
                    }
                    ListHeaderComponent={this.renderCard()}
                />
                {this.renderFooter()}
            </View >

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
            }).then(res => {
                let time = new Date();
                this.data.item.comments.push({
                    id: res.id,
                    userMentioned: usersMentioned,
                    comment: newComment,
                    datetime: time,
                    commenter: {
                        email: email,
                        username: username,
                        image: userphoto
                    }
                });
                this.setState({ newComment: '', send: true });
            });
            // this.commentsFlatList.scrollToEnd();
            this.setState({ send: false });
        } catch (error) {
        }
    }

    handleInputChange = newComment => {
        this.setState({ newComment });
    };

    updateSize = (height) => {
        this.setState({
            heightInput: height
        });
    }

    renderFooter() {
        return (
            <View style={{ flexDirection: 'row', padding: 8, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#fff', elevation: 4 }}>
                <Thumbnail small source={{ uri: this.state.userPhoto }} />
                <TextInput
                    keyboardType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline={true}
                    textBreakStrategy='highQuality'
                    style={{
                        height: this.state.heightInput,
                        borderColor: '#e0e0e0',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginHorizontal: 4,
                        width: '75%',
                        fontFamily: 'ProductSans',
                        textAlign: 'justify',

                    }}
                    value={this.state.newComment}
                    onChangeText={this.handleInputChange}
                    placeholder=" Adicionar comentário..."
                    returnKeyType="send"
                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                />
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 19, fontFamily: 'ProductSans', backgroundColor: this.color, borderColor: '#e7e7e7', borderWidth: 0.5, borderRadius: 10, width: "13%", height: 35, }}
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

    renderOpenImage() {
        return (
            <View>
                <Dialog
                    visible={this.state.openImage}
                    onTouchOutside={() => { this.setState({ openImage: false }) }}
                    dialogAnimation={new ScaleAnimation({})}
                    dialogStyle={{ alignItems: 'center', borderRadius: 15, backgroundColor: 'rgba(0,0,0,0)' }}
                    containerStyle={{ blurRadius: 1 }}
                >
                    <DialogContent>
                        <ImageScale source={{ uri: this.data.item.image }}
                            resizeMode='contain'
                            width={viewportWidth}
                        />
                    </DialogContent>
                </Dialog>
            </View>
        );
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
            this.renderWithComments ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <View>
                    {this.renderComments()}
                </View>
            </View> :
                <View style={{ flex: 1, backgroundColor: this.color, paddingLeft: 1, paddingRight: 1, paddingBottom: 1 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
                        {this.renderCard()}
                    </TouchableOpacity>
                    {this.renderOpenImage()}
                    {this.modalOptions()}
                    <Modal
                        visible={this.state.modalVisibleStatus}
                        animationType={"slide"}
                        onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                            {this.renderComments()}
                        </View>
                    </Modal>
                    <Modal
                        visible={this.state.openProfile}
                        animationType={"slide"}
                        onRequestClose={() => { this.showOtherProfile(!this.state.openProfile) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2b4a69' }}>
                            <OtherProfile
                                emailPerfil={this.state.otherProfile}
                                emailLogged={this.state.email}
                                usernameLogged={this.state.username}
                                userphotoLogged={this.state.userPhoto} />
                        </View>
                    </Modal>
                </View>
        );
    }
}
const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 3,
        paddingVertical: 5,
        paddingHorizontal: 8

    },
    datetime: {
        fontFamily: 'ProductSans',
        fontSize: 13,
        color: '#bdbdbd',
        margin: 1
    },
    comments: {
        fontFamily: 'ProductSans',
        fontSize: 13,
        color: 'gray',
        margin: 5,
        marginLeft: 1
    },
    comment: {
        fontFamily: 'ProductSans',
        fontSize: 12,
        color: 'gray',
        margin: 1
    },
    inputText: {
        fontFamily: 'ProductSans',
        color: 'white',
        fontSize: 14,
    },
    postText: {
        fontFamily: 'ProductSans',
        textAlign: 'justify',
        color: 'gray',
        margin: 5,
        fontSize: 14
    }
});
