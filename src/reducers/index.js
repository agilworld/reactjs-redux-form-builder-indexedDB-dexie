import { combineReducers } from 'redux'
import errorReducer from './errorReducer'
import loaderReducer from './loader'
import modalReducer from './modal'
import formLoaderReducer from './formLoader'
import forms from './formsReducer'

export default combineReducers({
    errors: errorReducer,
    loadingRequest: loaderReducer,
    modal: modalReducer,
    formLoader: formLoaderReducer,
    forms: forms
});
