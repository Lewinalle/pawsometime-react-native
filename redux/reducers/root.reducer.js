import { combineReducers } from 'redux';
import test from './test.reducer';
import auth from './auth.reducer';
import meetups from './meetups.reducer';
import posts from './posts.reducer';
import others from './others.reducer';

export default combineReducers({
	test,
	auth,
	meetups,
	posts,
	others
});
