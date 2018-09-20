
import React, { Component } from 'react';
import {
    Platform,
} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import { Initializer } from 'react-native-baidumap-sdk';

//确保全局只有一个BleManager实例，BleModule类保存着蓝牙的连接信息
import BleModule from './Component/CWBleSearch/BleModule';
global.BluetoothManager = new BleModule();

import { createStackNavigator } from 'react-navigation';

import SplashScreen from 'react-native-splash-screen';//白屏
import CWGLaunchlmage from './Component/CWHome/CWGLaunchlmage';//启动页
import CWMain from './Component/CWMain/CWMain';  //Navigator
import CWHome from './Component/CWHome/CWHome';  //首页
import CWButton from './Component/CWButton/CWButton';//更多BTN
import CWQRCode from './Component/CWQRCode/CWQRCode';//二维码
import RemainingBattery from './Component/CWRemainingBattery/CWRemainingBattery';//剩余电量模块
import CWScanning from './Component/CWScanning/CWScanning';//页面绑定
import CWBatteryTemperature from './Component/CWSvg/CWBatteryTemperature';//温度折线图
import CWBatteryVoltage from './Component/CWSvg/CWBatteryVoltage';//电压折线图
import CWBatteryElectricCurrent from './Component/CWSvg/CWBatteryElectricCurrent';//电流折线图
import CWBatteryCapacity from './Component/CWSvg/CWBatteryCapacity';//容量
import ChargerSvg from './Component/CWSvg/ChargerSvg';//充电器折线图
import ChargerDetector from './Component/CWSvg/ChargerDetector';//充电器数据检测仪
import HomepageData from './Component/HomepageLater/HomepageData';//蓄电池Next
import Calibration from './Component/HomepageLater/Calibration';//校准
import RechargeRecord from './Component/RechargeRecord/RechargeRecord';//充电记录
import Charging from './Component/Charging/Charging';//启动停止充电
import Help from './Component/Help/Help';//充电帮助
import PeakValley from './Component/Help/PeakValley';//峰谷电价
import Map from './Component/Map/Map';//地图
import PileJonining from './Component/PileJoining/PileJoining';//充电桩加盟
import RepairJoining from './Component/RepairJoining/RepairJoining';//维修加盟
import WXPay from './Component/Pay/WXPay';//微信支付
import PaymentPage from './Component/Pay/PaymentPage';//支付宝支付
import Filesystem from './Component/Filesystem/Filesystem';//写文件
import AboutUs from './Component/AboutUs/AboutUs';//关于我们
import CWBleConnect from './Component/CWBleSearch/CWBleConnect';//连接读取数据
import PresentationData from './Component/presentationData/PresentationData';//数据
import TAB from './Component/presentationData/TAB';//蓄电池数据(滑动)
import BatteryDataSvg from './Component/presentationData/BatteryDataSvg';//蓄电池数据(单)
import Shopping from './Component/Shopping/Shopping';//商城 
import RSSI from './Component/CWBleSearch/RSSI';//RSSI

//测试
import ListView from './Component/ListView/ListView'
import SQLiteTextDemo from './Component/SQLiteText/SQLiteTextDemo';//测试
import cha from './Component/SQLite/cha'
import Alert from './Component/Alert/AlertShow';
import CWEchart from './Component/CWSvg/CWEchart';
import ListViewText from './Component/ListView/ListViewText';

const RootStack = createStackNavigator({
        CWGLaunchlmage:{screen:CWGLaunchlmage},
        CWMain: { screen:CWMain },
        Home: { screen: CWHome },
        Button: { screen: CWButton },
        CWQRCode: { screen: CWQRCode },
        RemainingBattery:{ screen:RemainingBattery },
        CWScanning:{ screen:CWScanning },
        TAB:{screen:TAB},
        CWBatteryTemperature:{screen:CWBatteryTemperature},//温度
        CWBatteryVoltage:{screen:CWBatteryVoltage},//电压
        CWBatteryElectricCurrent:{screen:CWBatteryElectricCurrent},//电流
        CWBatteryCapacity:{screen:CWBatteryCapacity},//容量
        ChargerSvg:{screen:ChargerSvg},
        HomepageData:{screen:HomepageData},
        Calibration:{screen:Calibration},
        RechargeRecord:{screen:RechargeRecord},
        Charging:{screen:Charging},
        Map:{screen:Map},
        PileJonining:{screen:PileJonining},
        Help:{screen:Help},
        PeakValley:{screen:PeakValley},
        RepairJoining:{screen:RepairJoining},
        WXPay:{screen:WXPay},
        PaymentPage:{screen:PaymentPage},
        Filesystem:{screen:Filesystem},
        AboutUs:{screen:AboutUs},
        CWBleConnect:{screen:CWBleConnect},
        PresentationData:{screen:PresentationData},
        BatteryDataSvg:{screen:BatteryDataSvg}, 
        Shopping:{screen:Shopping},
        RSSI:{screen:RSSI},
        ChargerDetector:{screen:ChargerDetector},

        //测试
        ListView:{screen:ListView},
        ListViewText:{screen:ListViewText},
        SQLiteTextDemo:{screen:SQLiteTextDemo},
        cha:{screen:cha},
        Alert:{screen:Alert},//alert弹窗
        CWEchart:{screen:CWEchart},
    },
    {
        initialRouteName: 'CWGLaunchlmage', 
    }    
);

export default class App extends Component {
    /** 获取地理位置（经纬度） */
    componentDidMount() {
        SplashScreen.hide();
        Initializer.init('iOS 开发密钥').catch(e => console.error(e)); 
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

