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
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
var sqLite = new SQLiteText();
var db;

var battery1TemperatureData= [];
var battery2TemperatureData= [];
var battery3TemperatureData= [];
var battery4TemperatureData= [];
var battery5TemperatureData= [];
var battery6TemperatureData= [];
var promiseValues;
var battery1Time;
var battery2Time;
var battery3Time;
var battery4Time;
var battery5Time;
var battery6Time;
export default class CWBatteryTemperature extends Component {
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
        battery1TemperatureData= [];
        battery2TemperatureData=[];
        battery3TemperatureData=[];
        battery4TemperatureData=[];
        battery5TemperatureData=[];
        battery6TemperatureData=[];
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
        Promise.all([promise2]).then((values)=>{
            promiseValues=values;
            //查询电池1
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1TemperatureData.push(u.temperature);
                    }
                    this.setState({
                        battery1:battery1TemperatureData,
                    })
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
                            battery1TemperatureData.push(u.temperature);
                        }
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
                        battery1Time=setTimeout(batteryTemperature1, 10000);
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
                        battery2TemperatureData.push(u.temperature);
                    }
                    this.setState({
                        battery2:battery2TemperatureData,
                    })
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
                            battery2TemperatureData.push(u.temperature);
                        }
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
                        battery2Time=setTimeout(batteryTemperature2, 10000);
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
                        battery3TemperatureData.push(u.temperature);
                    }
                    this.setState({
                        battery3:battery3TemperatureData,
                    })
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
                            battery3TemperatureData.push(u.temperature);
                        }
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
                        battery3Time=setTimeout(batteryTemperature3, 10000);
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
                        battery4TemperatureData.push(u.temperature);
                    }
                    this.setState({
                        battery4:battery4TemperatureData,
                    })
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
                            battery4TemperatureData.push(u.temperature);
                        }
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
                        battery4Time=setTimeout(batteryTemperature4, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature4, 10000);

            //查询电池5
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][4]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery5TemperatureData.push(u.temperature);
                    }
                    this.setState({
                        battery5:battery5TemperatureData,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryTemperature5 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id= '"+values[0][4]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery5TemperatureData.push(u.temperature);
                        }
                        if(battery5TemperatureData.length>18){
                            battery5TemperatureData.shift();
                            this.setState({
                                battery5:battery5TemperatureData,
                            });
                        }else {
                            this.setState({
                                battery5:battery5TemperatureData,
                            });
                        }
                        battery5Time=setTimeout(batteryTemperature5, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature5, 10000);

            //查询电池6
            db.transaction((tx)=>{
                tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+values[0][5]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery6TemperatureData.push(u.temperature);
                    }
                    this.setState({
                        battery6:battery6TemperatureData,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryTemperature6 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id= '"+values[0][5]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery6TemperatureData.push(u.temperature);
                        }
                        if(battery6TemperatureData.length>18){
                            battery6TemperatureData.shift();
                            this.setState({
                                battery6:battery6TemperatureData,
                            });
                        }else {
                            this.setState({
                                battery6:battery6TemperatureData,
                            });
                        }
                        battery6Time=setTimeout(batteryTemperature6, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryTemperature6, 10000);
        });
    }

    historyTime(){
        battery1TemperatureData= [];
        battery2TemperatureData=[];
        battery3TemperatureData=[];
        battery4TemperatureData=[];
        battery5TemperatureData=[];
        battery6TemperatureData=[];
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
            // console.log(values[0][1]);
            tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+promiseValues[0][0]+"' order by my_timestamp desc  limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery1TemperatureData.push(u.temperature);
                }
                this.setState({
                    battery1:battery1TemperatureData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池2
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+promiseValues[0][1]+"' order by my_timestamp desc  limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery2TemperatureData.push(u.temperature);
                }
                this.setState({
                    battery2:battery2TemperatureData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池3
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+promiseValues[0][2]+"' order by my_timestamp desc  limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery3TemperatureData.push(u.temperature);
                }
                this.setState({
                    battery3:battery3TemperatureData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池4
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+promiseValues[0][3]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery4TemperatureData.push(u.temperature);
                }
                this.setState({
                    battery4:battery4TemperatureData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池5
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+promiseValues[0][4]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery5TemperatureData.push(u.temperature);
                }
                this.setState({
                    battery5:battery5TemperatureData,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池6
        db.transaction((tx)=>{
            tx.executeSql("select id,battery_id,my_timestamp,temperature from battery where battery_id='"+promiseValues[0][5]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery6TemperatureData.push(u.temperature);
                }
                this.setState({
                    battery6:battery6TemperatureData,
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
                text: '温度',
                x:'center'
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电池1','电池2','电池3','电池4','电池5','电池6'],
                y:'bottom',
                type: 'legendToggleSelect',
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
                },
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