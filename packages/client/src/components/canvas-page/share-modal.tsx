import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from '../icon';

interface ShareModalProps {
    onClose: () => void;
}

class ShareModal extends React.Component<ShareModalProps> {
    private onClick = () => {
        const input = ReactDOM.findDOMNode(this.refs['share-link']) as HTMLInputElement;
        input.setSelectionRange(0, input.value.length);
    };

    render() {
        return (
            <div className="modal">
                <div className="modal__content share-modal">
                    <a href="#" className="modal__close" onClick={this.props.onClose}>
                        <Icon name="times" />
                    </a>
                    <span>Share this link with your friends to draw with them.</span>
                    <input ref="share-link"
                        type="text"
                        name="share-link"
                        defaultValue={location.href}
                        onClick={this.onClick} />
                </div>
            </div>
        );
    }
}

export default ShareModal;