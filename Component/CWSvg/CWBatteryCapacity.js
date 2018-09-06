import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
import * as storage from '../../storage';
// import _ from 'lodash';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
var sqLite = new SQLiteText();
var db;

var battery1capacityData = [];
var battery2capacityData=[];
var battery3capacityData=[];
var battery4capacityData=[];
var battery5capacityData=[];
var battery6capacityData=[];
var promiseValues;
var battery1Time;
var battery2Time;
var battery3Time;
var battery4Time;
var battery5Time;
var battery6Time;
export default class CWBatteryCapacity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
            battery5:[],
            battery6:[],
            isLiked: false,
        };
    }

    async componentDidMount(){
        battery1capacityData = [];
        battery2capacityData=[];
        battery3capacityData=[];
        battery4capacityData=[];
        battery5capacityData=[];
        battery6capacityData=[];
        this.setState({
            isLiked: !this.state.isLiked
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
        Promise.all([promise2]).then((values) => {
            promiseValues=values;
            //查询电池1
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1capacityData.push(u.capacity);
                    }
                    this.setState({
                        battery1:battery1capacityData,
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
                        }
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
                        battery1Time=setTimeout(batteryCapacity1, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity1, 10000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+values[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2capacityData.push(u.capacity);
                    }
                    this.setState({
                        battery2:battery2capacityData,
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
                        }
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
                        battery2Time=setTimeout(batteryCapacity2, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity2, 10000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+values[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3capacityData.push(u.capacity);
                    }
                    this.setState({
                        battery3:battery3capacityData,
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
                        }
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
                        battery3Time=setTimeout(batteryCapacity3, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity3, 10000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+values[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4capacityData.push(u.capacity);
                    }
                    this.setState({
                        battery4:battery4capacityData,
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
                        }
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
                        battery4Time=setTimeout(batteryCapacity4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity4, 10000);

            //查询电池5
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+values[0][4]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery5capacityData.push(u.capacity);
                    }
                    this.setState({
                        battery5:battery5capacityData,
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
                        }
                        if(battery5capacityData.length>18){
                            battery5capacityData.shift();
                            this.setState({
                                battery5:battery5capacityData,
                            });
                        }else {
                            this.setState({
                                battery5:battery5capacityData,
                            });
                        }
                        battery5Time=setTimeout(batteryCapacity5, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity5, 10000);


            //查询电池6
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+values[0][5]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery6capacityData.push(u.capacity);
                    }
                    this.setState({
                        battery6:battery6capacityData,
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
                        }
                        if(battery6capacityData.length>18){
                            battery6capacityData.shift();
                            this.setState({
                                battery6:battery6capacityData,
                            });
                        }else {
                            this.setState({
                                battery6:battery6capacityData,
                            });
                        }
                        battery6Time=setTimeout(batteryCapacity6, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryCapacity6, 10000);
        });
    }
    // 查询历史数据
    historyTime(){
        battery1capacityData = [];
        battery2capacityData=[];
        battery3capacityData=[];
        battery4capacityData=[];
        battery5capacityData=[];
        battery6capacityData=[];
        clearTimeout(battery1Time);
        clearTimeout(battery2Time);
        clearTimeout(battery3Time);
        clearTimeout(battery4Time);
        clearTimeout(battery5Time);
        clearTimeout(battery6Time);
        this.setState({
            isLiked: !this.state.isLiked
        });

        //查询电池1
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery1capacityData.push(u.capacity);
                }
                this.setState({
                    battery1:battery1capacityData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池2
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery2capacityData.push(u.capacity);
                }
                this.setState({
                    battery2:battery2capacityData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池3
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery3capacityData.push(u.capacity);
                }
                this.setState({
                    battery3:battery3capacityData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池4
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery4capacityData.push(u.capacity);
                }
                this.setState({
                    battery4:battery4capacityData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池5
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][4]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery5capacityData.push(u.capacity);
                }
                this.setState({
                    battery5:battery5capacityData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池6
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,capacity from battery where battery_id='"+promiseValues[0][5]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery6capacityData.push(u.capacity);
                }
                this.setState({
                    battery6:battery6capacityData,
                })
            });
        },(error)=>{
            console.log(error);
        });
    }

    componentWillUnmount() {
        clearTimeout(battery1Time);
        clearTimeout(battery2Time);
        clearTimeout(battery3Time);
        clearTimeout(battery4Time);
        clearTimeout(battery5Time);
        clearTimeout(battery6Time);
    }
    render() {
        const option= {
            title: {
                text: '电池容量',
                // align: 'right',
                x: 'center',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4','电池5','电池6'],
                y:'bottom',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {show: true, readOnly: true},//show是否显示表格，readOnly是否只读
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
                data: [0,1, 2, 3, 4, 5, 6,7, 8, 9, 10, 11, 12,13, 14, 15, 16, 17,],
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
                },{
                    name: '电池5',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery5,
                    showSymbol: false,
                },{
                    name: '电池6',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery6,
                    showSymbol: false,
                },
                
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
            <View style={styles.container}>
                <Echarts
                    option={option}
                    width={Dimensions.get('window').width}
                />
                <View style={styles.switching}>
                    {this.state.isLiked?
                        <Text style={styles.selected}>
                            <Text>实时数据</Text>
                        </Text>:
                        <TouchableOpacity style={styles.unselected} onPress={()=>this.componentDidMount()}>
                            <Text>实时数据</Text>
                        </TouchableOpacity>
                    }
                    {this.state.isLiked?
                        <TouchableOpacity style={styles.unselected}  onPress={()=>this.historyTime()}>
                            <Text>历史数据</Text>
                        </TouchableOpacity>:
                        <Text style={styles.selected}>
                            <Text>历史数据</Text>
                        </Text>
                    }
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