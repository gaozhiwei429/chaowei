import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity, StyleSheet, ToastAndroid,
} from 'react-native';
import { List, Radio, WhiteSpace } from 'antd-mobile-rn';
import AliPay from "rn-alipay";
import * as WeChat from "react-native-wechat";
const RadioItem = Radio.RadioItem;

export default class PaymentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PayValue: 1,
        };
        //应用注册
        WeChat.registerApp('wx5b3e565f96159269');
    }


    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>确认支付</Text>),
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

    goAlipay () {
        const privateKey = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCafPVPs4gSCvcyfgcF/jH/O11E3VSX2F+tosl0/pLfGvw+tOJweJBzbYf7Mbp3snd+dUsjpeo0XbK8oRC9AmZ6Eb6sMH2hAEPxt9PP1CGPH9AvmjPivDClyVDNfICTtQo70yMtBVNbV3hMidoJdKTiHphvGQOLtvJ+kkfJUEvx12JytdnSnV7SLY7Zs9E3Ka7eEFswD9t8gizi2RRDBIL32en000RuZSCQbeXanZU5QqSi2vKxYcVtlWQVS26biRnC7ouMpjnO7f3Big/Apd4FB9rxhwfqF2WevNMWdC/iaRDHrfWXJXlfrO/QrihWqdjGM29tIRVOa5k3kqJQPnVDAgMBAAECggEBAIp9RnPCX1K9Xch3zdgDfdJt5ziaqQDOSUcgzTQCGqvCRyn3gZ6NlgDDycjXVW+EHzbP8yHr1D5JWLdcM+McSb1YNvOpLJWt5TrFLi363nKtdDWYKLczOPEFvVfYKnM/MgNbTQdI5ObXTNJgKYOce0rxXnkJlXIj+NKaU5wWTV5n69veLkPzfuO3hrYAa9fUh6bUVT9jEj5nMnHCRZn5lVFYQyNS1K0TO8lNVzNMYWCKI+QHr45C5MGWs5DwZAqfJsl057jrmoJlj0KPMLnChvfSShIFuc9TL80mgniCjiV1x0EUHGzgXYxW1OwZGn1hIFja+8qKgSMkfgvoPpO6mbECgYEA6A9KPYI1w/1aX2vRb2oevQIHNrtdaebTwQhzllXDEw5o+1mHSAk3o7pVL6lh28CCN698/xBHM8zEmKDXUFstL+sxCu/UDnHVhcPmK/0Xea0GLHtRhcoORbCHL7g2LYNtTJNjuI3MkNMFbr9wIqJBZGT4bz+2DUgaOPtWc+MbgE0CgYEAqmz/cxDfycpmbiTHYkvuExeaIbqz0EP9iAqoCqdf2u95QuqTiz3QGpLUf36vM95MuYuMXncl+OOMQ7aZjZamEjCmo1nVIFArzMKRlTQlrenT0MMgp3+tYM1+EbzhqdPgbLhtj+J78L9AVyl+5vBk8ZY2Eu8Wf49IYrwXC4psE88CgYA9WX15EWmBbQNtYqW13MpPka+yiopBqyKkT8WvIvE1ooOin6KiKr2o7WQD+7XBUP2cFyrmi7knOqVm7G6/8brahkUq7QiU4QdgG9BIJNsF8fZF4DxHMInhZq/2r66zDaHhsr2UVviT+RXgl3/fyCGdlwwO7TsF+9/i3J+Yd5wXqQKBgQCLlvF4nvadwpE5YBiLc6PRsYBGZjUHvdi4h/nxl/wUSBdrbtVgtEVyrpcswmfgtRDk3N8hNLg+bqqhf7uv1Be8SGsE2vyNFf16Hle9/NNr6lza3igt6Y7p/gZnouy2/FsS0dCzjI91tkCN4+gUYgxcMGukAH7OBl8EuAisJDm30wKBgBJ4c0XI/TwYQ4DOLYaKpyL+4PXSw1ty34eHpgJIGXVtzokZYz/U7G2//K1wnRTfsommeT8xmVJnemK2KXq6CmO/M11vC5mA3KEgJcXEXCgV6buFqtzr70lr7MOP0Yi9mh7LCYyed5h4yPoUl0U0ubZ1NsTR573ueUx1KqOchfHI';
        const data = {
            privateKey,
            partner: '2088302277569230',
            seller: '12312341234',
            outTradeNO: '1231231231231', //订单ID（由商家自行制定）
            subject: '测试商品标题', //商品标题
            body: '测试产品描述', //商品描述
            totalFee: '1', //商品价格
            notifyURL: 'http://yuezonglun.net"', //回调URL
            service: 'mobile.securitypay.pay',
            paymentType: '1',
            inputCharset: 'utf-8',
            itBPay: '30m',
            showURL: 'm.alipay.com',
            appSchemeIOS: 'testapp20', //应用注册scheme,在AlixPayDemo-Info.plist定义URL types
        };
        AliPay.pay(data).then((msg) => {
            console.log(msg);
        }, (e) => {
            console.log(e);
        });
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
        return (
            <View style={styles.container}>
                <View style={{marginTop:20,flex:1}}>
                    <View style={{marginBottom:10}}>
                        <Text>支付订单</Text>

                    </View>
                    <RadioItem
                        checked={this.state.PayValue === 1}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ PayValue: 1 });
                            }
                        }}
                    >
                        <Image source={require('../../img/wxPay.png')} style={styles.PayImage}/>
                    </RadioItem>

                    <RadioItem
                        checked={this.state.PayValue === 2}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ PayValue: 2 });
                            }
                        }}
                    >
                        <Image source={require('../../img/aliPay.png')} style={styles.PayImage}/>
                    </RadioItem>
                    <View style={styles.GoPayView}>
                        <TouchableOpacity
                            style={styles.goPay}
                            onPress={()=>{ this.state.PayValue === 2 ? this.goAlipay() : this.goWXPay() }}
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
    PayImage:{
        height:20,
        width:110,
        marginTop:5,
        marginLeft:3,
    },
    GoPayText:{
        fontSize:18,
        color:'#fff',
    },
    GoPayView:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container:{
      flex:1,
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