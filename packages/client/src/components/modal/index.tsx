import * as React from 'react';
import Icon from '../icon';
import './style.scss';

interface ModalProps {
    title: string;
    open: boolean;
    onClose: () => void;
    children: JSX.Element | JSX.Element[];
    width?: number;
    height?: number;
}

class Modal extends React.Component<ModalProps> {
    onClose = (e) => {
        e.preventDefault();
        this.props.onClose();
    };

    render() {
        const {
            title,
            open,
            children,
            width = 500,
            height = 250
        } = this.props;
        const dialogStyle = {
            width: `${width}px`,
            height: `${height}px`,
            left: `calc(50% - ${width / 2}px)`,
            top: `calc(50% - ${height / 2}px)`
        };
        return (
            <div className={open ? 'modal modal--open' : 'modal'}>
                <div className="modal__dialog" style={dialogStyle}>
                    <div className="modal__title">
                        <a href="#" className="modal__close" onClick={this.onClose}>
                            <Icon name="times" />
                        </a>
                        <span>{title}</span>
                    </div>
                    <div className="modal__content">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;