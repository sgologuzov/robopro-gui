import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import VM from 'robopro-vm';

import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';

import dropdownCaret from './dropdown-caret.svg';
import styles from './menu-bar.css';
import {
    openDeviceMenu,
    closeDeviceMenu,
    deviceMenuOpen
} from '../../reducers/menus';
import deviceIcon from './icon--device.svg';
import unconnectedIcon from './icon--unconnected.svg';
import connectedIcon from './icon--connected.svg';
import uploadFirmwareIcon from './icon--upload-firmware.svg';
import {setRealtimeConnection} from '../../reducers/connection-modal';
import {openConnectionModal, openUploadProgress} from '../../reducers/modals';
import {showAlertWithTimeout} from '../../reducers/alerts';
import bindAll from 'lodash.bindall';
import {setDeviceId, setDeviceName, setDeviceType} from '../../reducers/device';

class DeviceMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleConnectionMouseUp',
            'handleMonitoringMouseUp',
            'handleUploadFirmware'
        ]);
    }

    handleConnectionMouseUp () {
        this.props.onOpenConnectionModal();
    }

    handleMonitoringMouseUp () {
        const deviceId = this.props.device.deviceId;
        if (this.props.device.monitoring) {
            this.props.vm.disablePeripheralMonitoring(deviceId);
        } else {
            this.props.vm.enablePeripheralMonitoring(deviceId);
        }
    }

    handleUploadFirmware () {
        if (this.props.deviceId) {
            this.props.vm.uploadFirmwareToPeripheral(this.props.deviceId);
            this.props.onSetRealtimeConnection(false);
            this.props.onOpenUploadProgress();
        } else {
            this.props.onNoPeripheralIsConnected();
        }
    }

    render () {
        const {
            deviceId,
            iconURL,
            name,
            peripheralName,
            device
        } = this.props;
        return (
            <div
                key={deviceId}
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.menuOpen
                })}
                onMouseUp={this.props.onClickMenu}
            >
                <img
                    className={styles.deviceIcon}
                    src={iconURL}
                />
                <span className={styles.collapsibleLabel}>
                    {name}
                </span>
                <img src={dropdownCaret} />
                <MenuBarMenu
                    className={classNames(styles.menuBarMenu)}
                    open={this.props.menuOpen}
                    place={this.props.isRtl ? 'right' : 'left'}
                    onRequestClose={this.props.onRequestCloseMenu}
                >
                    <MenuSection>
                        <MenuItem>
                            <div
                                className={classNames(styles.menuBarItem, this.props.isRealtimeMode &&
                                this.props.peripheralName ? styles.hoverable : styles.disabled)}
                                onMouseUp={this.handleMonitoringMouseUp}
                            >
                                <img
                                    className={styles.deviceIcon}
                                    src={deviceIcon}
                                />
                                {device.monitoring ? (
                                    <FormattedMessage
                                        defaultMessage="Monitoring off"
                                        description="Pin value monitoring off"
                                        id="gui.deviceMenu.monitoringOff"
                                    />
                                ) : (
                                    <FormattedMessage
                                        defaultMessage="Monitoring on"
                                        description="Pin value monitoring on"
                                        id="gui.deviceMenu.monitoringOn"
                                    />
                                )}
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className={classNames(styles.menuBarItem, styles.hoverable)}
                                onMouseUp={this.handleConnectionMouseUp}
                            >
                                {peripheralName ? (
                                    <React.Fragment>
                                        <img
                                            className={styles.connectedIcon}
                                            src={connectedIcon}
                                        />
                                        {peripheralName}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <img
                                            className={styles.unconnectedIcon}
                                            src={unconnectedIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Unconnected"
                                            description="Text for menubar unconnected button"
                                            id="gui.menuBar.noConnection"
                                        />
                                    </React.Fragment>
                                )}
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className={classNames(styles.menuBarItem, this.props.isRealtimeMode &&
                                this.props.peripheralName ? styles.hoverable : styles.disabled)}
                                onMouseUp={this.props.isRealtimeMode && this.props.peripheralName ?
                                    this.handleUploadFirmware : null}
                            >
                                <img
                                    alt="UploadFirmware"
                                    className={classNames(styles.uploadFirmwareLogo)}
                                    draggable={false}
                                    src={uploadFirmwareIcon}
                                />
                                <FormattedMessage
                                    defaultMessage="Upload firmware"
                                    description="Button to upload the realtime firmware"
                                    id="gui.menuBar.uploadFirmware"
                                />
                            </div>
                        </MenuItem>
                    </MenuSection>
                </MenuBarMenu>
            </div>
        );
    }
}

DeviceMenu.propTypes = {
    device: PropTypes.object,
    deviceId: PropTypes.string,
    iconURL: PropTypes.string,
    isRealtimeMode: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    monitoring: PropTypes.bool,
    name: PropTypes.string,
    onClickMenu: PropTypes.func,
    onNoPeripheralIsConnected: PropTypes.func.isRequired,
    onOpenConnectionModal: PropTypes.func,
    onOpenUploadProgress: PropTypes.func,
    onRequestCloseMenu: PropTypes.func,
    onSetRealtimeConnection: PropTypes.func.isRequired,
    peripheralName: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    type: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = (state, ownProps) => ({
    menuOpen: deviceMenuOpen(state, ownProps.deviceId),
    isRealtimeMode: state.scratchGui.programMode.isRealtimeMode,
    isRtl: state.locales.isRtl,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClickMenu: () => dispatch(openDeviceMenu(ownProps.deviceId)),
    onNoPeripheralIsConnected: () => showAlertWithTimeout(dispatch, 'connectAPeripheralFirst'),
    onOpenConnectionModal: () => {
        dispatch(setDeviceId(ownProps.deviceId));
        dispatch(setDeviceName(ownProps.name));
        dispatch(setDeviceType(ownProps.type));
        dispatch(openConnectionModal());
    },
    onOpenUploadProgress: () => {
        dispatch(setDeviceId(ownProps.deviceId));
        dispatch(setDeviceName(ownProps.name));
        dispatch(setDeviceType(ownProps.type));
        dispatch(openUploadProgress());
    },
    onRequestCloseMenu: () => dispatch(closeDeviceMenu(ownProps.deviceId)),
    onSetRealtimeConnection: state => dispatch(setRealtimeConnection(state))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceMenu);
