import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
} from 'react-native';
import SQLite from './SQLite';
import TimerMixin from 'react-timer-mixin';
var reactMixin = require('react-mixin');
var sqLite = new SQLite();
var db;

function padding(num, length) {
    for(var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
    }
    return num;
}

export default class SQLiteDemo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            age:"",
            phone:"",
            email:"",
            address:"",
            data:[],
        };
    }

    mixins=[TimerMixin];

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    componentDidMount(){
        //开启数据库
        if(!db){
            db = sqLite.open();
        }
        //建表
        sqLite.createTable();
        //删除数据
        // sqLite.deleteData();
        // console.log('-----------------', Date.now())

        const loop = () => {
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth()+1;
            var d = date.getDate();
            var h = date.getHours();
            var mm = date.getMinutes();
            var s = date.getSeconds();
            var time=  y+'-'+padding(m, 2)+'-'+padding(d, 2)+' '+padding(h, 2)+':'+padding(mm, 2)+':'+padding(s, 2);
            // console.log('setTimmeout', Date.now());

            // 模拟数据
            var userData = [];
            var user = {};
            user.name = "Mr.Onion";
            user.age = time;
            user.sex = "男";
            user.phone = "12345678910";
            user.email = "123454321@qq.com";
            user.address = "A市B街111号C室";
            userData.push(user);
            //插入数据
            sqLite.insertUserData(userData, () => {
                //查询
                db.transaction((tx)=>{

                    tx.executeSql("select * from user order by id desc limit 1", [],(tx,results)=>{
                        var len = results.rows.length;
                        for(let i=0; i<len; i++){
                            var u = results.rows.item(i);
                            this.setState({
                                name:u.name,
                                age:u.age,
                                phone:u.phone,
                                email:u.email,
                                address:u.address,
                            });
                        }
                        // console.log('setTimeout', Date.now());
                        setTimeout(loop, 1000);
                    });
                },(error)=>{
                    console.log(error);
                });
            });
        };
        setTimeout(loop, 1000);

        // setInterval(()=>{
        //     // this.setState({ showText: !this.state.showText},()=>{
        //         //当前时间
        //         var date = new Date();
        //         var y = date.getFullYear();
        //         var m = date.getMonth()+1;
        //         var d = date.getDate();
        //         var h = date.getHours();
        //         var mm = date.getMinutes();
        //         var s = date.getSeconds();
        //         var time=  y+'-'+padding(m, 2)+'-'+padding(d, 2)+' '+padding(h, 2)+':'+padding(mm, 2)+':'+padding(s, 2);
        //         console.log(Date.now());
        //         //模拟数据
        //         var userData = [];
        //         var user = {};
        //         user.name = "Mr.Onion";
        //         user.age = time;
        //         user.sex = "男";
        //         user.phone = "12345678910";
        //         user.email = "123454321@qq.com";
        //         user.address = "A市B街111号C室";
        //         userData.push(user);
        //         //插入数据
        //         sqLite.insertUserData(userData);
        //         //查询
        //         db.transaction((tx)=>{
        //             tx.executeSql("select * from user", [],(tx,results)=>{
        //                 var len = results.rows.length;
        //                 for(let i=0; i<len; i++){
        //                     var u = results.rows.item(i);
        //                     this.setState({
        //                         name:u.name,
        //                         age:u.age,
        //                         phone:u.phone,
        //                         email:u.email,
        //                         address:u.address,
        //                     });
        //                 }
        //             });
        //         },(error)=>{
        //             console.log(error);
        //         });
        //     // })
        // },100);

    }
    render(){
        return (
            <View>
                <Text>
                    姓名:{this.state.name}
                </Text>
                <Text>
                    年龄：{this.state.age}
                </Text>
                <Text>
                    电话：{this.state.phone}
                </Text>
                <Text>
                    Email：{this.state.email}
                </Text>
                <Text>
                    地址：{this.state.address}
                </Text>
            </View>
        );
    }
}

reactMixin(SQLiteDemo.prototype, TimerMixin);