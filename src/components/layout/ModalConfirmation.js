import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { modalClose, modalButtonLoading, modalButtonFinish } from '../../actions/modal'

class ModalConfirmation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: this.props.show,
            oldClassName: document.body.className,
        };
    }
    static propTypes = {
        id: PropTypes.string,
        title: PropTypes.string.isRequired,
        okButton: PropTypes.string,
        loadingButton: PropTypes.string,
        cancelButton: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func,
        onClose: PropTypes.func,
        children: PropTypes.element.isRequired,
        stateId: PropTypes.string.isRequired
    };

    static defaultProps = {
        id: "modalConfirmation",
        loadingButton: "Loading...",
        okButton: 'Save Changes',
        cancelButton: 'Close',
        className: '',
        stateId: ''
    }

    onClick(e) {
        if (this.props.onClick) {
            this.props.modalButtonLoading();
            document.body.classList.remove("modal-open");
            this.props.onClick(e)
        }
    }

    onClose(e) {
        if (this.props.modal.loading) {
            e.preventDefault()
            return
        }

        document.body.classList.remove("modal-open");

        this.props.modalClose()
        this.props.onClose()
    }

    render() {

        if (!this.props.stateId) {
            return null;
        }

        if (this.props.children) {
            document.body.classList.remove("modal-open");
            const oldClassName = document.body.className + " " + "modal-open";
            document.body.className = oldClassName

            return (
                <React.Fragment>
                    <div className="modal-backdrop fade show"></div>
                    <div className={classnames('modal fade show ' + this.props.className)} id={this.props.id} role="dialog" aria-labelledby={this.props.id + 'Title'} style={{ 'display': "block" }} aria-hidden="true">
                        <div className="modal-dialog modal-sm" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">{this.props.title}</h5>
                                    <button type="button" className="close" disabled={this.props.modal.loading ? true : false} onClick={this.onClose.bind(this)} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {React.Children.only(this.props.children)}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" disabled={this.props.modal.loading ? true : false} className="btn btn-secondary" onClick={this.onClose.bind(this)}>{this.props.cancelButton}</button>
                                    <button type="button" disabled={this.props.modal.loading ? true : false} className="btn btn-primary" onClick={this.onClick.bind(this)}>{this.props.modal.loading ? this.props.loadingButton : this.props.okButton}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }

        return null;
    }
}

const mapStatetoProps = state => ({
    modal: state.modal,
});

export default connect(mapStatetoProps, {
    modalClose,
    modalButtonFinish,
    modalButtonLoading
})(ModalConfirmation);