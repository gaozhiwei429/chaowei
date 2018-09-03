import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
    Dimensions,
} from 'react-native';
import { List, Radio, WhiteSpace } from 'antd-mobile-rn';
import * as WeChat from "react-native-wechat";
const RadioItem = Radio.RadioItem;
import Alipay from './Alipay';
const {width,height}=Dimensions.get('window');
export default class PaymentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PayValue: 1,
            PayMoney: 3,
            billing:0,
        };
        //应用注册
        WeChat.registerApp('wx5b3e565f96159269');
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>待支付订单</Text>),
        headerStyle: {
            height: 40,
        },
        headerLeft:(
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'blue',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
    };

    async goAlipay () {   
        try {
            await Alipay.pay();
            // alert('支付成功');
        } catch (e) {
            alert(e.message);
        }
    }

    goWXPay(){
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.pay({
                        partnerId: '1481716752', // 商家向财付通申请的商家id
                        prepayId: '10000100', // 预支付订单
                        nonceStr: '1000', // 随机串，防重发
                        timeStamp: '10000100', // 时间戳，防重发
                        package: '10000100', // 商家根据财付通文档填写的数据和签名
                        sign: '9A0A8659F005D6984697E2CA0A9CF3B7' // 商家根据微信开放平台文档对数据做的签名
                    }).catch((error) => {
                        ToastAndroid.show(error, ToastAndroid.SHORT);
                    });
                } else {
                    ToastAndroid.show('没有安装微信软件，请您安装微信之后再试', ToastAndroid.SHORT);
                }
            });
    }

    render() {
        // const {params}=this.props.navigation.state;
        // const { AliPay } = params;
        return (
            <View style={styles.container}>
                <View style={{paddingLeft:20,}}>
                    <View style={{flexDirection:'row',}}>
                        <Text style={{fontSize:18}}>充电桩号：</Text>
                        <Text style={{fontSize:18,color:'#3BB6FF'}}>1030013010303</Text>
                    </View>
                    <View style={{marginTop:10}}>
                        <Text style={{fontSize:18}}>充电方式:</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10,}}>
                            {this.state.billing===0?
                                <View
                                    style={styles.choiceBillingOpt}
                                >
                                    <Text style={styles.rechargeText}>电量计费</Text>
                                </View>:
                                <TouchableOpacity
                                    style={styles.choiceBilling}
                                    onPress={()=>{this.setState({ billing: 0 });}}
                                >
                                    <Text style={styles.rechargeText}>电量计费</Text>
                                </TouchableOpacity>
                            }
                            {this.state.billing===1?
                                <View
                                    style={styles.choiceBillingOpt}
                                >
                                    <Text style={styles.rechargeText}>时间计费</Text>
                                </View>:
                                <TouchableOpacity
                                    style={styles.choiceBilling}
                                    onPress={()=>{this.setState({ billing: 1 });}}
                                >
                                    <Text style={styles.rechargeText}>时间计费</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{marginTop:10}}>
                        <Text style={{fontSize:17,paddingTop:5,paddingBottom:5,}}>充电金额</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',width:width/3*2}}>
                            {/**支付3元*/}
                            {this.state.PayMoney===3?
                                <View
                                    style={styles.choiceRechargeMoney}
                                >
                                    <Text style={styles.rechargeText}>3元</Text>
                                </View>:
                                <TouchableOpacity
                                    style={styles.rechargeMoney}
                                    onPress={()=>{this.setState({ PayMoney: 3 });}}
                                >
                                    <Text style={styles.rechargeText}>3元</Text>
                                </TouchableOpacity>
                            }
                            {/**支付2元*/}
                            {this.state.PayMoney===2?
                                <View
                                    style={styles.choiceRechargeMoney}
                                >
                                    <Text style={styles.rechargeText}>2元</Text>
                                </View>:
                                <TouchableOpacity
                                    style={styles.rechargeMoney}
                                    onPress={()=>{this.setState({ PayMoney: 2 });}}
                                >
                                    <Text style={styles.rechargeText}>2元</Text>
                                </TouchableOpacity>
                            }
                            {/**支付1元*/}
                            {this.state.PayMoney===1?
                                <View
                                    style={styles.choiceRechargeMoney}
                                >
                                    <Text style={styles.rechargeText}>1元</Text>
                                </View>:
                                <TouchableOpacity
                                    style={styles.rechargeMoney}
                                    onPress={()=>{this.setState({ PayMoney: 1 });}}
                                >
                                    <Text style={styles.rechargeText}>1元</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
                <View style={{marginTop:20,flex:1}}>
                    <View style={{marginBottom:10,paddingLeft:20,}}>
                        <Text>支付方式</Text>
                    </View>
                    {/**支付宝支付*/}
                    <RadioItem
                        checked={this.state.PayValue === 1}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ PayValue: 1 });
                            }
                        }}
                        style={{}}
                    >
                        <Image source={require('../../img/aliPay.png')} style={styles.aliPayImage}/>
                    </RadioItem>
                    {/**微信支付*/}
                    {/*<RadioItem*/}
                        {/*checked={this.state.PayValue === 2}*/}
                        {/*onChange={(event) => {*/}
                            {/*if (event.target.checked) {*/}
                                {/*this.setState({ PayValue: 2 });*/}
                            {/*}*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<Image source={require('../../img/wxPay.png')} style={styles.PayImage}/>*/}
                    {/*</RadioItem>*/}

                    <View style={styles.GoPayView}>
                        <TouchableOpacity
                            style={styles.goPay}
                            onPress={()=>{ this.state.PayValue === 1 ? this.goAlipay() : this.goWXPay() }}
                        >
                            <Text style={styles.GoPayText}>确认支付</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    choiceBillingOpt:{
        width:120,
        height:35,
        padding: 8,
        paddingLeft: 17,
        paddingRight: 17,
        backgroundColor: '#3BB6FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    choiceBilling:{
        width:120,
        height:35,
        padding: 8,
        paddingLeft: 17,
        paddingRight: 17,
        backgroundColor: '#ababab',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rechargeText:{
        fontSize:16,
        color:'#fff',
    },
    rechargeMoney:{
        width:60,
        height:35,
        padding: 8,
        paddingLeft: 17,
        paddingRight: 17,
        backgroundColor: '#ababab',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    choiceRechargeMoney:{
        width:60,
        height:35,
        padding: 10,
        paddingLeft: 17,
        paddingRight: 17,
        backgroundColor: '#3BB6FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aliPayImage:{
        height:32,
        width:165,
        marginLeft:10,
    },
    PayImage:{
        height:32,
        width:120,
        marginLeft:10,
    },
    GoPayText:{
        fontSize:18,
        color:'#fff',
    },
    GoPayView:{
        flex:1,
        alignItems: 'center',
        marginTop:50,
    },
    container:{
        flex:1,
        paddingTop:20,
    },
    goPay:{
        width:200,
        height:40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#3BB6FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    }
});