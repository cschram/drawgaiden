import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Input from '../input';

class ShareModal extends React.Component {
    shareLink: HTMLInputElement;

    private onClick = () => {
        this.shareLink.setSelectionRange(0, this.shareLink.value.length);
    };

    render() {
        return (
            <div className="share-modal">
                <span>Share this link with your friends to draw with them.</span>
                <Input innerRef={el => this.shareLink = el}
                       name="share-link"
                       value={location.href}
                       onChange={() => {}}
                       onClick={this.onClick} />
            </div>
        );
    }
}

export default ShareModal;