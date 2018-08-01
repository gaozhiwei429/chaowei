import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    Dimensions,
} from 'react-native';
import SQLite from './sqlite';
// import TimerMixin from 'react-timer-mixin';
import {BATTERY_BIND_STORAGE_KEY, CHARGER_BIND_STORAGE_KEY} from "../../config";
import * as storage from "../../storage";

import { LineChart, YAxis,XAxis, Grid } from 'react-native-svg-charts';
const data = [ 30, 10, 40, 15, 4, 24, 35, 41, 35, 53, 13, ];

// var reactMixin = require('react-mixin');
var sqLite = new SQLite();
var db;


function padding(num, length) {
    for(var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
    }
    return num;
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
var Identifier = '382687921502'; //识别码固定值
var batteryArray;
var BleData;

export default class SQLiteDemo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            charger_id:"",
            my_timestamp:"",
            capacity:"",
            temperature:"",
            equilibrium_time:"",
            P_longitude:'',
            P_latitude:'',
            BleData:[],
        };
        this.deviceMap = new Map();
    }

    // mixins=[TimerMixin];

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    componentDidMount(){
        //蓝牙搜索
        this.deviceMap.clear();
        BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                if (error.code === 102) {
                    alert('请打开手机蓝牙后再搜索');
                }
                // console.log(error);
            } else {
                this.deviceMap.set(device.id, device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                // this.setState( {BleData: [...this.deviceMap.values()]} )
                BleData = [...this.deviceMap.values()];
                // console.log(BleData,1234)
            }
        });

        // 充电器
        let promise1=new Promise(function (resolve, reject) {
            return storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            })}
        );

        // 电池
        let promise2=new Promise(function (resolve,reject) {
            return storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            })}
        );

        Promise.all([promise1,promise2]).then((values) => {
            batteryArray = [].concat.apply([], values);//绑定电池与充电器合并后的数组

            //开启数据库
            if(!db){
                db = sqLite.open();
            }
            //建表
            sqLite.createTable();
            //删除数据
            // sqLite.dropTable();
            // sqLite.deleteData();

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
                        console.log(BleData);
                        console.log('-----------------------------------');

                        if(BleData !== undefined){
                            for (var i = 0;i<BleData.length;i++) {
                                var searchBle = CharToHex(base64decode(BleData[i].manufacturerData)).replace(/\\x/g, '').replace(/\s+/g, '');

                                var batteryArrayID = BleData[i].id.replace(/\:/g, "");
                                var batteryArrayID1 = batteryArrayID.slice(0, 2);
                                var batteryArrayID2 = batteryArrayID.slice(2, 4);
                                var batteryArrayID3 = batteryArrayID.slice(4, 6);
                                var batteryArrayID4 = batteryArrayID.slice(6, 8);
                                var batteryArrayID5 = batteryArrayID.slice(8, 10);
                                var batteryArrayID6 = batteryArrayID.slice(10, 12);
                                var batteryID = batteryArrayID6.concat(batteryArrayID5, batteryArrayID4, batteryArrayID3, batteryArrayID2, batteryArrayID1);

                                var batteryIdentifier = searchBle.slice(4, 16);
                                if (batteryIdentifier === Identifier) {//确认识别码
                                    if(batteryArray !== undefined){
                                        for (var r=0;r<batteryArray.length;r++){
                                            if(batteryArray[r] === batteryID){
                                                // 模拟数据
                                                var batteryData = [];
                                                var battery = {};
                                                battery.charger_id = batteryID;
                                                battery.my_timestamp = time;
                                                battery.voltage = parseInt(searchBle.slice(20,24),16);
                                                battery.temperature = parseInt(searchBle.slice(24,26),16);
                                                battery.capacity = parseInt(searchBle.slice(26,30),16);
                                                battery.equilibrium_time = parseInt(searchBle.slice(30,34),16);
                                                battery.P_longitude=positionData.longitude;
                                                battery.P_latitude=positionData.latitude;
                                                batteryData.push(battery);
                                                //插入数据
                                                sqLite.insertbatteryData(batteryData, () => {
                                                    //查询
                                                    db.transaction((tx)=>{

                                                        tx.executeSql("select id,charger_id,my_timestamp,temperature,capacity,equilibrium_time from user order by id desc limit 1", [],(tx,results)=>{
                                                            var len = results.rows.length;
                                                            for(let i=0; i<len; i++){
                                                                var u = results.rows.item(i);
                                                                this.setState({
                                                                    charger_id:u.charger_id,
                                                                    my_timestamp:u.my_timestamp,
                                                                    temperature:u.temperature,
                                                                    capacity:u.capacity,
                                                                    equilibrium_time:u.equilibrium_time,
                                                                });
                                                                if(u.capacity !== ''){
                                                                    var datacapacity = parseInt(u.capacity);
                                                                    if(data.length>10){
                                                                        data.shift();
                                                                        data.push(datacapacity);
                                                                    }else {
                                                                        console.log('1');
                                                                    }
                                                                }
                                                            }
                                                            setTimeout(loop, 5000);
                                                        });
                                                    },(error)=>{
                                                        console.log(error);
                                                    });
                                                });
                                            }
                                        }
                                    }else {
                                        alert('请及时绑定充电器或电池')
                                    }
                                }
                            }
                        }else {
                            alert('请检查蓝牙是否开启');
                        }
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
        });

    }
    render(){
        const contentInset = { top: 20, bottom: 20 };
        return (
            <View style={{flex:1,marginTop:Dimensions.get('window').height > Dimensions.get('window').width ? 50 : 0 }}>
                <Text>
                    姓名:{this.state.charger_id}
                </Text>
                <Text>
                    年龄：{this.state.my_timestamp}
                </Text>
                <Text>
                    电话：{this.state.temperature}
                </Text>
                <Text>
                    Email：{this.state.capacity}
                </Text>
                <Text>
                    地址：{this.state.equilibrium_time}
                </Text>

                <View style={{ height: 300, padding: 10 ,flexDirection: 'row' }}>
                    <YAxis
                        style={{ width:30, }}
                        data={ data }
                        contentInset={ contentInset }
                        svg={{
                            fill: 'grey',
                            fontSize: 15,
                        }}
                        numberOfTicks={ 5 }
                        formatLabel={ (value,index) => `${value}`}
                    />
                    <LineChart
                        style={{ flex: 1,marginLeft: 10 }}
                        data={ data }
                        gridMin={ 0 }
                        contentInset={{ top: 17, bottom: 3 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                </View>
                <View style={{ height: 40, padding: 20,paddingTop:0}}>
                    <XAxis
                        style={{ marginHorizontal: -10 ,marginLeft: 16}}
                        data={ data }
                        formatLabel={ (value, index) => index }
                        contentInset={{ left: 15,  right: 4 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View>
        );
    }
}

// reactMixin(SQLiteDemo.prototype, TimerMixin);