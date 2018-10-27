import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import BleModule from '../CWBleSearch/BleModule';
import * as storage from '../../storage';
import {BATTERY_BIND_STORAGE_KEY,
    CALIBRATION_CHARGER_VOLTAGE_VALUE_STORAGE_KEY,
    CALIBRATION_CHARGER_ELECTRICITY_VALUE_STORAGE_KEY,
    CHARGER_BIND_STORAGE_KEY,
    CALIBRATION_BATTERY_VOLTAGE_VALUE_STORAGE_KEY,
    CALIBRATION_BATTERY_ELECTRICITY_VALUE_STORAGE_KEY
} from '../../config';
import bleBroadcast from '../CWBleBroadcast/CWBleBroadcast';//蓝牙广播模块
import * as commonality from '../../commonality';
import AlertS from '../Alert/Alert';

export default class Calibration extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            BatteryID: '',
            ChargerID:'',
            ChargerCalibration:'',
            BatteryVoltage:'',
            voltager:40,
            Electricity:15,
        };
        this.deviceMap = new Map();
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const { index,chargerImg } = params;

        if(chargerImg === 0){
            // 充电器
            storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
                if (!result) {
                    return;
                }
                this.setState({ ChargerID: result });
            });
        }else {
            // 电池
            storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {
                if (!result) {
                    return;
                }
                const value = result[index];
                this.setState({ BatteryID: value });
            });
        }

        this.deviceMap.clear();
        BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                if(error.errorCode == 102){
                    this.refs.bleScan.open();
                    this.setState({
                        BleScanErr:true
                    })
                }
                BluetoothManager.stopScan();
            }else{
                this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                let data1 = [...this.deviceMap.values()];
                for (let i = 0;i<data1.length;i++) {
                    let BleScan =commonality.CharToHex(commonality.base64decode(data1[i].manufacturerData)).replace(/\\x/g,'').replace(/\s+/g,'').toLowerCase();
                    let fixed = BleScan.slice(0,16);//截取搜索数据
                    let ScanID = data1[i].id.replace(/\:/g, "").toLowerCase();//搜索到的ID
                    let BleScanId1 = ScanID.slice(0, 2);
                    let BleScanId2 = ScanID.slice(2, 4);
                    let BleScanId3 = ScanID.slice(4, 6);
                    let BleScanId4 = ScanID.slice(6, 8);
                    let BleScanId5 = ScanID.slice(8, 10);
                    let BleScanId6 = ScanID.slice(10, 12);
                    let BleScanId = BleScanId6.concat(BleScanId5, BleScanId4, BleScanId3, BleScanId2, BleScanId1);
                    let StorageChargerID = this.state.ChargerID;   //充电器本地存储id
                    let StorageBatteryId = this.state.BatteryID;//蓄电池本地存储id
                    if(chargerImg === 0){
                        /**充电器*/
                        let ChargerFixedValue = '0289382687921502';//判断固定值
                        if(fixed === ChargerFixedValue){
                            if(BleScan !== null && StorageChargerID == BleScanId){//电压、电流校准
                                console.log(BleScan)
                                storage.get(CALIBRATION_CHARGER_VOLTAGE_VALUE_STORAGE_KEY,() => {
                                    this.setState({ 
                                        ChargerCalibration: BleScan
                                    })
                                });
                            }
                        }
                    }else {
                        /** 电池*/
                        let BatteryVoltageValue = '0388382687921502';//固定值电压
                        if(fixed === BatteryVoltageValue){//电压校准
                            if(BleScan !== null && StorageBatteryId === BleScanId){
                                storage.get(CALIBRATION_BATTERY_VOLTAGE_VALUE_STORAGE_KEY,() => {
                                    this.setState({ BatteryVoltage: BleScan});
                                });
                            }
                        }
                    }
                    let BleScans=BleScan.slice(0,22);
                    let bleBroadcastVoltager='02023826879215020000'+this.state.voltager;//充电器电压
                    let bleBroadcastElectricity='02033826879215020000'+this.state.Electricity;//充电器电流
                    let bleBroadcastBatteryVoltager='03023826879215020000'+this.state.voltager;//蓄电池电压
                    if(BleScanId == StorageChargerID){
                        if(BleScans == bleBroadcastVoltager){
                            bleBroadcast.stop();
                        }else if(BleScans == bleBroadcastElectricity){
                            bleBroadcast.stop();
                        }
                    }else if(StorageBatteryId== BleScanId&&BleScans == bleBroadcastBatteryVoltager){
                        bleBroadcast.stop();
                    }
                }
            }
        });
    };

    searchVoltage(){
        const { params } = this.props.navigation.state;
        const { chargerImg } = params;
        if(chargerImg === 0){
            bleBroadcast.start('0002','3826879215020000'+this.state.voltager+this.state.ChargerID,()=>{alert('此手机不支持')});//电压
        }else {
            bleBroadcast.start('0002','3826879215020000'+this.state.voltager+this.state.BatteryID,()=>{alert('此手机不支持')});//电压
        }
    }

    searchElectricity(){
        const { params } = this.props.navigation.state;
        const { chargerImg } = params;
        if(chargerImg === 0){
            bleBroadcast.start('0003','3826879215020000'+this.state.Electricity+this.state.ChargerID,()=>{alert('此手机不支持')});//电流
        }
    }
    componentWillUnmount (){
        BluetoothManager.stopScan();
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1,textAlign:'center'}}>校准</Text>),
        headerStyle: {
            height: 40,
        },
        // headerLeft:(
        //     <View />
        // ),
        headerRight: (
            <View />
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        const { params } = this.props.navigation.state;
        const { index,chargerImg } = params;
        var ChargerVoltage = parseInt((this.state.ChargerCalibration.slice(22,24)).concat(this.state.ChargerCalibration.slice(20,22)),16)/10;// 充电器电压
 
        var ChargerElectricity =  parseInt((this.state.ChargerCalibration.slice(26,28)).concat(this.state.ChargerCalibration.slice(24,26)),16)/10;// 充电器电流

        var BatteryVoltager = parseInt(this.state.BatteryVoltage.slice(22,24).concat(this.state.BatteryVoltage.slice(20,22)),16)/100;// 电池电压
        return (
            <View style={styles.Banding}>
            <AlertS ref='bleScan' title='提示' btnText='确定' msg='请先打开蓝牙再进行校准！' />
                {
                chargerImg===0?
                    <View style={styles.Calibration}>
                        <View style={styles.CalibrationRow}>
                            <Text style={styles.CalibrationText}>电压校准值:</Text>
                            <TextInput style={styles.CalibrationInput}
                                       returnKeyType="search"
                                       onChangeText={(voltager) => this.setState({voltager})}
                                       defaultValue='40'
                                       underlineColorAndroid='transparent'
                                       keyboardType='numeric'
                                       editable={false}
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{ isNaN(ChargerVoltage) ? 0 : ChargerVoltage}</Text>
                            </View>
                        </View>
                        <View style={styles.CalibrationRow}>
                            <Text style={styles.CalibrationText}>电流校准值:</Text>
                            <TextInput style={styles.CalibrationInput}
                                       returnKeyType="search"
                                       onChangeText={(Electricity) => this.setState({Electricity})}
                                       defaultValue='15'
                                       underlineColorAndroid='transparent'
                                       keyboardType='numeric'
                                       editable={false}
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{ isNaN(ChargerElectricity) ? 0:ChargerElectricity}</Text>
                            </View>
                        </View>
                        <View style={styles.BtnTouchable}>
                            <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                <Text style={{fontSize:20}}>电压校准</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.searchElectricity()} style={styles.CalibrationBtn}>
                                <Text style={{fontSize:20}}>电流校准</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        :index===0?
                    <View style={styles.Calibration}>
                        <View style={styles.CalibrationRow}>
                            <Text style={styles.CalibrationText}>电压校准值:</Text>
                            <TextInput style={styles.CalibrationInput}
                                       returnKeyType="search"
                                       onChangeText={(voltager) => this.setState({voltager})}
                                       defaultValue='40'
                                       underlineColorAndroid='transparent'
                                       keyboardType='numeric'
                                       editable={false}
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{ isNaN(BatteryVoltager) ? 0:BatteryVoltager}</Text>
                            </View>
                        </View>

                        <View style={styles.BtnTouchable}>
                            <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                <Text style={{fontSize:20}}>电压校准</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        :index===1?
                        <View style={styles.Calibration}>
                            <View style={styles.CalibrationRow}>
                                <Text style={styles.CalibrationText}>电压校准值:</Text>
                                <TextInput style={styles.CalibrationInput}
                                           returnKeyType="search"
                                           onChangeText={(voltager) => this.setState({voltager})}
                                           defaultValue='40'
                                           underlineColorAndroid='transparent'
                                           keyboardType='numeric'
                                           editable={false}
                                />
                                <View style={styles.CalibrationInstrument}>
                                    <Text style={styles.InstrumentText}>{ isNaN(BatteryVoltager) ? 0:BatteryVoltager}</Text>
                                </View>
                            </View>

                            <View style={styles.BtnTouchable}>
                                <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                    <Text style={{fontSize:20}}>电压校准</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                            :index===2?
                            <View style={styles.Calibration}>
                                <View style={styles.CalibrationRow}>
                                    <Text style={styles.CalibrationText}>电压校准值:</Text>
                                    <TextInput style={styles.CalibrationInput}
                                               returnKeyType="search"
                                               onChangeText={(voltager) => this.setState({voltager})}
                                               defaultValue='40'
                                               underlineColorAndroid='transparent'
                                               keyboardType='numeric'
                                               editable={false}
                                    />
                                    <View style={styles.CalibrationInstrument}>
                                        <Text style={styles.InstrumentText}>{isNaN(BatteryVoltager) ? 0: BatteryVoltager }</Text>
                                    </View>
                                </View>

                                <View style={styles.BtnTouchable}>
                                    <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                        <Text style={{fontSize:20}}>电压校准</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :index===3?
                            <View style={styles.Calibration}>
                                <View style={styles.CalibrationRow}>
                                    <Text style={styles.CalibrationText}>电压校准值:</Text>
                                    <TextInput style={styles.CalibrationInput}
                                               returnKeyType="search"
                                               onChangeText={(voltager) => this.setState({voltager})}
                                               defaultValue='40'
                                               underlineColorAndroid='transparent'
                                               keyboardType='numeric'
                                               editable={false}
                                    />
                                    <View style={styles.CalibrationInstrument}>
                                        <Text style={styles.InstrumentText}>{isNaN(BatteryVoltager) ? 0: BatteryVoltager}</Text>
                                    </View>
                                </View>

                                <View style={styles.BtnTouchable}>
                                    <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                        <Text style={{fontSize:20}}>电压校准</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                                :index===4?
                                    <View style={styles.Calibration}>
                                        <View style={styles.CalibrationRow}>
                                            <Text style={styles.CalibrationText}>电压校准值:</Text>
                                            <TextInput style={styles.CalibrationInput}
                                                       returnKeyType="search"
                                                       onChangeText={(voltager) => this.setState({voltager})}
                                                       defaultValue='40'
                                                       underlineColorAndroid='transparent'
                                                       keyboardType='numeric'
                                                       editable={false}
                                            />
                                            <View style={styles.CalibrationInstrument}>
                                                <Text style={styles.InstrumentText}>{isNaN(BatteryVoltager) ? 0: BatteryVoltager}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.BtnTouchable}>
                                            <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                                <Text style={{fontSize:20}}>电压校准</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>:
                                    <View style={styles.Calibration}>
                                        <View style={styles.CalibrationRow}>
                                            <Text style={styles.CalibrationText}>电压校准值:</Text>
                                            <TextInput style={styles.CalibrationInput}
                                                       returnKeyType="search"
                                                       onChangeText={(voltager) => this.setState({voltager})}
                                                       defaultValue='40'
                                                       underlineColorAndroid='transparent'
                                                       keyboardType='numeric'
                                                       editable={false}
                                            />
                                            <View style={styles.CalibrationInstrument}>
                                                <Text style={styles.InstrumentText}>{isNaN(BatteryVoltager) ? 0: BatteryVoltager}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.BtnTouchable}>
                                            <TouchableOpacity onPress={()=>this.searchVoltage()} style={styles.CalibrationBtn}>
                                                <Text style={{fontSize:20}}>电压校准</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    BtnTouchable:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    CalibrationBtn:{
        width:120,
        height:40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#3BB6FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    InstrumentText:{
        fontSize:20
    },
    CalibrationInstrument:{
        marginRight:20,
        width:55,    
        height:44,
        backgroundColor:'#ccc',
        alignItems:'center',
        justifyContent:'center'
    },
    CalibrationRow:{
        flexDirection:'row',
        height:45,
        borderBottomColor:'#eee',
        borderBottomWidth:1,
        alignItems:'center',
        justifyContent:'space-between'
    },
    CalibrationInput:{
        width:70,
        height:36,
        borderWidth:1,
        marginLeft: 5,
        paddingLeft:5,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    CalibrationText:{
        fontSize:20,
        marginLeft:15,
        paddingTop:10,
        paddingBottom:10,
    },
    Calibration: {
        flex:1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    Banding:{
        flex: 1,
        backgroundColor:'#fff',
    }
});