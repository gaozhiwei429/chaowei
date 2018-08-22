import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Linking,
    Dimensions,
    NativeModules,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import * as storage from '../../storage';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
import Toast from '../Alert/Toast';

// 引入手电筒模块
// let FlashLight = NativeModules.FlashLight;
// import FlashLight from '../FlashLight/FlashLight'
const {width,height}=Dimensions.get('window');
export default class CWQRCode extends Component {
    constructor(){
        super();
        this.state = {
            dataBattery:[],//电池
            dataCharger:[],//充电器
            dataBatteryArray:[],
            isLiked: false,
            qrcodeTopBtn:true,
            JudgeBtn:0,
        };
    }

    onBarCodeRead(e) {
        //将返回的结果转为对象
        // let id = JSON.parse(e.data);
        let data = e.data;
        let value =data.toLowerCase();

        if(this.state.JudgeBtn===0){//蓄电池
            storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {//扫码存储电池
                const set = new Set(result);
                if(set.has(value) !== true){
                    result = (result || []).concat(value);
                    if(result.length<6){
                        storage.save(BATTERY_BIND_STORAGE_KEY, result, () => {
                            this.setState({ dataBattery: value});
                            this.setState({ dataBatteryArray:result });
                        });
                        this.refs.succeed.open();
                    }else {
                        this.refs.batteryErr.open();
                    }
                }else {
                    this.refs.batteryExists.open();
                }
            });
        }
        if(this.state.JudgeBtn===1){//充电器
            storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {//扫码存储充电器
                result= (result || []).concat(value);
                if(result.length<2){
                    storage.save(CHARGER_BIND_STORAGE_KEY, result, () => {
                        this.setState({ dataCharger: value});
                    });
                    this.refs.succeed.open();
                }else {
                    this.refs.chargerErr.open();
                }
            });
        }
        if(this.state.JudgeBtn===2){//扫码充电
            Linking
                .openURL(e.data)
                .catch(err => console.error('An error occured', err));
        }
    }

    battery(){
        this.setState({
            JudgeBtn: 0
        });
    }

    charger(){
        this.setState({
            JudgeBtn: 1
        });
    }

    Recharge(){
        this.setState({
            JudgeBtn: 2
        });
    }

    // onSuccess(e) {
    //     Linking
    //         .openURL(e.data)
    //         .catch(err => console.error('An error occured', err));
    // }

    //手电筒模块
    _switch (){
        this.setState({
            switchFlash: !this.state.switchFlash,
        });
        let flash =this.state.switchFlash;
        QRCodeScanner.switchState(flash, () => {
        }, (message) => {
            console.error(message);
        })
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1,textAlign:'center'}}>扫码</Text>),
        headerStyle: {
            height:0,
            // backgroundColor: 'rgba(0,0,0,0.5)',
            elevation: null
        },
        headerTitleStyle:{
            alignSelf:'center',//居中显示
        },
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        // headerPressColorAndroid:'blue',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
    };

    render() {
        return (
            <View style={styles.container}>
                <Toast ref='batteryExists' type='wrong' msg='此块蓄电池已存在'/>
                <Toast ref='succeed' type='success' msg='扫码成功'/>
                <Toast ref='chargerErr' type='warning' msg='只支持绑定一个充电器'/>
                <Toast ref='batteryErr' type='warning' msg='目前最多支持绑定5块电池'/>
                <QRCodeScanner
                    onRead={this.onBarCodeRead.bind(this)}
                    cameraStyle={styles.camera}
                    fadeIn={false}
                    reactivate={true}
                    reactivateTimeout={3000}
                />

                {/*//QR覆盖层透明背景*/}
                <View style={styles.overlay}>
                    {/**顶部按钮*/}
                    <View style={{ height:40, backgroundColor:'rgba(0,0,0,0.6)', width:width, justifyContent:'center',}}>
                        {/*返回键*/}
                        <TouchableOpacity
                            style={{ alignItems:'center', position: 'absolute',}}
                            onPress={()=>this.props.navigation.goBack()}
                        >
                            <Image source={require('../../img/leftGoBackWhite.png')} style={{width:18,height:14,marginLeft:15,}}/>
                        </TouchableOpacity>

                        {/*导航标题切换*/}
                        <View style={{flex:1, alignItems:'center', justifyContent:'center',}}>
                            {this.state.JudgeBtn===0 ?
                                <Text style={styles.navigationHeadline}>蓄电池扫码</Text> :
                                this.state.JudgeBtn===1 ?
                                    <Text style={styles.navigationHeadline}>充电器扫码</Text> :
                                    this.state.JudgeBtn===2 ?
                                        <Text style={styles.navigationHeadline}>扫码充电</Text> :''}
                        </View>
                    </View>

                    {this.state.JudgeBtn===2?
                        <View style={styles.Recharge}>
                            {/**QR覆盖层顶部*/}
                            <View style={styles.RechargeTop}/>
                            {/**QR覆盖层中间*/}
                            <View style={styles.overlayCenter}>
                                {/**QR覆盖层中间左部分*/}
                                <View style={styles.RechargeBrim}/>
                                {/**QR覆盖层中间二维码扫码区域*/}
                                <View style={styles.QROverlayConterScan}>
                                    <View style={styles.QROverlayConterScanTopLeft}/>
                                    <View style={styles.QROverlayConterScanTopRight}/>
                                    <View style={styles.QRoverlayConterScanBottomLeft}/>
                                    <View style={styles.QRoverlayConterScanBottomRight}/>
                                </View>
                                {/**QR覆盖层中间右部分*/}
                                <View style={styles.RechargeBrim}/>
                            </View>
                            {/**QR覆盖层底部*/}
                            <View style={styles.RechargeBottom}/>
                        </View>:
                        <View>
                            {/**QR覆盖层顶部*/}
                            <View style={styles.overlayTop}/>
                            {/**QR覆盖层中间部*/}
                            <View style={styles.overlayCenter}>
                                {/*//QR覆盖层中间左部分*/}
                                <View style={styles.overlayCenterLeft}/>
                                {/**QR覆盖层中间二维码扫码区域*/}
                                <View style={styles.QROverlayConterScan}>
                                    <View style={styles.QROverlayConterScanTopLeft}/>
                                    <View style={styles.QROverlayConterScanTopRight}/>
                                    <View style={styles.QRoverlayConterScanBottomLeft}/>
                                    <View style={styles.QRoverlayConterScanBottomRight}/>
                                </View>
                                {/**QR覆盖层中间右部分*/}
                                <View style={styles.overlayCenterRight}/>
                            </View>
                            {/**QR覆盖层底部*/}
                            <View style={styles.overlayBottom}/>
                        </View>}

                    <View style={{flex:1,  height:70, backgroundColor:'rgba(0,0,0,0.7)', width:width, justifyContent:'space-around',flexDirection:'row', alignItems:'center',}}>
                        {this.state.JudgeBtn===0?
                            <View style={styles.selected}>
                                <Image source={require('../../img/BandPitchOn.png')} style={{width:30,height:30,}} />
                                <Text style={styles.selectedText}>蓄电池</Text>
                            </View> :
                            <TouchableOpacity style={styles.unselected}  onPress={()=>this.battery()}>
                                <Image source={require('../../img/Band.png')} style={{width:30,height:30,}} />
                                <Text style={styles.unselectedText}>蓄电池</Text>
                            </TouchableOpacity>
                        }
                        {this.state.JudgeBtn===1?
                            <View style={styles.selected}>
                                <Image source={require('../../img/BandPitchOn.png')} style={{width:30,height:30,}} />
                                <Text style={styles.selectedText}>充电器</Text>
                            </View>:
                            <TouchableOpacity style={styles.unselected} onPress={()=>this.charger()}>
                                <Image source={require('../../img/Band.png')} style={{width:30,height:30,}} />
                                <Text style={styles.unselectedText}>充电器</Text>
                            </TouchableOpacity>
                        }
                        {this.state.JudgeBtn===2?
                            <View style={styles.selected}>
                                <Image source={require('../../img/rechargeOn.png')} style={{width:30,height:30,}} />
                                <Text style={styles.selectedText}>电车充电</Text>
                            </View>:
                            <TouchableOpacity style={styles.unselected} onPress={()=>this.Recharge()}>
                                <Image source={require('../../img/recharge.png')} style={{width:30,height:30,}} />
                                <Text style={styles.unselectedText}>电车充电</Text>
                            </TouchableOpacity>
                        }
                    </View>



                    {/*<TouchableOpacity style={styles.overlayBottom} onPress={() => {*/}
                        {/*this._switch()*/}
                    {/*}}>*/}
                        {/*<Image style={{width:50,height:50 }} source={require('../../img/flashlight.png')}/>*/}
                        {/*<Text style={styles.overlayBottomText}>*/}
                            {/*{this.state.switchFlash?'打开手电筒':'关闭手电筒'}*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navigationHeadline:{
        fontSize:18,
        color:'#fff'
    },
    RechargeBrim:{
        width: width/5,
        height: width/5*3+10,
    },
    RechargeTop:{
        flex:1,
        height: height/3-40,
        width: width,
    },
    RechargeBottom:{
        flex:1,
        flexDirection:'row',
        height: height/3-105,
        width: width,
    },
    Recharge:{
        flex:1,
    },
    selectedText:{
        color:'#3BB6FF',
        fontSize:17,
        paddingLeft:5 ,
    },
    unselectedText:{
        color:'#F5F5F5',
        fontSize:17,
        paddingLeft:5 ,
    },
    selected:{
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unselected:{
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    QRoverlayConterScanBottomLeft:{
        position:'absolute',
        bottom:0,
        right:0,
        borderBottomWidth:2,
        borderRightWidth:2,
        borderColor:'#FF8F03',
        width:17,
        height:17
    },
    QRoverlayConterScanBottomRight:{
        position:'absolute',
        bottom:0,
        left:0,
        borderBottomWidth:2,
        borderLeftWidth:2,
        borderColor:'#FF8F03',
        width:17,
        height:17
    },
    QROverlayConterScanTopRight:{
        position:'absolute',
        right:0,
        borderTopWidth:2,
        borderRightWidth:2,
        borderColor:'#FF8F03',
        width:17,
        height:17
    },
    QROverlayConterScanTopLeft:{
        position:'absolute',
        borderTopWidth:2,
        borderLeftWidth:2,
        borderColor:'#FF8F03',
        width:17,
        height:17
    },
    QROverlayConterScan:{
        flex:1,
        margin:5,
    },
    overlayCenterRight:{
        width: width/5,
        height: width/5*3+10,
        backgroundColor:'rgba(0, 0, 0, 0.6)',
    },
    overlayCenterLeft:{
        width: width/5,
        height: width/5*3+10,
        backgroundColor:'rgba(0, 0, 0, 0.6)',

    },
    overlayCenter:{
        flex:1,
        flexDirection:'row',
    },
    overlayBottom:{
        flex:1,
        flexDirection:'row',
        height: height/3-105,
        width: width,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        // justifyContent:'space-around',
        // alignItems:'center',
    },
    overlayTop:{
        flex:1,
        height: height/3-40,
        width: width,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 10,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 20,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    camera: {
        backgroundColor: '#000',
        height: height
    },
    overlay: {
        position: 'absolute',
        flex:1
    },
});
