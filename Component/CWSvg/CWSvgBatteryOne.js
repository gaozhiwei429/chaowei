import React,{ Component } from 'react';
import {
    ListView,
    NativeEventEmitter,
    View,
    Text,
    Image,
    AsyncStorage,
    ScrollView
} from 'react-native';
import SQLiteText from '../SQLite/sqlite';
// import TimerMixin from 'react-timer-mixin';
var sqLite = new SQLiteText();
var db;

import { LineChart, YAxis,XAxis, Grid } from 'react-native-svg-charts';
var voltages = [];
var electric_current = [ ];
var temperature = [];
var capacity = [];
var t;
var l;
var k;
var c;
var data = [1024,1059,1000,1230,1102,1104,1240,1203,1200,1100];
//voltage
class BatteryVoltage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voltage:[],
            temperature:"",
            capacity:"",
            electric_current:"",
        };
    }

    async componentDidMount(){
        voltages=[];
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,voltage from battery order by id desc limit 11", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    voltages.push(parseInt( results.rows.item(i).voltage));
                    if(voltages.length<11){
                        this.setState({
                            voltage:voltages,
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,voltage from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        voltages.push(parseInt(u.voltage));
                        if( voltages!=='' && voltages.length>10){
                            voltages.shift();
                            this.setState({
                                voltage:voltages,
                            });
                        }else {
                            this.setState({
                                voltage:voltages,
                            });
                        }
                    }
                    t=setTimeout(loop, 1000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 1000);
    }

    async testaa(){
        voltages=[];
        clearTimeout(t);
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,voltage from battery order by id desc limit 21", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    if(voltages.length<21){
                        voltages.push(parseInt(results.rows.item(i).voltage));
                        this.setState({
                            voltage:voltages
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });
    }

    render() {
        const contentInset = { top: 2, bottom: 22 };
        const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
        return (
            <View>
                <View style={{marginTop:20,marginLeft:15,marginRight:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:20,color:'#333B6C'}}>电压曲线</Text>
                    <Text onPress={()=>{this.componentDidMount()}}>实时数据</Text>
                    <Text onPress={()=>{this.testaa()}}>最近20条记录</Text>
                </View>
                <View style={{ height: 300, padding: 20 ,paddingTop:10,flexDirection: 'row' ,}}>
                    <YAxis
                        style={{ width:25, }}
                        data={ voltages }
                        contentInset={ contentInset }
                        svg={{
                            fill: 'grey',
                            fontSize: 13,
                        }}
                        numberOfTicks={ 5 }
                        formatLabel={ (value,index) => `${value}`}
                    />
                    <LineChart
                        style={{ flex: 1,marginLeft: 0 }}
                        data={ voltages }
                        gridMin={ 0 }
                        contentInset={{ top: 0, bottom: 3 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                </View>
                <View style={{ height: 30, padding: 20,paddingTop:0}}>
                    <XAxis
                        style={{ marginHorizontal: -10 ,marginLeft: 20}}
                        data={ voltages }
                        formatLabel={ value => value }
                        contentInset={{ left: 5,  right: 13 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View>
        )
    }
}
//electric_current
class Battery_electric_current extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voltage:[],
            temperature:[],
            capacity:[],
            electric_current:[],
        };
    }

    async componentDidMount(){
        electric_current=[];
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,electric_current from battery order by id desc limit 11", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    electric_current.push(parseInt( results.rows.item(i).electric_current));
                    if(electric_current.length<11){
                        this.setState({
                            electric_current:electric_current,
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,electric_current from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        electric_current.push(parseInt(u.electric_current));
                        if( electric_current!=='' && electric_current.length>10){
                            electric_current.shift();
                            this.setState({
                                electric_current:electric_current,
                            });
                        }else {
                            this.setState({
                                electric_current:electric_current,
                            });
                        }
                    }
                    l=setTimeout(loop, 1000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 1000);
    }

    async testaa(){
        electric_current=[];
        clearTimeout(l);
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,electric_current from battery order by id desc limit 21", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    if(electric_current.length<21){
                        electric_current.push(parseInt(results.rows.item(i).electric_current));
                        this.setState({
                            electric_current:electric_current
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });
    }

    render() {
        const contentInset = { top: 2, bottom: 22 };
        return (
            <View>
                <View style={{marginTop:20,marginLeft:15,marginRight:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:20,color:'#333B6C'}}>电流曲线</Text>
                    <Text onPress={()=>{this.componentDidMount()}}>实时数据</Text>
                    <Text onPress={()=>{this.testaa()}}>最近20条记录</Text>
                </View>
                <View style={{ height: 300, padding: 20 ,paddingTop:10,flexDirection: 'row' ,}}>
                    <YAxis
                        style={{ width:25, }}
                        data={ electric_current }
                        contentInset={ contentInset }
                        svg={{
                            fill: 'grey',
                            fontSize: 13,
                        }}
                        numberOfTicks={ 5 }
                        formatLabel={ (value,index) => `${value}`}
                    />
                    <LineChart
                        style={{ flex: 1,marginLeft: 0 }}
                        data={ electric_current }
                        gridMin={ 0 }
                        contentInset={{ top: 0, bottom: 3 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                </View>
                <View style={{ height: 30, padding: 20,paddingTop:0}}>
                    <XAxis
                        style={{ marginHorizontal: -10 ,marginLeft: 20}}
                        data={ electric_current }
                        formatLabel={ value => value }
                        contentInset={{ left: 5,  right: 13 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View>
        )
    }
}
//Temperature
class BatteryTemperature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voltage:[],
            temperature:[],
            capacity:[],
            electric_current:[],
        };
    }

    async componentDidMount(){
        temperature=[];
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,temperature from battery order by id desc limit 11", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    temperature.push(parseInt(results.rows.item(i).temperature));
                    if(temperature.length<11){
                        this.setState({
                            temperature:temperature,
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,temperature from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        temperature.push(parseInt(u.temperature));
                        if( temperature!=='' && temperature.length>10){
                            temperature.shift();
                            this.setState({
                                temperature:temperature,
                            });
                        }else {
                            this.setState({
                                temperature:temperature,
                            });
                        }
                    }
                    k=setTimeout(loop, 1000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 1000);
    }

    async testTemperature(){
        temperature=[];
        clearTimeout(k);
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,temperature from battery order by id desc limit 21", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    if(electric_current.length<21){
                        temperature.push(parseInt(results.rows.item(i).temperature));
                        console.log(temperature);
                        this.setState({
                            temperature:temperature
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });
    }

    render() {
        const contentInset = { top: 2, bottom: 22 };
        return (
            <View>
                <View style={{marginTop:20,marginLeft:15,marginRight:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:20,color:'#333B6C'}}>温度曲线</Text>
                    <Text onPress={()=>{this.componentDidMount()}}>实时数据</Text>
                    <Text onPress={()=>{this.testTemperature()}}>最近20条记录</Text>
                </View>
                <View style={{ height: 300, padding: 20 ,paddingTop:10,flexDirection: 'row' ,}}>
                    <YAxis
                        style={{ width:25, }}
                        data={ temperature }
                        contentInset={ contentInset }
                        svg={{
                            fill: 'grey',
                            fontSize: 13,
                        }}
                        numberOfTicks={ 5 }
                        formatLabel={ (value,index) => `${value}`}
                    />
                    <LineChart
                        style={{ flex: 1,marginLeft: 0 }}
                        data={ temperature }
                        gridMin={ 0 }
                        contentInset={{ top: 0, bottom: 3 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                </View>
                <View style={{ height: 30, padding: 20,paddingTop:0}}>
                    <XAxis
                        style={{ marginHorizontal: -10 ,marginLeft: 20}}
                        data={ temperature }
                        formatLabel={ value => value }
                        contentInset={{ left: 5,  right: 13 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View>
        )
    }
}
//Capacity
class BatteryCapacity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voltage:[],
            temperature:[],
            capacity:[],
            electric_current:[],
        };
    }

    async componentDidMount(){
        capacity=[];
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,capacity from battery order by id desc limit 11", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    capacity.push(parseInt( results.rows.item(i).capacity));
                    if(capacity.length<11){
                        this.setState({
                            capacity:capacity,
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,capacity from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        capacity.push(parseInt(u.capacity));
                        if( capacity !=='' && capacity.length>10){
                            capacity.shift();
                            this.setState({
                                capacity:capacity,
                            });
                        }else {
                            this.setState({
                                capacity:capacity,
                            });
                        }
                    }
                    c=setTimeout(loop, 1000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 1000);
    }

    async testaa(){
        capacity=[];
        clearTimeout(c);
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,capacity from battery order by id desc limit 21", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    if(capacity.length<21){
                        capacity.push(parseInt(results.rows.item(i).capacity));
                        this.setState({
                            capacity:capacity
                        });
                    }
                }
            });
        },(error)=>{
            console.log(error);
        });
    }

    render() {
        const contentInset = { top: 2, bottom: 22 };
        return (
            <View>
                <View style={{marginTop:20,marginLeft:15,marginRight:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:20,color:'#333B6C'}}>容量曲线</Text>
                    <Text onPress={()=>{this.componentDidMount()}}>实时数据</Text>
                    <Text onPress={()=>{this.testaa()}}>最近20条记录</Text>
                </View>
                <View style={{ height: 300, padding: 20 ,paddingTop:10,flexDirection: 'row' ,}}>
                    <YAxis
                        style={{ width:25, }}
                        data={ capacity }
                        contentInset={ contentInset }
                        svg={{
                            fill: 'grey',
                            fontSize: 13,
                        }}
                        numberOfTicks={ 5 }
                        formatLabel={ (value,index) => `${value}`}
                    />
                    <LineChart
                        style={{ flex: 1,marginLeft: 0 }}
                        data={ capacity }
                        gridMin={ 0 }
                        contentInset={{ top: 0, bottom: 3 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                </View>
                <View style={{ height: 30, padding: 20,paddingTop:0}}>
                    <XAxis
                        style={{ marginHorizontal: -10 ,marginLeft: 20}}
                        data={ capacity }
                        formatLabel={ value => value }
                        contentInset={{ left: 5,  right: 13 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View>
        )
    }
}

export default class CWSvgDutyCycle extends Component {

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }

    static navigationOptions = {
        title: '电池1',
        headerStyle: {
            height:40,
        },
    };
    render() {
        return (
            <ScrollView>
                <BatteryVoltage/>
                <View style={{marginTop:10,height:2,backgroundColor:'#D8DBEA'}}/>

                <Battery_electric_current/>
                <View style={{marginTop:10,height:2,backgroundColor:'#D8DBEA'}}/>

                <BatteryTemperature/>
                <View style={{marginTop:10,height:2,backgroundColor:'#D8DBEA'}}/>

                <BatteryCapacity/>
            </ScrollView>
        )
    }
}