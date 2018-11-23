import React, { PureComponent } from "react";
import {
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Card, CardItem, Left, Body, Thumbnail, Text, Icon, View } from 'native-base';
import Modal from 'react-native-modal';
import OtherProfile from './OtherProfile';
import moment from 'moment';
import ImageScale from 'react-native-scalable-image';
import 'moment/locale/pt-br'
import Dialog, { ScaleAnimation, DialogContent } from 'react-native-popup-dialog';
//import ProgressiveImage from '../components/ProgressiveImage';

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
            infoEvent: false,
            modalVisibleStatus: false,
            showModalOptions: false,
            openProfile: false,
            refreshing: false,
            openImage: false,
            send: false,
            heightInput: 40,
            heightImage: 100,
            widthImage: 100,
            tagColor: this.color,
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
        return newDate.calendar().toLowerCase();
    }
    returnDateEventString(start, end) {
        let startDate = moment(start, "DD-MM-YYYY HH:mm:ss");
        let endDate = moment(end, "DD-MM-YYYY HH:mm:ss");
        startDate.isBetween()
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
                animationIn='zoomInUp'
                animationInTiming={300}
                animationOut="slideOutRight"
                animationOutTiming={300}
                backdropTransitionOutTiming={300}
                style={{ alignSelf: 'center', alignItems: 'center', width: '50%' }}
                isVisible={this.state.showModalOptions}
                onBackButtonPress={() => { this.setState({ showModalOptions: false }) }}
                onBackdropPress={() => this.setState({ showModalOptions: false })}>

                <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 15, alignItems: 'flex-start' }}>
                    <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ showModalOptions: false })} >
                        <Icon type="MaterialCommunityIcons" name="alert-box" style={{ fontSize: 18, color: this.color }} />
                        <Text style={{ fontFamily: 'ProductSans', fontSize: 18, color: this.color }}> Denúnciar...</Text>
                    </TouchableOpacity>
                    {this.state.author.email === this.state.email &&
                        <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'center' }} onPress={() => this.deletePost()} >
                            <Icon type="MaterialCommunityIcons" name="delete" style={{ fontSize: 18, color: this.color }} />
                            <Text style={{ fontFamily: 'ProductSans', fontSize: 18, color: this.color }}> Excluir</Text>
                        </TouchableOpacity>}
                </View>
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

    renderComments() {
        return (
            <View>
                < FlatList
                    ref={(list) => this.commentsFlatList = list
                    }
                    data={this.state.data.item.comments}
                    extraData={this.state.send}
                    keyExtractor={item => item.id + ''}
                    contentContainerStyle={{ paddingLeft: 1, paddingRight: 1 }}
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
                                <TouchableOpacity style={{ marginLeft: '3%', marginRight: '3%', marginBottom: '3%' }} activeOpacity={0.9} onPress={() => this.changeOtherProfile(item.commenter.email)}>
                                    <Thumbnail small source={{ uri: item.commenter.image }} />
                                </TouchableOpacity>
                                <View style={{ flex: 1, flexWrap: 'wrap', }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.9} onPress={() => this.changeOtherProfile(item.commenter.email)}>
                                        <Text style={{ fontFamily: 'ProductSans', color: 'black', fontSize: 14 }}>{'@' + item.commenter.username + ' '}</Text>
                                        <Icon style={{ fontSize: 9, color: 'gray' }} type="MaterialIcons" name="access-time" />
                                        <Text style={{ fontFamily: 'ProductSans', fontSize: 9, color: 'gray', margin: 1 }}>{' ' + this.returnTimeString(item.datetime)}</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: 'ProductSans', color: 'gray', fontSize: 14 }}>{item.comment}</Text>
                                </View>
                            </ View>
                        );
                    }}
                    ListHeaderComponent={this.renderCard()}
                    ListFooterComponent={this.renderFooter()}
                />
            </View>

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
                const date = new Date();
                const dateTime = this.returnTimeString(moment(date).format('DD-MM-YYYY HH:mm:ss'));
                this.data.item.comments.push({
                    id: res.id,
                    userMentioned: usersMentioned,
                    comment: newComment,
                    datetime: dateTime,
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

    updateSize = (height) => {
        this.setState({
            heightInput: height
        });
    }

    renderFooter() {
        return (
            <View style={{ flexDirection: 'row', width: viewportWidth, margin: 2, alignItems: 'center', justifyContent: 'center' }}>
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
                        margin: 4,
                        width: '75%',
                        fontFamily: 'ProductSans',
                        textAlign: 'justify'

                    }}
                    value={this.state.newComment}
                    onChangeText={this.handleInputChange}
                    placeholder=" Adicionar comentário..."
                    returnKeyType="send"
                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
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
            this.renderWithComments ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                        animationIn='slideInUp'
                        animationInTiming={300}
                        animationOut="slideOutDown"
                        animationOutTiming={300}
                        backdropTransitionOutTiming={200}
                        isVisible={this.state.modalVisibleStatus}
                        avoidKeyboard={true}
                        scrollOffset={1}
                        style={{ flex: 1, marginLeft: 0, marginTop: 0, marginBottom: 0, marginRight: 0 }}
                        onBackButtonPress={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                            <View>
                                {this.renderComments()}
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationIn='slideInUp'
                        animationInTiming={300}
                        animationOut="slideOutDown"
                        animationOutTiming={300}
                        backdropTransitionOutTiming={300}
                        isVisible={this.state.openProfile}
                        avoidKeyboard={true}
                        style={{ flex: 1, marginLeft: 0, marginTop: 0, marginBottom: 0, marginRight: 0 }}
                        onBackButtonPress={() => { this.showOtherProfile(!this.state.openProfile) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                            <OtherProfile email={this.state.otherProfile} />
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
        margin: 6,
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
