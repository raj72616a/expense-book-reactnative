import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import dateformat from 'dateformat';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { styles } from "../constants/styles";
import { lists } from "../constants/lists";
import { connect } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class CalendarScreen extends React.Component {
  state = {
    currentDate: new Date(),
    monthLabelText: dateformat(new Date(), "yyyy-mmm"),
    isDateTimePickerVisible: false,
    day : new Array(42).fill(0),
    currentDay : 0
  }

  _setMonth = (offset) => { 
    let newDate = new Date(this.state.currentDate.getTime());
    newDate.setMonth(newDate.getMonth()+offset);

    let newDays = this._refreshDays(newDate); 

    this.setState({
      currentDate: newDate,
      monthLabelText:  dateformat(newDate, "yyyy-mmm"),
      currentDay: newDays.currentDay,
      day: newDays.day
    });     
    
  }

  _refreshDays = (currentDate) => {
    let day = new Array(42).fill(0);
    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0 );
    lastDay = lastDay.getDate();
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 );

    let dayOffset = firstDay.getDay() - 1;
    for (var i = 1; i <= lastDay; i++) {
      day[i+dayOffset] = i;
    }

    let today = new Date();
    if (currentDate.getFullYear() == today.getFullYear() && currentDate.getMonth() == today.getMonth())
      return {day : day, currentDay : today.getDate()};
    else
      return {day : day, currentDay : -1};
  };

  _openDay = (day) => {
    if (day == 0) return;
    this.props.navigation.navigate('SignUp', {day : day, month : this.state.currentDate });
  };

  _grabDailyExpense = (day) => {
    if (day == 0) return null;
    let theDay = new Date(this.state.currentDate.getTime());
    theDay.setDate(day);
    let dayLabel = dateformat(theDay, "yyyy-mmm-dd")
    if (this.props.expenses.hasOwnProperty(dayLabel)) {
      let ttl = 0;
      for (var i in this.props.expenses[dayLabel]) {
        ttl += Number(this.props.expenses[dayLabel][i].amount);
      }
      return parseNum(ttl);
    }
    else {
      return null;
    }
  }

  _grabMonthlyExpense = (expenses, currentDate) => {
    let result = getEmptyLedger();

    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0 );
    lastDay = lastDay.getDate();

    let theDay = new Date(currentDate.getFullYear(), currentDate.getMonth() , 1 );
    for (var d = 1; d <= lastDay; d++) {
      theDay.setDate(d);
      let dayLabel = dateformat(theDay, "yyyy-mmm-dd");
      if (expenses.hasOwnProperty(dayLabel)) {
        for (var i in expenses[dayLabel]) {
          result.ttl += Number(expenses[dayLabel][i].amount);
          result.byTag[expenses[dayLabel][i].tag] += Number(expenses[dayLabel][i].amount);
          result.byCategory[expenses[dayLabel][i].category] += Number(expenses[dayLabel][i].amount);
        }
      }
    }

    result.ttl = parseNum(result.ttl);
    for (var i in result.byTag) {
      result.byTag[i] = parseNum(result.byTag[i]);
    }
    for (var i in result.byCategory) {
      result.byCategory[i] = parseNum(result.byCategory[i]);
    }

    return result;
  }

  componentWillMount(){
    let newDays = this._refreshDays(new Date()); 

    this.setState({
      currentDay : newDays.currentDay,
      day : newDays.day
    });
  }

  render() {
    return (
      <View style={styles.container}>

      <GestureRecognizer
        style = {{
          flex:12 
        }}
        onSwipeLeft={(state) => this._setMonth(1)}
        onSwipeRight={(state) => this._setMonth(-1)}
        config={{velocityThreshold: 0.2,
                directionalOffsetThreshold: 45}}>

        <View style={[styles.calenderHeader,{flexDirection:'row'}]}>
          <TouchableOpacity onPress={() => this._setMonth(-1)}>
              <Text style={styles.arrow}>◄</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={ ()=>this.setState({isDateTimePickerVisible: true}) }>
              <Text style={{width: 200, fontWeight: 'bold',fontSize:20, textAlign: 'center'}}> {this.state.monthLabelText} </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this._setMonth(1)}>
              <Text style={styles.arrow}>►</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.weekHeader}>
          {weekDays.map((dayOfWeek,key)=>{
            return (
                <View key={key} style={{flex: 1, borderWidth:0.5, borderColor: 'black', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold',fontSize:14, color:dayOfWeek.color, textAlign: 'center' }}> {dayOfWeek.name} </Text>
                </View>
              )
          })}
        </View>

        {([0,7,14,21,28,35]).map((eachWeek,keyW) => {
            return (
              <View key={keyW} style={styles.week}>
                {([0,1,2,3,4,5,6]).map((eachDay,keyD) => {
                    return (
                      <DateGrid amount={this._grabDailyExpense(this.state.day[eachDay + eachWeek])} openDay={this._openDay} key={keyD} day={this.state.day[eachDay + eachWeek]} isToday={(this.state.day[eachDay + eachWeek] == this.state.currentDay)} />
                    );
                })}
              </View>
            );
        })}

        </GestureRecognizer>

        <View style={{backgroundColor: 'white',	justifyContent: 'center',	flex: 6   }}>
          <ExpenseSummary amount={ this._grabMonthlyExpense(this.props.expenses, this.state.currentDate) }/>
        </View>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}

          date = {this.state.currentDate}

          onConfirm={(date) => {

            let newDays = this._refreshDays(date); 

            this.setState({
              currentDate: date,
              monthLabelText: dateformat(date, "yyyy-mmm"),
              isDateTimePickerVisible: false,
              currentDay : newDays.currentDay,
              day : newDays.day
            });

          }}

          onCancel={ ()=> {this.setState({isDateTimePickerVisible: false})} }
          />
      </View>
    );
  }
}

class DateGrid extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.openDay(this.props.day)} style={{flex: 1, borderWidth:0.5, borderColor: 'black'}}>  
        <View style={{flex: 1, justifyContent: 'center'}}>
          { this.props.isToday? (<View style={ styles.dayCircle }/>) : null }  
          <Text style={styles.dayLabel}> { (this.props.day > 0 ? this.props.day : '') }  </Text>
        </View>
        <View style={{flex: 3, flexDirection: 'column', justifyContent: 'center', alignItems : 'center'}}>
          { this.props.amount? (<Text style={{color:'#33adff'}}>{this.props.amount}</Text>) : null }  
        </View>
      </TouchableOpacity>
    );
  }
}

class ExpenseSummary extends React.Component {
  state = {
    mode : 'ttl'
  }

  _changeMode = () => {
    if (this.state.mode == 'ttl') this.setState({mode: 'tag'});
    else if (this.state.mode == 'tag') this.setState({mode: 'category'});
    else this.setState({mode: 'ttl'});
  }

  _renderTtl = () => {
    switch(this.state.mode) {
      case 'ttl':
        return (
            <Text style={{fontSize: 20}}>{ 'Monthly Total: $' + this.props.amount.ttl }</Text>
          )
      case 'tag':
        return (
            lists.Tag.map((eachTag,key)=>{
              return (
                  <Text key={key} style={{}}>{  eachTag + ': $' + this.props.amount.byTag[eachTag] }</Text>
                )
            })
          )
      case 'category':
        return (
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
              <View style={{flex : 1}}>
                {lists.CategoryCol1.map((eachCateg,key)=>{
                  return (
                      <Text key={key} style={{}}>{  eachCateg + ': $' + this.props.amount.byCategory[eachCateg] }</Text>
                    )
                })}
              </View>
              <View style={{flex : 1}}>
                {lists.CategoryCol2.map((eachCateg,key)=>{
                  return (
                      <Text key={key} style={{}}>{  eachCateg + ': $' + this.props.amount.byCategory[eachCateg] }</Text>
                    )
                })}
              </View>
            </View>
          )
      default:
        return null;
    }
  }

  render() {
    return (
      <View style={{flexDirection : 'row', alignItems: 'center', justifyContent : 'space-between'}}>
        <View style={{flex: 5, flexDirection: 'column', alignItems:'flex-start', padding: 20}}>
          { this._renderTtl() }
        </View>
        <View style={{flex: 1, flexDirection: 'column', alignItems:'flex-start'}}>
            <TouchableOpacity onPress={ this._changeMode }>
                <Text style={{ padding: 6, color:'skyblue'}}><Icon name="rotate-3d" size={30}/></Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  expenses: state.expenses
});

export default connect(mapStateToProps)(CalendarScreen)

const weekDays = [
  {name : 'Sun', color: 'red'},
  {name : 'Mon', color: 'black'},
  {name : 'Tue', color: 'black'},
  {name : 'Wed', color: 'black'},
  {name : 'Thu', color: 'black'},
  {name : 'Fri', color: 'black'},
  {name : 'Sat', color: 'black'}
];

const parseNum = (number) => {
  if (number >= 10000000) {
    return (number * 0.000001).toPrecision(3) + 'M';
  }
  if (number >= 10000) {
    return (number * 0.001).toPrecision(3) + 'K';
  }

  return parseFloat(number.toFixed(2));
}

const getEmptyLedger = () => {
  let result = {
    ttl : 0,
    byTag : {
      },
    byCategory : {
      }
  };

  for (var i in lists.Tag) {
    result.byTag[lists.Tag[i]] = 0;
  }
  for (var i in lists.Category) {
    result.byCategory[lists.Category[i]] = 0;
  }
  return result;
}