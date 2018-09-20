//SQLite.js
import React, { Component } from 'react';
import {
    ToastAndroid,
} from 'react-native';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var database_name = "chaowei.db";//数据库文件
var database_version = "1.0";//版本号
var database_displayname = "MySQLite";
var database_size = -1;
var db;

export default class SQLite extends Component {

    componentWillUnmount(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
    }
    open(){
        return new Promise((resolve, reject) => {
            db = SQLiteStorage.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
                ()=>{
                    this._successCB('open');
                    resolve(db);
                },
                (err)=>{
                    this._errorCB('open',err);
                    reject(err);
                });
        });
    }

    //创建电池表
    createBatteryTable() {
        return new Promise((resolve, reject) => {
            db.transaction((tx)=> {
                tx.executeSql('CREATE TABLE IF NOT EXISTS BATTERY(' +
                    'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                    'battery_id varchar,'+
                    'my_timestamp VARCHAR,' +
                    'voltage VARCHAR,' +
                    'electric_current VARCHAR,' +
                    'equilibrium_temperature VARCHAR,'+//ADD
                    'temperature VARCHAR,' +
                    'targetCurrent VARCHAR,'+//add
                    'targetVoltage VARCHAR,'+//add
                    'capacity VARCHAR,' +
                    'balanceVoltage VARCHAR,'+//add
                    'bindingState VARCHAR,'+//add
                    'equilibriumState VARCHAR,'+//add
                    'equilibrium_time VARCHAR,' +
                    'P_longitude VARCHAR,' +
                    'P_latitude VARCHAR)'
                    , [], ()=> {
                        this._successCB('executeSql');
                        resolve();
                    }, (err)=> {
                        this._errorCB('executeSql', err);
                        reject(err);
                    });
            }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
                this._errorCB('transaction', err);
                reject(err);
            }, ()=> {
                this._successCB('transaction');
            });
        });
    }

    //创建充电器表
    createChargerTable() {
        return new Promise((resolve, reject) => {
            db.transaction((tx)=> {
                tx.executeSql('CREATE TABLE IF NOT EXISTS CHARGER(' +
                    'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                    'charger_id varchar,'+
                    'my_timestamp VARCHAR,' +
                    'voltage VARCHAR,' +
                    'electric_current VARCHAR,' +
                    'chargerTemperature VARCHAR,'+//add
                    'batteryTemperature VARCHAR,' +
                    'targetCurrent VARCHAR,'+//add
                    'targetVoltage VARCHAR,'+//add
                    'capacity VARCHAR,' +
                    'balanceVoltage VARCHAR,'+//add
                    'bindingState VARCHAR,'+//add
                    'chargingState VARCHAR,'+//add
                    'ambientTemperature VARCHAR,'+//add
                    'P_longitude VARCHAR,' +
                    'P_latitude VARCHAR)'
                    , [], ()=> {
                        this._successCB('executeSql');
                        resolve();
                    }, (err)=> {
                        this._errorCB('executeSql', err);
                        reject(err);
                    });
            }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
                this._errorCB('transaction', err);
                reject(err);
            }, ()=> {
                this._successCB('transaction');
            })
        });
    }

    //创建充电器检测仪表
    createChargerDetectorTable() {
        return new Promise((resolve, reject) => {
            db.transaction((tx)=> {
                tx.executeSql('CREATE TABLE IF NOT EXISTS ChargerDetector(' +
                    'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                    'ChargerDetector_id varchar,'+
                    'my_timestamp VARCHAR,' +
                    'voltage VARCHAR,' +
                    'electric_current VARCHAR,' +
                    'capacity VARCHAR,' +
                    'BoardTemperature VARCHAR,'+//add
                    'AmbientTemperature VARCHAR)'
                    , [], ()=> {
                        this._successCB('executeSql');
                        resolve();
                    }, (err)=> {
                        this._errorCB('executeSql', err);
                        reject(err);
                    });
            }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
                this._errorCB('transaction', err);
                reject(err);
            }, ()=> {
                this._successCB('transaction');
            })
        });
    }

    //创建数据库表
    async createTable(){
        if (!db) {
            db = await this.open();
        }

        await Promise.all([
            await this.createBatteryTable(),
            await this.createChargerTable(),
            await this.createChargerDetectorTable(),
        ]);
    }

    //删除蓄电池数据
    async deleteData(){
        if (!db) {
            db = await this.open();
        }
        db.transaction((tx)=>{
            tx.executeSql('delete from battery',[],()=>{

            });
        });
    }

    //删除蓄电池表格
    dropTable(){
        db.transaction((tx)=>{
            tx.executeSql('drop table battery',[],()=>{

            });
        },(err)=>{
            this._errorCB('transaction', err);
        },()=>{
            this._successCB('transaction');
        });
    }

    //写蓄电池数据
    async insertbatteryData(batteryData, callback){
        let len = batteryData.length;
        if (!db) {
            db = await this.open();
        }
        this.createTable();
        //删除数据表
        // this.dropTable();
        // this.deleteData();

        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
                var battery = batteryData[i];
                let battery_id= battery.battery_id;
                let my_timestamp = battery.my_timestamp;
                let electric_current = battery.electric_current;
                let equilibrium_temperature=battery.equilibrium_temperature;//add
                let voltage = battery.voltage;
                let temperature = battery.temperature;
                let targetCurrent=battery.targetCurrent;//add
                let targetVoltage=battery.targetVoltage;//add
                let capacity = battery.capacity;
                let balanceVoltage=battery.balanceVoltage;//add
                let bindingState=battery.bindingState;//add
                let equilibriumState=battery.equilibriumState;//add
                let equilibrium_time = battery.equilibrium_time;
                let P_longitude = battery.P_longitude;
                let P_latitude = battery.P_latitude;
                let sql = "INSERT INTO battery(battery_id,my_timestamp,voltage,electric_current,equilibrium_temperature,temperature,targetCurrent,targetVoltage,capacity,balanceVoltage,bindingState,equilibriumState,equilibrium_time,P_longitude,P_latitude)"+
                    "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[battery_id,my_timestamp,voltage,electric_current,equilibrium_temperature,temperature,targetCurrent,targetVoltage,capacity,balanceVoltage,bindingState,equilibriumState,equilibrium_time,P_longitude,P_latitude],()=>{
                        callback();
                    },(err)=>{
                        console.log(err);
                    }
                );
            }
        },(error)=>{
            this._errorCB('transaction', error);
        },()=>{
            this._successCB('transaction insert data');
        });
    }

    //删除充电器数据
    async deleteChargerData(){
        if (!db) {
            db = await this.open();
        }
        db.transaction((tx)=>{
            tx.executeSql('delete from charger',[],()=>{

            });
        });
    }

    //删除充电器表格
    dropChargerTable(){
        db.transaction((tx)=>{
            tx.executeSql('drop table charger',[],()=>{

            });
        },(err)=>{
            this._errorCB('transaction', err);
        },()=>{
            this._successCB('transaction');
        });
    }

    //写充电器数据
    async insertchargerData(chargerData, callback){
        let len = chargerData.length;
        if (!db) {
            db = await this.open();
        }
        this.createTable();
        //删除充电器数据、表
        // this.deleteChargerData();
        // this.dropChargerTable();

        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
                var charger = chargerData[i];
                let charger_id= charger.charger_id;
                let my_timestamp = charger.my_timestamp;
                let electric_current = charger.electric_current;
                let chargerTemperature=charger.chargerTemperature;//add
                let voltage = charger.voltage;
                let batteryTemperature = charger.batteryTemperature;
                let targetCurrent=charger.targetCurrent;//add
                let targetVoltage=charger.targetVoltage;//add
                let capacity = charger.capacity;
                let balanceVoltage=charger.balanceVoltage;//add
                let bindingState=charger.bindingState;//add
                let chargingState=charger.chargingState;//add
                let ambientTemperature=charger.ambientTemperature;//add
                let P_longitude = charger.P_longitude;
                let P_latitude = charger.P_latitude;
                let sql = "INSERT INTO charger(charger_id,my_timestamp,voltage,electric_current,chargerTemperature,batteryTemperature,targetCurrent,targetVoltage,capacity,balanceVoltage,bindingState,chargingState,ambientTemperature,P_longitude,P_latitude)"+
                    "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[charger_id,my_timestamp,voltage,electric_current,chargerTemperature,batteryTemperature,targetCurrent,targetVoltage,capacity,balanceVoltage,bindingState,chargingState,ambientTemperature,P_longitude,P_latitude],()=>{
                        callback();
                    },(err)=>{
                        console.log(err);
                    }
                );
            }
        },(error)=>{
            this._errorCB('transaction', error);
        },()=>{
            this._successCB('transaction insert data');
        });
    }

    //删除充电器检测仪数据
    async deleteChargerDetectorData(){
        if (!db) {
            db = await this.open();
        }
        db.transaction((tx)=>{
            tx.executeSql('delete from ChargerDetector',[],()=>{

            });
        });
    }

    //删除充电器检测仪表格
    dropChargerDetectorTable(){
        db.transaction((tx)=>{
            tx.executeSql('drop table ChargerDetector',[],()=>{

            });
        },(err)=>{
            this._errorCB('transaction', err);
        },()=>{
            this._successCB('transaction');
        });
    }

    //写充电器检测仪数据  createChargerDetectorTable
    async insertChargerDetectorData(ChargerDetectorData, callback){
        let len = ChargerDetectorData.length;
        if (!db) {
            db = await this.open();
        }
        this.createTable();
        //删除充电器数据、表
        // this.deleteChargerData();
        // this.dropChargerTable();

        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
                var ChargerDetector = ChargerDetectorData[i];
                let ChargerDetector_id= ChargerDetector.ChargerDetector_id;
                let my_timestamp = ChargerDetector.my_timestamp;
                let voltage = ChargerDetector.voltage;
                let electric_current = ChargerDetector.electric_current;
                let capacity = ChargerDetector.capacity;
                let BoardTemperature=ChargerDetector.BoardTemperature;//add
                let AmbientTemperature=ChargerDetector.AmbientTemperature;//add
                let sql = "INSERT INTO ChargerDetector(ChargerDetector_id,my_timestamp,voltage,electric_current,capacity,BoardTemperature,AmbientTemperature)"+
                    "values(?,?,?,?,?,?,?)"; 
                tx.executeSql(sql,[ChargerDetector_id,my_timestamp,voltage,electric_current,capacity,BoardTemperature,AmbientTemperature],()=>{
                        callback();
                    },(err)=>{
                        console.log(err);
                    }
                );
            }
        },(error)=>{
            this._errorCB('transaction', error);
        },()=>{
            this._successCB('transaction insert data');
        });
    }

    //结束
    close(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    }

    //成功
    _successCB(name){
        console.log("SQLiteStorage "+name+" success");
    }

    //失败
    _errorCB(name, err){
        console.log("SQLiteStorage "+name);
        console.log(err);
    }

    render(){
        return null;
    }
}