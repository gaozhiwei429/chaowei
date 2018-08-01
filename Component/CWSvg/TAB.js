import React from 'react';
import {

} from 'react-native';
import { createMaterialTopTabNavigator,TabNavigator } from 'react-navigation'

// import CWSvgBatteryOne from './CWSvgBatteryOne';
// import CWSvgBatterTwo from './CWSvgBatteryTwo';
// import CWSvgBatteryThree from './CWSvgBatteryThree';
// import CWSvgBatteryFour from './CWSvgBatteryFour';

import CWBatteryTemperature from './CWBatteryTemperature';//温度
import CWBatteryVoltage from './CWBatteryVoltage';//电压
import CWBatteryElectricCurrent from './CWBatteryElectricCurrent';//电流
import CWBatteryCapacity from './CWBatteryCapacity';//容量

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
    title:'曲线图',
    headerStyle:{
        height:40,
        // backgroundColor: 'red',
        // elevation: null
    },

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