import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';

import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
import * as storage from '../../storage';
// import _ from 'lodash';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
import * as commonality from '../../commonality';
var sqLite = new SQLiteText();
var db;

var battery1electric_currentData= [];
var battery2electric_currentData=[];
var battery3electric_currentData=[];
var battery4electric_currentData=[];
var battery5electric_currentData=[];
var battery6electric_currentData=[];
var batteryWriteTime = [];
var promiseValues;
var battery1Time;
var battery2Time;
var battery3Time;
var battery4Time;
var battery5Time;
var battery6Time;
export default class CWBatteryElectricCurrent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battery1:[],
            battery2:[],
            battery3:[],
            battery4:[],
            battery5:[],
            battery6:[],
            previous:0,
            writeTime:[],
        };
    }
    
    async componentDidMount(){
        battery1electric_currentData=[];
        battery2electric_currentData=[];
        battery3electric_currentData=[];
        battery4electric_currentData=[];
        battery5electric_currentData=[];
        battery6electric_currentData=[];
        batteryWriteTime=[];
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
        Promise.all([promise2]).then((values) => {
            promiseValues=values;
            //查询电池1
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][0]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length; 
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery1electric_currentData.push(u.electric_current);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery1:battery1electric_currentData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current1 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][0]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery1electric_currentData.push(u.electric_current);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery1electric_currentData.length>18 && writeTime.length>18){
                            battery1electric_currentData.shift();
                            batteryWriteTime.shift();
                            this.setState({
                                battery1:battery1electric_currentData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery1:battery1electric_currentData,
                                writeTime,
                            });
                        }
                        battery1Time=setTimeout(batteryelectric_current1, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current1, 60000);

            //查询电池2
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][1]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery2electric_currentData.push(u.electric_current);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery2:battery2electric_currentData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current2 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][1]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery2electric_currentData.push(u.electric_current);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery2electric_currentData.length>18 && writeTime.length>18){
                            battery2electric_currentData.shift();
                            writeTime.shift();
                            this.setState({
                                battery2:battery2electric_currentData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery2:battery2electric_currentData,
                                writeTime,
                            });
                        }
                        battery2Time=setTimeout(batteryelectric_current2, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current2, 60000);

            //查询电池3
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][2]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery3electric_currentData.push(u.electric_current);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery3:battery3electric_currentData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current3 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][2]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery3electric_currentData.push(u.electric_current);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery3electric_currentData.length>18){
                            battery3electric_currentData.shift();
                            this.setState({
                                battery3:battery3electric_currentData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery3:battery3electric_currentData,
                                writeTime,
                            });
                        }
                        battery3Time=setTimeout(batteryelectric_current3, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current3, 60000);

            //查询电池4
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][3]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery4electric_currentData.push(u.electric_current);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery4:battery4electric_currentData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current4 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][3]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery4electric_currentData.push(u.electric_current);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery4electric_currentData.length>18 && writeTime.length>18){
                            battery4electric_currentData.shift();
                            writeTime.shift();
                            this.setState({
                                battery4:battery4electric_currentData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery4:battery4electric_currentData,
                                writeTime,
                            });
                        }
                        battery4Time=setTimeout(batteryelectric_current4, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current4, 60000);

            //查询电池5
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][4]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery5electric_currentData.push(u.electric_current);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery5:battery5electric_currentData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current5 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][4]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery5electric_currentData.push(u.electric_current);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery5electric_currentData.length>18 && writeTime.length>18){
                            battery5electric_currentData.shift();
                            writeTime.shift();
                            this.setState({
                                battery5:battery5electric_currentData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery5:battery5electric_currentData,
                                writeTime,
                            });
                        }
                        battery5Time=setTimeout(batteryelectric_current5, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current5, 60000);

            //查询电池6
            db.transaction((tx)=>{
                tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][5]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        battery6electric_currentData.push(u.electric_current);
                        batteryWriteTime.push(u.my_timestamp);
                    }
                    let writeTime = Array.from(new Set(batteryWriteTime));
                    this.setState({
                        battery6:battery6electric_currentData,
                        writeTime,
                    })
                });
            },(error)=>{
                console.log(error);
            });

            const batteryelectric_current6 = () => {
                //查询
                db.transaction((tx)=>{
                    tx.executeSql("select id,battery_id,my_timestamp,electric_current from battery where battery_id= '"+values[0][5]+"' order by my_timestamp desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            battery6electric_currentData.push(u.electric_current);
                            batteryWriteTime.push(u.my_timestamp);
                        }
                        let writeTime = Array.from(new Set(batteryWriteTime));
                        if(battery6electric_currentData.length>18 && writeTime.length>18){
                            battery6electric_currentData.shift();
                            writeTime.shift();
                            this.setState({
                                battery6:battery6electric_currentData,
                                writeTime,
                            });
                        }else {
                            this.setState({
                                battery6:battery6electric_currentData,
                                writeTime,
                            });
                        }
                        battery6Time=setTimeout(batteryelectric_current6, 60000);
                    });
                },(error)=>{
                    console.log(error);
                });
            };
            setTimeout(batteryelectric_current6, 60000);
        });
    }

    historyTime(whether){
        battery1electric_currentData=[];
        battery2electric_currentData=[];
        battery3electric_currentData=[];
        battery4electric_currentData=[];
        battery5electric_currentData=[];
        battery5electric_currentData=[];
        batteryWriteTime=[];
        clearInterval(battery1Time);
        clearInterval(battery2Time);
        clearInterval(battery3Time);
        clearInterval(battery4Time);
        clearInterval(battery5Time);
        clearInterval(battery6Time);
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
            tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][0]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery1electric_currentData.push(u.electric_current);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery1:battery1electric_currentData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池2
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][1]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery2electric_currentData.push(u.electric_current);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery2:battery2electric_currentData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池3
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][2]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery3electric_currentData.push(u.electric_current);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery3:battery3electric_currentData,
                    writeTime,

                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池4
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][3]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery4electric_currentData.push(u.electric_current);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery4:battery4electric_currentData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池5
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][4]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery5electric_currentData.push(u.electric_current);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery5:battery5electric_currentData,
                    writeTime,
                })
            });
        },(error)=>{
            console.log(error);
        });

        //查询电池6
        db.transaction((tx)=>{
            tx.executeSql("SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][5]+"' ORDER BY id DESC LIMIT '"+this.state.previous+"',18)  AS batteryTab ORDER BY my_timestamp ASC", [],(tx,results)=>{
                //"SELECT id,battery_id,my_timestamp,electric_current FROM (SELECT id,battery_id,my_timestamp,electric_current FROM battery WHERE battery_id='"+promiseValues[0][0]+"' ORDER BY id DESC LIMIT 18)  AS batteryTab ORDER BY my_timestamp ASC"
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    battery6electric_currentData.push(u.electric_current);
                    batteryWriteTime.push(u.my_timestamp);
                }
                let writeTime = Array.from(new Set(batteryWriteTime));
                this.setState({
                    battery6:battery6electric_currentData,
                    writeTime,
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
                text: '电池电流',
                x:'center'
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
                showTitle : true,
                feature : {
                    dataView : {
                        show: true,
                        readOnly: true,
                        emphasis:{
                            iconStyle:{
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 10,
                                borderWidth:1,
                            }
                        }
                    },//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        // type: ['line', 'bar','stack' ,'tiled'],//'line', 'bar','stack' ,'tiled'
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
                data: this.state.writeTime.map(function(item){
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
                name : '电流(A)'
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
                },
                {
                    name: '电池5',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery5,  
                    showSymbol: false,
                },
                {
                    name: '电池6',
                    type: 'line',
                    smooth:true,
                    data: this.state.battery6,  
                    showSymbol: false,
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