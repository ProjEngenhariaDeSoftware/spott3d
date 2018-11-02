import React, { Component } from 'react';
import {
	Text,
	FlatList,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	TextInput,
	Modal,
	AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Card, CardItem, Left, Right, Body, Thumbnail, Icon, Button, View } from 'native-base';
import { ListItem } from 'react-native-elements';
import ProgressiveImage from '../components/ProgressiveImage';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class SpottedCard extends Component {
	constructor(props) {
		super(props);
		this.data = props.data;
		this.state = {
			newComment: '',
			modalVisibleStatus: false
		}
	}

	async componentDidMount() {
		try {
		} catch (error) { }
	}

	renderCard() {
		return (
			<Card style={{ marginBottom: 0, flex: 1 }}>
				<CardItem style={{ backgroundColor: '#faeaea' }}>
					<Left style={{ flex: 2 }}>
						<Body style={{ justifyContent: 'center' }}>
							<View style={styles.local}>
                <Icon style={styles.local} type="MaterialIcons" name="pin-drop" />
                <Text style={styles.local}>
									{' ' + this.data.item.location.toUpperCase()}
								</Text>
              </View>
							<View style={styles.local}>
                <Icon style={styles.datetime} type="MaterialIcons" name="school" />
                <Text style={styles.datetime}>
									{' ' + this.data.item.course}
								</Text>
              </View>
							<View style={styles.local}>
                <Icon style={styles.datetime} type="MaterialIcons" name="access-time" />
                <Text style={styles.datetime}>
									{' ' + this.data.item.datetime}
								</Text>
              </View>
						</Body>
					</Left>
					<Right style={{ flex: 1 }}>
						<Icon type="MaterialIcons" name="alert-box" button onPress={() => alert("Cliquei em denunciar")} />
					</Right>
				</CardItem>
        <Body>
				  <Body style={{ flex:1 }}>
				  	{this.renderText()}
				  </Body>
        </Body>
				<CardItem>
					<Left>
						<Button transparent>
							<Icon type="MaterialIcons" name="comment-text-multiple" style={styles.comments}/>
							<Text note style={styles.comments}> {this.data.item.comments.length} comentários</Text>
						</Button>
					</Left>
				</CardItem>
			</Card>
		);
	}

	renderComments() {
		return (
			<FlatList
				data={this.data.item.comments}
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
		// this.state.data.item.coments.push({ coment: comment, userid: this.state.username, userphoto: this.state.userphoto });
		// console.log(coment);
	}

	renderFooter() {
		return (
			<View style={{ flex: 1, alignItems: 'center' }}>
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<TextInput
						keyboardType="default"
						autoCorrect={false}
						style={styles.input}
						onChangeText={(newComment) => { this.setState({ newComment }) }}
						placeholder=" Adicionar comentário..."
						returnKeyType="send"
						value={this.state.newComment}
					/>
					<TouchableOpacity
						style={styles.submit}
						onPress={this.sendComment}
						activeOpacity={0.8}>
						<Text style={styles.inputText}>
        	    enviar
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
			<View style={styles.container}>
				<TouchableOpacity activeOpacity={0.8} onPress={() => this.showModalFunction(!this.state.modalVisibleStatus)}>
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
	container: {
		flex: 1,
		backgroundColor: '#EC5D73'
	},
	box: {
   	flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
	local: {
    flexDirection: 'row',
    alignItems: 'center',
		fontFamily: 'ProductSans',
		fontSize: 16,
		color: '#EC5D73',
		margin: 1
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
		margin: 2,
		height: 40,
		borderColor: '#e0e0e0',
		borderWidth: 1,
		borderRadius: 10,
		width: "70%",
		fontFamily: 'ProductSans'
	},
	inputText: {
		fontFamily: 'ProductSans',
		color: 'white',
		fontSize: 12
	},
	submit: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 19,
    fontFamily: 'ProductSans',
    backgroundColor: '#EC5D73',
    borderColor: '#e7e7e7',
    borderWidth: 0.5,
    borderRadius: 10,
    elevation: 2,
    width: 70,
		height: 40,
    margin: 2
  },
	userComment: {
		fontFamily: 'ProductSans',
		color: 'black',
		fontSize: 12
	},
	postText: {
		fontFamily: 'ProductSans',
		textAlign: 'justify',
		margin: 5,
		fontSize: 16
	}
});

