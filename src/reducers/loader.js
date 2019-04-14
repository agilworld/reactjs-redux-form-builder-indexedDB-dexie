import { LOADER_START, LOADER_COMPLETE, LOADER_ERROR } from '../actions/types';

const initialState = {
    data: null,
    status: 'complete'
}

export default function (state = initialState, action) {
    let data = action.payload
    switch (action.type) {
        case LOADER_START:
            return {
                ...state,
                status: data.status,
                data: data.data
            }
        case LOADER_COMPLETE:
            return {
                ...state,
                status: data.status,
                data: data.data
            }
        case LOADER_ERROR:
            return {
                ...state,
                status: data.status,
                data: data.data
            }
        default:
            return state;
    }
}