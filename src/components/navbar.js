import React, { Component } from 'react';
import { StyleSheet, Text, View, Icon } from 'react-native';
import { Actions } from 'react-native-router-flux';
import BottomNavigation, { FullTab } from 'react-native-material-bottom-navigation';

export default class Navbar extends Component {
  tabs = [
    {
      key: 'games',
      icon: 'gamepad-variant',
      label: 'Games',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'movies-tv',
      icon: 'movie',
      label: 'Movies & TV',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'music',
      icon: 'music-note',
      label: 'Music',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]

  renderIcon = iconName => ({ isActive }) => {
    return <Icon size={24} color="white" name={iconName} />
  }

  renderTab = ({ tab, isActive }) => {
    return (
      <FullTab
        key={tab.key}
        isActive={isActive}
        label={tab.label}
        renderIcon={this.renderIcon}
      />
    )
  }

  renderBadge = badgeCount => {
    return <Badge>{badgeCount}</Badge>
  }


  render() {
    return (
      <View>
        <BottomNavigation
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})