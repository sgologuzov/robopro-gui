import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'robopro-vm';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import MapMonitorComponent from '../components/monitor/map-monitor.jsx';

class MapMonitor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, []);

        this.state = {
            width: props.width || 100,
            height: props.height || 200
        };
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <MapMonitorComponent
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

MapMonitor.propTypes = {
    height: PropTypes.number,
    id: PropTypes.string,
    targetId: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    vm: PropTypes.instanceOf(VM),
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
};

const mapStateToProps = state => ({vm: state.scratchGui.vm});

export default connect(mapStateToProps)(MapMonitor);
