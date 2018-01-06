import * as React from 'react';
import './style.scss';

interface SliderProps {
    name: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    step?: number;
    disabled?: boolean;
    className?: string;
}

class Slider extends React.Component<SliderProps> {
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
            min,
            max,
            step = 1,
            disabled = false,
            className = ''
        } = this.props;
        className = `slider ${className}`;
        if (disabled) {
            className = `${className} slider--disabled`;
        }
        return <input type="range"
                      className={className}
                      name={name}
                      value={value}
                      min={min}
                      max={max}
                      step={step}
                      disabled={disabled}
                      onChange={this.onChange} />;
    }
}

export default Slider;