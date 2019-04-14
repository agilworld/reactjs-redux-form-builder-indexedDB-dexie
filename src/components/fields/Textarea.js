import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Textarea = ({
    name,
    placeholder,
    value,
    label,
    size,
    error,
    info,
    type,
    col,
    id,
    style,
    onChange,
    onBlur,
    disabled
}) => {
    return (
        <div>
            <textarea
                id={id}
                className={classnames('mceNoEditor form-control', {
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
                rows="3"
            >
            </textarea>
            {info && <small className="form-text text-muted" dangerouslySetInnerHTML={{ __html: info }}></small>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

Textarea.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

Textarea.defaultProps = {
    placeholder: 'Short Text here',
    type: 'text',
    size: 'md',
    col: {
        xs: 12
    }
};

export default Textarea;