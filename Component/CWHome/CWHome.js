import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ProgressBarAndroid,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    DeviceEventEmitter,
} from 'react-native';

import bleBroadcast from '../CWBleBroadcast/CWBleBroadcast';//蓝牙广播模块
import * as storage from '../../storage';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY,PHONE_BIND_STORAGE_KEY } from '../../config';
import SQLite from '../SQLite/sqlite';
import ToastSuccessAndError from '../Alert/ToastSuccessAndError';
import Confirm from '../Alert/Confirm';
import ProgressDialogAlert from '../Alert/ProgressDialogAlert';
import AlertS from '../Alert/Alert';
import * as commonality from '../../commonality';
import EasyToast, {DURATION} from 'react-native-easy-toast';//tost
var sqLite = new SQLite();
var db;

const {width,height}=Dimensions.get('window');
var otherIndex = 0;	// 其余电池中正在处理的 index
var currentIndex = 0; // 当前要绑定的电池 index
var commandArr = ['0105','0106','0107','0108','0109','010a','010b','010c'];//命令符
var Reserved = '00';//
var batteryArray;                         //绑定电池与充电器合并后的数组
var others;                               //其他的电池
var Identifier = '382687921502'; //识别码固定值
var chargerIdentifier = '0289382687921502'; //充电器识别固定码
var batteryIdentifier = '0388382687921502'; //蓄电池识别固定码
var BleScan;
var BroadcastJudgment;

function bindSingle(){
    others = batteryArray.filter(x => x !== batteryArray[currentIndex]); // 其他的电池
    var commandList = commandArr[otherIndex];
    // 向 batteryArray[currentIndex] 发送 commandArr[otherIndex] + others[otherIndex] 的值
    var equipmentList = Identifier.concat(Reserved,Reserved,others[otherIndex],batteryArray[currentIndex]);
    BroadcastJudgment = Identifier.concat(others[otherIndex]);
    var endMark=equipmentList.concat('20',commonality.padding(others.length+1,2));//
    var endRepair = equipmentList.concat('0000');//填补
    if(others.length === otherIndex+1){
        bleBroadcast.start(commandList ,endMark);// BLE广播
    }else {
        bleBroadcast.start(commandList ,endRepair);// BLE广播
    }
    // var con=commandList.concat(equipmentList);//广播的数据
    // console.log(con);//广播的数据
    otherIndex = otherIndex + 1;// otherIndex 自增
}

export default class CWHome extends Component {
    constructor(){
        super();
        this.state = {
            bandingImg:0,
            chargerStorage:0,
            batteryStorage:0,
            chargerLen:0,
        };
        this.deviceMap = new Map();
    } 

    componentDidMount() {
        /** 是否绑定*/
        storage.get(PHONE_BIND_STORAGE_KEY, (error, result) => {
            if(result == '123' ){
                this.setState({
                    bandingImg: 1
                });
            }
        });

        // 添加监听者
        this.listener = DeviceEventEmitter.addListener('charger', (len) => {
            this.setState({
                chargerStorage: len
            });
        })

        /** 充电器*/   
        storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
            if(result !== null){
                this.setState({
                    chargerStorage: 1
                });
            }else {
                this.setState({
                    chargerStorage: 0
                });
            }
        });

        // 添加监听者
        this.listener = DeviceEventEmitter.addListener('battery', (len) => {
            this.setState({
                batteryStorage: len
            });  
        })
        /** 电池*/
        storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {
            if(result !== null){
                this.setState({
                    batteryStorage: result.length,
                });
            }else {
                this.setState({
                    batteryStorage: 0,
                });
            }
        });

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
            // console.log(batteryArray);
            /**蓝牙扫描绑定*/
            this.deviceMap.clear();
            BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    this.refs.bleScan.open();
                }else{
                    this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                    BleScan = [...this.deviceMap.values()];
                }
            })

            //向数据库写数据
            this.writeDatabase();
            // this.abuttons();
        });
    }
    
    /**充电器*/ 
    chargerStorage(val){
        this.setState({
            chargerStorage:val
        });
    }
    /**蓄电池*/ 
    batteryStorage(val){
        this.setState({
            batteryStorage:val
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
                    var time=  y+'-'+commonality.padding(m, 2)+'-'+commonality.padding(d, 2)+' '+commonality.padding(h, 2)+':'+commonality.padding(mm, 2)+':'+commonality.padding(s, 2);
                    var actionsBattery = [];
                    var actionsCharger = [];
                    if(BleScan !== undefined){
                        for (var i = 0;i<BleScan.length;i++){
                            var searchBle = commonality.CharToHex(commonality.base64decode(BleScan[i].manufacturerData)).replace(/\\x/g, '').replace(/\s+/g, '');
                            var batteryArrayID = BleScan[i].id.replace(/\:/g, "");
                            var batteryArrayID1 = batteryArrayID.slice(0, 2);
                            var batteryArrayID2 = batteryArrayID.slice(2, 4);
                            var batteryArrayID3 = batteryArrayID.slice(4, 6);
                            var batteryArrayID4 = batteryArrayID.slice(6, 8);
                            var batteryArrayID5 = batteryArrayID.slice(8, 10);
                            var batteryArrayID6 = batteryArrayID.slice(10, 12);
                            var equipmentID = batteryArrayID6.concat(batteryArrayID5, batteryArrayID4, batteryArrayID3, batteryArrayID2, batteryArrayID1).toLowerCase();
                            let BleScanRssi=BleScan[i].rssi;//BLE信号强度
                            if (batteryArray !== undefined && BleScanRssi > -80) {  
                                for (var r=0;r<batteryArray.length;r++){
                                    var scanIdentifier = searchBle.slice(0, 16);//搜索到的电池识别码与ID   
                                    if(scanIdentifier == batteryIdentifier && batteryArray[r] == equipmentID){//判断电池识别码与ID
                                        // 电池数据
                                        var batteryData = [];
                                        var battery = {};
                                        battery.battery_id = equipmentID;//设备id
                                        battery.my_timestamp = time;//当前时间
                                        battery.voltage = parseInt((searchBle.slice(22,24).concat(searchBle.slice(20,22))),16)/100;//电压
                                        battery.equilibrium_time = parseInt(searchBle.slice(24,26),16)/100;//平衡时间
                                        battery.electric_current = parseInt(searchBle.slice(26,28),16)/100;//均衡电流
                                        battery.equilibriumTemperature=parseInt(searchBle.slice(28,30),16);//均衡温度1
                                        battery.temperature = parseInt(searchBle.slice(30,32),16);//环境温度
                                        battery.targetCurrent=parseInt((searchBle.slice(34,36).concat(searchBle.slice(32,34))),16)/100;//目标电流2
                                        battery.targetVoltage=parseInt((searchBle.slice(38,40).concat(searchBle.slice(36,38))),16)/10;//目标电压2
                                        battery.capacity = parseInt((searchBle.slice(42,44).concat(searchBle.slice(40,42))),16)/100;//容量
                                        battery.balanceVoltage=parseInt((searchBle.slice(46,48).concat(searchBle.slice(44,46))),16)/10;//均衡电压2
                                        battery.bindingState = parseInt(searchBle.slice(48,50),16);//绑定状态1
                                        battery.equilibriumState = parseInt(searchBle.slice(50,52),16);//均衡状态1
                                        battery.P_longitude=positionData.longitude;
                                        battery.P_latitude=positionData.latitude;
                                        batteryData.push(battery);
                                        //写入电池数据库
                                        var actionBattery = sqLite.insertbatteryData(batteryData, () => {});
                                        actionsBattery.push(actionBattery);
                                    }else if(scanIdentifier == chargerIdentifier && batteryArray[r] == equipmentID){
                                        // 充电器数据
                                        var chargerData = [];
                                        var charger = {};
                                        charger.charger_id = equipmentID;//设备id
                                        charger.my_timestamp = time;//当前时间
                                        charger.voltage = parseInt((searchBle.slice(22,24).concat(searchBle.slice(20,22))),16)/10;//电压
                                        charger.electric_current =parseInt((searchBle.slice(26,28).concat(searchBle.slice(24,26))),16)/100;//电流
                                        charger.chargerTemperature=parseInt(searchBle.slice(28,30),16);//充电器温度1
                                        charger.batteryTemperature = parseInt(searchBle.slice(30,32),16);//电池温度
                                        charger.targetCurrent = parseInt((searchBle.slice(34,36).concat(searchBle.slice(32,34))),16)/100;//目标电流2
                                        charger.targetVoltage = parseInt((searchBle.slice(38,40).concat(searchBle.slice(36,38))),16)/10;//目标电压2
                                        charger.capacity = parseInt((searchBle.slice(42,44).concat(searchBle.slice(40,42))),16)/100;//容量
                                        charger.balanceVoltage = parseInt((searchBle.slice(46,48).concat(searchBle.slice(44,46))),16)/10;//均衡电压2
                                        charger.bindingState = parseInt(searchBle.slice(48,50),16);//绑定状态1
                                        charger.chargingState = parseInt(searchBle.slice(50,52),16);//充电状态1
                                        charger.ambientTemperature = parseInt(searchBle.slice(52,54),16);//环境温度1
                                        charger.P_longitude=positionData.longitude;
                                        charger.P_latitude=positionData.latitude;
                                        chargerData.push(charger);
                                        //写入充电器数据库
                                        var actionCharger = sqLite.insertchargerData(chargerData,()=>{});
                                        actionsCharger.push(actionCharger)
                                    }
                                }
                            }
                        }
                    }
                    Promise.all([actionsBattery],[actionsCharger]).then(function () {
                        setTimeout(loop, 60000);
                    });
                };
                setTimeout(loop, 60000);
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
            maximumAge: 1000,
        };
    }

    /**绑定*/
    cbanding(){
        storage.get(PHONE_BIND_STORAGE_KEY, (error, result) => {
            if(result !== '123'){
                bindSingle();
                this.refs.toast.show('开始绑定!',1500)
            }else{
                this.refs.toast.show('已绑定完成!',1500)
            }
        });
        /**蓝牙扫描绑定*/
        this.deviceMap.clear();
        BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                this.refs.bleScan.open();
            }else{
                this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                BleScan = [...this.deviceMap.values()];
                if(BleScan !== undefined){
                    for (let z = 0;z<BleScan.length;z++) {
                        var BleDataArray=commonality.CharToHex(commonality.base64decode(BleScan[z].manufacturerData)).replace(/\\x/g,'').replace(/\s+/g,'').toLowerCase();
                        let InterceptionA=BleDataArray.slice(4,16);
                        let BleScanArrayId = BleScan[z].id.replace(/\:/g, "").toLowerCase();
                        let BleScanId1 = BleScanArrayId.slice(0, 2);
                        let BleScanId2 = BleScanArrayId.slice(2, 4);
                        let BleScanId3 = BleScanArrayId.slice(4, 6);
                        let BleScanId4 = BleScanArrayId.slice(6, 8);
                        let BleScanId5 = BleScanArrayId.slice(8, 10);
                        let BleScanId6 = BleScanArrayId.slice(10, 12);
                        let BleScanId = BleScanId6.concat(BleScanId5, BleScanId4, BleScanId3, BleScanId2, BleScanId1).toLowerCase();

                        var InterceptionB = BleDataArray.slice(20,32);  //截取搜索到蓝牙广播的部分数据
                        var Interception=InterceptionA.concat(InterceptionB);
                        var BleBroadcastID=batteryArray[currentIndex];
                        if(Interception === BroadcastJudgment && BleBroadcastID === BleScanId){
                            // 绑定了一块
                            if (otherIndex === others.length){
                                this.refs.band.success();
                                // 已经全部绑定成功，返回
                                if (currentIndex === batteryArray.length -1) {
                                    storage.get(PHONE_BIND_STORAGE_KEY, (error, result) => {
                                        result = (result || '').replace(result,'123');
                                        storage.save(PHONE_BIND_STORAGE_KEY, result, () => {
                                            if(result == '123'){ 
                                                bleBroadcast.stop();
                                                this.refs.toast_su.success();
                                                this.setState({
                                                    bandingImg: 1
                                                });
                                                return;
                                            }
                                        });
                                    });
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
        });
    }

    goQRCode(){
        this.props.navigation.navigate('CWQRCode')
    }

    abbc(){
        return new Promise((resolve, reject)=>{
            /**蓝牙扫描绑定*/
            this.deviceMap.clear();
            BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    this.refs.bleScan.open();
                    reject(error)
                }else{
                    this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                    var BleS = [...this.deviceMap.values()];
                    resolve(BleS);
                }
            });
        })
    }

    async abuttons(){
        var resff =await this.abbc();
        console.log(resff);
    }

    // 蓝牙广播结束
    componentWillUnmount(){
        // bleBroadcast.stop();
        // BluetoothManager.stopScan();
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
        bleBroadcast.start('0101' ,'382687921502000001f0ffffff01');// 蓝牙广播开始
    }
    //电池2
    banding2(){
        bleBroadcast.start('0101' ,'382687921502000002f0ffffff01');// 蓝牙广播开始
    }
    //电池3
    banding3(){
        bleBroadcast.start('0101' ,'382687921502000003f0ffffff01');// 蓝牙广播开始
    }
    //电池4
    banding4(){
        bleBroadcast.start('0101' ,'382687921502000004f0ffffff01');// 蓝牙广播开始
    }
    //电池5
    banding5(){
        bleBroadcast.start('0101' ,'382687921502000005f0ffffff01');// 蓝牙广播开始
    }
    //电池6
    banding6(){
        bleBroadcast.start('0101' ,'382687921502000006f0ffffff01');// 蓝牙广播开始
    }
    //充电器
    banding7(){
        bleBroadcast.start('0101' ,'382687921502000001f0ffffff00');// 蓝牙广播开始
    }

    aaaa(){  
        bleBroadcast.stop();    
    };  
    bbbb(){
        AsyncStorage.removeItem(PHONE_BIND_STORAGE_KEY,(error)=>{
            if (error == null) {
                alert('解绑成功');
            } else {
                alert('error');
            };    
    })
    }     
    render(){
        return(
            <View style={styles.container}>
                <ToastSuccessAndError ref='toast_su' successMsg='绑定完成' errorMsg='请打开蓝牙'/>
                <ToastSuccessAndError ref='band' successMsg="绑定一个" />
                <Confirm ref='confirm' leftFunc={() => {this.goQRCode()}} rightFunc={() => {}} btnLeftText='去扫码' btnRightText='取消' title='提示' msg='您还未扫码！'/>
                {/*进度条*/}
                <ProgressDialogAlert ref='pmgressbar' title='提示信息' btnText='确定' msg={10}  progress={0.7} width={200} color='red'/>
                <AlertS ref='bleScan' title='提示' btnText='确定' msg='请先打开蓝牙开关！' />

                {/*测试*/}
                <View style={{justifyContent:'space-around',flexDirection:'row'}}>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding1()}>
                        <Text>电池1-01</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding2()}>
                        <Text>电池2-02</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding3()}>
                        <Text>电池3-03</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding4()}>
                        <Text>电池4-04</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding5()}>
                        <Text>电池5-05</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding6()}>
                        <Text>电池6-06</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.banding7()}>
                        <Text>充电器01</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.aaaa()}>
                        <Text>BLE sotp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:35,height:35,backgroundColor:'#0fa'}} onPress={()=>this.bbbb()}>
                        <Text>解绑</Text>
                    </TouchableOpacity> 
                </View>

                {/*顶部电量可行驶里程*/}
                <Text style={styles.mileageText}>还可以骑行30公里</Text> 
                {/*进度条*/}
                <ProgressBarAndroid  styleAttr="Horizontal" color="red" indeterminate={false} progress={0.7} />
                {/*电源、电池按钮*/}
                <View style={styles.BtnView}>
                    {/*充电器按钮*/}
                    {this.state.chargerStorage===0?<View
                        // onPress={() => this.props.navigation.navigate('HomepageData',{chargerImg: 0}) }
                    >
                        <Image style={{width:Dimensions.get('window').width/3,height:Dimensions.get('window').width/2}} source={require('../../img/charger.png')}/>
                    </View>:
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('HomepageData',{chargerImg: 0}) }
                        >
                            <Image style={{width:Dimensions.get('window').width/3,height:Dimensions.get('window').width/2}} source={require('../../img/QRCCharger.png')}/>
                        </TouchableOpacity>}
                    {/*右侧电池按钮*/}
                    <View style={styles.viewRightImage} >
                        {this.state.batteryStorage===1||this.state.batteryStorage===2||this.state.batteryStorage===3||this.state.batteryStorage===4||this.state.batteryStorage===5||this.state.batteryStorage===6?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate('HomepageData', { index: 0 })}
                                style={{justifyContent:'center'}}
                            >
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/QRCBattery.png')}
                                />
                            </TouchableOpacity>:
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/battery.png')}
                                />
                            </View>
                        }
                        {this.state.batteryStorage===2||this.state.batteryStorage===3||this.state.batteryStorage===4||this.state.batteryStorage===5||this.state.batteryStorage===6?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate('HomepageData', { index: 1 })}
                                style={{justifyContent:'center'}}
                            >
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/QRCBattery.png')}
                                />
                            </TouchableOpacity>:
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/battery.png')}
                                />
                            </View>
                        }
                        {this.state.batteryStorage===3||this.state.batteryStorage===4||this.state.batteryStorage===5||this.state.batteryStorage===6?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate('HomepageData', { index: 2 })}
                                style={{justifyContent:'center'}}
                            >
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/QRCBattery.png')}
                                />
                            </TouchableOpacity>:
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/battery.png')}
                                />
                            </View>
                        }
                        {this.state.batteryStorage===4||this.state.batteryStorage===5||this.state.batteryStorage===6?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate('HomepageData', { index: 3 })}
                                style={{justifyContent:'center'}}
                            >
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/QRCBattery.png')}
                                />
                            </TouchableOpacity>:
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/battery.png')}
                                />
                            </View>
                        }
                        {this.state.batteryStorage===5||this.state.batteryStorage===6?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate('HomepageData', { index: 4 })}
                                style={{justifyContent:'center'}}
                            >
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/QRCBattery.png')}
                                />
                            </TouchableOpacity>:
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/battery.png')}
                                />
                            </View>
                        }
                        {this.state.batteryStorage===6?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate('HomepageData', { index: 5 })}
                                style={{justifyContent:'center'}}
                            >
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/QRCBattery.png')}
                                />
                            </TouchableOpacity>:
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={styles.ImagesStyle}
                                    source={require('../../img/battery.png')}
                                />
                            </View>
                        }
                    </View>
                </View>
                {/*绑定按钮*/}
                {this.state.bandingImg===0?
                    <TouchableOpacity style={{position:'absolute',bottom:20,left:20}} onPress={()=>{this.cbanding()}}>
                        <Image style={{width:width/8,height:width/8 }} source={require('../../img/bind.png')}/>
                    </TouchableOpacity>:<View/>}
                <EasyToast
                    ref="toast"
                    style={{backgroundColor:'rgba(0,0,0,0.5)',padding:12}}
                    position='top' 
                />
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    mileageText:{
        fontSize:20,
        textAlign:'center',
        backgroundColor:'#527FE4',
        color:'#fff',
        lineHeight:50,
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
        width:40,
        height:70, 
        // flex:1,   
    }
});

// AppRegistry.registerComponent('CWHome', () => CWHome);