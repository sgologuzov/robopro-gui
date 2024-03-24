const ADD_DEVICE = 'scratch-gui/devices/add';
const REMOVE_DEVICE = 'scratch-gui/devices/remove';

const initialState = {
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    const newState = Object.assign({}, state);
    switch (action.type) {
    case ADD_DEVICE: {
        newState[action.deviceId] = action.device;
        return newState;
    }
    case REMOVE_DEVICE: {
        delete newState[action.deviceId];
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

const removeDevice = function (deviceId) {
    return {
        type: REMOVE_DEVICE,
        deviceId: deviceId
    };
};

export {
    reducer as default,
    initialState as devicesInitialState,
    addDevice,
    removeDevice
};
