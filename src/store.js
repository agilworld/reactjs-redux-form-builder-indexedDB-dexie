import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { LOADER_START, LOADER_COMPLETE, LOADER_ERROR } from './actions/types'

const initialState = {};

const loadingConnection = store => next => action => {

    if (!action.promise) {
        return next(action)
    }

    function makeAction(ready, data) {
        const newAction = Object.assign({}, action, { ready }, data)
        delete newAction.promise
        return newAction
    }

    store.dispatch({
        type: LOADER_START, payload: {
            status: 'start'
        }
    })

    next(makeAction(false))

    return action.promise.then(
        result => {
            store.dispatch({
                type: LOADER_COMPLETE, payload: {
                    status: 'complete'
                }
            })
        },
        error => {
            let err = error
            store.dispatch({
                type: LOADER_ERROR, payload: {
                    status: 'error',
                    data: err.response ? err.response : err,
                }
            })
            console.log('Caught Exception!', error)
        }
    )

}


const middleware = [
    thunk,
    loadingConnection,
];


// dev tools middleware
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

const store = createStore(
    rootReducer,
    initialState,
    composeSetup(
        applyMiddleware(...middleware)
    )

);

export default store;