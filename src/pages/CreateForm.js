import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import rest, { restForm } from '../utils/rest'
import { fetchForm, saveForm, deleteForm } from '../actions/form'
import { modalOpen, modalClose, modalButtonFinish } from '../actions/modal'
import store from '../store'
import _ from 'lodash'
import Card from '../components/layout/Card'
import { uniqueId, sectionID } from '../utils/helpers'
import { Text, Textarea } from '../components/fields'
import Modal from '../components/layout/ModalConfirmation'
import {
    MdDelete,
    MdCheckBoxOutlineBlank,
    MdCreate,
    MdCheckBox,
    MdAddCircleOutline,
    MdDone, MdWarning,
    MdAdd,
    IoIosAddCircleOutline,
} from 'react-icons/md'
import { CARD_NEW, CARD_REMOVED, CARD_REMOVING, CARD_REQUIRED, DELETE_FORM, CHANGE_SECTION } from '../actions/types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class CreateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            desc: '',
            edit: null,
            delete: null,
            loading: false,
            disabled: false,
            modal: false,
            success: false,
            init: false,
            section: null,
            editName: "",
            sectionId: null,
            sectionName: '',
            forms: []
        }

        this.addCard = this.addCard.bind(this)
        this.addSection = this.addSection.bind(this)
        this.onChange = this.onChange.bind(this)
        this.saveForm = this.saveForm.bind(this)
        this.removeForm = this.removeForm.bind(this)
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState({ init: true })
            this.props.fetchForm(this.props.match.params.id)
                .then(res => {
                    this.setState({
                        title: res.title,
                        desc: res.description,
                        init: false
                    })
                })
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    editSection(id, name, e) {
        this.setState({
            sectionName: id,
            editName: name
        })
    }

    onKeypress(id, sectionId, e) {
        if (e.key == 'Enter') {
            this.setState({
                sectionName: '',
                editName: '',
                section: {
                    id: sectionId,
                    name: this.state.editName
                }
            })

            store.dispatch({
                type: CHANGE_SECTION,
                id: id,
                payload: {
                    name: this.state.editName,
                    id: sectionId
                }
            })
        }
    }

    async saveForm(e) {
        const form = this.props.forms

        if (this.state.title == '' || this.state.desc == '') {
            return
        }

        if (_.isEmpty(form.create)) {
            return
        }

        this.setState({
            disabled: true,
            loading: true,
            edit: null
        })

        const entries = _.keyBy(form.create, 'sectionId')

        let sections = []
        Object.entries(entries).map((wiz, idx) => {
            sections.push({
                name: wiz[1].section.name,
                id: wiz[1].section.id
            })
        })

        const json = {
            fields: form.create,
            sections: sections
        }

        const data = {
            title: this.state.title,
            description: this.state.desc,
            data: json,
        }

        this.props.saveForm(data, this.props.match.params.id)
            .then(res => {
                if (res) {
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
            })
    }

    addCard(e) {
        e.preventDefault()
        this.newCard()
    }

    async addSection(e) {
        e.preventDefault()

        await this.setState({
            sectionId: null
        })

        await this.newCard()
    }

    async newField(sectionId, sectionName, e) {
        e.preventDefault()

        const id = uniqueId();
        let list = this.props.forms.create;
        let data = {
            id: id,
            title: '',
            type: "text",
            placeholder: '',
            options: [],
            required: false,
        }

        data.sectionId = sectionId
        data.section = {
            id: sectionId,
            name: sectionName
        }

        store.dispatch({
            type: CARD_NEW,
            payload: data,
            id: id
        })

        this.setState({
            edit: id
        })
    }

    newCard() {
        const id = uniqueId();
        let list = this.props.forms.create;
        let section, data = {
            id: id,
            title: '',
            type: "text",
            placeholder: '',
            options: [],
            required: false,
        }

        if (_.isEmpty(list) || _.isEmpty(this.state.sectionId)) {
            const sectionId = sectionID()
            this.setState({
                sectionId: sectionId,
                section: {
                    id: sectionId,
                    name: "New section"
                }
            })

            data.sectionId = sectionId
            data.section = {
                id: sectionId,
                name: "New section"
            }

        } else {
            data.sectionId = this.state.section.id
            data.section = this.state.section
        }

        store.dispatch({
            type: CARD_NEW,
            payload: data,
            id: id
        })

        this.setState({
            edit: id
        })
    }

    removeCard(id, e) {
        let list = this.props.forms.create;

        _.unset(list, id)
        console.log(list)
        /*
        const deleting = new Promise((resolve, reject) => {
            store.dispatch({
                type: CARD_REMOVING,
                payload: list,
                id: id
            })
            resolve(true)
        })*/

        store.dispatch({
            type: CARD_REMOVING,
            payload: list,
            id: id
        })

        this.setState({
            edit: null,
            sectionId: null,
            section: null,
            sectionName: ''
        })

        /*deleting.then(res => {
            store.dispatch({
                type: CARD_REMOVED,
            })
            this.setState({
                edit: null,
                sectionId: null,
                section: null,
                sectionName: ''
            })
        })*/
    }

    editCard(id, e) {
        if (this.state.edit == id) {
            this.setState({
                edit: null
            })
        } else {
            this.setState({
                edit: id
            })
        }
    }

    toggleRequired(id, e) {
        let list = this.props.forms.create;

        const required = !list[id].required
        store.dispatch({
            type: CARD_REQUIRED,
            payload: id,
            required: required
        })
    }

    modalOpen(e) {
        this.setState({
            modal: true
        })
    }

    modalClose(e) {
        this.setState({
            modal: false
        })
    }

    removeForm(e) {
        this.props.deleteForm(this.props.match.params.id)
            .then(res => {
                this.props.modalButtonFinish()
                document.body.classList.remove("modal-open");
                this.props.history.push("/")
            })
            .catch(err => {
                alert("Something went wrong!")
                this.setState({
                    modal: false
                })

            })
            .then(() => {
                this.props.modalButtonFinish()
            })
    }

    render() {
        const forms = this.props.forms
        const removingId = this.props.forms.deleting
        let cards = []
        let sections = _.keyBy(forms.create, 'sectionId')
        console.log(forms.create)
        Object.entries(sections).map((wiz, idx) => {
            cards.push(
                <div className="section" key={wiz[1].sectionId}>
                    <div className="section-top">
                        <div className="section-panel" style={{ textAlign: "left" }}
                            onBlur={this.onKeypress.bind(this, wiz[1].id, wiz[1].sectionId)}
                            onKeyDown={this.onKeypress.bind(this, wiz[1].id, wiz[1].sectionId)}
                            onClick={this.editSection.bind(this, wiz[0], wiz[1].section.name)}>
                            {this.state.sectionName !== wiz[0] ? wiz[1].section.name : ''}
                            {this.state.sectionName == wiz[0] && <Text className="input-lg" type="text"
                                style={{ fontSize: "20px", height: "34px", marginBottom: "0px" }}
                                disabled={this.state.loading}
                                onChange={this.onChange}
                                value={this.state.editName}
                                name="editName" id="_section"
                                placeholder="Enter section name" />}
                        </div>
                        <button disabled={this.state.disabled || (this.state.init)} onClick={this.newField.bind(this, wiz[1].sectionId, wiz[1].section.name)} type="button" className="btn btn-primary new-field">
                            <MdAdd size="1.5em" />
                        </button>
                    </div>
                    <div style={{ display: "block", clear: "both" }}></div>
                    {Object.entries(_.filter(forms.create, { 'sectionId': wiz[1].sectionId }))
                        .map((val, id) => (
                            <div key={val[1].id} className={classnames('panel card')}>
                                <div className={classnames("text-right footer-card", {
                                    "bg-white": this.state.edit !== val[1].id
                                })}>
                                    <div className="row">
                                        <div className="text-left col-7">
                                            <h4>{val[1].title != '' ? val[1].title : <em style={{ color: "#999" }}>No Question</em>}</h4>
                                            <p>{val[1].type.toUpperCase().replace("_", " ")}</p>
                                        </div>
                                        <div className="col-5">
                                            <button onClick={this.toggleRequired.bind(this, val[1].id)} style={{ marginRight: "10px" }} type="button" className={classnames({
                                                'btn required': true,
                                                'btn-default': !val[1].required,
                                                'btn-dark': val[1].required
                                            })}>
                                                {!val[1].required && <React.Fragment><MdCheckBoxOutlineBlank size="1.5em" style={{ float: "left" }} /> <span style={{ float: "left", lineHeight: "25px" }} className="" >Required</span></React.Fragment>}

                                                {val[1].required && <React.Fragment><MdCheckBox size="1.5em" style={{ float: "left" }} /> <span style={{ float: "left", lineHeight: "25px" }} className=""> Required</span></React.Fragment>}
                                            </button>
                                            <button onClick={this.removeCard.bind(this, val[1].id)} type="button" className="btn btn-outline-danger delete_card" style={{ marginRight: "10px" }}>
                                                <MdDelete size="1.5em" />
                                            </button>
                                            <button onClick={this.editCard.bind(this, val[1].id)} type="button"
                                                className={classnames({
                                                    'btn delete-card': true,
                                                    'btn-outline-secondary': this.state.edit !== val[1].id,
                                                    'btn-success': this.state.edit == val[1].id
                                                })}>
                                                <MdCreate size="1.5em" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {this.state.edit == val[1].id && <div className="panel-body"><Card id={val[1].id} data={val[1]} delete={removingId != false} /> </div>}
                            </div>
                        )
                        )}
                </div>
            )
        })

        return (
            <div className="row justify-content-md-center text-center mb-5">
                <div className="col-sm-8">
                    {this.props.match.params.id && <h2 className="mt-4">Edit: {this.state.title}</h2>}
                    {!this.props.match.params.id && <h2 className="mt-4">Create A Form</h2>}
                    <div className="card">
                        <div className="card-body">
                            {this.state.success && <div class="alert alert-success text-left fade show" role="alert">
                                <strong>Well done! all fields is successfully saved!</strong>
                            </div>}

                            <div className="form-group">
                                <Text className="input-lg" type="text" style={{ fontSize: "20px" }}
                                    onChange={this.onChange}
                                    disabled={this.state.loading}
                                    value={this.state.title}
                                    name="title" id="_new_title"
                                    placeholder="Enter form title" />

                                <Textarea className="form-control input-lg" style={{ fontSize: "15px", height: "auto" }}
                                    onChange={this.onChange}
                                    value={this.state.desc}
                                    disabled={this.state.loading}
                                    name="desc"
                                    id="_new_desc"
                                    placeholder="Enter form description" />

                                <div className="row">
                                    <div className="col-4 text-left">
                                        <Link to="/" className="btn btn-outline-secondary">&larr; Back to List</Link>
                                    </div>

                                    <div className="col-8">
                                        <div className="text-right">
                                            <button type="button" disabled={this.state.disabled || (this.state.init && _.isEmpty(forms.create))} style={{ display: "inline-flex", flexDirection: "row" }} className="btn btn-success" onClick={this.saveForm}>
                                                <MdDone size="1.5em" /> {this.state.loading == true ? 'Loading...' : 'Save All'}
                                            </button>

                                            <div className="btn-group">
                                                <button disabled={this.state.disabled || (this.state.init && _.isEmpty(forms.create))} style={{ marginLeft: "10px", display: "inline-flex", flexDirection: "row" }} type="button" className="btn btn-primary"
                                                    onClick={this.addSection}>
                                                    <MdAdd size="1.5em" /> New Section
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {!_.isEmpty(forms.create) && _.findKey(forms.create, 'sectionId') && cards.map((cr) => cr)}

                    {!_.isEmpty(forms.create) && _.findKey(forms.create, 'sectionId') === undefined &&
                        <div className="card-body text-center">
                            <MdWarning color="red" size="3em" /> <br />
                            <h4>You must update this form by removing the form and starts it again</h4>
                        </div>
                    }

                    {this.state.init && _.isEmpty(forms.create) && <div className="panel">
                        <div className="card-body">
                            Fetching fields...
                        </div>
                    </div>}

                    {this.props.match.params.id && !_.isEmpty(forms.create) && <div className="text-center">
                        <button type="button" disabled={this.state.disabled} onClick={this.modalOpen.bind(this)} className="btn mt-4 btn-outline-dark btn-lg">
                            <MdDelete size="1.5em" />  Delete Permanently
                        </button>
                    </div>}

                    {this.state.modal && <Modal okButton="OK, Delete!" onClick={this.removeForm} onClose={this.modalClose.bind(this)} stateId="_remove_form" title="Delete Form">
                        <h4>Are you sure to want to delete permanently ? </h4>
                    </Modal>}
                </div>
            </div >

        )
    }
}

CreateForm.propTypes = {
    forms: PropTypes.object
}

const mapStateToProps = state => ({
    forms: state.forms
})

export default connect(mapStateToProps, {
    fetchForm,
    saveForm,
    deleteForm,
    modalClose,
    modalOpen,
    modalButtonFinish
})(CreateForm)

