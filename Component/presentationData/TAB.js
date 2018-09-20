import React from 'react';
import {
    Text,
    View,
    Image,  
} from 'react-native';
import { createMaterialTopTabNavigator,TabNavigator } from 'react-navigation'

import CWBatteryTemperature from '../CWSvg/CWBatteryTemperature';//温度
import CWBatteryVoltage from '../CWSvg/CWBatteryVoltage';//电压
import CWBatteryElectricCurrent from '../CWSvg/CWBatteryElectricCurrent';//电流
import CWBatteryCapacity from '../CWSvg/CWBatteryCapacity';//容量

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
    // CWSvgBatteryone,  //电池1
    // CWSvgBatterTwo,//电池2
    // CWSvgBatteryThree,//电池3
    // CWSvgBatteryFour,//电池4
}, {
    //设置TabNavigator的位置
    tabBarPosition: 'top',
    backBehavior: 'none',
    //...
    tabBarOptions: {
        activeTintColor: '#474747',
        labelStyle: {
            fontSize: 17,
        },
        tabStyle: {
            // width: 100,
            height:40,
        },
        activeTabStyle: {
            backgroundColor: 'red',
        },
        style: {
            backgroundColor: '#3BB6FF',
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

    // header:  /* Your custom header */
    //     <View
    //         style={{
    //             height: 30,
    //             marginTop: 10 /* only for IOS to give StatusBar Space */
    //         }}
    //     >
    //         <Text>This is CustomHeader</Text>
    //     </View>

};

export default Tabs;