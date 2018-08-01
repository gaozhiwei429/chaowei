import { AsyncStorage } from 'react-native'

export function save(key, value, callback) {
    const valueStr = JSON.stringify(value);
    AsyncStorage.setItem(key, valueStr, callback);
}

export function get(key, callback) {
    AsyncStorage.getItem(key, function (error, resultStr) {
        if (error) return callback(error);

        let result;
        try {
            result = JSON.parse(resultStr);
        } catch (e) {
            result = null;
        }
        callback(null, result);
    });
}