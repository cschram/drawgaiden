import * as React from 'react';
import './style.scss';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    className?: string;
}

export default class ColorPicker extends React.Component<ColorPickerProps> {
    input: HTMLInputElement;

    onClick = (e) => {
        if (e.target !== this.input) {
            this.input.click();
        }
    };

    onChange = (e) => {
        e.preventDefault();
        this.props.onChange(this.input.value);
    };

    render() {
        let className = 'color-picker';
        if (this.props.className) {
            className = `${className} ${this.props.className}`;
        }
        const style = {
            backgroundColor: this.props.color
        };
        return (
            <div className={className} style={style} onClick={this.onClick}>
                <input type="color"
                       ref={el => this.input = el}
                       value={this.props.color}
                       onChange={this.onChange} />
            </div>
        );
    }
}