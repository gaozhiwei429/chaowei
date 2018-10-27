import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
    Image,
} from 'react-native';

import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
import * as storage from '../../storage';
// import _ from 'lodash'; 
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
import * as commonality from '../../commonality';
var sqLite = new SQLiteText();
var db;

export default class BatteryPower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ybattery1:[],
            ybattery2:[],
            ybattery3:[],
            ybattery4:[],
            ybattery5:[],
            ybattery6:[],
            xTime:[],
            batteryBind:[],
        };
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

        //蓄电池存储数据
        const dataVoltage = await Promise.all([promise2]);

        const loop = ()=>{
            //查询数据库总数据
            new Promise(function (resolve,reject){
                return db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,voltage,electric_current from battery where battery_id order by my_timestamp asc", [],(tx,results)=>{
                        var len = results.rows.length;
                        let DatabaseData=[];
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            DatabaseData.push(u);
                        }
                        resolve(DatabaseData);
                    });
                },(error)=>{
                    reject(error);
                });
            }).then((DatabaseData)=>{
                const repeatTime=DatabaseData.map((item,i) => {
                    return item.my_timestamp
                })
        
                //时间去重后排序
                const xTime = Array.from(new Set(repeatTime)).sort(function(a, b){
                    return a > b ? 1 : -1; // 这里改为大于号
                })
                
                //电池1
                const battery1 = DatabaseData.map((item,i)=>{
                    if(dataVoltage[0][0]==DatabaseData[i].battery_id){
                        return item
                    }
                }).filter(function(val){//过滤掉undefined
                    return !(!val || val === "");
                })
        
                const battery1Time=battery1.map(item=>{
                    return item.my_timestamp
                })
        
                //获取两个数组的差集且向原数组中push
                var difference1Time=xTime.filter(function(v){ return battery1Time.indexOf(v) == -1 });
                difference1Time.map(item=>{
                    return battery1.push(
                            {my_timestamp:item,voltage:null,electric_current:null,battery_id:dataVoltage[0][0]}
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
                    return (item.voltage)*(item.electric_current)
                })
        
                //电池2
                var battery2 = DatabaseData.map((item,i)=>{
                    if(dataVoltage[0][1]==DatabaseData[i].battery_id){
                        return item
                    }
                }).filter(function(val){//过滤掉undefined
                    return !(!val || val === "");
                })
        
                var battery2Time=battery2.map(item=>{
                    return item.my_timestamp
                })
        
                //获取两个数组的差集且向原数组中push
                var difference2Time=xTime.filter(function(v){ return battery2Time.indexOf(v) == -1 })
                difference2Time.map(item=>{
                    return battery2.push(
                        {my_timestamp:item,voltage:null,electric_current:null,battery_id:dataVoltage[0][1]}
                    )
                })
        
                var ybattery2 = battery2.sort(function(a, b) {
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
                    return (item.voltage)*(item.electric_current)
                })
                
                //电池3  
                const battery3 = DatabaseData.map((item,i)=>{
                    if(dataVoltage[0][2]==DatabaseData[i].battery_id){
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
                        {my_timestamp:item,voltage:null,electric_current:null,battery_id:dataVoltage[0][2]}
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
                    return (item.voltage)*(item.electric_current)
                })
                
                //电池4 
                const battery4 = DatabaseData.map((item,i)=>{
                    if(dataVoltage[0][3]==DatabaseData[i].battery_id){
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
                        {my_timestamp:item,voltage:null,electric_current:null,battery_id:dataVoltage[0][3]}
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
                    return (item.voltage)*(item.electric_current)
                })
        
                //电池5
                const battery5 = DatabaseData.map((item,i)=>{
                    if(dataVoltage[0][4]==DatabaseData[i].battery_id){
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
                        {my_timestamp:item,voltage:null,electric_current:null,battery_id:dataVoltage[0][4]}
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
                    return (item.voltage)*(item.electric_current)
                })
        
        
                //电池6
                const battery6 = DatabaseData.map((item,i)=>{
                    if(dataVoltage[0][5]==DatabaseData[i].battery_id){
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
                        {my_timestamp:item,voltage:null,electric_current:null,battery_id:dataVoltage[0][5]}
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
                    return (item.voltage)*(item.electric_current)
                })
                
                this.setState({
                    ybattery1,
                    ybattery2,
                    ybattery3,
                    ybattery4,
                    ybattery5,
                    ybattery6,
                    DatabaseData,
                    xTime,
                    batteryBind:dataVoltage,
                })
            })
            setTimeout(loop,60000);
        }

        loop();
    }

    componentWillUnmount() {
        this.battery1TimeVoltage && clearTimeout(this.battery1TimeVoltage);
    }

    table(){
        this.props.navigation.navigate('Table',{ 
            localData:this.state.DatabaseData,
            batteryBind:this.state.batteryBind,
            power:true,
        })
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>蓄电池功率数据</Text>), 
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
                x:'center',
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
                // orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
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
                name : '功率(W)',
            }, 
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 0,
                end: 100,
                // realtime:false,
            },
            series: [
                {
                    name: '电池1',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery1.map(item => item.toFixed(2)),
                    showSymbol: false,
                    connectNulls:true,
                },{
                    name: '电池2',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery2.map(item => item.toFixed(2)),
                    showSymbol: false,
                    connectNulls:true,
                }, {
                    name: '电池3',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery3.map(item => item.toFixed(2)),
                    showSymbol: false,
                    connectNulls:true,
                },
                {
                    name: '电池4',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery4.map(item => item.toFixed(2)),
                    showSymbol: false,
                    connectNulls:true,
                },
                {
                    name: '电池5',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery5.map(item => item.toFixed(2)),
                    showSymbol: false,
                    connectNulls:true,
                },
                {
                    name: '电池6',
                    type: 'line',
                    smooth:true,
                    data: this.state.ybattery6.map(item => item.toFixed(2)),
                    showSymbol: false,
                    connectNulls:true,
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
                <View style={styles.switching}>
                    {/* <TouchableOpacity style={styles.selected} onPress={()=>this.componentDidMount()}>
                        <Text>实时数据</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={styles.selected}  onPress={()=>this.historyTime(1)}>
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