import { FORM_LOADING_START, FORM_LOADING_FINISH } from '../actions/types';

const initialState = false

export default function (state = initialState, action) {
    switch (action.type) {
        case FORM_LOADING_START:
            return true
        case FORM_LOADING_FINISH:
            return false;
        default:
            return state;
    }
}