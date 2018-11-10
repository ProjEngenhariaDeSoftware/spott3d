// import React, { Component } from "react";
// import {
//     Text,
//     FlatList,
//     StyleSheet,
//     Dimensions,
//     TouchableOpacity,
//     TextInput,
//     Modal,
// } from "react-native";

// import { Card, CardItem, Left, Right, Body, Thumbnail, Icon, Button, View } from 'native-base'
// import { ListItem } from 'react-native-elements'
// import ProgressiveImage from '../components/ProgressiveImage';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// export default class PostCard extends Component {
//     constructor(props) {
//         super(props);
//         this.data = props.data;
//         this.subcolor = props.subcolor;
//         this.color = props.color;
//         this.state = {
//             data: props.data,
//             username: props.username,
//             userphoto: props.userphoto,
//             author: '',
//             authorPhoto: '',
//             email: props.email,
//             newComment: "",
//             modalVisibleStatus: false,
//             refreshing: false
//         }
//     }

//     async componentDidMount() {
//         try {
//             const email = this.data.item.email;
//             await fetch('https://api-spotted.herokuapp.com/api/user/email/' + email)
//                 .then(res => res.json())
//                 .then(postInfo => {
//                     const author = postInfo.username;
//                     const authorPhoto = postInfo.image;
//                     this.setState({ author: author, authorPhoto: authorPhoto });
//                 });
//         } catch (error) {
//         }
//     }

//     renderImage() {
//         return (
//             <CardItem cardBody>
//                 <ProgressiveImage
//                     thumbnailSource={{ uri: this.data.item.image }}
//                     source={{ uri: this.data.item.image }}
//                     style={{ width: viewportWidth, height: 170 }}
//                     resizeMode="contain" />
//             </CardItem>
//         );
//     }

//     renderCard() {
//         return (
//             <Card style={{ marginBottom: 1, flex: 1 }}>
//                 <CardItem style={{ backgroundColor: this.subcolor }}>
//                     <Left style={{ flex: 2 }}>
//                         <Body style={{ justifyContent: 'center', margin: 1 }}>
//                             <View style={{ flexDirection: 'row', alignItems: 'flex-start', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
//                                 {/* <Icon style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }} type="MaterialIcons" name="pin-drop" />
//                                 <Text style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
//                                     {this.data.item.location != '' ? ' ' + this.data.item.location.toUpperCase() : 'Desconhecido'}
//                                     Sem Local
//                             </Text> */}
//                                 <Left style={{ flex: 0.8 }}>
//                                     <Thumbnail small source={{ uri: this.state.authorPhoto }} />
//                                 </Left>
//                             </View>
//                             <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
//                                 <Icon style={styles.datetime} type="MaterialIcons" name="verified-user" />
//                                 <Text style={styles.datetime}>
//                                     {this.data.item.email}
//                                 </Text>
//                             </View>
//                             <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
//                                 <Icon style={styles.datetime} type="MaterialIcons" name="access-time" />
//                                 <Text style={styles.datetime}>
//                                     {' ' + this.data.item.datetime}
//                                 </Text>
//                             </View>
//                         </Body>
//                     </Left>
//                     <Right style={{ flex: 1 }}>
//                         <Icon type="MaterialCommunityIcons" name="alert-box" />
//                     </Right>
//                 </CardItem>
//                 <Body>
//                     <Body style={{ flex: 1 }}>
//                         {this.renderText()}
//                         {this.renderImage()}
//                     </Body>
//                 </Body>
//                 <CardItem>
//                     <Left>
//                         <Button transparent onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
//                             <Icon type="MaterialCommunityIcons" name="comment-text-multiple" style={styles.comments} />
//                             <Text note style={styles.comments}> {this.data.item.comments.length == 0 ? 'Adicionar comentário' : this.data.item.comments.length + ' comentário(s)'}</Text>
//                         </Button>
//                     </Left>
//                     {this.state.email == this.data.item.email &&
//                         <Right>
//                             <Icon type="MaterialCommunityIcons" name="delete" button onPress={() => this.deletePost()} />
//                         </Right>}
//                 </CardItem>
//             </Card>
//         );
//     }

//     deletePost = async () => {
//         const id = this.data.item.id;
//         await fetch('https://api-spotted.herokuapp.com/api/post/id/' + id, {
//             method: 'delete'
//         });
//         alert("Post deletado atualize o feed!");
//     };

//     refreshingData = async () => {
//         this.setState({newComment: ''});
//         try{
//             await fetch('https://api-spotted.herokuapp.com/api/post/id/' + this.state.data.item.id)
//               .then(res => res.json())
//               .then(newData => {
//                   const newItemData = {"item" : newData};
//                 this.setState({ data: newItemData});
//             });
//         }catch (erro) {}
//     };

//     renderComments() {
//         return (
//             <FlatList
//                 data={this.state.data.item.comments}
//                 extraData={this.state.data.item.comments}
//                 refreshing={true}
//                 keyExtractor={item => item.id + ''}
//                 onEndReachedThreshold={1}
//                 renderItem={({ item }) => {
//                     return (
//                         <View style={styles.item}>
//                             <ListItem
//                                 containerStyle={{ marginLeft: 0 }}
//                                 title={'@' + item.commenter.username}
//                                 titleStyle={styles.userComment}
//                                 subtitle={<View style={styles.subtitleView}>
//                                     <Text style={styles.text}>{item.comment}</Text>
//                                 </View>}
//                                 leftAvatar={{ source: { uri: item.commenter.image } }}
//                             >
//                             </ListItem>
//                         </View>
//                     );
//                 }}
//                 contentContainerStyle={{ width: viewportWidth }}
//                 ListHeaderComponent={this.renderCard(viewportWidth)}
//                 ListFooterComponent={this.renderFooter(this.state.userphoto)}
//             />

//         );
//     }

//     sendComment = async () => {
//         try {
//             const filterMentioned = this.state.newComment.match(/@\w+\S\w*/);
//             const usersMentioned = filterMentioned !== null ? filterMentioned[0].substr(1) : '';

//             const id = this.data.item.id;
//             const email = this.state.email;
//             const username = this.state.username;
//             const userphoto = this.state.userphoto
//             const newComment = this.state.newComment;

//             await fetch(`https://api-spotted.herokuapp.com/api/post/${id}/comment`, {
//                 method: 'PUT',
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     userMentioned: usersMentioned,
//                     comment: newComment,
//                     commenter: { 
//                         image: userphoto,
//                         username: username,
//                         email: email
//                     }
//                 })
//             }).then(this.refreshingData());
//             // .then(a => {
//             //     this.data.item.comments.push({
//             //         comment: this.state.newComment,
//             //         commenter: { email: this.state.email }
//             //     });
//         } catch (error) {
//         }
//     }

//     handleInputChange = newComment => {
//         this.setState({newComment});
//     };

//     renderFooter(userphoto) {
//         return (
//             <View style={{ flexDirection: 'row', width: viewportWidth, margin: 2 }}>
//                 <Thumbnail small source={{ uri: userphoto }} style={{ marginStart: 18 }} />
//                 <TextInput
//                     autoFocus
//                     keyboardType="default"
//                     autoCorrect={false}
//                     autoCapitalize="none"
//                     multiline={true}
//                     style={styles.input}
//                     value={this.state.newComment}
//                     onChangeText={this.handleInputChange}
//                     placeholder=" Adicionar comentário..."
//                     returnKeyType="send"
//                     onSubmitEditing={this.sendComment}
//                 />
//                 <TouchableOpacity
//                     style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 19, fontFamily: 'ProductSans', backgroundColor: this.color, borderColor: '#e7e7e7', borderWidth: 0.5, borderRadius: 10, width: "15%", height: 40, marginRight: 4 }}
//                     onPress={() => this.sendComment()}
//                     activeOpacity={0.8}>
//                     <Text style={styles.inputText}>
//                         enviar
//         	  			</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     showModalFunction(visible) {
//         this.setState({ modalVisibleStatus: visible });
//     }

//     renderText() {
//         return (
//             <CardItem>
//                 <Body>
//                     <Text style={styles.postText}>{this.data.item.text}</Text>
//                 </Body>
//             </CardItem>
//         );
//     }

//     render() {
//         return (
//             <TouchableOpacity activeOpacity={0.5} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
//                 <View>
//                     {this.renderCard()}
//                     <Modal
//                         transparent={false}
//                         animationType={"slide"}
//                         visible={this.state.modalVisibleStatus}
//                         onRequestClose={() => { this.showModalFunction(!this.state.modalVisibleStatus) }} >
//                         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                             <View>
//                                 {this.renderComments()}
//                             </View>
//                         </View>

//                     </Modal>
//                 </View>
//             </TouchableOpacity>
//         );
//     }
// }
// const styles = StyleSheet.create({
//     item: {
//         backgroundColor: 'white',
//         margin: 2
//     },
//     box: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     datetime: {
//         fontFamily: 'ProductSans',
//         fontSize: 13,
//         color: 'gray',
//         margin: 1
//     },
//     comments: {
//         fontFamily: 'ProductSans',
//         fontSize: 13,
//         color: 'gray',
//         margin: 5
//     },
//     comment: {
//         fontFamily: 'ProductSans',
//         fontSize: 12,
//         color: 'gray',
//         margin: 1
//     },
//     subtitleView: {
//         flexDirection: 'row',
//         margin: 0.5
//     },
//     input: {
//         marginLeft: 4,
//         margin: 2,
//         height: 40,
//         borderColor: '#e0e0e0',
//         borderWidth: 1,
//         borderRadius: 10,
//         width: '68%',
//         fontFamily: 'ProductSans'
//     },
//     inputText: {
//         fontFamily: 'ProductSans',
//         color: 'white',
//         fontSize: 14
//     },
//     userComment: {
//         fontFamily: 'ProductSans',
//         color: 'black',
//         fontSize: 14
//     },
//     postText: {
//         fontFamily: 'ProductSans',
//         textAlign: 'justify',
//         margin: 5,
//         fontSize: 16
//     }
// });
