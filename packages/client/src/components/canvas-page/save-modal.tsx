import * as React from 'react';
import Icon from '../icon';

interface SaveModalProps {
    onClose: () => void;
    imageData: string;
}

const SaveModal = ({ onClose, imageData }: SaveModalProps) => (
    <div className="modal">
        <div className="modal__content save-modal">
            <a href="#" className="modal__close" onClick={onClose}>
                <Icon name="times" />
            </a>
            <span>Right click and press "Save Image As" to save.</span>
            <div className="save-modal__scroll-content">
                <img src={imageData} />
            </div>
        </div>
    </div>
);

export default SaveModal;