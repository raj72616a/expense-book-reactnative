import React from 'react';
import { Text, View, Button,TouchableOpacity, Modal,TextInput,Picker,Alert,FlatList } from 'react-native';
import dateformat from 'dateformat';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { styles } from "../constants/styles";
import { lists } from "../constants/lists";
import { connect } from 'react-redux';
import { addExpense, editExpense, delExpense } from "../actions/index";
import Icon from "react-native-vector-icons/AntDesign";

class DayScreen extends React.Component {
  state = {
    currentDate: new Date(),
    dayLabelText: '',
    isDateTimePickerVisible : false,
    isModalVisible : true,
    Category : 'Food',
    Tag : '💰',
    Description : '',
    Amount : '',
    selectedKey : -1
  } 

  componentWillMount() {
    let nav = this.props.navigation;
    let thisDay = nav.getParam('month').setDate(nav.getParam('day'));
    this.setState ({
      currentDate: thisDay,
      dayLabelText: dateformat(thisDay, "yyyy-mmm-dd"),
      isModalVisible: !this.props.expenses.hasOwnProperty(dateformat(thisDay, "yyyy-mmm-dd"))
    })
  }

  _upsertExpense = (newExpense) => {
    newExpense.date = this.state.dayLabelText;
    if (this.state.selectedKey < 0) {
      this.props.add(newExpense);
    }
    else {
      newExpense.key = this.state.selectedKey;
      this.props.edit(newExpense);
    }
  }

  _delExpense = () => {
    this.props.del({date : this.state.dayLabelText, key : this.state.selectedKey});
  }

  _fillNewExpense = () => {
    this.setState({
      Category : 'Food',
      Tag : '💰',
      Amount : '',
      Description : '',
      selectedKey : -1,
      isModalVisible : true
    });
  }

  _editExpense = (key) => {
    if (Number.isNaN(key) || Number(key) < 0 || Number(key) >= this.props.expenses[this.state.dayLabelText].length ) {
      console.log('invalid key');
      return;
    }

    let expenseItm = this.props.expenses[this.state.dayLabelText][Number(key)];

    this.setState({
      Category : expenseItm.category,
      Tag : expenseItm.tag,
      Amount : expenseItm.amount,
      Description : expenseItm.remarks,
      selectedKey : Number(key),
      isModalVisible : true
    });
  }

  _getExpenseTtl = () => {
    let ttl = 0;
    for (var i in this.props.expenses[this.state.dayLabelText]) {
      ttl +=  Number(this.props.expenses[this.state.dayLabelText][i].amount);
    }
    return parseFloat(ttl.toFixed(2));
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.dayScreenHeader}>
          <TouchableOpacity onPress={ ()=>this.setState({isDateTimePickerVisible: true}) }>
            <View>
              <Text style={{width: 200, fontWeight: 'bold',fontSize:20, textAlign: 'center'}}> {this.state.dayLabelText} </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{flex:8}}>
        <FlatList
          style = {{padding: 5, alignSelf: 'center'}}
          contentContainerStyle={{ flexGrow: 1 }}
          data={
            this.props.expenses.hasOwnProperty(this.state.dayLabelText) ?
              ([{amount:-1, key: 'add'}]).concat(this.props.expenses[this.state.dayLabelText].map((eachExpense,key)=>{ eachExpense.key = key.toString(); return eachExpense; }) )
            :
              [{amount:-1, key: 'add'}]
          }
          renderItem={ ({item}) => <ExpenseItem item={item} OnPress={(key)=>{ if (key=='add') this._fillNewExpense(); else this._editExpense(key); }} /> } />

        </View>

        <View style = {{flex: 1, padding: 20}}>
          { this.props.expenses.hasOwnProperty(this.state.dayLabelText) ?
            (
              <Text style={{fontSize: 20}}>{ 'Daily Total: $' + this._getExpenseTtl() }</Text>
              )
            :
            null
          }
        </View>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          date = {new Date(this.state.currentDate)}
          onConfirm={(date) => {
            this.setState({ currentDate: date,
              dayLabelText: dateformat(date, "yyyy-mmm-dd"),
              isDateTimePickerVisible: false });
          }}
          onCancel={ ()=> {this.setState({isDateTimePickerVisible: false})} } />

        <Modal        
          animationType='fade'
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => {
          }}>
          <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
            <View elevation={5} style={styles.formContainer}>
              <Text style={ styles.formLabel }>Category</Text>
              <Picker
                style={ styles.formField }
                selectedValue={this.state.Category}                
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({Category: itemValue})
                }>
                { lists.Category.map((itm,key)=>{return ( <Picker.Item key={key} label={itm} value={itm} /> )}) }
              </Picker>

              <Text style={ styles.formLabel }>Tag</Text>
              <TagSelector selected={this.state.Tag} onSelect={(newValue)=> this.setState({Tag:newValue})} />

              <Text style={ styles.formLabel }>Description</Text>
              <TextInput style={ styles.formField } value={this.state.Description} onChangeText={(text) => this.setState({Description: text})} />

              <Text style={ styles.formLabel }>Amount</Text>
              <TextInput autoCapitalize="none" keyboardType='numeric' style={ styles.formField } value={this.state.Amount} onChangeText={(text) => this.setState({Amount: text})} />

              <View style={{flexDirection:'row',padding:10,alignItems:'center',justifyContent:'space-between'}}>
              <Button
                color='grey'
                title="Cancel"
                onPress={() => {
                  this.setState({isModalVisible : false});
                }}/>

              { (this.state.selectedKey >= 0)? (
                <Button
                  color='#ff8080'
                  title="Delete"
                  onPress={() => {
                    Alert.alert('Delete Record','Are you sure to delete this expense record?',
                      [
                        {text:'Cancel', style :'cancel'},
                        {text:'OK', onPress: ()=> {
                          this._delExpense();
                          this.setState({isModalVisible : false});
                        }}
                      ]);
                  }}/>) : null }    
            
              <Button
                title="Submit"
                onPress={() => {
                  if (!this.state.Amount || this.state.Amount =="" || Number.isNaN( this.state.Amount) ) {
                    Alert.alert('Missing Amount','Please input the expense amount.',[{text:'OK'}]);
                    return;
                  }
                  let newExpense = {
                    category : this.state.Category,
                    tag : this.state.Tag,
                    remarks :this.state.Description || "",
                    amount : parseFloat(this.state.Amount).toString()
                  }
                  this._upsertExpense(newExpense);
                  this.setState({isModalVisible : false});
                }}/>
               </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

class TagSelector extends React.Component {
  render() {
    return (
      <View style={{flexDirection:'row',height:40,padding:4,alignItems:'center',justifyContent:'space-between'}}>

          {lists.Tag.map((eachTag,key) => {
              return (
                <TouchableOpacity key={key} style={(this.props.selected==eachTag ? styles.selectorSelected : styles.selectorUnselected)} onPress={ ()=> this.props.onSelect(eachTag) }>
                  <Text style={styles.selectorContent}>{eachTag}</Text>
                </TouchableOpacity>
              );
          })}
      </View>
    )
  }
}

class ExpenseItem extends React.Component {
  render() {
    return (
      this.props.item.key == "add" ?
      (
          <View elevation={3} style={styles.ExpenseItem}>
            <View style={{alignSelf:'center',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=> this.props.OnPress(this.props.item.key)}>              
                <Text style={{fontSize:18,color:'#4d79ff'}}><Icon name="addfile" size={26}/> Add new record</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      :
      (
        <View elevation={3} style={styles.ExpenseItem}>
            <View style={{flex:8, flexDirection:'column'}}>
              <Text> { this.props.item.tag + this.props.item.category + (this.props.item.remarks==''?'' : (' - ' + this.props.item.remarks ) )  } </Text>
              <Text> { '$' + this.props.item.amount } </Text>
            </View>
            <View style={{flex:2, flexDirection:'row', justifyContent:'flex-end' }}>
              <TouchableOpacity onPress={()=> this.props.OnPress(this.props.item.key)}>              
                <Text style={{ color : 'skyblue', padding: 6 }}><Icon name="edit" size={24}/></Text>
              </TouchableOpacity>
            </View>
          </View>
        )
    );
  }
}

const mapStateToProps = state => ({
  expenses: state.expenses
});

const mapDispatchToProps =  {
  add: (newItm) => addExpense(newItm),
  edit: (newItm) => editExpense(newItm),
  del: (itm) => delExpense(itm)
}

export default connect(mapStateToProps, mapDispatchToProps)(DayScreen)