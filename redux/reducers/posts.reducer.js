import {
	FETCH_GENERAL_POSTS,
	FETCH_QUESTION_POSTS,
	FETCH_TIP_POSTS,
	FETCH_TRADE_POSTS,
	FETCH_USER_GENERAL_POSTS,
	FETCH_USER_QUESTION_POSTS,
	FETCH_USER_TIP_POSTS,
	FETCH_USER_TRADE_POSTS
} from '../actions/index.actions';

const initialState = {
	generalPosts: null,
	questionPosts: [],
	tipPosts: [],
	tradePosts: [],
	userGeneralPosts: null,
	userQuestionPosts: [],
	userTipPosts: [],
	userTradePosts: []
};

const postsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_GENERAL_POSTS:
			return {
				...state,
				generalPosts: action.payload.data
			};
		case FETCH_QUESTION_POSTS:
			return {
				...state,
				questionPosts: action.payload.data
			};
		case FETCH_TIP_POSTS:
			return {
				...state,
				tipPosts: action.payload.data
			};
		case FETCH_TRADE_POSTS:
			return {
				...state,
				tradePosts: action.payload.data
			};
		case FETCH_USER_GENERAL_POSTS:
			return {
				...state,
				userGeneralPosts: action.payload.data
			};
		case FETCH_USER_QUESTION_POSTS:
			return {
				...state,
				userQuestionPosts: action.payload.data
			};
		case FETCH_USER_TIP_POSTS:
			return {
				...state,
				userTipPosts: action.payload.data
			};
		case FETCH_USER_TRADE_POSTS:
			return {
				...state,
				userTradePosts: action.payload.data
			};
		default:
			return state;
	}
};

export default postsReducer;
