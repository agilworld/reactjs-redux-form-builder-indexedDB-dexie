import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { fetchForms, clearForm } from '../actions/form'
import rest, { restForm } from '../utils/rest'
import store from '../store'
import _ from 'lodash'
import Card from '../components/layout/Card'
import { uniqueId } from '../utils/helpers'
import { Text, Textarea } from '../components/fields'
import { MdDelete, MdCheckBoxOutlineBlank, MdCreate, MdCheckBox, MdAddCircle, MdDone } from 'react-icons/md'
import { CARD_NEW, CARD_REMOVED, CARD_REMOVING, CARD_REQUIRED } from '../actions/types';


class ListForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: '',
            desc: '',
            edit: null,
            delete: null,
            disabled: false,
            loading: false,
            base: '',
            forms: []
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        this.props.fetchForms()
            .then(res => {
                this.setState({
                    loading: false,
                    base: res.base_url
                })
            })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    gotoEdit(id, e) {
        e.preventDefault()
        this.props.history.push("/edit/" + id)
    }

    render() {
        const forms = this.props.forms
        return (
            <div className="row justify-content-md-center text-center">
                <div className="col-sm-8">
                    <h2 className="mt-4">Form Builder</h2>
                    <div className="card">
                        <div className="card-body">
                            <div className="form-group" style={{ marginBottom: "0px" }}>

                                <div className="text-left">
                                    <button type="button" style={{ display: "inline-flex", flexDirection: "row" }} className="btn btn-success" onClick={() => {
                                        this.props.clearForm()
                                        this.props.history.push("/new")
                                    }}>
                                        <MdAddCircle size="1.5em" /> Add New Form
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover text-left">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Code</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {!_.isEmpty(forms.list) &&
                                        <tbody>
                                            {forms.list.map((row, ind) => (
                                                <tr key={ind}>
                                                    <td>
                                                        <strong> {row.title}</strong>
                                                    </td>
                                                    <td>
                                                        <code>{row.code}</code>
                                                    </td>
                                                    <td>
                                                        {row.description.substr(0, 25)}{row.description.length > 25 ? '...' : ''}
                                                    </td>
                                                    <td>
                                                        <a className="btn btn-outline-primary" onClick={this.gotoEdit.bind(this, row.id)}>
                                                            <MdCreate size="1.5em" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>}

                                    {_.isEmpty(forms.list) && <tbody>
                                        <tr>
                                            <td colSpan="4">
                                                {this.state.loading ? 'Fetching data...' : 'No data'}
                                            </td>
                                        </tr>
                                    </tbody>}
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        )
    }
}

ListForm.propTypes = {
    forms: PropTypes.object,
    fetchForms: PropTypes.func
}

const mapStateToProps = state => ({
    forms: state.forms
})

export default connect(mapStateToProps, { fetchForms, clearForm })(ListForm)

