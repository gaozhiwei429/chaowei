import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';

import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
import * as storage from '../../storage';
// import _ from 'lodash';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
var sqLite = new SQLiteText();
var db;

var voltageData = [];
var battery1capacityData = [];
var battery2capacityData=[];
var battery3capacityData=[];
var battery4capacityData=[];

class CWBatteryCapacity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
            selectedNodeIndex:[],
        };
    }

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

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
        Promise.all([promise2]).then((values) => {

            //查询电池1
            db.transaction((tx)=>{
                // console.log(values[0][1]);
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1capacityData.push(parseInt(u.capacity));
                        this.setState({
                            battery1:battery1capacityData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity1 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery1capacityData.push(parseInt(u.capacity));
                            if(battery1capacityData.length>18){
                                battery1capacityData.shift();
                                this.setState({
                                    battery1:battery1capacityData,
                                });
                            }else {
                                this.setState({
                                    battery1:battery1capacityData,
                                });
                            }
                        }
                        setTimeout(batteryCapacity1, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity1, 10000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2capacityData.push(parseInt(u.capacity));
                        this.setState({
                            battery2:battery2capacityData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity2 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery2capacityData.push(parseInt(u.capacity));
                            if(battery2capacityData.length>18){
                                battery2capacityData.shift();
                                this.setState({
                                    battery2:battery2capacityData,
                                });
                            }else {
                                this.setState({
                                    battery2:battery2capacityData,
                                });
                            }
                        }
                        setTimeout(batteryCapacity2, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity2, 10000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3capacityData.push(parseInt(u.capacity));
                        this.setState({
                            battery3:battery3capacityData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity3 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery3capacityData.push(parseInt(u.capacity));
                            if(battery3capacityData.length>18){
                                battery3capacityData.shift();
                                this.setState({
                                    battery3:battery3capacityData,
                                });
                            }else {
                                this.setState({
                                    battery3:battery3capacityData,
                                });
                            }
                        }
                        setTimeout(batteryCapacity3, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity3, 10000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4capacityData.push(parseInt(u.capacity));
                        this.setState({
                            battery4:battery4capacityData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity4 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery4capacityData.push(parseInt(u.capacity));
                            if(battery4capacityData.length>18){
                                battery4capacityData.shift();
                                this.setState({
                                    battery4:battery4capacityData,
                                });
                            }else {
                                this.setState({
                                    battery4:battery4capacityData,
                                });
                            }
                        }
                        setTimeout(batteryCapacity4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity4, 10000);
        });
    }
    onChartNodePress(data) {
        console.log(data)
        this.setState({
            selectedNodeIndex: data,
        })
    }
    render() {
        const option= {
            title: {
                text: '容量',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4'],
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {show: true, readOnly: false},//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '',//时间
                data: [0,1, 2, 3, 4, 5, 6,7, 8, 9, 10, 11, 12,13, 14, 15, 16, 17,],
            },
            yAxis: {
                type:'value',
                name : '容量(C)'
            },
            series: [
                {
                    name: '电池1',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery1,
                    showSymbol: false,
                },{
                    name: '电池2',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery2,
                    showSymbol: false,
                }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery3,
                    showSymbol: false,
                },
                {
                    name: '电池4',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery4,
                    showSymbol: false,
                }
            ],
            // visualMap: {//值的大小决定曲线的颜色
            //     top: 10,
            //     right: 10,
            //     pieces: [{
            //         gt: 0,
            //         lte: 50,
            //         color: '#096'
            //     }, {
            //         gt: 50,
            //         lte: 100,
            //         color: '#ffde33'
            //     }, {
            //         gt: 100,
            //         lte: 150,
            //         color: '#ff9933'
            //     }, {
            //         gt: 150,
            //         lte: 200,
            //         color: '#cc0033'
            //     }, {
            //         gt: 200,
            //         lte: 300,
            //         color: '#660099'
            //     }, {
            //         gt: 300,
            //         color: '#7e0023'
            //     }],
            //     outOfRange: {
            //         color: '#999'
            //     }
            // },
        };
        return (
            <View>
                <Echarts
                    option={option}
                    width={Dimensions.get('window').width}
                    onNodePress={(data) => this.onChartNodePress(data)}
                />
            </View>
        );
    }
}


var battery1VoltageData= [];
var battery2VoltageData=[];
var battery3VoltageData=[];
var battery4VoltageData=[];
class CWBatteryVoltage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
        };
    }
    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

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
        Promise.all([promise2]).then((values) => {

            //查询电池1
            db.transaction((tx)=>{
                // console.log(values[0][1]);
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1VoltageData.push(parseInt(u.voltage));
                        this.setState({
                            battery1:battery1VoltageData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryVoltage1 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery1VoltageData.push(parseInt(u.voltage));
                            if(battery1VoltageData.length>18){
                                battery1VoltageData.shift();
                                this.setState({
                                    battery1:battery1VoltageData,
                                });
                            }else {
                                this.setState({
                                    battery1:battery1VoltageData,
                                });
                            }
                        }
                        setTimeout(batteryVoltage1, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage1, 10000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2VoltageData.push(parseInt(u.voltage));
                        this.setState({
                            battery2:battery2VoltageData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryVoltage2 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery2VoltageData.push(parseInt(u.voltage));
                            if(battery2VoltageData.length>18){
                                battery2VoltageData.shift();
                                this.setState({
                                    battery2:battery2VoltageData,
                                });
                            }else {
                                this.setState({
                                    battery2:battery2VoltageData,
                                });
                            }
                        }
                        setTimeout(batteryVoltage2, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage2, 10000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3VoltageData.push(parseInt(u.voltage));
                        this.setState({
                            battery3:battery3VoltageData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryVoltage3 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery3VoltageData.push(parseInt(u.voltage));
                            if(battery3VoltageData.length>18){
                                battery3VoltageData.shift();
                                this.setState({
                                    battery3:battery3VoltageData,
                                });
                            }else {
                                this.setState({
                                    battery3:battery3VoltageData,
                                });
                            }
                        }
                        setTimeout(batteryVoltage3, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage3, 10000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id='"+values[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4VoltageData.push(parseInt(u.voltage));
                        this.setState({
                            battery4:battery4VoltageData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryVoltage4 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,capacity,electric_current from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery4VoltageData.push(parseInt(u.voltage));
                            if(battery4VoltageData.length>18){
                                battery4VoltageData.shift();
                                this.setState({
                                    battery4:battery4VoltageData,
                                });
                            }else {
                                this.setState({
                                    battery4:battery4VoltageData,
                                });
                            }
                        }
                        setTimeout(batteryVoltage4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage4, 10000);
        });
    }
    render() {
        const option= {
            title: {
                text: '电压',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4'],
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {show: true, readOnly: false},//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '',//时间
                data: [0,1, 2, 3, 4, 5, 6,7, 8, 9, 10, 11, 12,13, 14, 15, 16, 17,],
            },
            yAxis: {
                type:'value',
                name : '电压(V)'
            },
            series: [
                {
                    name: '电池1',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery1,
                    showSymbol: false,
                },{
                    name: '电池2',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery2,
                    showSymbol: false,
                }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery3,
                    showSymbol: false,
                },
                {
                    name: '电池4',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery4,
                    showSymbol: false,
                }
            ],
            // visualMap: {//值的大小决定曲线的颜色
            //     top: 10,
            //     right: 10,
            //     pieces: [{
            //         gt: 0,
            //         lte: 50,
            //         color: '#096'
            //     }, {
            //         gt: 50,
            //         lte: 100,
            //         color: '#ffde33'
            //     }, {
            //         gt: 100,
            //         lte: 150,
            //         color: '#ff9933'
            //     }, {
            //         gt: 150,
            //         lte: 200,
            //         color: '#cc0033'
            //     }, {
            //         gt: 200,
            //         lte: 300,
            //         color: '#660099'
            //     }, {
            //         gt: 300,
            //         color: '#7e0023'
            //     }],
            //     outOfRange: {
            //         color: '#999'
            //     }
            // },
        };
        return (
            <View>
                <Echarts option={option}  width={Dimensions.get('window').width}/>
            </View>
        );
    }
}

var battery1TemperatureData= [];
var battery2TemperatureData=[];
var battery3TemperatureData=[];
var battery4TemperatureData=[];
class CWBatteryTemperature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
        };
    }
    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

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
        Promise.all([promise2]).then((values) => {

            //查询电池1
            db.transaction((tx)=>{
                // console.log(values[0][1]);
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1TemperatureData.push(parseInt(u.temperature));
                        this.setState({
                            battery1:battery1TemperatureData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryTemperature1 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery1TemperatureData.push(parseInt(u.temperature));
                            if(battery1TemperatureData.length>18){
                                battery1TemperatureData.shift();
                                this.setState({
                                    battery1:battery1TemperatureData,
                                });
                            }else {
                                this.setState({
                                    battery1:battery1TemperatureData,
                                });
                            }
                        }
                        setTimeout(batteryTemperature1, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature1, 10000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2TemperatureData.push(parseInt(u.temperature));
                        this.setState({
                            battery2:battery2TemperatureData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryTemperature2 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery2TemperatureData.push(parseInt(u.temperature));
                            if(battery2TemperatureData.length>18){
                                battery2TemperatureData.shift();
                                this.setState({
                                    battery2:battery2TemperatureData,
                                });
                            }else {
                                this.setState({
                                    battery2:battery2TemperatureData,
                                });
                            }
                        }
                        setTimeout(batteryTemperature2, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature2, 10000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3TemperatureData.push(parseInt(u.temperature));
                        this.setState({
                            battery3:battery3TemperatureData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryTemperature3 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery3TemperatureData.push(parseInt(u.temperature));
                            if(battery3TemperatureData.length>18){
                                battery3TemperatureData.shift();
                                this.setState({
                                    battery3:battery3TemperatureData,
                                });
                            }else {
                                this.setState({
                                    battery3:battery3TemperatureData,
                                });
                            }
                        }
                        setTimeout(batteryTemperature3, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature3, 10000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4TemperatureData.push(parseInt(u.temperature));
                        this.setState({
                            battery4:battery4TemperatureData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryTemperature4 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery4TemperatureData.push(parseInt(u.temperature));
                            if(battery4TemperatureData.length>18){
                                battery4TemperatureData.shift();
                                this.setState({
                                    battery4:battery4TemperatureData,
                                });
                            }else {
                                this.setState({
                                    battery4:battery4TemperatureData,
                                });
                            }
                        }
                        setTimeout(batteryTemperature4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature4, 10000);
        });
    }
    render() {
        const option= {
            title: {
                text: '温度',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4'],
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {show: true, readOnly: false},//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '',//时间
                data: [0,1, 2, 3, 4, 5, 6,7, 8, 9, 10, 11, 12,13, 14, 15, 16, 17,],
            },
            yAxis: {
                type:'value',
                name : '温度(℃)'
            },
            series: [
                {
                    name: '电池1',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery1,
                    showSymbol: false,
                },{
                    name: '电池2',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery2,
                    showSymbol: false,
                }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery3,
                    showSymbol: false,
                },
                {
                    name: '电池4',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery4,
                    showSymbol: false,
                }
            ],
            // visualMap: {//值的大小决定曲线的颜色
            //     top: 10,
            //     right: 10,
            //     pieces: [{
            //         gt: 0,
            //         lte: 50,
            //         color: '#096'
            //     }, {
            //         gt: 50,
            //         lte: 100,
            //         color: '#ffde33'
            //     }, {
            //         gt: 100,
            //         lte: 150,
            //         color: '#ff9933'
            //     }, {
            //         gt: 150,
            //         lte: 200,
            //         color: '#cc0033'
            //     }, {
            //         gt: 200,
            //         lte: 300,
            //         color: '#660099'
            //     }, {
            //         gt: 300,
            //         color: '#7e0023'
            //     }],
            //     outOfRange: {
            //         color: '#999'
            //     }
            // },
        };
        return (
            <View>
                <Echarts option={option}  width={Dimensions.get('window').width}/>
            </View>
        );
    }
}

var battery1electric_currentData= [];
var battery2electric_currentData=[];
var battery3electric_currentData=[];
var battery4electric_currentData=[];
class CWBatteryelectric_current extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
        };
    }
    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

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
        Promise.all([promise2]).then((values) => {

            //查询电池1
            db.transaction((tx)=>{
                // console.log(values[0][1]);
                tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1electric_currentData.push(parseInt(u.electric_current));
                        this.setState({
                            battery1:battery1electric_currentData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current1 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery1electric_currentData.push(parseInt(u.electric_current));
                            if(battery1electric_currentData.length>18){
                                battery1TemperatureData.shift();
                                this.setState({
                                    battery1:battery1electric_currentData,
                                });
                            }else {
                                this.setState({
                                    battery1:battery1electric_currentData,
                                });
                            }
                        }
                        setTimeout(batteryelectric_current1, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current1, 10000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id='"+values[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2electric_currentData.push(parseInt(u.electric_current));
                        this.setState({
                            battery2:battery2electric_currentData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current2 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery2electric_currentData.push(parseInt(u.electric_current));
                            if(battery2electric_currentData.length>18){
                                battery2electric_currentData.shift();
                                this.setState({
                                    battery2:battery2electric_currentData,
                                });
                            }else {
                                this.setState({
                                    battery2:battery2electric_currentData,
                                });
                            }
                        }
                        setTimeout(batteryelectric_current2, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current2, 10000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id='"+values[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3electric_currentData.push(parseInt(u.electric_current));
                        this.setState({
                            battery3:battery3electric_currentData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current3 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery3electric_currentData.push(parseInt(u.electric_current));
                            if(battery3electric_currentData.length>18){
                                battery3electric_currentData.shift();
                                this.setState({
                                    battery3:battery3electric_currentData,
                                });
                            }else {
                                this.setState({
                                    battery3:battery3electric_currentData,
                                });
                            }
                        }
                        setTimeout(batteryelectric_current3, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current3, 10000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id='"+values[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4electric_currentData.push(parseInt(u.electric_current));
                        this.setState({
                            battery4:battery4electric_currentData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current4 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery4electric_currentData.push(parseInt(u.electric_current));
                            if(battery4electric_currentData.length>18){
                                battery4electric_currentData.shift();
                                this.setState({
                                    battery4:battery4electric_currentData,
                                });
                            }else {
                                this.setState({
                                    battery4:battery4electric_currentData,
                                });
                            }
                        }
                        setTimeout(batteryelectric_current4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current4, 10000);
        });
    }
    render() {
        const option= {
            title: {
                text: '电流',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4'],
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {show: true, readOnly: false},//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '',//时间
                data: [0,1, 2, 3, 4, 5, 6,7, 8, 9, 10, 11, 12,13, 14, 15, 16, 17,],
            },
            yAxis: {
                type:'value',
                name : '电流(A)'
            },
            series: [
                {
                    name: '电池1',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery1,
                    showSymbol: false,
                },{
                    name: '电池2',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery2,
                    showSymbol: false,
                }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery3,
                    showSymbol: false,
                },
                {
                    name: '电池4',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery4,
                    showSymbol: false,
                }
            ],
            // visualMap: {//值的大小决定曲线的颜色
            //     top: 10,
            //     right: 10,
            //     pieces: [{
            //         gt: 0,
            //         lte: 50,
            //         color: '#096'
            //     }, {
            //         gt: 50,
            //         lte: 100,
            //         color: '#ffde33'
            //     }, {
            //         gt: 100,
            //         lte: 150,
            //         color: '#ff9933'
            //     }, {
            //         gt: 150,
            //         lte: 200,
            //         color: '#cc0033'
            //     }, {
            //         gt: 200,
            //         lte: 300,
            //         color: '#660099'
            //     }, {
            //         gt: 300,
            //         color: '#7e0023'
            //     }],
            //     outOfRange: {
            //         color: '#999'
            //     }
            // },
        };
        return (
            <View>
                <Echarts option={option}  width={Dimensions.get('window').width}/>
            </View>
        );
    }
}

class CWESV extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[10,20,30,20,43,53,23,53,34,12,43,54,64,65,34,54,34,24,34,56,45,23,54,34,65],
            text: 'text'
        };
    }

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //建表
        // sqLite.createTable();
        //删除数据
        // sqLite.deleteData();

        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,my_timestamp,voltage from battery order by id desc limit 25", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    voltageData.push(u.voltage);
                    this.setState({
                        data:voltageData,
                    })
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,my_timestamp,voltage,capacity from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        voltageData.push(u.voltage);
                        if(voltageData.length>25){
                            voltageData.shift();
                            this.setState({
                                data:voltageData,
                            });
                        }else {
                            this.setState({
                                data:voltageData,
                            });
                        }
                    }
                    setTimeout(loop, 10000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 10000);

    }

    render() {
        const option= {
            title: {
                text: '电压',
            },
            //点击某一个点的数据的时候，显示出悬浮窗
            // tooltip : {
            //     trigger: 'item',//item,axis,none
            // },

            //可以手动选择现实几个图标
            legend: {
                data:['电池1','电池2','电池3','电池4',]
            },

            //图形的颜色组
            color:['rgb(249,159,94)','rgb(67,205,126)','#cc0033','#660099'],//

            xAxis: {
                data: [0,1, 2, 3, 4, 5, 6,7, 8, 9, 10, 11, 12,13, 14, 15, 16, 17, 18,19, 20, 21, 22, 23, 24],
            },
            yAxis: {
                type:'value',
                name : '电压(V)',
                boundaryGap: [0, '50%'],
            },
            series: [{
                name: '电池1',
                type: 'line',
                smooth:true,
                data: this.state.data,
                showSymbol: false,
            },{
                name: '电池2',
                type: 'line',
                smooth:true,
                data: [400,600,232,244,543,325,345,235,899,234,345,345,323,],
                showSymbol: false,

            }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: [543,325,345,235,400,600,232,244,899,234,345,345,323,],
                    showSymbol: false,

                },{
                name: '电池4',
                type: 'line',
                smooth:true,
                data: [899,234,345,345,323,543,325,345,235,400,600,232,244,899,234,345,345,323,],
                showSymbol: false,

            }],
            //值的大小决定曲线的颜色
            // visualMap: {
            //     top: 10,
            //     right: 10,
            //     pieces: [{
            //         gt: 0,
            //         lte: 50,
            //         color: '#096'
            //     }, {
            //         gt: 50,
            //         lte: 100,
            //         color: '#ffde33'
            //     }, {
            //         gt: 100,
            //         lte: 150,
            //         color: '#ff9933'
            //     }, {
            //         gt: 150,
            //         lte: 200,
            //         color: '#cc0033'
            //     }, {
            //         gt: 200,
            //         lte: 300,
            //         color: '#660099'
            //     }, {
            //         gt: 300,
            //         color: '#7e0023'
            //     }],
            //     outOfRange: {
            //         color: '#999'
            //     }
            // },

            // dataZoom: [
            //     {   // 这个dataZoom组件，默认控制x轴。
            //         type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            //         start: 50,        // 左边在 50% 的位置。
            //         end: 100,         // 右边在 100% 的位置。
            //     }
            // ],
        };
        return (
            <Echarts option={option}  width={Dimensions.get('window').width}/>
        );
    }
}

export default class CWEchart extends Component{
    render() {
        return(
            <ScrollView>
                <CWBatteryCapacity/>{/*容量*/}
                {/*<CWBatteryVoltage/>/!*电压*!/*/}
                {/*<CWBatteryTemperature/>/!*温度*!/*/}
                {/*<CWBatteryelectric_current/>/!*电流*!/*/}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 20,
        marginBottom: 20,
    },
    echartstyle: {
        height: 50,
        width: 100,
    },
    button: {
        backgroundColor: '#d9534f',
        padding: 8,
        borderRadius: 4,
        marginBottom: 20
    }
});