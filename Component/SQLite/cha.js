import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
} from 'react-native';
import SQLiteText from './sqlite';
var sqLite = new SQLiteText();
var db;
import { LineChart, YAxis,XAxis, Grid } from 'react-native-svg-charts';

const data = [ ];

export default class SQLiteDemo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            charger_id:"",
            my_timestamp:"",
            voltage:"",
            temperature:"",
            capacity:"",
            equilibrium_time:"",
            showText:true,
            data:[],
            dataCharger:[],//充电器
            dataBatteryArray:[],//电池数组
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
        //建表
        // sqLite.createTable();
        //删除数据
        // sqLite.deleteData();

        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,my_timestamp,voltage,capacity from battery order by id desc limit 11", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    this.setState({
                        my_timestamp:u.my_timestamp,
                        voltage:u.voltage,
                        capacity:u.capacity,
                        email:u.email,
                        address:u.address,
                    });
                    var voltage=parseInt(u.voltage)
                    data.push(voltage)
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,my_timestamp,voltage,capacity from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        this.setState({
                            my_timestamp:u.my_timestamp,
                            voltage:u.voltage,
                            capacity:u.capacity,
                            email:u.email,
                            address:u.address,
                        });
                        var voltage=parseInt(u.voltage)
                        if(data.length>10){
                            data.shift();
                            data.push(voltage)
                        }
                    }
                    setTimeout(loop, 1000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 1000);

    }
    render(){
        const contentInset = { top: 20, bottom: 20 };
        return (
            <View>
                <Text>
                    姓名:{this.state.my_timestamp}
                </Text>
                <Text>
                    年龄：{this.state.voltage}
                </Text>
                <Text>
                    电话：{this.state.capacity}
                </Text>
                <Text>
                    Email：{this.state.email}
                </Text>
                <Text>
                    地址：{this.state.address}
                </Text>

                <View style={{ height: 300, padding: 20 ,flexDirection: 'row' }}>
                    <YAxis
                        style={{
                            // backgroundColor:'#543',
                            width:35
                        }}
                        data={ data }
                        contentInset={ contentInset }
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        numberOfTicks={ 3 }
                        formatLabel={ (value,index) => `${value}`}
                    />
                    <LineChart
                        style={{ flex: 1,marginLeft: 16 }}
                        data={ data }
                        gridMin={ 0 }
                        contentInset={{ top: 10, bottom: 10 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                </View>
                <View style={{ height: 300, padding: 20}}>
                    <XAxis
                        style={{ marginHorizontal: -10 ,marginLeft: 16}}
                        data={ data }
                        formatLabel={ (value, index) => index }
                        contentInset={{ left: 40,  right: 10 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View>
        );
    }
}

