import { BleManager  } from 'react-native-ble-plx';

export default class BleModule{
    constructor(){
        this.manager = new BleManager();
    }
    /**
     * 停止搜索蓝牙
     * */
    stopScan(){
        this.manager.stopDeviceScan();
        console.log('stopDeviceScan');
    }
}