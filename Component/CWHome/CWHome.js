import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ProgressBarAndroid,
    TouchableOpacity,
    Dimensions,
    Alert, AsyncStorage,
} from 'react-native';

import CWQRCode from '../CWQRCode/CWQRCode';
import bleBroadcast from '../CWBleBroadcast/CWBleBroadcast';//蓝牙广播模块
import HomepageData from '../HomepageLater/HomepageData';//蓄电池Next
import * as storage from '../../storage';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY,PHONE_BIND_STORAGE_KEY } from '../../config';
import SQLite from '../SQLite/sqlite';
import ToastSuccessAndError from '../Alert/ToastSuccessAndError';
import Confirm from '../Alert/Confirm';
import ProgressDialogAlert from '../Alert/ProgressDialogAlert';
import AlertS from '../Alert/Alert';
var sqLite = new SQLite();
var db;
// import CWScanning from '../CWScanning/CWScanning';//绑定页面
// import TimerMixin from 'react-timer-mixin';
// var reactMixin = require('react-mixin');
// import _ from 'lodash';

const {width,height}=Dimensions.get('window');

function padding(num, length) {
    for(var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
    }
    return num;
}


var otherIndex = 0;	// 其余电池中正在处理的 index
var currentIndex = 0; // 当前要绑定的电池 index
var commandArr = ['05','06','07','08','09','0a','0b','0c'];//命令符
var Reserved = '00';//
var batteryArray;                         //绑定电池与充电器合并后的数组
var others;                               //其他的电池
var Identifier = '382687921502'; //识别码固定值
var batteryIdentifier = '02aa382687921502'; //蓄电池识别固定码
var chargerIdentifier = '03aa382687921502'; //充电器识别固定码
var BleScan;

function bindSingle(){
    others = batteryArray.filter(x => x !== batteryArray[currentIndex]); // 其他的电池
    var commandList = commandArr[otherIndex];
    // 向 batteryArray[currentIndex] 发送 commandArr[otherIndex] + others[otherIndex] 的值
    var equipmentList = Identifier.concat(Reserved,Reserved,others[otherIndex],batteryArray[currentIndex]);
    // bleBroadcast.start(commandList ,equipmentList);// 蓝牙广播开始
    var con=commandList.concat(equipmentList);//广播的数据
    // console.log(con);//广播的数据
    otherIndex = otherIndex + 1;// otherIndex 自增
}

var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    if(str != null){
        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c1 == -1);
            if(c1 == -1)
                break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c2 == -1);
            if(c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if(c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while(i < len && c3 == -1);
            if(c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if(c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while(i < len && c4 == -1);
            if(c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
    }
    return out;
}

function CharToHex(str) {
    var out, i, len, c, h;
    out = "";
    if(str != null){
        len = str.length;
        i = 0;
        while(i < len) {
            c = str.charCodeAt(i++);
            h = c.toString(16);
            if(h.length < 2)
                h = "0" + h;
            out += "\\x" + h + " ";
            if(i > 0 && i % 8 == 0)
                out += "\r\n";
        }
    }
    return out;
}

function pad(num, n) {
    return Array(n>num?(n-(''+num).length+1):0).join(0)+num;
}

export default class CWHome extends Component {
    constructor(){
        super();
        this.state = {
            dataCharger:[],//充电器
            dataBatteryArray:[],//电池数组
            data:[],
            phoneBind:'',
            battery_id:"",
            my_timestamp:"",
            capacity:"",
            temperature:"",
            equilibrium_time:"",
            P_longitude:'',
            P_latitude:'',
            electric_current:'',
        };
        this.deviceMap = new Map();
    }

    componentDidMount() {
        /** 充电器*/
        let promise1=new Promise(function (resolve, reject) {
            return storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            })}
        );

        /** 电池*/
        let promise2=new Promise(function (resolve,reject) {
            return storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            })}
        );

        /** 电池充电器数据广播*/
        Promise.all([promise1,promise2]).then((values) => {
            batteryArray=[].concat.apply([],values);//绑定电池与充电器合并后的数组
            // if(batteryArray.length >= 5 ){
            storage.get(PHONE_BIND_STORAGE_KEY, (error, result) => {
                if(result !== '123'){
                    bindSingle();
                }
                // console.log(result);
            });
            // bindSingle();

            /**蓝牙扫描绑定*/
            this.deviceMap.clear();
            BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    // if(error.code == 102){
                    //     alert('请打开手机蓝牙后再搜索');
                    // }
                    this.refs.bleScan.open();
                }else{
                    this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                    // this.setState({data:[...this.deviceMap.values()]},()=>{
                    BleScan = [...this.deviceMap.values()];

                    if(batteryArray.length >= 5 ){
                        //var BroadcastJudgment = Identifier.concat(others[otherIndex-1]);//广播判断数据.toString(16)
                        var BroadcastJudgment1 = Identifier.concat(batteryArray[currentIndex]);
                        if(BleScan !== undefined){
                            for (let z = 0;z<BleScan.length;z++) {
                                let BleDataArray=CharToHex(base64decode(BleScan[z].manufacturerData)).replace(/\\x/g,'').replace(/\s+/g,'');
                                let InterceptionA=BleDataArray.slice(4,16);
                                let BleScanArrayId = BleScan[z].id.replace(/\:/g, "");
                                let BleScanId1 = BleScanArrayId.slice(0, 2);
                                let BleScanId2 = BleScanArrayId.slice(2, 4);
                                let BleScanId3 = BleScanArrayId.slice(4, 6);
                                let BleScanId4 = BleScanArrayId.slice(6, 8);
                                let BleScanId5 = BleScanArrayId.slice(8, 10);
                                let BleScanId6 = BleScanArrayId.slice(10, 12);
                                let BleScanId = BleScanId6.concat(BleScanId5, BleScanId4, BleScanId3, BleScanId2, BleScanId1);
                                let BleScanRssi=BleScan[z].rssi;//BLE信号强度

                                if(Identifier === InterceptionA && BleScanRssi > -80){
                                    //var InterceptionB = BleDataArray.slice(20,32);  //截取搜索到蓝牙广播的部分数据
                                    var InterceptionB = BleDataArray.slice(32,44);  //截取搜索到蓝牙广播的部分数据
                                    var Interception=InterceptionA.concat(InterceptionB);

                                    if(Interception === BroadcastJudgment1 && BleScanId === InterceptionB){//
                                        // 绑定了一块
                                        if (otherIndex === others.length){
                                            // 蓝牙广播返回绑定手机设备个数
                                            var command='20';
                                            var equipmentQuantity = Identifier.concat(Reserved,Reserved,pad(otherIndex,2),batteryArray[currentIndex].toString(16));
                                            bleBroadcast.start(command ,equipmentQuantity);

                                            // 已经全部绑定成功，返回
                                            if (currentIndex === batteryArray.length -1) {
                                                storage.get(PHONE_BIND_STORAGE_KEY, (error, result) => {
                                                    result = (result || '').replace(result,'123');
                                                    storage.save(PHONE_BIND_STORAGE_KEY, result, () => {
                                                        this.setState({ phoneBind: '123'});
                                                        if(result == '123'){
                                                            bleBroadcast.stop();
                                                            this.refs.toast_su.success();
                                                            // Alert.alert('提示','绑定完成',[{text:"确定"}]);
                                                            return;
                                                        }
                                                    });
                                                });
                                                // BluetoothManager.stopScan();
                                                // bleBroadcast.stop();
                                                // Alert.alert('提示','绑定完成',[{text:"确定"}]);
                                                // break;
                                            }
                                            // 绑定下一块
                                            currentIndex = currentIndex + 1;
                                            otherIndex = 0;
                                        }
                                        bindSingle();
                                    }
                                }
                            }
                        }
                    }else {
                        this.refs.confirm.open();
                        // Alert.alert('提示','您还未扫码',
                        //     [
                        //         {text:"取消",},
                        //         {text:"去扫码",onPress:()=>{this.goQRCodeBattery()}},
                        //     ]
                        // );
                    }
                }
            });

            // }else {
            //     this.refs.confirm.open();
            //     // Alert.alert('提示','您还未扫码',
            //     //     [
            //     //         {text:"取消",},
            //     //         {text:"去扫码",onPress:()=>{this.goQRCodeBattery()}},
            //     //     ]
            //     // );
            // }
            //向数据库写数据
            this.writeDatabase();
        });
    }


    /**向数据库写数据*/
    async writeDatabase(){
        /**向数据库写数据*/
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //建表
        sqLite.createTable();
        //删除充电器表、数据
        // sqLite.dropTable();
        // sqLite.deleteData();

        // sqLite.deleteChargerData();
        // sqLite.dropChargerTable();

        /** 获取地理位置（经纬度） */
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const positionData = position.coords;
                /**  经度：positionData.longitude*/
                /** 纬度：positionData.latitude*/
                const loop = () => {
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = date.getMonth()+1;
                    var d = date.getDate();
                    var h = date.getHours();
                    var mm = date.getMinutes();
                    var s = date.getSeconds();
                    var time=  y+'-'+padding(m, 2)+'-'+padding(d, 2)+' '+padding(h, 2)+':'+padding(mm, 2)+':'+padding(s, 2);
                    var actionsBattery = [];
                    var actionsCharger = [];
                    if(BleScan !== undefined){
                        for (var i = 0;i<BleScan.length;i++) {
                            var searchBle = CharToHex(base64decode(BleScan[i].manufacturerData)).replace(/\\x/g, '').replace(/\s+/g, '');
                            var batteryArrayID = BleScan[i].id.replace(/\:/g, "");
                            var batteryArrayID1 = batteryArrayID.slice(0, 2);
                            var batteryArrayID2 = batteryArrayID.slice(2, 4);
                            var batteryArrayID3 = batteryArrayID.slice(4, 6);
                            var batteryArrayID4 = batteryArrayID.slice(6, 8);
                            var batteryArrayID5 = batteryArrayID.slice(8, 10);
                            var batteryArrayID6 = batteryArrayID.slice(10, 12);
                            var batteryID = batteryArrayID6.concat(batteryArrayID5, batteryArrayID4, batteryArrayID3, batteryArrayID2, batteryArrayID1);
                            let BleScanRssi=BleScan[i].rssi;//BLE信号强度
                            if (batteryArray !== undefined && BleScanRssi > -80) {
                                for (var r=0;r<batteryArray.length;r++){
                                    var batteryIdentifier = searchBle.slice(4, 16);//搜索到的电池识别码与ID
                                    if(batteryIdentifier === Identifier && batteryArray[r] === batteryID){//判断电池识别码与ID
                                        // 电池数据
                                        var batteryData = [];
                                        var battery = {};
                                        battery.battery_id = batteryID;//设备id
                                        battery.my_timestamp = time;//当前时间
                                        battery.voltage = parseInt(searchBle.slice(20,24),16);//电压
                                        battery.electric_current = parseInt(searchBle.slice(24,26),16);//电流
                                        battery.temperature = parseInt(searchBle.slice(26,30),16);
                                        battery.capacity = parseInt(searchBle.slice(30,34),16);
                                        battery.equilibrium_time = parseInt(searchBle.slice(34,36),16);
                                        battery.P_longitude=positionData.longitude;
                                        battery.P_latitude=positionData.latitude;
                                        batteryData.push(battery);
                                        //写入电池数据库
                                        var actionBattery = sqLite.insertbatteryData(batteryData, () => {
                                            // //查询
                                            // db.transaction((tx)=>{
                                            //
                                            //     tx.executeSql("select id,charger_id,my_timestamp,temperature,capacity,equilibrium_time from battery order by id desc limit 1", [],(tx,results)=>{
                                            //         var len = results.rows.length;
                                            //         for(let i=0; i<len; i++){
                                            //             var u = results.rows.item(i);
                                            //             this.setState({
                                            //                 charger_id:u.charger_id,
                                            //                 my_timestamp:u.my_timestamp,
                                            //                 temperature:u.temperature,
                                            //                 capacity:u.capacity,
                                            //                 equilibrium_time:u.equilibrium_time,
                                            //             });
                                            //             if(u.capacity !== ''){
                                            //                 var datacapacity = parseInt(u.capacity);
                                            //                 if(data.length>10){
                                            //                     data.shift();
                                            //                     data.push(datacapacity);
                                            //                 }else {
                                            //                     console.log('1');
                                            //                 }
                                            //             }
                                            //         }
                                            //         setTimeout(loop, 5000);
                                            //     });
                                            // },(error)=>{
                                            //     console.log(error);
                                            // });
                                        });

                                        actionsBattery.push(actionBattery);

                                        // 充电器数据
                                        var chargerData = [];
                                        var charger = {};
                                        charger.charger_id = batteryID;//设备id
                                        charger.my_timestamp = time;//当前时间
                                        charger.voltage = parseInt(searchBle.slice(20,24),16);//电压
                                        charger.electric_current = parseInt(searchBle.slice(24,26),16);//电流
                                        charger.temperature = parseInt(searchBle.slice(26,30),16);
                                        charger.capacity = parseInt(searchBle.slice(30,34),16);
                                        charger.equilibrium_time = parseInt(searchBle.slice(34,36),16);
                                        charger.P_longitude=positionData.longitude;
                                        charger.P_latitude=positionData.latitude;
                                        chargerData.push(charger);
                                        //写入充电器数据库
                                        var actionCharger = sqLite.insertchargerData(chargerData,()=>{
                                        });
                                        actionsCharger.push(actionCharger)
                                        // setTimeout(loop, 5000);
                                    }
                                }
                            }

                        }
                    }
                    Promise.all([actionsBattery],[actionsCharger]).then(function () {
                        setTimeout(loop, 5000);
                    });
                };
                setTimeout(loop, 5000);
            }
        ),
            (error) => {
                console.warn('失败：' + JSON.stringify(error.message))
            }, {
            // 提高精确度，但是获取的速度会慢一点
            enableHighAccuracy: true,
            // 设置获取超时的时间20秒
            timeout: 20000,
            // 示应用程序的缓存时间，每次请求都是立即去获取一个全新的对象内容
            maximumAge: 1000
        };
    }

    goQRCodeBattery(){
        this.props.navigation.navigate('CWQRCode')
    }

    // 蓝牙广播结束
    componentWillUnmount(){
        // bleBroadcast.stop();
        // BluetoothManager.stopScan();
    }

    compennetDidUnmount(){
        //关闭数据库
        // sqLite.close();
    }

    // 页头
    static navigationOptions = {
        headerTitle: '首页',
        headerStyle: {
            height:40,
        },
    };

    //电池1
    banding1(){
        bleBroadcast.start('01' ,'3826879215020000020203040506');// 蓝牙广播开始
        // alert('1')
    }
    //电池2
    banding2(){
        bleBroadcast.start('01' ,'3826879215020000030203040506');// 蓝牙广播开始
    }
    //电池3
    banding3(){
        bleBroadcast.start('01' ,'3826879215020000040203040506');// 蓝牙广播开始
    }
    //电池4
    banding4(){
        bleBroadcast.start('01' ,'3826879215020000050203040506');// 蓝牙广播开始
    }
    //充电器
    banding5(){
        bleBroadcast.start('01' ,'3826879215020000010203040506');// 蓝牙广播开始
    }

    _removeText = ()=>{
        AsyncStorage.removeItem(PHONE_BIND_STORAGE_KEY);
        // alert('1')
    };
    render(){
        return(
            <View style={styles.container}>
                <ToastSuccessAndError ref='toast_su' successMsg='绑定完成' errorMsg='请打开蓝牙'/>
                <Confirm ref='confirm' leftFunc={() => {this.goQRCodeBattery()}} rightFunc={() => {}} btnLeftText='去扫码' btnRightText='取消' title='提示' msg='您还未扫码！'/>
                {/*进度条*/}
                <ProgressDialogAlert ref='pmgressbar' title='提示信息' btnText='确定' msg={10}  progress={0.7} width={200} color='red'/>
                <AlertS ref='bleScan' title='提示' btnText='确定' msg='请先打开蓝牙开关！' />

                <View style={{width:Dimensions.get('window').width,height:40,alignItems:'center',flexDirection:'row',borderBottomColor:'#ff0',justifyContent:'space-between',backgroundColor:'#fff'}}>
                    <View style={{marginLeft:20}}>
                        <Text style={{fontSize:20,color:'#000'}}>首页</Text>
                    </View>
                    <TouchableOpacity style={{marginRight:20}} onPress={()=>this.props.navigation.navigate('CWQRCode')}>
                        <Image style={{width:20,height:20 }} source={require('../../img/saomiao01.png')}/>
                    </TouchableOpacity>
                </View>
                {/*测试*/}
                {/*<View style={{justifyContent:'space-around',flexDirection:'row'}}>*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'#0fa'}} onPress={()=>this.banding1()}>*/}
                        {/*<Text>电池1-02</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'#0fa'}} onPress={()=>this.banding2()}>*/}
                        {/*<Text>电池2-03</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'#0fa'}} onPress={()=>this.banding3()}>*/}
                        {/*<Text>电池3-04</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'#0fa'}} onPress={()=>this.banding4()}>*/}
                        {/*<Text>电池4-05</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'#0fa'}} onPress={()=>this.banding5()}>*/}
                        {/*<Text>充电器-01</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'#0fa'}} onPress={()=>this.componentDidMount()}>*/}
                        {/*<Text>测试</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity onPress={()=>this._removeText()} style={{width:40,height:40,backgroundColor:'#0fa'}}>*/}
                        {/*<Text>清除测试</Text>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}

                {/*顶部电量可行驶里程*/}
                <Text style={styles.mileageText}>还可以骑行30公里</Text>
                {/*进度条*/}
                <ProgressBarAndroid  styleAttr="Horizontal" color="red" indeterminate={false} progress={0.7} />
                {/*电源、电池按钮*/}
                <View style={styles.BtnView}>
                    {/*充电器按钮*/}
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('HomepageData',{chargerImg: 0}) }
                    >
                        <Image style={{width:Dimensions.get('window').width/3,height:Dimensions.get('window').width/2}} source={require('../../img/charger.png')}/>
                    </TouchableOpacity>
                    {/*右侧电池按钮*/}
                    <View style={styles.viewRightImage} >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate('HomepageData', { index: 0 })}
                            style={{justifyContent:'center'}}
                        >
                            <Image
                                style={styles.ImagesStyle}
                                source={require('../../img/battery.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate('HomepageData', { index: 1 })}
                        >
                            <Image
                                style={styles.ImagesStyle}
                                source={require('../../img/battery.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate('HomepageData', { index: 2 })}
                        >
                            <Image
                                style={styles.ImagesStyle}
                                source={require('../../img/battery.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate('HomepageData', { index: 3 })}
                        >
                            <Image
                                style={styles.ImagesStyle}
                                source={require('../../img/battery.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/*绑定按钮*/}
                <TouchableOpacity style={{position:'absolute',bottom:20,left:20}} onPress={()=>{this.componentDidMount()}}>
                    <Image style={{width:width/8,height:width/8 }} source={require('../../img/bind.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    mileageText:{
        fontSize:20,
        textAlign:'center',
        backgroundColor:'#527FE4',
        color:'#fff',
        lineHeight:50
    },
    BtnView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
    },
    viewRightImage:{
    },
    ImagesStyle:{
        width:width/7 ,
        height:height/7
    }
});

// AppRegistry.registerComponent('CWHome', () => CWHome);