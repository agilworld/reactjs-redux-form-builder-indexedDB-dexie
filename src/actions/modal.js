import {
    MODAL_SHOW,
    MODAL_HIDE,
    MODAL_BUTTON_LOADING_START,
    MODAL_BUTTON_LOADING_END,
    FORM_LOADING_START,
    FORM_LOADING_FINISH
} from './types';

export const modalOpen = () => dispatch => {
    dispatch({
        type: MODAL_SHOW
    })
}

export const modalClose = () => dispatch => {
    dispatch({
        type: MODAL_HIDE
    })
}

export const modalButtonLoading = () => dispatch => {
    dispatch({
        type: MODAL_BUTTON_LOADING_START
    })
}

export const modalButtonFinish = () => dispatch => {
    dispatch({
        type: MODAL_BUTTON_LOADING_END
    })
}

export const formLoadingStart = () => dispatch => {
    dispatch({
        type: FORM_LOADING_START
    })
}

export const formLoadingFinish = () => dispatch => {
    dispatch({
        type: FORM_LOADING_FINISH
    })
}