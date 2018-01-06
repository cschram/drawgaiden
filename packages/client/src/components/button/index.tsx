import * as React from 'react';
import './style.scss';

interface ButtonProps {
    onClick: () => void;
    primary?: boolean;
    transparent?: boolean;
    disabled?: boolean;
    className?: string;
    children?: JSX.Element | JSX.Element[] | string;
}

class Button extends React.Component<ButtonProps> {
    onClick = (e) => {
        e.preventDefault();
        this.props.onClick();
    };

    render() {
        let {
            primary = false,
            transparent = false,
            disabled = false,
            className,
            children
        } = this.props;
        if (className) {
            className = `${className} btn`;
        } else {
            className = 'btn';
        }
        if (primary) {
            className = `${className} btn--primary`;
        }
        if (transparent) {
            className = `${className} btn--transparent`;
        }
        if (disabled) {
            className = `${className} btn--disabled`;
        }
        return  <button className={className}
                        disabled={disabled}
                        onClick={this.onClick}>{children}</button>;
    }
}

export default Button;