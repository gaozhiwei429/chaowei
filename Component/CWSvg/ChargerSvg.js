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
import { CHARGER_BIND_STORAGE_KEY } from '../../config';
var sqLite = new SQLiteText();
var db;

var chargerVoltageData = [];
var chargerElectricCurrentData=[];
var chargerTemperatureData=[];
var chargerCapacityData=[];
var chargerTimeData=[];
var promiseValues;
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

            xTime:[],
            chargerData:[],
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

        {/*
        // 充电器
        storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            promiseValues=result;
            //查询
            db.transaction((tx)=>{
                tx.executeSql("SELECT * FROM (SELECT * FROM charger WHERE charger_id='"+result[0]+"' ORDER BY id DESC )  AS chargerTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
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
                alert('1');
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
                        this.setState({
                            chargerVoltage:chargerVoltageData,
                            chargerElectricCurrent:chargerElectricCurrentData,
                            chargerTemperature:chargerTemperatureData,
                            chargerCapacity:chargerCapacityData,
                            chargerTime:chargerTimeData,
                        });
                        this.chargerClearTime = setTimeout(chargerFeedback, 1000);
                    });
                },(error)=>{ 
                    console.log(error);
                });
            };
            this.chargerClearTime && setTimeout(chargerFeedback, 1000);
        });

        */}





        /** 充电器*/
        let CHARGER_BIND=new Promise(function (resolve,reject) {
            return storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            })}
        );
        //充电器存储数据
        const chargerBind = await Promise.all([CHARGER_BIND]);

        //查询数据库总数据
        let voltageData = new Promise(function (resolve,reject){
            return db.transaction((tx)=>{
                tx.executeSql("select charger_id,capacity,voltage,my_timestamp,chargerTemperature,electric_current from charger where charger_id order by my_timestamp asc", [],(tx,results)=>{
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

        let chargerData = await Promise.all([voltageData]);

        // 取到时间
        const repeatTime=chargerData[0].map((item,i) => {
            return item.my_timestamp
        })

        //时间去重后排序
        const xTime = Array.from(new Set(repeatTime)).sort(function(a, b){
            return a > b ? 1 : -1; // 这里改为大于号
        })

        this.setState({
            chargerData:commonality.uniqeByKeys(...chargerData,['my_timestamp']),
            xTime, 
        })


    }

    async historyTime(whether){
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTemperatureData=[];
        chargerCapacityData=[];
        chargerTimeData=[]; 
        this.chargerClearTime && clearTimeout(this.chargerClearTime);
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
            }else{
                this.setState({
                    previous:this.state.previous-18,
                });
            }
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
                if(len<1){
                    Alert.alert('','sorry，数据查完了！',[{
                        text:'确定',onPress:()=>{}  
                    }])
                    this.setState({
                        previous:this.state.previous-18,
                    })
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
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTemperatureData=[];
        chargerCapacityData=[];
        chargerTimeData=[];
        this.chargerClearTime && clearTimeout(this.chargerClearTime);
    }
    table(){
        this.props.navigation.navigate('Table',{
            charger:0,
            localData:[this.state.chargerData],
        })
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
        const option= {
            title : {
                text: '',
                x: 'center',
            },
            smooth:true,
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电压(V)','温度(℃)','电流(A)','容量(C)'],
                left:'17%',
                right:'15%',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:false,
                magicType: {type: ['line', 'bar']},
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                        // optionToContent: function(opt) {
                        //     var axisData = opt.xAxis[0].data;
                        //     var series = opt.series;
                        //     var table = '<div style="height:350px;overflow:auto"><table style="width:100%;text-align:center;"><tbody><tr>'
                        //     + '<td>时间</td>'
                        //     + '<td>' + series[0].name + '</td>'
                        //     + '<td>' + series[1].name + '</td>'
                        //     + '<td>' + series[2].name + '</td>'
                        //     + '<td>' + series[3].name + '</td>'
                        //     + '</tr>';
                        //     for (var i = 0, l = axisData.length; i < l; i++) {
                        //         table += '<tr>'
                        //                     + '<td>' + axisData[i] + '</td>'
                        //                     + '<td>' + series[0].data[i] + '</td>'
                        //                     + '<td>' + series[1].data[i] + '</td>'
                        //                     + '<td>' + series[2].data[i] + '</td>'
                        //                     + '<td>' + series[3].data[i] + '</td>'
                        //                     + '</tr>';
                        //     }
                        //     table += '</tbody></table></div>';
                        //     return table;
                        // },
                    },//show是否显示表格，readOnly是否只读
                    // restore : {show: true},
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
                data: this.state.xTime.map(function(item){
                    return commonality.replaceTime(item);  
                }), 
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电压/温度',//  
                },{
                    type:'value',
                    name : '电流/容量',//  
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 80,
                end: 100,
                // realtime:false,
            },
            series: [
                {
                    name: '电压(V)',
                    type: 'line',
                    smooth:true,
                    data:this.state.chargerData && this.state.chargerData.map(item=>{
                        return item.voltage
                    }),
                    showSymbol: false,
                }, {
                    name: '温度(℃)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerData && this.state.chargerData.map(item=>{
                        return item.chargerTemperature
                    }),
                    showSymbol: false,
                },
                {
                    name: '容量(C)',
                    type: 'line',
                    smooth:true,
                    data:this.state.chargerData &&  this.state.chargerData.map(item=>{
                        return item.capacity
                    }),
                    showSymbol: false,
                    yAxisIndex:1,
                },{
                    name: '电流(A)',
                    type: 'line',
                    smooth:true,
                    data: this.state.chargerData &&  this.state.chargerData.map(item=>{
                        return item.electric_current
                    }),
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        };
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft:'90%',width:25,height:25}}  
                    onPress={()=>this.table()}
                >
                    <Image
                        style={{width:25,height:25}}
                        source={require('../../img/dataTable/dataTable.png')}
                    />
                </TouchableOpacity>
                <Echarts
                    option={option}
                    width={Dimensions.get('window').width}
                />
               
                {/* <View style={styles.switching}>
                    <TouchableOpacity style={styles.selected} onPress={()=>this.componentDidMount()}>
                        <Text>实时数据</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(1)}>
                        <Text>上一页</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(0)}>
                        <Text>下一页</Text>
                    </TouchableOpacity>
                </View> */}
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