import React from 'react';
import {
    Text,
    View,
    Image,  
} from 'react-native';
import { TabNavigator } from 'react-navigation'

import CWBatteryTemperature from '../CWSvg/CWBatteryTemperature';//温度
import CWBatteryVoltage from '../CWSvg/CWBatteryVoltage';//电压
import CWBatteryElectricCurrent from '../CWSvg/CWBatteryElectricCurrent';//电流
import CWBatteryCapacity from '../CWSvg/CWBatteryCapacity';//容量
import BattteryPower from '../CWSvg/BatteryPower';//功率

const Tabs = TabNavigator({
    BatteryVoltage: {
        screen: CWBatteryVoltage,
        navigationOptions: {
            tabBarLabel: '电压',
        }
    },
    BatteryElectricCurrent: {
        screen: CWBatteryElectricCurrent,
        navigationOptions: {
            tabBarLabel: '电流',
        }
    },
    BatteryTemperature: {
        screen: CWBatteryTemperature,
        navigationOptions: {
            tabBarLabel: '温度',
        },
    },
    BatteryCapacity: {
        screen: CWBatteryCapacity,
        navigationOptions: {
            tabBarLabel: '容量',
        }
    },
    BattteryPower: {
        screen: BattteryPower,
        navigationOptions: {
            tabBarLabel: '功率',
        }
    },
}, {
    //设置TabNavigator的位置
    tabBarPosition: 'bottom',
    swipeEnabled:false,
    animationEnabled:true,
    // lazy:false,
    backBehavior:'none',
    tabBarOptions: {
        activeTintColor: '#3BB6FF',     // 文字和图片选中颜色
        activeBackgroundColor:'#fff',       //文字和图片选中的背景色
        inactiveTintColor: '#999',      // 文字和图片默认颜色
        inactiveBackgroundColor:'#fff',     //文字和图片默认的背景色
        indicatorStyle: {height: 0},    // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了 暂时解决这个问题
        labelStyle: {
            fontSize: 17,
        },
        tabStyle: {
            height:50,
        },
        scrollEnabled:false,//是否启用可滚动选项卡
        style: {
            backgroundColor: '#F5FCFF',
            paddingBottom:0,
            borderColor:'#fff',

        },
    },
});

Tabs.navigationOptions = {
    headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>蓄电池曲线图</Text>),
    headerStyle:{
        height:40,
    },
    // headerLeft:(
    //     <View/>
    // ),
    headerRight: (
        <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
    ),
    headerPressColorAndroid:'gray',
    headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),

};

export default Tabs;