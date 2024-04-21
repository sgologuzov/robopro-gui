import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'robopro-vm';
import {connect} from 'react-redux';
import {getEventXY} from '../lib/touch-utils';
import ObjectMonitorComponent from '../components/monitor/object-monitor.jsx';
import {Map} from 'immutable';

class ObjectMonitor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleResizeMouseDown'
        ]);

        this.state = {
            width: props.width || 100,
            height: props.height || 200
        };
    }

    handleResizeMouseDown (e) {
        this.initialPosition = getEventXY(e);
        this.initialWidth = this.state.width;
        this.initialHeight = this.state.height;

        const onMouseMove = ev => {
            const newPosition = getEventXY(ev);
            const dx = newPosition.x - this.initialPosition.x;
            const dy = newPosition.y - this.initialPosition.y;
            this.setState({
                width: Math.max(Math.min(this.initialWidth + dx, 480), 100),
                height: Math.max(Math.min(this.initialHeight + dy, 360), 60)
            });
        };

        const onMouseUp = ev => {
            onMouseMove(ev); // Make sure width/height are up-to-date
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            this.props.vm.runtime.requestUpdateMonitor(Map({
                id: this.props.id,
                height: this.state.height,
                width: this.state.width
            }));
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

    }

    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <ObjectMonitorComponent
                {...props}
                activeIndex={this.state.activeIndex}
                activeValue={this.state.activeValue}
                height={this.state.height}
                width={this.state.width}
                onActivate={this.handleActivate}
                onAdd={this.handleAdd}
                onDeactivate={this.handleDeactivate}
                onFocus={this.handleFocus}
                onInput={this.handleInput}
                onKeyPress={this.handleKeyPress}
                onRemove={this.handleRemove}
                onResizeMouseDown={this.handleResizeMouseDown}
            />
        );
    }
}

ObjectMonitor.propTypes = {
    height: PropTypes.number,
    id: PropTypes.string,
    targetId: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.number),
        PropTypes.objectOf(PropTypes.string)
    ]),
    vm: PropTypes.instanceOf(VM),
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
};

const mapStateToProps = state => ({vm: state.scratchGui.vm});

export default connect(mapStateToProps)(ObjectMonitor);
