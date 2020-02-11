import { combineReducers } from 'redux';
import test from './test.reducer';
import auth from './auth.reducer';

export default combineReducers({
	test,
	auth
});
