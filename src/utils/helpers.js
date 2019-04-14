import _ from 'lodash';
import rest from '../utils/rest'

export const urlExists = (url) => {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

export const validateRequired = (data, filterData) => {
    let output = {}
    filterData.map(key => {
        if (_.has(data, key) && (data[key] === '' || data[key] === null || data[key] === undefined)) {
            output[key] = backwardsLang(key)
        }
    })

    return output;
}

export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const inputNumberOnly = (evt) => {
    let theEvent = evt;
    let key
    // Handle paste
    if (theEvent.type === 'paste') {
        key = window.event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

export const encapsulateErrors = (data) => {
    let errors = []
    if (_.has(data, 'validated')) {
        if (_.has(data, 'messages') && typeof data.messages === 'object') {
            return _.mapValues(data.messages, (item) => {
                return _.join(item, "\n")
            })
        } else if (_.has(data, 'messages') && typeof data.messages === 'string') {
            return data.messages
        }

        return errors;
    }

    return data
}

export const findStatusText = data => status => {
    return _.findKey(data, status) ? true : false;
}

export const encodeUri = uri => {
    const str = uri.replace(" ", '%20')
    return encodeURIComponent(str)
}

export const cacheStore = () => {
    return localStorage
}

export const backwardsLang = (key) => {
    return key.capitalize().replace("_", " ")
}

/**
   * Creates a string that can be used for dynamic id attributes
   * Example: "id-so7567s1pcpojemi"
   * @returns {string}
   */
export const uniqueId = () => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

/**
   * Creates a string that can be used for dynamic id attributes
   * Example: "id-so7567s1pcpojemi"
   * @returns {string}
   */
export const sectionID = () => {
    return 'secId-' + Math.random().toString(30).substr(5, 20);
}