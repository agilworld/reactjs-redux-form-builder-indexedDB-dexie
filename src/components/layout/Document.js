import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Document extends Component {
    constructor() {
        super();
        this.state = {
            oldTitle: document.title,
            oldClassName: document.body.className,
        };
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired,
    }

    componentWillMount = () => {
        if (this.props.title) {
            document.title = this.props.title;
        }
        if (this.props.className) {
            const className = `${this.props.className}`;
            document.body.className = className.trim().replace('  ', ' ');
        }
    }

    componentWillUnmount = () => {
        document.title = this.state.oldTitle;
        document.body.className = this.state.oldClassName;
    }

    render() {
        if (this.props.children) {
            return React.Children.only(this.props.children);
        }

        return null;
    }
}

export default Document;