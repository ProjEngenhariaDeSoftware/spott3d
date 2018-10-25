import React, { Component } from "react";
import {
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    AsyncStorage
} from "react-native";

import { Card, CardItem, Left, Right, Body, Thumbnail, Icon, Button, View } from 'native-base'
import ProgressiveImage from '../components/ProgressiveImage';
import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class PostCard extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.state = {
            data: props.data,
            username: props.username,
            userphoto: props.userphoto
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

                            <Card style={{ marginLeft: 0, flex: 0, width: DialogManager.viewportWidth }}>
                                <CardItem>
                                    <Left style={{ flex: 0.8 }}>
                                        <Thumbnail small source={{ uri: item.userphoto }} />
                                        <Body>
                                            <Text style={styles.titleText}>{item.userid}</Text>
                                            <Text style={styles.text}>{item.coment}</Text>
                                        </Body>
                                    </Left>
                                    {this.state.username == item.userid &&
                                    <Right>
                                        <Icon type="MaterialCommunityIcons" name="delete" button onPress={() => alert("Cliquei em delete")} />
                                    </Right>}

                                </CardItem>
                            </Card>


                        </View>
                    );
                }}

                ListHeaderComponent={this.renderCard(DialogManager.viewportWidth)}
            />

        );
    }



    renderDialog() {
        DialogManager.show({
            height: viewportHeight,
            animationDuration: 200,
            ScaleAnimation: new ScaleAnimation(),
            children: (
                <DialogContent>
                    <View>
                        {this.renderComments()}
                    </View>
                </DialogContent>
            ),
        }, () => {

        });
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
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.renderDialog()}>
                {this.renderCard(viewportWidth)}
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

