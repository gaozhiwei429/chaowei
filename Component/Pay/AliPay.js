import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AliPay from 'rn-alipay';

export default class Alipay extends Component {
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

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    点击进入支付宝支付
                </Text>
                <Text style={styles.instructions}>
                    具体参数请在页面中配置
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.goAlipay.bind(this)}>
                    <Text style={styles.buttonText}>去支付</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    button: {
        marginTop: 10,
        padding: 10,
        borderColor: '#ff6600',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonText: {
        color: '#556600',
    },
});