import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import FieldText from '../fields/Text'
import _ from 'lodash'
import {
    CHANGE_QUESTION,
    CHANGE_PLACEHOLDER,
    CHANGE_TYPE,
    ADD_OPTION,
    CHANGE_OPTION,
    REMOVE_OPTION
} from '../../actions/types'
import store from '../../store'
import { MdCheckBoxOutlineBlank, MdRadioButtonUnchecked, MdExpandMore, MdDelete } from 'react-icons/md'

class Card extends Component {
    constructor(props) {
        super(props)
        const initData = this.props.data
        this.state = {
            fieldType: initData.type,
            value: initData.placeholder,
            question: initData.title,
            options: initData.options
        }

        this.onTitleUpdate = this.onTitleUpdate.bind(this)
        this.onFieldsUpdate = this.onFieldsUpdate.bind(this)
        this.onPlaceholderUpdate = this.onPlaceholderUpdate.bind(this)

        // Options
        this.onUpdateOptions = this.onUpdateOptions.bind(this)
        this.addOption = this.addOption.bind(this)
    }
    onTitleUpdate(e) {
        let data = this.props.data

        data.title = e.target.value

        store.dispatch({
            type: CHANGE_QUESTION,
            payload: data,
            id: this.props.id
        })
    }

    onPlaceholderUpdate(e) {
        let data = this.props.data

        data.placeholder = e.target.value

        store.dispatch({
            type: CHANGE_PLACEHOLDER,
            payload: data,
            id: this.props.id
        })

    }

    onFieldsUpdate(e) {
        if (e.target.value == '') {
            return
        }

        let data = this.props.data

        data.type = e.target.value

        store.dispatch({
            type: CHANGE_TYPE,
            payload: data,
            id: this.props.id
        })

        this.setState({ fieldType: e.target.value })
    }

    addOption(e) {
        e.preventDefault()

        this.setState({ options: [...this.state.options, ""] })

        let data = this.props.data

        data.options.push("")

        store.dispatch({
            type: ADD_OPTION,
            payload: data,
            id: this.props.id
        })
    }

    onUpdateOptions(id, e) {
        if (e.target.value == '') {
            return
        }

        let data = this.props.data
        const resData = _.fill(this.state.options, e.target.value, id, id)

        data.options = resData

        store.dispatch({
            type: CHANGE_OPTION,
            payload: data,
            id: this.props.id
        })
    }

    removeOption(ind, e) {
        e.preventDefault()
        let data = this.props.data

        data.options.splice(ind, 1)

        store.dispatch({
            type: REMOVE_OPTION,
            payload: data,
            id: this.props.id
        })
    }

    render() {
        const type = this.state.fieldType
        const id = this.props.id
        const value = this.state.value


        return (
            <div id={id} className="panel" style={{ padding: 0 }}>
                <div className="panel-body" style={{ padding: 0 }}>

                    <div className="row">
                        <div className="col-8">
                            <input type="text"
                                onChange={(e) => { this.setState({ question: e.target.value }) }}
                                onBlur={this.onTitleUpdate}
                                placeholder="Question"
                                value={this.state.question}
                                style={{ fontSize: "17px" }}
                                className="form-control" name="title" id={id + "_question"} />
                        </div>
                        <div className="col-4">
                            <select name="fields" className="form-control" id="fields"
                                onChange={this.onFieldsUpdate}
                                style={{ fontSize: "17px" }}
                                value={this.state.fieldType}
                            >
                                <option value="text">Text</option>
                                <option value="textarea">Paragaph</option>
                                <option value="radio">Multiple Choice</option>
                                <option value="checkbox">Checkboxes</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="image_upload">Image Upload</option>
                                <option value="date">Date</option>
                                <option value="time">Time</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            {(
                                this.props.data.type == 'text' ||
                                this.props.data.type == 'textarea' ||
                                this.props.data.type == 'image_upload'
                            ) &&
                                <input type="text" placeholder={this.props.data.type == 'image_upload' ? "Enter description" : "Enter placeholder"} name={id + "_placeholder"} className="form-control"
                                    value={this.state.value}
                                    onChange={(e) => { this.setState({ value: e.target.value }) }}
                                    onBlur={this.onPlaceholderUpdate}
                                    id={id + "_placeholder"} />}

                            {(this.props.data.type == 'radio' || this.props.data.type == 'checkbox' || this.props.data.type == 'dropdown') && (
                                <div className="row">
                                    <div className="text-left col-4">
                                        {!_.isEmpty(this.state.options) && this.state.options.map((val, index) => (
                                            <div key={index} className="row">
                                                <div className="col-1" style={{ lineHeight: "50px" }}>

                                                    <a href="#" style={{ color: "#999" }} onClick={this.removeOption.bind(this, index)}>
                                                        <MdDelete size="1.2em" />
                                                    </a>
                                                </div>
                                                <div className="col-10">
                                                    <FieldText type="text" placeholder="Enter Option"
                                                        name={id + "_placeholder"}
                                                        style={{ marginBottom: "5px" }}
                                                        value={val}
                                                        onBlur={this.onUpdateOptions.bind(this, index)}
                                                        onChange={(e) => {
                                                            this.state.options[index] = e.target.value
                                                            this.forceUpdate()
                                                        }}
                                                        style={{ marginBottom: "10px" }}
                                                        id={id + "_placeholder"} />
                                                </div>
                                            </div>
                                        ))}
                                        <a href="#"
                                            style={{ display: "block", marginTop: "10px", paddingBottom: "20px" }}
                                            onClick={this.addOption}>Add option</a>

                                        <div className="clear"></div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Card.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
}

export default Card

