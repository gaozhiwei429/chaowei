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

var battery1VoltageData= [];
var battery2VoltageData=[];
var battery3VoltageData=[];
var battery4VoltageData=[];
var promiseValues;
var battery1Time;
var battery2Time;
var battery3Time;
var battery4Time;
export default class CWBatteryVoltage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
            isLiked: false,
        };
    }
    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){
        battery1VoltageData= [];
        battery2VoltageData=[];
        battery3VoltageData=[];
        battery4VoltageData=[];
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
                // console.log(values[0][1]);
                tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
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
                    tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
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
                        battery1Time=setTimeout(batteryVoltage1, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage1, 10000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+values[0][1]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
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
                    tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
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
                        battery2Time=setTimeout(batteryVoltage2, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage2, 10000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+values[0][2]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
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
                    tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
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
                        battery3Time=setTimeout(batteryVoltage3, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage3, 10000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+values[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
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
                    tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
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
                        battery4Time=setTimeout(batteryVoltage4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryVoltage4, 10000);
        });
    }

    async historyTime(){
        battery1VoltageData=[];
        battery2VoltageData=[];
        battery3VoltageData=[];
        battery4VoltageData=[];
        clearInterval(battery1Time);
        clearInterval(battery2Time);
        clearInterval(battery3Time);
        clearInterval(battery4Time);
        this.setState({
            isLiked: !this.state.isLiked
        });
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询电池1
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+promiseValues[0][0]+"' order by my_timestamp  limit 18", [],(tx,results)=>{
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

        //查询电池2
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+promiseValues[0][1]+"' order by my_timestamp  limit 18", [],(tx,results)=>{
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

        //查询电池3
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+promiseValues[0][2]+"' order by my_timestamp  limit 18", [],(tx,results)=>{
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

        //查询电池4
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,voltage from battery where battery_id='"+promiseValues[0][3]+"' order by my_timestamp  limit 18", [],(tx,results)=>{
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
                // orient: 'vertical',//改变icon的布局朝向
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
            <View style={styles.container}>
                <Echarts
                    option={option}
                    width={Dimensions.get('window').width}
                />
                <View style={styles.switching}>
                    {this.state.isLiked?
                        <TouchableOpacity style={styles.selected}>
                            <Text>实时数据</Text>
                        </TouchableOpacity>:
                        <TouchableOpacity style={styles.unselected} onPress={()=>this.componentDidMount()}>
                            <Text>实时数据</Text>
                        </TouchableOpacity>
                    }
                    {this.state.isLiked?
                        <TouchableOpacity style={styles.unselected}  onPress={()=>this.historyTime()}>
                            <Text>历史数据</Text>
                        </TouchableOpacity>:
                        <TouchableOpacity style={styles.selected}>
                            <Text>历史数据</Text>
                        </TouchableOpacity>
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