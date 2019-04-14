import rest, { restForm } from '../utils/rest'
import {
    FETCH_FORMS,
    FETCH_FORM,
    CLEAR_FORM,
    DELETE_FORM,
    SAVE_FORM,
    UPDATE_FORM
} from '../actions/types'
import db from '../db'
import { uniqueId } from '../utils/helpers';

export const fetchForms = (args) => dispatch => {

    return new Promise((resolve, reject) => {
        db.table("forms")
            .toArray()
            .then((forms) => {
                dispatch({
                    type: FETCH_FORMS,
                    payload: forms
                })

                resolve(forms)
            })
            .catch(err => {
                reject(err)
            })
        /*
        const data = new FormData()
        data.append("offset", 0)
        data.append("limit", 20)

        restForm()
            .get("admin/form/all", data)
            .then(res => {

                dispatch({
                    type: FETCH_FORMS,
                    payload: res.data.rows
                })

                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })*/
    })
}


export const fetchForm = (id) => dispatch => {

    return new Promise(async (resolve, reject) => {
        /*restForm()
            .get("admin/form/detail/" + id)
            .then(res => {
                const data = res.data.row.data
                const parsed = JSON.parse(data)

                dispatch({
                    type: FETCH_FORM,
                    payload: parsed.fields
                })

                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })*/

        const field = await db.table("forms")
            .where({ id: parseInt(id) })
            .first();

        if (!field) {
            reject(field)
        }

        dispatch({
            type: FETCH_FORM,
            payload: field.data.fields
        })

        resolve(field)
    })
}

export const saveForm = (data, id = null) => dispatch => {
    if (id) {
        data.id = parseInt(id)
    }

    return new Promise((resolve, reject) => {

        if (id) {
            db.table("forms")
                .update(parseInt(id), data)
                .then(() => {
                    dispatch({
                        type: UPDATE_FORM
                    })

                    resolve(true)
                })
                .catch(err => {
                    reject(err)
                })
        } else {
            data.code = uniqueId()

            db.table("forms")
                .add(data)
                .then((id) => {
                    dispatch({
                        type: SAVE_FORM
                    })

                    resolve(true)
                })
                .catch(err => {
                    reject(err)
                })
        }

    })

    /*restForm()
        .post("admin/form/save", formData)
        .then(res => {
            if (res.data.success) {
                //this.props.history.push("/")
                setTimeout(() => {
                    this.setState({
                        success: false,
                    })
                }, 3500)
            }

            this.setState({
                success: true,
                disabled: false,
                loading: false
            })
        })
        .catch(err => {
            console.log(err)
        })*/
}

export const deleteForm = (id) => dispatch => {

    return new Promise((resolve, reject) => {
        db.table("forms")
            .where({ id: parseInt(id) })
            .delete()
            .then((deleteCount) => {
                dispatch({
                    type: DELETE_FORM
                })

                resolve(true)
            })
            .catch(err => {
                reject(err)
            })

        /*rest()
            .get("admin/form/delete/" + id)
            .then(res => {
                dispatch({
                    type: DELETE_FORM,
                })

                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })*/
    })
}

export const clearForm = () => dispatch => {
    dispatch({
        type: CLEAR_FORM,
    })
}