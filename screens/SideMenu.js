import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import { styles } from "../constants/styles";
import PropTypes from 'prop-types';
import {NavigationActions} from 'react-navigation';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from 'react-redux';
import { editConfig } from "../actions/index";

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
  	if (route == null) return;

    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  _toggleCloudSync = () => {
  	if (this.props.config.cloudSync) {
  		this.props.editConfig({cloudSync: false, accessToken: this.props.config.accessToken});
  	}
  	else {
  		if (this.props.config.accessToken) {
  			this.props.editConfig({cloudSync: true, accessToken: this.props.config.accessToken});	
  		}
  		else {
  			this.props.navigation.dispatch(NavigationActions.navigate({
          routeName: 'SignUp'
        }));
  		}
  	}
  	return null;
  }

  render() {
  	return (
      <View style={styles.container}>
      	<View style={{flex:1,backgroundColor: 'skyblue', flexDirection:'column', justifyContent: 'space-between', alignItems : 'center'}}>
      		<View style={{flex:5}}/>

        	<TouchableOpacity style={{flex:1}} onPress={ this.navigateToScreen('MiniCalc') }>
              <Text style={menuButtonStyle}> <Icon name="calculator" size={24}/> Calculator </Text>
        	</TouchableOpacity>

        	<TouchableOpacity style={{flex:1}} onPress={ ()=>( this._toggleCloudSync() ) }>
              <Text style={menuButtonStyle}> <Icon name={this.props.config.cloudSync? "cloud-outline" : "cloud-off-outline"} size={24}/> Sync </Text>
        	</TouchableOpacity>

      		<View style={{flex:8}}/>
      	</View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const mapStateToProps = state => ({
  config: state.config
});

const mapDispatchToProps =  {
  editConfig: (itm) => editConfig(itm)
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)

const menuButtonStyle = {
  color:'white',
  fontWeight: 'bold',
  fontSize:24,
  textAlign: 'center'
}