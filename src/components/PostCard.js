import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";

import { Card, CardItem, Left, Right, Body, Thumbnail, Icon, Button, View } from 'native-base'
import ProgressiveImage from '../components/ProgressiveImage';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class PostCard extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
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
            <TouchableOpacity activeOpacity={0.5} onPress={() => alert("Cliquei no card")}>
                <Card style={{marginLeft: 0, flex: 0, width: viewportWidth}}>
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
                                <Text note style={styles.iconText}> {this.data.item.coments} Comentários</Text>
                            </Button>
                        </Left>
                        <Right>
                            <Icon type="MaterialCommunityIcons" name="delete" button onPress={() => alert("Cliquei em delete")} />
                        </Right>
                    </CardItem>
                </Card>
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

