import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  calenderHeader : {
    flexDirection: 'row',
    backgroundColor:'skyblue',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40
  },
  dayScreenHeader : {
    flexDirection: 'row',
    backgroundColor:'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  formContainer : {              
    backgroundColor:'white',
    justifyContent: 'space-between',
    height:500,
    width:300,
    borderRadius: 20,
    padding:20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  formLabel : {
    color: '#3366ff',
    fontWeight: 'bold',
    fontSize:20,
    padding: 4
  },
  formField : {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 4
  },
  tabSelected : {
    fontSize : 28,
    fontWeight : 'bold',
    color : 'white',
    backgroundColor : 'blue',
    borderRadius : 10,
    padding : 12,
  },
  tabUnselected : {
    fontSize : 24,
    fontWeight : 'bold',
    color : 'white',
    backgroundColor : 'grey',
    borderRadius : 10,
    padding : 10,
  },
  selectorUnselected : {
    justifyContent: 'center',
    alignItems : 'center',
    borderRadius : 5
  },
  selectorSelected : {
    justifyContent: 'center',
    alignItems : 'center',
    backgroundColor : 'skyblue',
    borderRadius : 5
  },
  selectorContent : {
    fontSize:20, textAlign: 'center', padding:4
  },
  ExpenseItem : {
    flexDirection : 'row',
    backgroundColor:'white',
    justifyContent: 'space-between',
    height:60,
    width:320,
    borderRadius: 20,
    padding:10,
    margin: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  arrow : {
    fontSize: 20
  },
  weekHeader : {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    flex: 1
  },
  week : {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    flex: 3
  },
  dayLabel : {
    position: 'absolute',
    top: 6,
    left: 6,    
    width: 30,
    height: 15,
    textAlign: 'center'
  },
  dayCircle: {
    position: 'absolute',
    top: 5,
    left: 5,    
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 0.3,
    borderColor: 'black'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  loadingScreen : {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});