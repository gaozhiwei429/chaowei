import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
    Alert, 
} from 'react-native';

import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
import * as storage from '../../storage';
import * as commonality from '../../commonality';
// import _ from 'lodash';
import { CHARGER_BIND_STORAGE_KEY,LOGGER_STORAGE_KEY} from '../../config';
var sqLite = new SQLiteText();
var db;

class VoltageCurrent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chargerVoltage:[],
            chargerElectricCurrent:[],
            chargerTimeData:[],
            chargerTime:[],
        };
    }

    async componentDidMount(){
        var chargerVoltageData = [];
        var chargerElectricCurrentData=[];
        var chargerTimeData=[];

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        /** 充电器检测仪*/
        storage.get(LOGGER_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            //查询
            db.transaction((tx)=>{
                tx.executeSql("SELECT voltage,electric_current,my_timestamp FROM (SELECT voltage,electric_current,my_timestamp FROM ChargerDetector WHERE ChargerDetector_id='"+result[0]+"' ORDER BY id DESC )  AS chargerDetectorTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    // SELECT * FROM (SELECT *FROM group_chatmsg_v WHERE ((group_Id=46 AND send_user_id=28 AND receive_user_id=70) OR (group_Id=46 AND receive_user_id=28 AND STATUS=1)) AND is_delete =0 ORDER BY crtime DESC LIMIT 15)  AS chatMsgTable ORDER BY crtime ASC
                    var len = results.rows.length;
                    for(var i=0; i<len; i++){
                        var u = results.rows.item(i);    
                        chargerVoltageData.push(u.voltage);
                        chargerElectricCurrentData.push(u.electric_current);
                        chargerTimeData.push(u.my_timestamp);    
                    }
                    this.setState({
                        chargerVoltage:chargerVoltageData,
                        chargerElectricCurrent:chargerElectricCurrentData,
                        chargerTime:chargerTimeData,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const ChargerDetectorFeedback = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select voltage,electric_current,my_timestamp from ChargerDetector where ChargerDetector_id= '"+result[0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(var i=0; i<len; i++){
                            var u = results.rows.item(i);
                            chargerVoltageData.push(u.voltage);
                            chargerElectricCurrentData.push(u.electric_current);
                            chargerTimeData.push(u.my_timestamp); 
                        }  
                        this.setState({
                            chargerVoltage:chargerVoltageData,
                            chargerElectricCurrent:chargerElectricCurrentData,
                            chargerTime:chargerTimeData,
                        });
                        this.ChargerDetectorClearTime = setTimeout(ChargerDetectorFeedback, 60000);
                    });
                },(error)=>{ 
                    console.log(error);
                });
            };
            this.ChargerDetectorClearTime && setTimeout(ChargerDetectorFeedback, 60000);
        });
    }

    componentWillUnmount() {
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTimeData=[];

        this.ChargerDetectorClearTime && clearTimeout(this.ChargerDetectorClearTime);
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        const option= {
            title : {
                text: '电压/电流',
                left: '3%', 
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电压(V)','电流(A)'],
                y:'top',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: true, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)',],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.chargerTime.map(function(item){
                    return commonality.replaceTime(item); 
                }),
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电压',//   V /A /℃ /C
                },{
                    type:'value',
                    name : '电流',//   V /A /℃ /C
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 70,
                end: 100,
            },
            series: [
                {
                    name: '电压(V)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerVoltage,
                    showSymbol: false,
                }, {
                    name: '电流(A)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerElectricCurrent,
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        };
        return (
            <Echarts
                option={option}
                width={Dimensions.get('window').width}
            />
        );
    }
}


class Temperature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BoardTemperature:[],
            AmbientTemperature:[],
            TimeData:[],
        };
    }

    async componentDidMount(){
        var BoardTemperatureData = [];
        var AmbientTemperatureData=[];
        var TimeData=[];

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        /** 充电器检测仪*/
        storage.get(LOGGER_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            //查询
            db.transaction((tx)=>{
                tx.executeSql("SELECT BoardTemperature,AmbientTemperature,my_timestamp FROM (SELECT BoardTemperature,AmbientTemperature,my_timestamp FROM ChargerDetector WHERE ChargerDetector_id='"+result[0]+"' ORDER BY id DESC )  AS chargerDetectorTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(var i=0; i<len; i++){
                        var u = results.rows.item(i);    
                        BoardTemperatureData.push(u.BoardTemperature);
                        AmbientTemperatureData.push(u.AmbientTemperature);
                        TimeData.push(u.my_timestamp);    
                    }
                    this.setState({
                        BoardTemperature:BoardTemperatureData,
                        AmbientTemperature:AmbientTemperatureData,
                        TimeData,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const TemperatureFeedback = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select BoardTemperature,AmbientTemperature,my_timestamp from ChargerDetector where ChargerDetector_id= '"+result[0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(var i=0; i<len; i++){
                            var u = results.rows.item(i);
                            BoardTemperatureData.push(u.BoardTemperature);
                            AmbientTemperatureData.push(u.AmbientTemperature);
                            TimeData.push(u.my_timestamp);    
                        }  
                        this.setState({
                            BoardTemperature:BoardTemperatureData,
                            AmbientTemperature:AmbientTemperatureData,
                            TimeData,
                        });
                        this.ChargerDetectorClearTime = setTimeout(ChargerDetectorFeedback, 60000);
                    });
                },(error)=>{ 
                    console.log(error);
                });
            };
            this.TemperatureClearTime && setTimeout(TemperatureFeedback, 60000);
        });
    }

    componentWillUnmount() {
        BoardTemperatureData = [];
        AmbientTemperatureData=[];
        TimeData=[];
        this.TemperatureClearTime && clearTimeout(this.TemperatureClearTime);
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render(){
        const option= {
            title : {
                text: '温度',
                left: '3%', 
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电路板温度(°)','环境温度(°)'],
                y:'top',
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
            color:['rgb(67,205,126)','rgb(249,159,94)',],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.TimeData.map(function(item){
                    return commonality.replaceTime(item); 
                }),
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电路板温度',//   V /A /℃ /C
                },{
                    type:'value',
                    name : '环境温度',//   V /A /℃ /C
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 70,
                end: 100,
            },
            series: [
                {
                    name: '电路板温度(°)',
                    type: 'line',
                    smooth:true,
                    data: this.state.BoardTemperature,
                    showSymbol: false,
                }, {
                    name: '环境温度(°)',
                    type: 'line',
                    smooth:true,
                    data: this.state.AmbientTemperature,
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        };
        return (
            <Echarts
                option={option}
                width={Dimensions.get('window').width}
            />
        );
    }
}

class CapacityPower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            capacityData:[],
            CapacityPowerData:[],
            TimeData:[],
        };
    }

    async componentDidMount(){
        var capacityData = [];
        var CapacityPowerData=[];
        var TimeData=[];

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        /** 充电器检测仪*/
        storage.get(LOGGER_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            //查询
            db.transaction((tx)=>{
                tx.executeSql("SELECT capacity,voltage,my_timestamp,electric_current FROM (SELECT capacity,voltage,my_timestamp,electric_current FROM ChargerDetector WHERE ChargerDetector_id='"+result[0]+"' ORDER BY id DESC )  AS chargerDetectorTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(var i=0; i<len; i++){
                        var u = results.rows.item(i);    
                        capacityData.push(u.capacity);
                        CapacityPowerData.push((u.voltage*u.electric_current).toFixed(2));
                        TimeData.push(u.my_timestamp);  
                        console.log((u.voltage*u.electric_current).toFixed(2));
                        // console.log(u.voltage*u.electric_current)   
                    } 
                    
                    this.setState({
                        capacityData,
                        CapacityPowerData,
                        TimeData,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const TemperatureFeedback = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select capacity,voltage,my_timestamp,electric_current from ChargerDetector where ChargerDetector_id= '"+result[0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(var i=0; i<len; i++){
                            var u = results.rows.item(i);
                            capacityData.push(u.capacity);
                            CapacityPowerData.push((u.voltage*u.electric_current).toFixed(2));
                            
                            TimeData.push(u.my_timestamp);    
                        }  
                        this.setState({
                            capacityData,
                            CapacityPowerData,
                            TimeData,
                        });
                        this.ChargerDetectorClearTime = setTimeout(ChargerDetectorFeedback, 60000);
                    });
                },(error)=>{ 
                    console.log(error);
                });
            };
            this.TemperatureClearTime && setTimeout(TemperatureFeedback, 60000);
        });
    }

    componentWillUnmount() {
        capacityData = [];
        CapacityPowerData=[];
        TimeData=[];
        this.TemperatureClearTime && clearTimeout(this.TemperatureClearTime);
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render(){
        const option= {
            title : {
                text: '容量/功率',
                left: '3%', 
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['容量(Ah)','功率(W)'],
                y:'top',
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
            color:['rgb(67,205,126)','rgb(249,159,94)',],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.TimeData.map(function(item){
                    return commonality.replaceTime(item); 
                }),
            },
            yAxis: [  
                {
                    type:'value',
                    name : '容量',//   V /A /℃ /C
                },{
                    type:'value',
                    name : '功率',//   V /A /℃ /C
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 70,
                end: 100,
            },
            series: [
                {
                    name: '容量(Ah)',
                    type: 'line',
                    smooth:true,
                    data: this.state.capacityData,
                    showSymbol: false,
                }, {
                    name: '功率(W)',
                    type: 'line',
                    smooth:true,
                    data: this.state.CapacityPowerData,
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        }; 
        return (
            <Echarts
                option={option}
                width={Dimensions.get('window').width}
            />
        );
    }
}

export default class ChargerDetector extends Component {

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        
        return (
            <ScrollView style={styles.container}>
                <View style={{marginTop:15,marginBottom:15}}>
                    <VoltageCurrent/>
                </View>
                <View style={{marginTop:15,marginBottom:15}}>
                    <Temperature/>
                </View>
                <View style={{marginTop:15,marginBottom:15}}>
                    <CapacityPower/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    switching:{
        marginTop:15,
        marginBottom:20
    },
});