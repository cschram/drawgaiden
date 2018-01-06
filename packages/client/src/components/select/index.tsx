import * as React from 'react';
import Icon from '../icon';
import './style.scss';

type SelectLabel = string | JSX.Element;

interface SelectOption {
    value: string;
    label: SelectLabel;
}

interface SelectProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

interface SelectState {
    open: boolean;
}

class Select extends React.Component<SelectProps, SelectState> {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    onClick = (e) => {
        if (!this.props.disabled) {
            this.setState({ open: !this.state.open });
        }
    };

    onSelect = (e) => {
        e.preventDefault();
        if (!this.props.disabled) {
            const value = e.target.getAttribute('data-value');
            this.setState({ open: false });
            this.props.onChange(value);
        }
    };

    render() {
        let {
            value,
            options,
            disabled = false,
            className = ''
        } = this.props;
        const activeOption = options.find(option => option.value === value);
        className = `select ${className}`;
        if (disabled) {
            className = `${className} select--disabled`;
        }
        if (this.state.open) {
            className = `${className} select--open`;
        }
        
        return (
            <div className={className} onClick={this.onClick}>
                <span className="select__label">{activeOption.label}</span>
                <span className="select__arrow">
                    <Icon name={this.state.open ? 'caret-up' : 'caret-down'} />
                </span>
                <ul className="select__menu">
                    {options.map((option, i) => {
                        let className = 'select__menu-option';
                        if (option.value === value) {
                            className = `${className} select__menu-option--active`;
                        }
                        return (
                            <li key={i}
                                className={className}
                                data-value={option.value}
                                onClick={this.onSelect}>
                                    {option.label}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default Select;