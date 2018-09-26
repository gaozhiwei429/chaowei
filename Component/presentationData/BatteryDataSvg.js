import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import CWBtnCell from '../CWButton/CWBtnCell';

export default class BatteryDataSvg extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>蓄电池数据</Text>), 
        headerStyle: {
            height: 40,
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

    render() {
        return (
            <ScrollView style={styles.Binding}>
                <CWBtnCell
                    title='电压数据'
                    onPress={() => this.props.navigation.navigate('CWBatteryVoltage')}
                />
                <CWBtnCell
                    title='电流数据' 
                    onPress={() => this.props.navigation.navigate('CWBatteryElectricCurrent')}
                />
                <CWBtnCell
                    title='温度数据'
                    onPress={() => this.props.navigation.navigate('CWBatteryTemperature')}
                />
                <CWBtnCell
                    title='容量数据'
                    onPress={() => this.props.navigation.navigate('CWBatteryCapacity')}
                />
            </ScrollView >
        )
    }
};


const styles = StyleSheet.create({
    Binding: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#fff'
    }, 
});
