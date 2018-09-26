import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity, 
    Dimensions,
    Image,
} from 'react-native';
import RNFS from 'react-native-fs';
import SQLiteText from '../SQLite/sqlite';
import AlertProgress from '../Alert/AlertProgress';
import EasyToast, {DURATION} from 'react-native-easy-toast';
import OpenFolder from '../OpenFolder/Openfolder';
var sqLite = new SQLiteText();
var db;
var batterypath = RNFS.ExternalDirectoryPath  + '/电池数据.csv'; // 文件路径
var chargerpath = RNFS.ExternalDirectoryPath  + '/充电器数据.csv' ;// 文件路径
var ChargerDetectorpath = RNFS.ExternalDirectoryPath + '/充电器检测仪数据.csv';

export default class Filesystem extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            AlertProgress: 0,
            percentage:0,
        }
    }

    // 写内容到文件中
    /**
     * 电池参数说明：
     * battery_id               电池ID
     * my_timestamp             写入时间
     * voltage                  当前的电压
     * equilibrium_time         平衡时间
     * electric_current         均衡电流
     * equilibrium_temperature  均衡温度
     * temperature              环境温度
     * targetCurrent            目标电流
     * targetVoltage            目标电压
     * capacity                 容量
     * balanceVoltage           均衡电压
     * bindingState             绑定状态
     * equilibriumState         均衡状态
     * */

    /**电池数据写入文件*/
    async batteryWriteFile(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }

        let batteryContent={'battery_id':'电池ID', 'my_timestamp': '写入时间', 'voltage': '当前的电压', 'equilibrium_time': '平衡时间', 'electric_current': '均衡电流', 'equilibrium_temperature': '均衡温度', 'temperature': '环境温度', 'targetCurrent': '目标电流', 'targetVoltage': '目标电压', 'capacity': '容量', 'balanceVoltage': '均衡电压', 'bindingState': '绑定状态', 'equilibriumState': '均衡状态'};

        let batteryJsonarr = batteryContent.battery_id+','+batteryContent.my_timestamp+','+batteryContent.voltage+','+batteryContent.equilibrium_time+','+batteryContent.electric_current+','+batteryContent.equilibrium_temperature+','+batteryContent.temperature+','+batteryContent.targetCurrent+','+batteryContent.targetVoltage+','+batteryContent.capacity+','+batteryContent.balanceVoltage+','+batteryContent.bindingState+','+batteryContent.equilibriumState+','+'\n';

        RNFS.writeFile(batterypath, batteryJsonarr, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });

        db.transaction((tx)=>{
            tx.executeSql("select * from battery order by id desc", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    let u = results.rows.item(i);
                    let content={'battery_id':u.battery_id, 'my_timestamp': u.my_timestamp, 'voltage': u.voltage, 'equilibrium_time': u.equilibrium_time, 'electric_current': u.electric_current, 'equilibrium_temperature': u.equilibrium_temperature, 'temperature': u.temperature, 'targetCurrent': u.targetCurrent, 'targetVoltage': u.targetVoltage, 'capacity': u.capacity, 'balanceVoltage': u.balanceVoltage, 'bindingState': u.bindingState, 'equilibriumState': u.equilibriumState};
                    // var jsonarr = JSON.stringify(content);
                    let jsonarr = content.battery_id+','+content.my_timestamp+','+content.voltage+','+content.equilibrium_time+','+content.electric_current+','+content.equilibrium_temperature+','+content.temperature+','+content.targetCurrent+','+content.targetVoltage+','+content.capacity+','+content.balanceVoltage+','+content.bindingState+','+content.equilibriumState+','+'\n';
                    // write the file
                    RNFS.appendFile(batterypath, jsonarr, 'utf8')
                        .then((success) => {
                            var progress=(i/(len-1));
                            var percentage=parseInt(progress*100);
                            this.setState({
                                AlertProgress: progress,
                                percentage:percentage
                            });
                            this.refs.alert.open();
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }
            });
        },(error)=>{
            console.log(error);
        });
    }

    /**
     * 充电器参数说明：
     * charger_id               充电器ID
     * my_timestamp             写入时间
     * voltage                  当前的电压
     * electric_current         当前电流
     * chargerTemperature       充电器温度
     * batteryTemperature       电池温度
     * targetCurrent            目标电流
     * targetVoltage            目标电压
     * capacity                 容量
     * balanceVoltage           均衡电压
     * bindingState             绑定状态
     * chargingState            充电状态
     * ambientTemperature       环境温度
     * */

    /**充电器数据写入文件*/
    async chargerWriteFile(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }

        let chargerContent={'charger_id':'充电器ID', 'my_timestamp': '写入时间', 'voltage': '当前的电压', 'electric_current': '当前电流', 'chargerTemperature': '充电器温度', 'batteryTemperature': '电池温度', 'targetCurrent': '目标电流', 'targetVoltage': '目标电压',  'capacity': '容量', 'balanceVoltage': '均衡电压', 'bindingState': '绑定状态', 'chargingState': '充电状态', 'ambientTemperature': '环境温度'};

        let chargerJsonarr = chargerContent.charger_id+','+chargerContent.my_timestamp+','+chargerContent.voltage+','+chargerContent.electric_current+','+chargerContent.chargerTemperature+','+chargerContent.batteryTemperature+','+chargerContent.targetCurrent+','+chargerContent.targetVoltage+','+chargerContent.capacity+','+chargerContent.balanceVoltage+','+chargerContent.bindingState+','+chargerContent.chargingState+','+chargerContent.ambientTemperature+','+'\n';

        RNFS.writeFile(chargerpath, chargerJsonarr, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });

        db.transaction((tx)=>{
            tx.executeSql("select * from charger order by id desc", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    let u = results.rows.item(i);
                    let content={'charger_id':u.charger_id, 'my_timestamp': u.my_timestamp, 'voltage': u.voltage, 'electric_current': u.electric_current, 'chargerTemperature': u.chargerTemperature, 'batteryTemperature': u.batteryTemperature, 'targetCurrent': u.targetCurrent, 'targetVoltage': u.targetVoltage,  'capacity': u.capacity, 'balanceVoltage': u.balanceVoltage, 'bindingState': u.bindingState, 'chargingState': u.chargingState, 'ambientTemperature': u.ambientTemperature};
                    let jsonarr = content.charger_id+','+content.my_timestamp+','+content.voltage+','+content.electric_current+','+content.chargerTemperature+','+content.batteryTemperature+','+content.targetCurrent+','+content.targetVoltage+','+content.capacity+','+content.balanceVoltage+','+content.bindingState+','+content.chargingState+','+content.ambientTemperature+','+'\n';
                    // write the file
                    RNFS.appendFile(chargerpath, jsonarr, 'utf8')
                        .then((success) => {
                            var progress=(i/(len-1));
                            // console.log(progress);
                            var percentage=parseInt(progress*100);
                            // console.log(percentage);
                            this.setState({
                                AlertProgress: progress,
                                percentage:percentage
                            });
                            this.refs.alert.open();
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }
            });
        },(error)=>{
            console.log(error);
        });
    }

    /**
     * 充电器检测仪参数说明：
     * ChargerDetector_id             电池ID
     * my_timestamp                   写入时间
     * voltage                        当前的电压
     * equilibrium_time               平衡时间
     * capacity                       容量
     * BoardTemperature               电路板温度
     * AmbientTemperature             环境温度
     * */
    

    async ChargerDetectorFile(){
        //开启数据库
        if(!db){
            db = await sqLite.open();
        }

        let ChargerDetectorContent={
            'ChargerDetector_id':'充电器检测仪ID', 
            'my_timestamp': '写入时间', 
            'voltage': '当前的电压',
            'electric_current': '当前电流',
            'capacity': '容量',
            'BoardTemperature': '电路板温度',
            'AmbientTemperature': '环境温度'
        };

        let ChargerDetectorJsonarr = 
            ChargerDetectorContent.ChargerDetector_id + ',' + 
            ChargerDetectorContent.my_timestamp + ',' + 
            ChargerDetectorContent.voltage + ',' + 
            ChargerDetectorContent.electric_current + ',' + 
            ChargerDetectorContent.BoardTemperature + ',' +
            ChargerDetectorContent.AmbientTemperature + ',' + '\n' ;

        RNFS.writeFile(ChargerDetectorpath, ChargerDetectorJsonarr, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });

        db.transaction((tx)=>{
            tx.executeSql ( " select * from ChargerDetector order by id desc " , [],(tx,results)=>{
                var len = results.rows.length;
                for ( let i = 0 ; i < len ; i++ ) {
                    let u = results.rows.item(i);
                    let content = {
                        'ChargerDetector_id':u.ChargerDetector_id,
                        'my_timestamp': u.my_timestamp,
                        'voltage': u.voltage ,
                        'electric_current': u.electric_current ,
                        'capacity': u.capacity ,
                        'BoardTemperature': u.BoardTemperature , 
                        'AmbientTemperature': u.AmbientTemperature
                    };
                    let ChargerDetectorJsonarr = 
                    content.ChargerDetector_id + ',' +
                    content.my_timestamp + ',' +
                    content.voltage + ',' +
                    content.electric_current + ',' +
                    content.capacity + ',' +
                    content.BoardTemperature + ',' + 
                    content.AmbientTemperature + ',' + '\n';
                    // write the file 
                    RNFS.appendFile(ChargerDetectorpath, ChargerDetectorJsonarr, 'utf8')
                        .then((success) => {
                            var progress=(i/(len-1)); 
                            var percentage=parseInt(progress*100);
                            this.setState({
                                AlertProgress: progress,
                                percentage:percentage
                            });
                            this.refs.alert.open();
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }
            });
        },(error)=>{
            console.log(error);
        });
    }


    // 删除电池文件
    deleteFile(){
        RNFS.unlink(batterypath)  
            // .then(()=>{
            //     this.refs.toast.show('文件删除成功!',2000);
            // })
            .catch((err)=>{
                console.log(err)
                // this.refs.toast.show('没有文件可以删除!',2000);
            })
        RNFS.unlink(chargerpath)
            // .then(()=>{
            //     this.refs.toast.show('文件删除成功!',2000);
            // })
            .catch((err)=>{
                console.log(err)
                // this.refs.toast.show('没有文件可以删除!',2000);
            })
        RNFS.unlink(ChargerDetectorpath)
            .then(()=>{
                this.refs.toast.show('文件删除成功!',2000);
            })
            .catch((err)=>{
                this.refs.toast.show('没有文件可以删除!',2000);
            })
    }

    static navigationOptions = {
        headerTitle: (<Text style={{fontSize: 20, flex: 1, textAlign: 'center'}}>读写文件</Text>),
        headerStyle: {
            height: 40,
        },
        // headerLeft:(
        //     <View/>
        // ),
        headerRight: (
            <View style={{height: 44, width: 55, justifyContent: 'center', paddingRight: 15}}/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        return (
            <View style={styles.container}>
                <AlertProgress ref='alert' btnText='确定' width={_width*0.55} progress={this.state.AlertProgress} percentage={this.state.percentage}/>

                <TouchableOpacity onPress={()=>this.batteryWriteFile()} >
                    <Text style={{margin:20,fontSize:20}}>电池数据</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.chargerWriteFile()}>
                    <Text style={{margin:20,fontSize:20}}>充电器数据</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.ChargerDetectorFile()}>
                    <Text style={{margin:20,fontSize:20}}>充电器检测仪数据</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.deleteFile()}>
                    <Text style={{margin:20,fontSize:20}}>删除文件</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>OpenFolder.open()}>
                    <Text style={{margin:20,fontSize:20}}>打开文件夹</Text>
                </TouchableOpacity>
                <Text style={{width:_width/2}}>注：{'\n'}①打开文件夹功能此功能需借助——ES文件浏览器 软件;{'\n'}②导出的文件在安卓手机文件管理系统下的 Android/data/com.chaowei/files/文件夹下</Text>
                <EasyToast
                    ref="toast"
                    style={ {backgroundColor:'rgba(0,0,0,0.5)',padding:12}}
                    position='top'
                />
            </View>
        );
    }
};

let _width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});