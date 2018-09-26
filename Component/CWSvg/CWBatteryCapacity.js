import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Alert,
    Image
} from 'react-native';

import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
import * as storage from '../../storage';
// import _ from 'lodash';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
import * as commonality from '../../commonality';
var sqLite = new SQLiteText();
var db;

var battery1capacityData = [];
var battery2capacityData=[];
var battery3capacityData=[];
var battery4capacityData=[];
var battery5capacityData=[];
var battery6capacityData=[];
var batteryWriteTime = [];
var promiseValues;
export default class CWBatteryCapacity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ybattery1:[],
            ybattery2:[],
            ybattery3:[],
            ybattery4:[],
            ybattery5:[],
            ybattery6:[],
            previous:0,
            xTime:[],
        };
    }

    async componentDidMount(){
        battery1capacityData = [];
        battery2capacityData=[];
        battery3capacityData=[];
        battery4capacityData=[];
        battery5capacityData=[];
        battery6capacityData=[];
        batteryWriteTime = [];
        this.setState({
            previous:0,
        });
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

        {/*

        Promise.all([promise2]).then((values) => {
            promiseValues=values;
            //查询电池1
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][0]+"' ORDER BY id DESC )  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1capacityData.push(u.capacity);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery1:battery1capacityData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });
            const batteryCapacity1 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery1capacityData.push(u.capacity);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery1capacityData.length>18 && writeTime.length>18){
                            battery1capacityData.shift();
                            writeTime.shift();
                            this.setState({
                                battery1:battery1capacityData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery1:battery1capacityData,
                                writeTime,
                            });
                        }
                        this.battery1Time=setTimeout(batteryCapacity1, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            this.battery1Time=setTimeout(batteryCapacity1, 60000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][1]+"' ORDER BY id DESC )  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2capacityData.push(u.capacity);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery2:battery2capacityData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity2 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery2capacityData.push(u.capacity);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery2capacityData.length>18 && writeTime.length>18){
                            battery2capacityData.shift();
                            writeTime.shift();
                            this.setState({
                                battery2:battery2capacityData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery2:battery2capacityData,
                                writeTime,
                            });
                        }
                        this.battery2Time=setTimeout(batteryCapacity2, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            this.battery2Time=setTimeout(batteryCapacity2, 60000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][2]+"' ORDER BY id DESC )  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3capacityData.push(u.capacity);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery3:battery3capacityData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity3 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery3capacityData.push(u.capacity);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery3capacityData.length>18 && writeTime.length>18){
                            battery3capacityData.shift();
                            writeTime.shift();
                            this.setState({
                                battery3:battery3capacityData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery3:battery3capacityData,
                                writeTime,
                            });
                        }
                        this.battery3Time=setTimeout(batteryCapacity3, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            this.battery3Time=setTimeout(batteryCapacity3, 60000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][3]+"' ORDER BY id DESC )  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4capacityData.push(u.capacity);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery4:battery4capacityData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity4 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery4capacityData.push(u.capacity);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery4capacityData.length>18 && writeTime.length>18){
                            battery4capacityData.shift();
                            writeTime.shift();
                            this.setState({
                                battery4:battery4capacityData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery4:battery4capacityData,
                                writeTime,
                            });
                        }
                        this.battery4Time=setTimeout(batteryCapacity4, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            this.battery4Time=setTimeout(batteryCapacity4, 60000);

            //查询电池5
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][4]+"' ORDER BY id DESC)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery5capacityData.push(u.capacity);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery5:battery5capacityData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity5 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id= '"+values[0][4]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery5capacityData.push(u.capacity);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery5capacityData.length>18&& writeTime.length>18){
                            battery5capacityData.shift();
                            writeTime.shift();
                            this.setState({
                                battery5:battery5capacityData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery5:battery5capacityData,
                                writeTime,
                            });
                        }
                        this.battery5Time=setTimeout(batteryCapacity5, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            this.battery5Time=setTimeout(batteryCapacity5, 60000);


            //查询电池6
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][5]+"' ORDER BY id DESC)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery6capacityData.push(u.capacity);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery6:battery6capacityData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryCapacity6 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id= '"+values[0][5]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery6capacityData.push(u.capacity);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(my_timestamp));
                        if(battery6capacityData.length>18 && writeTime.length>18){
                            battery6capacityData.shift();
                            writeTime.shift();
                            this.setState({
                                battery6:battery6capacityData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery6:battery6capacityData,
                                writeTime,
                            });
                        }
                        this.battery6Time=setTimeout(batteryCapacity6, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            this.battery6Time=setTimeout(batteryCapacity6, 60000);
        });

        */}


        //蓄电池存储数据
        const dataVoltage = await Promise.all([promise2]);

        //查询数据库总数据
        let voltageData = new Promise(function (resolve,reject){
            return db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id order by my_timestamp asc", [],(tx,results)=>{
                    var len = results.rows.length;
                    let voltageData=[];
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        voltageData.push(u);
                    }
                    resolve(voltageData);
                });
            },(error)=>{
                reject(error);
            });
        })

        const capacity = await Promise.all([voltageData]);
        
        const repeatTime=capacity[0].map((item,i) => {
            return item.my_timestamp
        })

        //时间去重后排序
        const xTime = Array.from(new Set(repeatTime)).sort(function(a, b){
            return a > b ? 1 : -1; // 这里改为大于号
        })
        
        //电池1
        const battery1 = capacity[0].map((item,i)=>{
            if(dataVoltage[0][0]==capacity[0][i].battery_id){
                return item
            }
        }).filter(function(val){//过滤掉undefined
            return !(!val || val === "");
        })

        const battery1Time=battery1.map(item=>{
            return item.my_timestamp
        })

        //获取两个数组的差集且向原数组中push
        var difference1Time=xTime.filter(function(v){ return battery1Time.indexOf(v) == -1 })
        difference1Time.map(item=>{
            return battery1.push(
                {my_timestamp:item,capacity:null,battery_id:dataVoltage[0][0]}
                )
        })

        const ybattery1 = battery1.sort(function(a, b) {
            if (a.my_timestamp < b.my_timestamp ) {
                return -1;
            } else if (a.my_timestamp > b.my_timestamp ) {
                return 1;
            } else {
                if (a.my_timestamp < b.my_timestamp ) {
                    return 1;
                } else if (a.my_timestamp > b.my_timestamp ) {
                    return -1;
                }
                return 0;
            }
        }).map(item=>{
            return item.capacity
        })


        //电池2
        const battery2 = capacity[0].map((item,i)=>{
            if(dataVoltage[0][1]==capacity[0][i].battery_id){
                return item
            }
        }).filter(function(val){//过滤掉undefined
            return !(!val || val === "");
        })

        const battery2Time=battery2.map(item=>{
            return item.my_timestamp
        })

        //获取两个数组的差集且向原数组中push
        var difference2Time=xTime.filter(function(v){ return battery2Time.indexOf(v) == -1 })
        difference2Time.map(item=>{
            return battery2.push(
                {my_timestamp:item,capacity:null,battery_id:dataVoltage[0][1]}
                )
        })
        
        const ybattery2 = battery2.sort(function(a, b) {
            if (a.my_timestamp < b.my_timestamp ) {
                return -1;
            } else if (a.my_timestamp > b.my_timestamp ) {
                return 1;
            } else {
                if (a.my_timestamp < b.my_timestamp ) {
                    return 1;
                } else if (a.my_timestamp > b.my_timestamp ) {
                    return -1;
                }
                return 0;
            }
        }).map(item=>{
            return item.capacity
        })

        //电池3  
        const battery3 = capacity[0].map((item,i)=>{
            if(dataVoltage[0][2]==capacity[0][i].battery_id){
                return item
            }
        }).filter(function(val){//过滤掉undefined
            return !(!val || val === "");
        })

        const battery3Time=battery3.map(item=>{
            return item.my_timestamp
        })

        //获取两个数组的差集且向原数组中push
        var difference3Time=xTime.filter(function(v){ return battery3Time.indexOf(v) == -1 })
        difference3Time.map(item=>{
            return battery3.push(
                {my_timestamp:item,capacity:null,battery_id:dataVoltage[0][2]}
                )
        })
        const ybattery3 = battery3.sort(function(a, b) {
            if (a.my_timestamp < b.my_timestamp ) {
                return -1;
            } else if (a.my_timestamp > b.my_timestamp ) {
                return 1;
            } else {
                if (a.my_timestamp < b.my_timestamp ) {
                    return 1;
                } else if (a.my_timestamp > b.my_timestamp ) {
                    return -1;
                }
                return 0;
            }
        }).map(item=>{
            return item.capacity
        })

        //电池4 
        const battery4 = capacity[0].map((item,i)=>{
            if(dataVoltage[0][3]==capacity[0][i].battery_id){
                return item
            }
        }).filter(function(val){//过滤掉undefined
            return !(!val || val === "");
        })

        const battery4Time=battery4.map(item=>{
            return item.my_timestamp
        })

        //获取两个数组的差集且向原数组中push
        var difference4Time=xTime.filter(function(v){ return battery4Time.indexOf(v) == -1 })
        difference4Time.map(item=>{
            return battery4.push(
                {my_timestamp:item,capacity:null,battery_id:dataVoltage[0][3]}
                )
        })
        const ybattery4 = battery4.sort(function(a, b) {
            if (a.my_timestamp < b.my_timestamp ) {
                return -1;
            } else if (a.my_timestamp > b.my_timestamp ) {
                return 1;
            } else {
                if (a.my_timestamp < b.my_timestamp ) {
                    return 1;
                } else if (a.my_timestamp > b.my_timestamp ) {
                    return -1;
                }
                return 0;
            }
        }).map(item=>{
            return item.capacity
        })

        //电池5
        const battery5 = capacity[0].map((item,i)=>{
            if(dataVoltage[0][4]==capacity[0][i].battery_id){
                return item
            }
        }).filter(function(val){//过滤掉undefined
            return !(!val || val === "");
        })

        const battery5Time=battery5.map(item=>{
            return item.my_timestamp
        })

        //获取两个数组的差集且向原数组中push
        var difference5Time=xTime.filter(function(v){ return battery5Time.indexOf(v) == -1 })
        difference5Time.map(item=>{
            return battery5.push(
                {my_timestamp:item,capacity:null,battery_id:dataVoltage[0][4]}
                )
        })
        const ybattery5 = battery5.sort(function(a, b) {
            if (a.my_timestamp < b.my_timestamp ) {
                return -1;
            } else if (a.my_timestamp > b.my_timestamp ) {
                return 1;
            } else {
                if (a.my_timestamp < b.my_timestamp ) {
                    return 1;
                } else if (a.my_timestamp > b.my_timestamp ) {
                    return -1;
                }
                return 0;
            }
        }).map(item=>{
            return item.capacity
        })


        //电池6
        const battery6 = capacity[0].map((item,i)=>{
            if(dataVoltage[0][5]==capacity[0][i].battery_id){
                return item
            }
        }).filter(function(val){//过滤掉undefined
            return !(!val || val === "");
        })

        const battery6Time=battery6.map(item=>{
            return item.my_timestamp
        })

        //获取两个数组的差集且向原数组中push
        var difference6Time=xTime.filter(function(v){ return battery6Time.indexOf(v) == -1 })
        difference6Time.map(item=>{
            return battery6.push(
                {my_timestamp:item,capacity:null,battery_id:dataVoltage[0][5]}
                )
        })
        const ybattery6 = battery6.sort(function(a, b) {
            if (a.my_timestamp < b.my_timestamp ) {
                return -1;
            } else if (a.my_timestamp > b.my_timestamp ) {
                return 1;
            } else {
                if (a.my_timestamp < b.my_timestamp ) {
                    return 1;
                } else if (a.my_timestamp > b.my_timestamp ) {
                    return -1;
                }
                return 0;
            }
        }).map(item=>{
            return item.capacity
        })

        this.setState({
            ybattery1,
            ybattery2,
            ybattery3,
            ybattery4,
            ybattery5,
            ybattery6,
            xTime
        })
    }
    // 查询历史数据
    historyTime(whether){
        battery1capacityData = [];
        battery2capacityData=[];
        battery3capacityData=[];
        battery4capacityData=[]; 
        battery5capacityData=[];
        battery6capacityData=[];
        batteryWriteTime = [];
        this.battery1Time && clearTimeout(this.battery1Time);
        this.battery2Time && clearTimeout(this.battery2Time);
        this.battery3Time && clearTimeout(this.battery3Time);
        this.battery4Time && clearTimeout(this.battery4Time);
        this.battery5Time && clearTimeout(this.battery5Time);
        this.battery6Time && clearTimeout(this.battery6Time);
        if(whether===0){
            this.setState({
                previous:this.state.previous+18,
            });
        }else{
            if(this.state.previous-18<0){
                Alert.alert('','sorry，查到最顶部没有数据了！',[{
                    text:'确定',onPress:()=>{}   
                }])
                return;  
            }
            this.setState({
                previous:this.state.previous-18,
            });
        }
                
        //查询电池1
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][0]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                //"SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][0]+"' ORDER BY id DESC LIMIT 18)  AS chargerTab ORDER BY my_timestamp ASC"
                //"select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][1]+"' order by my_timestamp desc limit 18"
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery1capacityData.push(u.capacity);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery1:battery1capacityData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池2
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][1]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery2capacityData.push(u.capacity);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery2:battery2capacityData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池3
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][2]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery3capacityData.push(u.capacity);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery3:battery3capacityData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池4
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][3]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery4capacityData.push(u.capacity);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery4:battery4capacityData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池5
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][4]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery5capacityData.push(u.capacity);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery5:battery5capacityData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池6
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,capacity FROM (SELECT id,battery_id,my_timestamp,capacity FROM battery WHERE battery_id='"+promiseValues[0][5]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery6capacityData.push(u.capacity);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery6:battery6capacityData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });
    }

    componentWillUnmount() {
        this.battery1Time && clearTimeout(this.battery1Time);
        this.battery2Time && clearTimeout(this.battery2Time);
        this.battery3Time && clearTimeout(this.battery3Time);
        this.battery4Time && clearTimeout(this.battery4Time);
        this.battery5Time && clearTimeout(this.battery5Time);
        this.battery6Time && clearTimeout(this.battery6Time);
    }
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>蓄电池容量数据</Text>), 
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
        const option= {
            title: {
                text: '',
                // align: 'right',
                x: 'center',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4','电池5','电池6'],
                top:'top',       
                left:'20%',
                right:'20%',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: true,
                        readOnly: true,
                        optionToContent: function(opt) {
                            var axisData = opt.xAxis[0].data;
                            var series = opt.series;
                            var table = '<div style="height:350px;overflow:auto"><table style="width:100%;text-align:center;"><tbody><tr>'
                                         + '<td>时间</td>'
                                         + '<td>' + series[0].name + '</td>'
                                         + '<td>' + series[1].name + '</td>'
                                         + '<td>' + series[2].name + '</td>'
                                         + '<td>' + series[3].name + '</td>'
                                         + '<td>' + series[4].name + '</td>'
                                         + '<td>' + series[5].name + '</td>'
                                         + '</tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                table += '<tr>'
                                         + '<td>' + axisData[i] + '</td>'
                                         + '<td>' + series[0].data[i] + '</td>'
                                         + '<td>' + series[1].data[i] + '</td>'
                                         + '<td>' + series[2].data[i] + '</td>'
                                         + '<td>' + series[3].data[i] + '</td>'
                                         + '<td>' + series[4].data[i] + '</td>'
                                         + '<td>' + series[5].data[i] + '</td>'
                                         + '</tr>';
                            }
                            table += '</tbody></table></div>';
                            return table;
                        },
                    },//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)','rgb(255, 0, 203)','rgb(0,0,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.xTime.map(function(item){
                    return commonality.replaceTime(item);  
                }),    
                axisLabel:{ 
                    textStyle:{ 
                        fontSize: 9,
                    }
                }
            },
            yAxis: {
                type:'value',
                name : '容量(C)'
            },
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 80,
                end: 100,
                // realtime:false,
            },
            series: [
                {
                    name: '电池1',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery1,
                    showSymbol: false,
                    connectNulls:true,
                },{
                    name: '电池2',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery2,
                    showSymbol: false,
                    connectNulls:true,
                }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery3,
                    showSymbol: false,
                    connectNulls:true,
                },
                {
                    name: '电池4',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery4,
                    showSymbol: false,
                    connectNulls:true,
                },{
                    name: '电池5',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery5,
                    showSymbol: false,
                    connectNulls:true,
                },{
                    name: '电池6',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery6,
                    showSymbol: false,
                    connectNulls:true,
                },
                
            ],
        };
        return (
            <View style={styles.container}>
                <Echarts
                    option={option}
                    width={Dimensions.get('window').width}
                />
                <View style={styles.switching}>
                    {/* <TouchableOpacity style={styles.selected} onPress={()=>this.componentDidMount()}>
                        <Text>实时数据</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(1)}>
                        <Text>上一页</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(0)}>
                        <Text>下一页</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 30,
    },
    switching:{
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection:'row',
        flex:1,
    },
    selected:{
        width:100,
        height:40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#3BB6FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unselected:{
        width:100,
        height:40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#F8F8FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    }
});