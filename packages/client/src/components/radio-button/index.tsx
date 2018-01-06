import * as React from 'react';
import './style.scss';

type SelectLabel = string | JSX.Element;

export interface RadioOption {
    value: string;
    label: SelectLabel;
}

interface RadioButtonProps {
    name: string;
    value: string;
    options: RadioOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

class RadioButton extends React.Component<RadioButtonProps> {
    onChange = (e) => {
        e.preventDefault();
        if (!this.props.disabled) {
            this.props.onChange(e.target.value);
        }
    };

    render() {
        let {
            name,
            value,
            options,
            disabled = false,
            className = ''
        } = this.props;
        className = `radio-button ${className}`;
        if (disabled) {
            className = `${className} radio-button--disabled`;
        }
        
        return (
            <ul className={className}>
                {options.map((option, i) => {
                    const id = `${name}_${i}`;
                    const checked = option.value === value;
                    let className = 'radio-button__option';
                    if (checked) {
                        className = `${className} radio-button__option--checked`;
                    }
                    return (
                        <li key={id} className={className}>
                            <input type="radio"
                                   name={name}
                                   id={id}
                                   value={option.value}
                                   checked={checked}
                                   onChange={this.onChange} />
                            <label htmlFor={id}>{option.label}</label>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default RadioButton;