import React from "react";
import { AsyncStorage, ActivityIndicator, View } from "react-native"
import { Provider } from "react-redux";
import store from "./store/index";
import {_initialState} from "./reducers/index";
import App from "./App";
import JSZip from "jszip";
import {styles} from "./constants/styles";

export default class ReduxWrapper extends React.Component {
  state = {
  	isLoading : true,
  	initStore : null
  }

  componentWillMount = () => {
  	let expenses = null;
  	let config = null;
  	let _initStore = Object.assign({},_initialState);

  	AsyncStorage.getItem('config').then((value)=>{
  		if (value) {
  			config = JSON.parse(value);
  		}
  		return AsyncStorage.getItem('expenses');
  	}).then((value)=>{
  		if (value) {
  			expenses = JSON.parse(value);
  		}

  		if (!config || !config.cloudSync) {
	      	throw "jump to catch";
  		}   		

		let zip = new JSZip();
		zip.file('request.json', JSON.stringify(expenses));

		return zip.generateAsync({
			type:"base64",
			compression: "DEFLATE",
		    compressionOptions: {
		        level: 6
		    }
		});
	})
	.then((content)=>{
	    return fetch('https://akashangames.com:727/SyncUpZip', {
	        method: 'POST',
	        headers: {
	          Accept: 'application/json',
	          'Content-Type': 'application/json',
	        },
	        body: JSON.stringify({accessToken: config.accessToken, expenses : content}),
	      });
  	})
	.then((result)=>{
	  	return fetch('https://akashangames.com:727/SyncDownZip', {
	        method: 'POST',
	        headers: {
	          Accept: 'application/json',
	          'Content-Type': 'application/json',
	        },
	        body: JSON.stringify({accessToken: config.accessToken}),
	  	})
	})
	.then((response)=>response.json())
	.then((responseJson)=>{
	  	if (responseJson.error) {
	  		if (responseJson.error=='unsync')
	  			config = {cloudSync: false, accessToken:null}
	  	}

	  	if (!responseJson.hasOwnProperty("expenses")) {
	  		throw "no expense downloaded";
	  	}	  	

		let zip = new JSZip();
		return zip.loadAsync(responseJson.expenses,{base64:true});
	})
	.then ((unzipped)=>{
		return unzipped.file('response.json').async("string");
	})
	.then ((extracted)=>{
		_initStore.expenses = JSON.parse(extracted);
		if (config) _initStore.config = config;

	  	this.setState({
	  		initStore : _initStore,
	  		isLoading: false
	  	});
	})
  	.catch((error)=>{
  		console.log (error);

  		if (expenses) _initStore.expenses = expenses;
  		if (config) _initStore.config = config;
  		
      	this.setState({
      		initStore : _initStore,
      		isLoading: false
      	});
  	});
  }

  render() {
  	if (this.state.isLoading) {
  		return (
			<View style={styles.loadingScreen}>
				<ActivityIndicator size="large" color="skyblue" />
			</View>
	    )
  	}
  	else {
		return (
			<Provider store={ this.state.initStore? store(this.state.initStore) : store()}>
	    		<App />
	  		</Provider>
	    );
  	}
  }
}