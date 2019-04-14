import {
    GET_ERRORS,
    CARD_NEW,
    CARD_REMOVED,
    CARD_REMOVING,
    CARD_REQUIRED,
    CHANGE_QUESTION,
    CHANGE_PLACEHOLDER,
    CHANGE_TYPE,
    ADD_OPTION,
    CHANGE_OPTION,
    REMOVE_OPTION,
    FETCH_FORMS,
    FETCH_FORM,
    SAVE_FORM,
    CLEAR_FORM,
    CHANGE_SECTION
} from '../actions/types';
import _ from 'lodash'

const initialState = {
    create: {},
    list: [],
    deleting: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CARD_NEW:
        case CHANGE_QUESTION:
        case CHANGE_PLACEHOLDER:
        case CHANGE_TYPE:
        case ADD_OPTION:
        case CHANGE_OPTION:
        case REMOVE_OPTION:
            return {
                ...state,
                create: {
                    ...state.create,
                    // Update our Post object with a new "comments" array
                    [action.id]: action.payload
                }
            }
        case CARD_REMOVED:
            return {
                ...state,
                deleting: false
            }

        case CARD_REQUIRED:
            return {
                ...state,
                create: {
                    ...state.create,
                    // Update our Post object with a new "comments" array
                    [action.payload]: {
                        ...state.create[action.payload],
                        required: action.required
                    }
                }
            }
        case FETCH_FORMS:
            return {
                ...state,
                list: action.payload
            }
        case FETCH_FORM:
            return {
                ...state,
                create: action.payload
            }
        case CLEAR_FORM:
            return {
                ...state,
                create: {}
            }
        case CARD_REMOVING:
            const id = action.id
            const list = action.payload
            return {
                ...state,
                create: list,
                deleting: id
            }
        case CHANGE_SECTION:
            return {
                ...state,
                create: {
                    ...state.create,
                    [action.id]: {
                        ...state.create[action.id],
                        section: action.payload
                    }
                }
            }
        default:
            return state;
    }
}