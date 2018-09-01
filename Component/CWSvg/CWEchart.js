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