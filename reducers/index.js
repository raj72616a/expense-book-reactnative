import {AsyncStorage} from 'react-native';

export const _initialState = {
  expenses: {},
  config: {
    cloudSync : false,
    accessToken : null
  }
};

function rootReducer(state, action) {
  if (action.type == "MERGE_EXPENSES") {
    let newExpense = Object.assign({}, state.expenses);

    for (var key in action.payload.expenses) {
      if (newExpense.hasOwnProperty[key]) {
        if (action.payload.expenses[key].length > newExpense[key])
          newExpense[key] = action.payload.expenses[key];
      }
      else {
        newExpense[key] = action.payload.expenses[key];
      }
    }

    AsyncStorage.setItem('expenses', JSON.stringify(newExpense));
    let newState = Object.assign({expenses : newExpense}, {config : state.config})
    return newState;
  }
  else if (action.type == "EDIT_CONFIG") {
    let newConfig = {cloudSync : action.payload.cloudSync, accessToken : action.payload.accessToken};
    AsyncStorage.setItem('config', JSON.stringify(newConfig));

    let newState = Object.assign ({config: newConfig }, {expenses : state.expenses} );
    return newState;
  }
  else if (action.type == "ADD_EXPENSE") {
    let newExpense = Object.assign({}, state.expenses);
  	if (newExpense[action.payload.date] == null)
  		newExpense[action.payload.date] = [];

  	newExpense[action.payload.date].push({
  		category: action.payload.category,
  		tag: action.payload.tag,
  		remarks: action.payload.remarks,
  		amount: action.payload.amount
  	});

    if (state.config.cloudSync) {
      let uploadExpense = {};
      uploadExpense[action.payload.date] = newExpense[action.payload.date];

      fetch('https://akashangames.com:727/SyncUp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accessToken:state.config.accessToken, expenses : uploadExpense}),
      })
      .catch((err)=>{console.log(err);})
      ;
    }
    AsyncStorage.setItem('expenses', JSON.stringify(newExpense));
    let newState = Object.assign({expenses : newExpense}, {config : state.config})
  	return newState;
  }
  else if (action.type == "EDIT_EXPENSE") {
    let newExpense = Object.assign({}, state.expenses);
    let dayExpense = state.expenses[action.payload.date].slice(0);
    dayExpense[Number(action.payload.key)] = {
      category: action.payload.category,
      tag: action.payload.tag,
      remarks: action.payload.remarks,
      amount: action.payload.amount
    };
    newExpense[action.payload.date] = dayExpense;

    if (state.config.cloudSync) {
      let uploadExpense = {};
      uploadExpense[action.payload.date] = newExpense[action.payload.date];

      fetch('https://akashangames.com:727/SyncUp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accessToken:state.config.accessToken, expenses : uploadExpense}),
      })
      .catch((err)=>{console.log(err);});
    }

    AsyncStorage.setItem('expenses', JSON.stringify(newExpense));

    let newState = Object.assign({expenses : newExpense}, {config : state.config})
    return newState;
  }
  else if (action.type == "DEL_EXPENSE") {
    let newExpense = Object.assign({}, state.expenses);
    let dayExpense = state.expenses[action.payload.date].slice(0);

    dayExpense.splice(Number(action.payload.key),1);
    
    newExpense[action.payload.date] = dayExpense;

    if (state.config.cloudSync) {
      let uploadExpense = {};
      uploadExpense[action.payload.date] = newExpense[action.payload.date];

      fetch('https://akashangames.com:727/SyncUp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accessToken:state.config.accessToken, expenses : uploadExpense}),
      })
      .catch((err)=>{console.log(err);});
    }

    AsyncStorage.setItem('expenses', JSON.stringify(newExpense));

    let newState = Object.assign({expenses : newExpense}, {config : state.config})
    return newState;
  }
  return state;
};
export default rootReducer;