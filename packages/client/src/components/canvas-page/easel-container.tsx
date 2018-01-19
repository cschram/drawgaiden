import * as React from 'react';
import { User } from '@drawgaiden/common';
import Button from '../button';
import Icon from '../icon';
import Loading from '../loading';
import ColorPicker from '../color-picker';
import Modal from '../modal';
import { default as RadioButton, RadioOption } from '../radio-button';
import Select from '../select';
import Slider from '../slider';

interface EaselContainerProps {
    innerRef: (el: HTMLElement) => void;
    hideControls: boolean;
    toggleControls: () => void;
    tools: RadioOption[];
    currentTool: string;
    onChangeTool: (tool: string) => void;
    currentLayer: number;
    numLayers: number;
    onChangeLayer: (layer: number) => void;
    onShare: () => void;
    onSave: () => void;
    onExit: () => void;
    strokeColor: string;
    onChangeStrokeColor: (color: string) => void;
    fillColor: string;
    onChangeFillColor: (color: string) => void;
    toolSize: number;
    onChangeToolSize: (size: number) => void;
    toolOpacity: number;
    onChangeToolOpacity: (opacity: number) => void;
    toolSmoothness: number;
    onChangeToolSmoothness: (smoothness: number) => void;
    users: User[];
}

export default function EaselContainer({
    innerRef,
    hideControls,
    toggleControls,
    tools,
    currentTool,
    onChangeTool,
    currentLayer,
    onChangeLayer,
    numLayers,
    onShare,
    onSave,
    onExit,
    strokeColor,
    onChangeStrokeColor,
    fillColor,
    onChangeFillColor,
    toolSize,
    onChangeToolSize,
    toolOpacity,
    onChangeToolOpacity,
    toolSmoothness,
    onChangeToolSmoothness,
    users
}: EaselContainerProps) {
    const layerOptions = [];
    for (let i = 0; i < numLayers; i++) {
        layerOptions.push({
            value: i.toString(),
            label: `Layer ${i + 1}`
        });
    }
    const _onChangeLayer = (value: string) => {
        onChangeLayer(parseInt(value, 10));
    };
    return (
        <div className="canvas-page__easel-container">
            <div className="canvas-page__easel" ref={innerRef}>
                <div className="canvas-page__overlay">
                    {users.map(user => {
                        const style = {
                            left: user.mousePosition.x,
                            top: user.mousePosition.y
                        };
                        return <span key={`user-mouse-${user.username}`}
                                     className="canvas-page__user"
                                     style={style}>{user.username}</span>
                    })}
                </div>
            </div>
            <div className="canvas-page__controls">
                <Button transparent={hideControls}
                        className="canvas-page__control-toggle"
                        onClick={toggleControls}>
                    <Icon name={hideControls ? 'eye-slash' : 'eye'} />
                </Button>
                {hideControls ? null :
                    <span>
                        <RadioButton name="tools"
                                     value={currentTool}
                                     options={tools}
                                     className="canvas-page__control"
                                     onChange={onChangeTool} />
                        <Select value={currentLayer.toString()}
                                options={layerOptions}
                                className="canvas-page__control"
                                onChange={_onChangeLayer} />
                        <Button className="canvas-page__control" onClick={onShare}>
                            <Icon name="share-alt" />
                            <span>Share</span>
                        </Button>
                        <Button className="canvas-page__control" onClick={onSave}>
                            <Icon name="floppy-o" />
                            <span>Save</span>
                        </Button>
                        <Button className="canvas-page__control" onClick={onExit}>
                            <Icon name="times" />
                            <span>Exit</span>
                        </Button>
                    </span>
                }
            </div>
            {hideControls ? null :
                <div className="canvas-page__settings">
                    <div className="canvas-page__tool-setting canvas-page__colors">
                        <ColorPicker color={strokeColor}
                                     onChange={onChangeStrokeColor} />
                        <ColorPicker color={fillColor}
                                     onChange={onChangeFillColor} />
                    </div>
                    <div className="canvas-page__tool-setting">
                        <label>Size</label>
                        <Slider name="size"
                                value={toolSize}
                                min={1}
                                max={50}
                                onChange={onChangeToolSize} />
                    </div>
                    <div className="canvas-page__tool-setting">
                        <label>Opacity</label>
                        <Slider name="opacity"
                                value={toolOpacity}
                                min={0}
                                max={100}
                                onChange={onChangeToolOpacity} />
                    </div>
                    <div className="canvas-page__tool-setting">
                        <label>Smoothness</label>
                        <Slider name="smoothness"
                                value={toolSmoothness}
                                min={0}
                                max={100}
                                onChange={onChangeToolSmoothness} />
                    </div>
                </div>
            }
        </div>
    );
}