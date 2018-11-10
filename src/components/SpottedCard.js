import React, { Component } from 'react';
import {
	Text,
	FlatList,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	TextInput,
	Modal,
	AsyncStorage,
	Image
} from 'react-native';
import { Card, CardItem, Left, Right, Body, Thumbnail, Icon, Button, View } from 'native-base';
import { ListItem } from 'react-native-elements';
import ProgressiveImage from '../components/ProgressiveImage';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

export default class SpottedCard extends Component {
	
	constructor(props) {
		super(props);
		this.data = props.data;
		this.subcolor = props.subcolor;
		this.color = props.color;
		this.state = {
			newComment: '',
			modalVisibleStatus: false,
			id: this.data.item.id,
			sending: false
		}
	}

	async componentDidMount() {
		try {
		} catch (error) { }
	}

	validadeData(value) {
		return (value != null && value.trim().length != 0);
	}

	renderCard() {
		return (
			<Card style={{ marginBottom: 1, flex: 1 }}>
				<CardItem style={{ backgroundColor: this.subcolor }}>
					<Left style={{ flex: 2 }}>
						<Body style={{ justifyContent: 'center', margin: 1 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
								<Icon style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }} type="MaterialIcons" name="pin-drop" />
								<Text style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
									{this.validadeData(this.data.item.location) ? ' ' + this.data.item.location.toUpperCase() : 'DESCONHECIDO'}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'ProductSans', fontSize: 16, color: this.color, margin: 1 }}>
								<Icon style={styles.datetime} type="MaterialIcons" name="school" />
								<Text style={styles.datetime}>
									{this.validadeData(this.data.item.course) ? ' ' + this.data.item.course : 'Desconhecido'}
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
					<Right style={{ flex: 1, fontSize: 17 }} onPress={this.report}>
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
				</CardItem>
			</Card>
		);
	}

	renderImage() {
		return (
			<CardItem cardBody>
				<Image source={{ uri: this.data.item.image }}
					style={{ width: viewportWidth, height: imageHeight, resizeMode: 'contain', }}
				/>
			</CardItem>
		);
	}

	renderComments() {
		return (
			<FlatList
				data={this.data.item.comments.sort((a, b) => a.id - b.id)}
				extraData={this.state}
				keyExtractor={item => item.id}
				onEndReachedThreshold={1}
				renderItem={({ item }) => {
					return (
						<View style={styles.item}>
							<ListItem
								containerStyle={{ margin: 1 }}
								title={'@' + item.commenter.username}
								titleStyle={styles.userComment}
								subtitle={
									<View style={styles.subtitleView}>
										<Text style={styles.comment}>{item.comment}</Text>
									</View>
								}
								leftAvatar={{ source: { uri: item.commenter.image } }}
							>
							</ListItem>
						</View>
					);
				}}
				contentContainerStyle={{ width: viewportWidth }}
				ListHeaderComponent={this.renderCard()}
				ListFooterComponent={this.renderFooter()}
			/>
		);
	}

	sendComment = async () => {
		try {
			this.setState({ sending: true });
			let userEmail = await AsyncStorage.getItem('email');
			let userPhoto = await AsyncStorage.getItem('photoURL');
			let nickname = await AsyncStorage.getItem('username');
			//let usersMentioned = this.state.newComment.match(/@\w+/g).map(e => e.substr(1));

			await fetch('https://api-spotted.herokuapp.com/api/spotted/' + this.state.id + '/comment', {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userMentioned: '',
					comment: this.state.newComment,
					commenter: {
						email: userEmail,
						username: nickname,
						image: userPhoto
					}
				})
			}).then(a => {
				this.data.item.comments.push({
					id: a.id,
					userMentioned: '',
					comment: this.state.newComment,
					commenter: {
						email: userEmail,
						username: nickname,
						image: userPhoto
					}
				});
				this.setState({ newComment: '', sending: false });
			});
		} catch (error) {
			this.setState({ sending: false });
		}
	}

	report = async () => {
		try {
			await fetch('https://api-spotted.herokuapp.com/api/spotted/' + this.state.id + '/to-report', {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					visible: false
				})
			}).then(a => {
				alert('Reportado!');
			});
		} catch (error) {
			console.error(error);
		}
	}

	renderFooter() {
		return (
			<View style={{ flex: 1, alignItems: 'center' }}>
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2 }}>
					<TextInput
						keyboardType="default"
						autoCorrect={false}
						style={styles.input}
						onChangeText={(newComment) => { this.setState({ newComment }) }}
						placeholder=" Adicionar comentário..."
						value={this.state.newComment}
					/>
					<TouchableOpacity
						style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 19, fontFamily: 'ProductSans', backgroundColor: this.color, borderColor: '#e7e7e7', borderWidth: 0.5, borderRadius: 10, width: "20%", height: 40, margin: 2, marginRight: 4 }}
						onPress={this.sendComment}
						activeOpacity={0.8}>
						<Text style={styles.inputText}>
							{this.state.sending ? 'enviando' : 'enviar'}
						</Text>
					</TouchableOpacity>
				</View>
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
			<View style={{ flex: 1, backgroundColor: this.color }}>
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
					</View>
				</TouchableOpacity>
			</View>
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
		width: "80%",
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

