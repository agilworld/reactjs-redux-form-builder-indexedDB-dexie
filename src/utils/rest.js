import axios from 'axios'
import { cacheStore } from './helpers';

const getApiUrl = () => {
    return process.env.REACT_APP_API_URL
}

const rest = () => {
    let prepare = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    }

    return axios.create({
        baseURL: getApiUrl(),
        // `headers` are custom headers to be sent
        headers: prepare
    })
}

export const restForm = (bodyFormData) => {

    return axios.create({
        baseURL: getApiUrl(),
        // `headers` are custom headers to be sent
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data',
        }
    })
}

export default rest;