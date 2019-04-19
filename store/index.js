import { createStore } from "redux";
import rootReducer, {_initialState} from "../reducers/index";
const store = (initialState = _initialState) => createStore(rootReducer, initialState);
export default store;