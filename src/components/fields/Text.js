import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Text = ({
    name,
    placeholder,
    value,
    label,
    size,
    error,
    info,
    type,
    col,
    style,
    id,
    onChange,
    onBlur,
    disabled
}) => {
    return (
        <React.Fragment>
            <input
                type={type}
                id={id}
                className={classnames('form-control', {
                    'is-invalid': error,
                    'form-control-lg': size === 'lg',
                    'form-control-sm': size === 'sm'
                })}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                style={style}
                disabled={disabled}
            />
            {info && <small className="form-text text-muted" dangerouslySetInnerHTML={{ __html: info }}></small>}
            {error && <div className="invalid-feedback">{error}</div>}
        </React.Fragment>
    );
};

Text.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

Text.defaultProps = {
    placeholder: 'Short Text here',
    type: 'text',
    size: 'md',
    col: {
        xs: 12
    }
};

export default Text;