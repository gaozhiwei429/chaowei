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


var chargerVoltageData = [];
var chargerElectricCurrentData=[];
var chargerTemperatureData=[];
var chargerCapacityData=[];
var promiseValues;
var chargerTime;
export default class ChargerSvg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chargerVoltage:[],
            chargerElectricCurrent:[],
            chargerTemperature:[],
            chargerCapacity:[],
            isLiked: false,
        };
    }

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTemperatureData=[];
        chargerCapacityData=[];
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
        storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            promiseValues=result;
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select charger_id,my_timestamp,voltage,electric_current,temperature,capacity from charger where charger_id='"+result[0]+"' order by my_timestamp desc limit 18", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(var i=0; i<len; i++){
                        var u = results.rows.item(i);
                        chargerVoltageData.push(parseInt(u.voltage));
                        chargerElectricCurrentData.push(parseInt(u.electric_current));
                        chargerTemperatureData.push(parseInt(u.temperature));
                        chargerCapacityData.push(parseInt(u.capacity));
                        this.setState({
                            chargerVoltage:chargerVoltageData,
                            chargerElectricCurrent:chargerElectricCurrentData,
                            chargerTemperature:chargerTemperatureData,
                            chargerCapacity:chargerCapacityData,
                        })
                    }
                });
            },(error)=>{
                console.log(error);
            });

            const chargerFeedback = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select * from charger where charger_id= '"+result[0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(var i=0; i<len; i++){
                            var u = results.rows.item(i);
                            chargerVoltageData.push(parseInt(u.voltage));
                            chargerElectricCurrentData.push(parseInt(u.electric_current));
                            chargerTemperatureData.push(parseInt(u.temperature));
                            chargerCapacityData.push(parseInt(u.capacity));
                            if(chargerVoltageData.length>18 && chargerElectricCurrentData.length>18 && chargerTemperatureData.length>18 && chargerCapacityData.length>18){
                                chargerVoltageData.shift();
                                chargerElectricCurrentData.shift();
                                chargerTemperatureData.shift();
                                chargerCapacityData.shift();
                                this.setState({
                                    chargerVoltage:chargerVoltageData,
                                    chargerElectricCurrent:chargerElectricCurrentData,
                                    chargerTemperature:chargerTemperatureData,
                                    chargerCapacity:chargerCapacityData,
                                });
                            }else {
                                this.setState({
                                    chargerVoltage:chargerVoltageData,
                                    chargerElectricCurrent:chargerElectricCurrentData,
                                    chargerTemperature:chargerTemperatureData,
                                    chargerCapacity:chargerCapacityData,
                                });
                            }
                        }
                        chargerTime=setTimeout(chargerFeedback, 10000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(chargerFeedback, 10000);
        });
    }

    async historyTime(){
        chargerVoltageData = [];
        console.log(chargerVoltageData);
        chargerElectricCurrentData=[];
        chargerTemperatureData=[];
        chargerCapacityData=[];
        clearTimeout(chargerTime);
        this.setState({
            isLiked: !this.state.isLiked
        });

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }

        //查询
        db.transaction((tx)=>{
            tx.executeSql("select * from charger where charger_id='"+promiseValues[0]+"' order by my_timestamp desc limit 16,34", [],(tx,results)=>{
                var len = results.rows.length;
                for(var i=0; i<len; i++){
                    var u = results.rows.item(i);
                    chargerVoltageData.push(parseInt(u.voltage));
                    chargerElectricCurrentData.push(parseInt(u.electric_current));
                    chargerTemperatureData.push(parseInt(u.temperature));
                    chargerCapacityData.push(parseInt(u.capacity));
                    this.setState({
                        chargerVoltage:chargerVoltageData,
                        chargerElectricCurrent:chargerElectricCurrentData,
                        chargerTemperature:chargerTemperatureData,
                        chargerCapacity:chargerCapacityData,
                    })
                }
            });
        },(error)=>{
            console.log(error);
        });

    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器数据曲线</Text>),
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
        // headerLeft:(
        //     <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        // ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'blue',
    };
    render() {
        const option= {
            title: {
                text: '',//充电器
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电压(V)','电流(A)','温度(℃)','容量(C)'],
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
                name : '',//   V /A /℃ /C
            },
            series: [
                {
                    name: '电压(V)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerVoltage,
                    showSymbol: false,
                },{
                    name: '电流(A)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerElectricCurrent,
                    showSymbol: false,
                }, {
                    name: '温度(℃)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerTemperature,
                    showSymbol: false,
                },
                {
                    name: '容量(C)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerCapacity,
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