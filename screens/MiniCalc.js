import React from 'react'
import { View } from 'react-native'
import { Calculator } from 'react-native-calculator'
 
export default class MiniCalc extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Calculator 
        	calcButtonBackgroundColor = {'skyblue'}
        	fontSize = {30}
        	hasAcceptButton = {false}
        	style={{ flex: 1 }} />
      </View>
    )
  }
}