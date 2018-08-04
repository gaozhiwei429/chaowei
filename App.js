
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import CWGLaunchlmage from './Component/CWHome/CWGLaunchlmage';//启动页
import CWMain from './Component/CWMain/CWMain';  //Navigator
import CWHome from './Component/CWHome/CWHome';  //首页
import CWButton from './Component/CWButton/CWButton';//更多BTN
import CWQRCode from './Component/CWQRCode/CWQRCode';//二维码
import CWBle from './Component/CWBleSearch/CWBle';//蓝牙接收
import TAB from './Component/CWSvg/TAB';//
import RemainingBattery from './Component/CWRemainingBattery/CWRemainingBattery';//剩余电量模块
import CWScanning from './Component/CWScanning/CWScanning';//页面绑定
import CWBatteryTemperature from './Component/CWSvg/CWBatteryTemperature';//温度折线图
import CWBatteryVoltage from './Component/CWSvg/CWBatteryVoltage';//电压折线图
import CWBatteryElectricCurrent from './Component/CWSvg/CWBatteryElectricCurrent';//电流折线图
import CWBatteryCapacity from './Component/CWSvg/CWBatteryCapacity';//容量
import ChargerData from './Component/ChargerLater/ChargerData';//充电器net
import ChargerSvg from './Component/ChargerLater/ChargerSvg';//充电器折线图

//测试
import ListView from './Component/ListView/ListView'
import CWSvgBatteryone from './Component/CWSvg/CWSvgBatteryOne';
import CWSvgBatterTwo from './Component/CWSvg/CWSvgBatteryTwo';
import CWSvgBatteryThree from './Component/CWSvg/CWSvgBatteryThree';
import CWSvgBatteryFour from './Component/CWSvg/CWSvgBatteryFour';

import SQLiteDemo from './Component/SQLite/SQLiteDemo';
import SQLiteTextDemo from './Component/SQLiteText/SQLiteTextDemo';//测试
import cha from './Component/SQLite/cha'
import Alert from './Component/Alert/AlertShow';
import CWEchart from './Component/CWSvg/CWEchart';
import CWSvgText from './Component/CWSvg/CWSvgText';

import BleModule from './Component/CWBleSearch/BleModule';
//确保全局只有一个BleManager实例，BleModule类保存着蓝牙的连接信息
global.BluetoothManager = new BleModule();

import { createStackNavigator } from 'react-navigation';

const RootStack = createStackNavigator({
        CWGLaunchlmage:{screen:CWGLaunchlmage},
        CWMain: { screen:CWMain },
        Home: { screen: CWHome },
        Button: { screen: CWButton },
        CWQRCode: { screen: CWQRCode },
        Ble:{ screen:CWBle },
        RemainingBattery:{ screen:RemainingBattery },
        CWScanning:{ screen:CWScanning },
        TAB:{screen:TAB},
        CWBatteryTemperature:{screen:CWBatteryTemperature},//温度
        CWBatteryVoltage:{screen:CWBatteryVoltage},//电压
        CWBatteryElectricCurrent:{screen:CWBatteryElectricCurrent},//电流
        CWBatteryCapacity:{screen:CWBatteryCapacity},//容量
        ChargerData:{screen:ChargerData},//充电器第二页
        ChargerSvg:{screen:ChargerSvg},

        //测试
        CWSvgBatteryone:{screen:CWSvgBatteryone},
        CWSvgBatterTwo:{screen:CWSvgBatterTwo},
        CWSvgBatteryThree:{screen:CWSvgBatteryThree},
        CWSvgBatteryFour:{screen:CWSvgBatteryFour},

        ListView:{screen:ListView},
        SQLiteDemo:{screen:SQLiteDemo},//
        SQLiteTextDemo:{screen:SQLiteTextDemo},
        cha:{screen:cha},
        Alert:{screen:Alert},//alert弹窗
        CWEchart:{screen:CWEchart},
        CWSvgText:{screen:CWSvgText},
    },
    {
        initialRouteName: 'CWGLaunchlmage',
    }
);

export default class App extends Component {
    /** 获取地理位置（经纬度） */
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const positionData = position.coords;
            }
        )
    }
    render() {
        return (
            <RootStack />
        );
    }
}

