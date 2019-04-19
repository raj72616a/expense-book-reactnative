import React from 'react'
import { View, Text, Button,TouchableOpacity,TextInput,Alert} from 'react-native'
import { connect } from 'react-redux';
import { editConfig, mergeExpenses } from "../actions/index";
import { styles } from "../constants/styles";

class SignUp extends React.Component {
  state = {
    mode : 'SignUp',
    email : '',
    pass : '',
    pass2 : ''
  }

  _submitSignUp = () => {
    if (this.state.email=='') {
      Alert.alert('Missing Email','Please fill in the Email field.',[{text:'OK'}]);
      return;
    }
    if (this.state.pass=='' || (this.state.mode=='SignUp' && this.state.pass2=='') ) {
      Alert.alert('Missing Password','Please fill in the Password field.',[{text:'OK'}]);
      return;
    } 
    if (this.state.mode=='SignUp' && this.state.pass != this.state.pass2 ) {
      Alert.alert('Password Mismatch','Please make sure the password is correct.',[{text:'OK'}]);
      return;
    }

    if (this.state.mode=='SignUp') {
      fetch('https://akashangames.com:727/SignUp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:this.state.email, pass:this.state.pass}),
      })
      .then ((response) => response.json())
      .then ((responseJson)=>{
        if (responseJson.error)
          Alert.alert('Error',responseJson.error,[{text:'OK'}]);
        else {
          this.props.editConfig({cloudSync:true, accessToken:responseJson.accessToken})
          fetch('https://akashangames.com:727/SyncUp', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({accessToken:responseJson.accessToken, expenses: this.props.expenses}),
          });
          this.props.navigation.goBack();
        }                  
      });
    }
    else if (this.state.mode == 'Login') {
      fetch('https://akashangames.com:727/Login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:this.state.email, pass:this.state.pass}),
      })
      .then ((response) => response.json())
      .then ((responseJson)=>{
        if (responseJson.error)
          Alert.alert('Error',responseJson.error,[{text:'OK'}]);
        else {
          this.props.editConfig({cloudSync:true, accessToken:responseJson.accessToken})
          fetch('https://akashangames.com:727/SyncDown', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({accessToken:responseJson.accessToken}),
          })
          .then((response2) => response2.json())
          .then((responseJson2) => {
            if (!responseJson2.error) {
              this.props.mergeExpenses({expenses: responseJson2});
            }
            this.props.navigation.goBack();
          });                    
        }                  
      }); 
    }
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <View elevation={5} style={styles.formContainer}>

          <View style={{flexDirection:'row',padding:10,alignItems:'center',justifyContent:'space-evenly'}}>
            <TouchableOpacity onPress={() => this.setState({mode:'SignUp'})}>
                <Text style={ this.state.mode == 'SignUp'? styles.tabSelected : styles.tabUnselected }>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({mode:'Login'})}>
                <Text style={ this.state.mode == 'Login'? styles.tabSelected : styles.tabUnselected }>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={ styles.formLabel }>Email Address</Text>
          <TextInput keyboardType='email-address' style={ styles.formField } onChangeText={(text) => {this.setState({email : text})} } />

          <Text style={ styles.formLabel }>Password</Text>
          <TextInput secureTextEntry={true} style={ styles.formField } onChangeText={(text) => {this.setState({pass : text})} } />
          {
            (this.state.mode == 'SignUp') ? (
              <View>
                <Text style={ styles.formLabel }>Re-confirm Password</Text>
                <TextInput secureTextEntry={true} style={ styles.formField } onChangeText={(text) => {this.setState({pass2 : text})} } />
              </View>
              )
            : null
          }
          <Button
            title="Submit"
            onPress={() => this._submitSignUp() }/>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  config: state.config,
  expenses: state.expenses
});

const mapDispatchToProps =  {
  editConfig: (itm) => editConfig(itm),
  mergeExpenses: (itm) => mergeExpenses(itm)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)