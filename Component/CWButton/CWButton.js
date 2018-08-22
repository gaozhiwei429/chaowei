import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';

import RemainingBattery from '../CWRemainingBattery/CWRemainingBattery';

class CWBtnCell extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.Btn} onPress={this.props.onPress}>
                <Text style={styles.BtnText}>{this.props.title}</Text>
                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
            </TouchableOpacity>
        )
    }
}

export default class CWButton extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>更多</Text>),
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
        // headerLeft:(
        //     <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        // ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'blue',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
    };

    render() {
        return (
            <ScrollView style={styles.Binding}>
                {/*<CWBtnCell*/}
                    {/*title='微信支付'*/}
                    {/*onPress={() => this.props.navigation.navigate('WXPay')}*/}
                {/*/>*/}
                {/*<CWBtnCell*/}
                    {/*title='支付宝支付'*/}
                    {/*onPress={() => this.props.navigation.navigate('AliPay')}*/}
                {/*/>*/}
                {/*<CWBtnCell*/}
                    {/*title='确认支付'*/}
                    {/*onPress={() => this.props.navigation.navigate('PaymentPage')}*/}
                {/*/>*/}
                <CWBtnCell
                    title='目前电量'
                    onPress={() => this.props.navigation.navigate('RemainingBattery')}
                />
                <CWBtnCell
                    title='充电记录'
                    onPress={() => this.props.navigation.navigate('RechargeRecord')}
                />
                <CWBtnCell
                    title='充电桩加盟'
                    onPress={() => this.props.navigation.navigate('PileJonining')}
                />
                <CWBtnCell
                    title='充电桩地图'
                    onPress={() => this.props.navigation.navigate('Map')}
                />
                <CWBtnCell
                    title='电动车维修加盟'
                    onPress={() => this.props.navigation.navigate('RepairJoining')}
                />
                <CWBtnCell
                    title='电池诊断'
                />
                <CWBtnCell
                    title='高端充电器介绍'
                />
                <CWBtnCell
                    title='充电器送货上门'
                />
                <CWBtnCell
                    title='红包购充电器'
                />
                <CWBtnCell
                    title='充电成本估算'
                />
                <CWBtnCell
                    title='电池衰退曲线'
                />
                <CWBtnCell
                    title='电池价格购买方式'
                />
                <CWBtnCell
                    title='中智无线电池介绍'
                />
                <CWBtnCell
                    title='电池上门更换'
                />
                <CWBtnCell
                    title='红包充电'
                />
                {/*<TouchableOpacity >*/}
                    {/*<Text*/}
                        {/*style={{width:width,textAlign:'center',marginTop:40,marginBottom:20}}*/}
                        {/*onPress={() => this.props.navigation.navigate('CWQRCode')}*/}
                    {/*>*/}
                        {/*<Image style={{width:200,height:200}} source={require('../../img/saomiao01.png')}/>*/}
                    {/*</Text>*/}
                {/*</TouchableOpacity>*/}
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
    BtnImg:{
        width:15,
        height:15,
        position:'absolute',
        right:20,
    },
    Btn:{
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:1,
        justifyContent: 'center',
        // alignItems: 'center',
        marginLeft:15,
    },
    BtnText:{
        fontSize:19,
        paddingTop:10,
        paddingBottom:10,
    },
});
