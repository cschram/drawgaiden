import * as React from 'react';
import './style.scss';

interface InputProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    innerRef?: (el: HTMLInputElement) => void;
    onClick?: () => void;
}

class Input extends React.Component<InputProps> {
    private onChange = (e) => {
        e.preventDefault();
        if (!this.props.disabled) {
            this.props.onChange(e.target.value);
        }
    };

    render() {
        let {
            name,
            value,
            disabled = false,
            placeholder = '',
            className = '',
            innerRef = () => {},
            onClick = () => {}
        } = this.props;
        className = `input ${className}`;
        if (disabled) {
            className = `${className} input--disabled`;
        }
        return <input className={className}
                      ref={innerRef}
                      type="text"
                      name={name}
                      value={value}
                      disabled={disabled}
                      placeholder={placeholder}
                      onChange={this.onChange}
                      onClick={onClick} />;
    }
}

export default Input;