import React from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
export default class ProgressBar extends React.Component {
	constructor(props) {
		super();
		this.state = {
			color: props.color
		}
	}
	render() {
		return (
			<View style={styles.progressBar}>
				<ActivityIndicator size="large" color={this.state.color} animating />
			</View>
		);
	}
}
const styles = StyleSheet.create({
	progressBar: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
});