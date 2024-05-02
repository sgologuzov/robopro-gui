const ADD_DEVICE = 'scratch-gui/devices/add';
const SET_PERIPHERAL_NAME = 'scratch-gui/devices/setPeripheralName';
const CLEAR_PERIPHERAL_NAME = 'scratch-gui/devices/clearPeripheralName';
const REMOVE_DEVICE = 'scratch-gui/devices/remove';
const UPDATE_MONITORING = 'scratch-gui/devices/monitoring';

const initialState = {
    roboProBot: {deviceId: 'roboProBot', monitoring: false},
    roboProStation: {deviceId: 'roboProStation', monitoring: false}
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    const newState = Object.assign({}, state);
    switch (action.type) {
    case ADD_DEVICE: {
        const device = action.device;
        newState[action.deviceId] = Object.assign({}, device);
        return newState;
    }
    case SET_PERIPHERAL_NAME: {
        if (newState[action.deviceId]) {
            newState[action.deviceId].peripheralName = action.peripheralName;
        }
        return newState;
    }
    case CLEAR_PERIPHERAL_NAME: {
        if (newState[action.deviceId]) {
            delete newState[action.deviceId].peripheralName;
        }
        return newState;
    }
    case REMOVE_DEVICE: {
        delete newState[action.deviceId];
        return newState;
    }
    case UPDATE_MONITORING: {
        const device = action.device;
        if (newState[action.deviceId]) {
            newState[device.deviceId].monitoring = device.monitoring;
        }
        return newState;
    }
    default:
        return state;
    }
};

const addDevice = function (device) {
    return {
        type: ADD_DEVICE,
        deviceId: device.deviceId,
        device: device
    };
};

const setPeripheralName = function (deviceId, peripheralName) {
    return {
        type: SET_PERIPHERAL_NAME,
        deviceId,
        peripheralName
    };
};

const clearPeripheralName = function (deviceId) {
    return {
        type: CLEAR_PERIPHERAL_NAME,
        deviceId
    };
};

const removeDevice = function (deviceId) {
    return {
        type: REMOVE_DEVICE,
        deviceId: deviceId
    };
};

const updateMonitoring = function (device) {
    return {
        type: UPDATE_MONITORING,
        device: device
    };
};

export {
    reducer as default,
    initialState as devicesInitialState,
    addDevice,
    clearPeripheralName,
    removeDevice,
    setPeripheralName,
    updateMonitoring
};
