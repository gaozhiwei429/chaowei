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
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
var sqLite = new SQLiteText();
var db;


var chargerVoltageData = [];
var chargerElectricCurrentData=[];
var chargerTemperatureData=[];
var chargerCapacityData=[];
var chargerTimeData=[];
var promiseValues;
var chargerClearTime;
export default class ChargerSvg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chargerVoltage:[],
            chargerElectricCurrent:[],
            chargerTemperature:[],
            chargerCapacity:[],
            chargerTimeData:[],
            chargerTime:[],
            previous:0,
        };
    }


    async componentDidMount(){
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTemperatureData=[];
        chargerCapacityData=[];
        chargerTimeData=[];
        this.setState({
            previous:0,
        });
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        /** 充电器*/
        storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            promiseValues=result;
            //查询
            db.transaction((tx)=>{
                tx.executeSql("SELECT * FROM (SELECT * FROM charger WHERE charger_id='"+result[0]+"' ORDER BY id DESC LIMIT 18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    // SELECT * FROM (SELECT *FROM group_chatmsg_v WHERE ((group_Id=46 AND send_user_id=28 AND receive_user_id=70) OR (group_Id=46 AND receive_user_id=28 AND STATUS=1)) AND is_delete =0 ORDER BY crtime DESC LIMIT 15)  AS chatMsgTable ORDER BY crtime ASC
                    var len = results.rows.length;
                    for(var i=0; i<len; i++){
                        var u = results.rows.item(i);    
                        chargerVoltageData.push(u.voltage);
                        chargerElectricCurrentData.push(u.electric_current);
                        chargerTemperatureData.push(u.chargerTemperature);
                        chargerCapacityData.push(u.capacity);
                        chargerTimeData.push(u.my_timestamp);    
                    }
                    this.setState({
                        chargerVoltage:chargerVoltageData,
                        chargerElectricCurrent:chargerElectricCurrentData,
                        chargerTemperature:chargerTemperatureData,
                        chargerCapacity:chargerCapacityData,
                        chargerTime:chargerTimeData,
                    })
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
                            chargerVoltageData.push(u.voltage);
                            chargerElectricCurrentData.push(u.electric_current);
                            chargerTemperatureData.push(u.chargerTemperature);
                            chargerCapacityData.push(u.capacity);
                            chargerTimeData.push(u.my_timestamp); 
                        }
                        if(chargerVoltageData.length>18 && chargerElectricCurrentData.length>18 && chargerTemperatureData.length>18 && chargerCapacityData.length>18){
                            chargerVoltageData.shift();
                            chargerElectricCurrentData.shift();
                            chargerTemperatureData.shift();
                            chargerCapacityData.shift();
                            chargerTimeData.shift();
                            this.setState({
                                chargerVoltage:chargerVoltageData,
                                chargerElectricCurrent:chargerElectricCurrentData,
                                chargerTemperature:chargerTemperatureData,
                                chargerCapacity:chargerCapacityData,
                                chargerTime:chargerTimeData,
                            });
                        }else{
                            this.setState({
                                chargerVoltage:chargerVoltageData,
                                chargerElectricCurrent:chargerElectricCurrentData,
                                chargerTemperature:chargerTemperatureData,
                                chargerCapacity:chargerCapacityData,
                                chargerTime:chargerTimeData,
                            });
                        }
                        chargerClearTime = setTimeout(chargerFeedback, 60000);
                    });
                },(error)=>{ 
                    console.log(error);
                });
            };
            setTimeout(chargerFeedback, 60000);
        });
    }

    async historyTime(whether){
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTemperatureData=[];
        chargerCapacityData=[];
        chargerTimeData=[];
        clearTimeout(chargerClearTime);
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

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }

        //查询
        db.transaction((tx)=>{
            tx.executeSql("SELECT * FROM (SELECT * FROM charger WHERE charger_id='"+promiseValues[0]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                //"SELECT * FROM (SELECT * FROM charger WHERE charger_id='"+promiseValues[0]+"' ORDER BY id DESC LIMIT 18 OFFSET 16)  AS chargerTab ORDER BY my_timestamp ASC"
                var len = results.rows.length;
                console.log(this.state.previous,'1');   
                console.log(len);
                if(len<18 || len==0){
                    alert('sorry，没有数据可查了')  
                    return;
                }
                for(var i=0; i<len; i++){
                    var u = results.rows.item(i);
                    chargerVoltageData.push(u.voltage);
                    chargerElectricCurrentData.push(u.electric_current);
                    chargerTemperatureData.push(u.chargerTemperature);
                    chargerCapacityData.push(u.capacity);
                    chargerTimeData.push(u.my_timestamp);  
                }
                this.setState({
                    chargerVoltage:chargerVoltageData,
                    chargerElectricCurrent:chargerElectricCurrentData,
                    chargerTemperature:chargerTemperatureData,
                    chargerCapacity:chargerCapacityData,
                    chargerTime:chargerTimeData,
                })
            });
        },(error)=>{
            console.log(error);
        });

    }

    componentWillUnmount() {
        clearTimeout(chargerClearTime);
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器数据曲线</Text>),
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
        // console.log(this.state.chargerTime); 
        const option= {
            title : {
                text: '充电器数据曲线',
                x: 'center',
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电压(V)','电流(A)','温度(℃)','容量(C)'],
                y:'bottom',
                // x: 'center',
                // orient:'vertical'
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
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)'],//图形的颜色组
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
                // axisLabel: {
                //     formatter: function (date, idx) {   
                //         return idx === 0 ? date.getMonth() : [date.getMonth() + 1, date.getDate()].join('-');
                //     }
                // }, 
                axisLabel:{ 
                    textStyle:{ 
                        fontSize: 9,
                    }
                }
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电压/温度',//   V /A /℃ /C
                    // max:100,
                    // min:30,
                },{
                    type:'value',
                    name : '电流/容量',//   V /A /℃ /C
                },
            ],
            series: [
                {
                    name: '电压(V)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerVoltage,
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
                    yAxisIndex:1,
                },{
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
            <View style={styles.container}>
                <Echarts
                    option={option}
                    width={Dimensions.get('window').width}
                />
                <View style={styles.switching}>
                    <TouchableOpacity style={styles.selected} onPress={()=>this.componentDidMount()}>
                        <Text>实时数据</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(1)}>
                        <Text>上一页</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(0)}>
                        <Text>下一页</Text>
                    </TouchableOpacity>
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