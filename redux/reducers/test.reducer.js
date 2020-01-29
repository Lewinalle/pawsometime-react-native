import { SET_TEXT } from '../actions/index.actions';

const initialState = {
    text: 'Default Text',
}

const test = (state = initialState, action = {}) => {
    switch(action.type) {
        case SET_TEXT:
            console.log('setting',action.payload.data );
            return { 
                ...state, 
                text: action.payload.data 
            }
        default:
            return state;
    }

}

export default test;