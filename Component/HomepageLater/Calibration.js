import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import BleModule from '../CWBleSearch/BleModule';
import * as storage from '../../storage';
import {BATTERY_BIND_STORAGE_KEY, CALIBRATION_CHARGER_VOLTAGE_VALUE_STORAGE_KEY, CALIBRATION_CHARGER_ELECTRICITY_VALUE_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY,CALIBRATION_BATTERY_VOLTAGE_VALUE_STORAGE_KEY,CALIBRATION_BATTERY_ELECTRICITY_VALUE_STORAGE_KEY} from '../../config';
import bleBroadcast from '../CWBleBroadcast/CWBleBroadcast';//蓝牙广播模块
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    if(str != null){
        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c1 == -1);
            if(c1 == -1)
                break;

            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c2 == -1);
            if(c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if(c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while(i < len && c3 == -1);
            if(c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if(c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while(i < len && c4 == -1);
            if(c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
    }

    return out;
}

function CharToHex(str) {
    var out, i, len, c, h;
    out = "";
    if(str != null){
        len = str.length;
        i = 0;
        while(i < len) {
            c = str.charCodeAt(i++);
            h = c.toString(16);
            if(h.length < 2)
                h = "0" + h;
            out += "\\x" + h + " ";
            if(i > 0 && i % 8 == 0)
                out += "\r\n";
        }
    }
    return out;
}

export default class Calibration extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            BatteryID: '',
            ChargerID:'',
            ChargerVoltage:'',
            ChargerElectricity:'',
            BatteryVoltage:'',
            BatteryElectricity:'',
            voltager:'',
            Electricity:'',
        };
        this.deviceMap = new Map();
    }

    componentWillMount() {
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
                alert('请打开手机蓝牙后再搜索');
            }else{
                this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                let data1 = [...this.deviceMap.values()];
                for (let i = 0;i<data1.length;i++) {
                    let BleScan =CharToHex(base64decode(data1[i].manufacturerData)).replace(/\\x/g,'').replace(/\s+/g,'');
                    let fixed = BleScan.slice(0,16);//截取搜索数据
                    let ScanID = data1[i].id.replace(/\:/g, "");//搜索到的ID
                    if(chargerImg === 0){
                        /**充电器*/
                        let StorageChargerID = this.state.ChargerID;   //本地存储id

                        let ChargerVoltageValue = '0202382687921502';//固定值电压
                        let ChargerElectricityValue = '0203382687921502';//固定值电流
                        if(fixed === ChargerVoltageValue){//电压校准
                            if(BleScan !== null && StorageChargerID === ScanID){
                                storage.get(CALIBRATION_CHARGER_VOLTAGE_VALUE_STORAGE_KEY,() => {
                                    this.setState({ ChargerVoltage: BleScan});
                                });
                            }
                        }else if(fixed ===ChargerElectricityValue){//电流校准
                            if(BleScan !== null && StorageChargerID === ScanID){
                                storage.get(CALIBRATION_CHARGER_ELECTRICITY_VALUE_STORAGE_KEY,() => {
                                    this.setState({ ChargerElectricity: BleScan});
                                });
                            }
                        }
                    }else {
                        /** 电池*/
                        let StorageBatteryId = this.state.BatteryID;//本地存储id
                        let BatteryVoltageValue = '0302382687921502';//固定值电压
                        let BatteryElectricityValue = '0303382687921502';//固定值电流
                        if(fixed === BatteryVoltageValue){//电压校准
                            if(BleScan !== null && StorageBatteryId === ScanID){
                                storage.get(CALIBRATION_BATTERY_VOLTAGE_VALUE_STORAGE_KEY,() => {
                                    this.setState({ BatteryVoltage: BleScan});
                                });
                            }
                        }else if(fixed === BatteryElectricityValue){
                            if(BleScan !== null && StorageBatteryId === ScanID){
                                storage.get(CALIBRATION_BATTERY_ELECTRICITY_VALUE_STORAGE_KEY,() => {
                                    this.setState({ BatteryElectricity: BleScan});
                                });
                            }
                        }

                    }
                }
            }
        });
    };

    searchVoltage(){
        const { params } = this.props.navigation.state;
        const { chargerImg } = params;
        if(chargerImg === 0){
            bleBroadcast.start('02','02023826879215020000'+this.state.voltager+this.state.ChargerID);//电压
        }else {
            bleBroadcast.start('02','03023826879215020000'+this.state.voltager+this.state.BatteryID);//电压
        }

        console.log("您输入的内容为："+this.state.voltager);
    }

    searchElectricity(){
        const { params } = this.props.navigation.state;
        const { chargerImg } = params;
        if(chargerImg === 0){
            bleBroadcast.start('03','02033826879215020000'+this.state.Electricity+this.state.ChargerID);//电流
        }else {
            bleBroadcast.start('03','03033826879215020000'+this.state.Electricity+this.state.BatteryID);//电流
        }

        console.log("您输入的内容为："+this.state.Electricity);
    }

    static navigationOptions = {
        title: '校准',
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
    };

    render() {
        const { params } = this.props.navigation.state;
        const { index,chargerImg } = params;
        // 充电器电压
        var ChargerVoltage = parseInt(this.state.ChargerVoltage.slice(20,22));
        // 充电器电流
        var ChargerElectricity = parseInt(this.state.ChargerElectricity.slice(20,22));

        // 电池电压
        var BatteryVoltager = parseInt(this.state.BatteryVoltage.slice(20,22));
        //电池电流
        var BatteryElectricity = parseInt(this.state.BatteryElectricity.slice(20,22));
        return (
            <View style={styles.Banding}>
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
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{ChargerVoltage == NaN ? ChargerVoltage:0}</Text>
                            </View>
                        </View>
                        <View style={styles.CalibrationRow}>
                            <Text style={styles.CalibrationText}>电流校准值:</Text>
                            <TextInput style={styles.CalibrationInput}
                                       returnKeyType="search"
                                       onChangeText={(Electricity) => this.setState({Electricity})}
                                       defaultValue='12'
                                       underlineColorAndroid='transparent'
                                       keyboardType='numeric'
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{ChargerElectricity == NaN ? ChargerElectricity:0}</Text>
                            </View>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{color:'#c0c0c0'}}>注：输入框内容以手动输入数据为准</Text>
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
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{BatteryVoltager == NaN ? BatteryVoltager:0}</Text>
                            </View>
                        </View>
                        <View style={styles.CalibrationRow}>
                            <Text style={styles.CalibrationText}>电流校准值:</Text>
                            <TextInput style={styles.CalibrationInput}
                                       returnKeyType="search"
                                       onChangeText={(Electricity) => this.setState({Electricity})}
                                       defaultValue='12'
                                       underlineColorAndroid='transparent'
                                       keyboardType='numeric'
                            />
                            <View style={styles.CalibrationInstrument}>
                                <Text style={styles.InstrumentText}>{BatteryElectricity == NaN ? BatteryElectricity:0}</Text>
                            </View>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{color:'#c0c0c0'}}>注：输入框内容以手动输入数据为准</Text>
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
                                />
                                <View style={styles.CalibrationInstrument}>
                                    <Text style={styles.InstrumentText}>{BatteryVoltager == NaN ? BatteryVoltager:0}</Text>
                                </View>
                            </View>
                            <View style={styles.CalibrationRow}>
                                <Text style={styles.CalibrationText}>电流校准值:</Text>
                                <TextInput style={styles.CalibrationInput}
                                           returnKeyType="search"
                                           onChangeText={(Electricity) => this.setState({Electricity})}
                                           defaultValue='12'
                                           underlineColorAndroid='transparent'
                                           keyboardType='numeric'
                                />
                                <View style={styles.CalibrationInstrument}>
                                    <Text style={styles.InstrumentText}>{BatteryElectricity == NaN ? BatteryElectricity:0}</Text>
                                </View>
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Text style={{color:'#c0c0c0'}}>注：输入框内容以手动输入数据为准</Text>
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
                                    />
                                    <View style={styles.CalibrationInstrument}>
                                        <Text style={styles.InstrumentText}>{BatteryVoltager == NaN ? BatteryVoltager:0}</Text>
                                    </View>
                                </View>
                                <View style={styles.CalibrationRow}>
                                    <Text style={styles.CalibrationText}>电流校准值:</Text>
                                    <TextInput style={styles.CalibrationInput}
                                               returnKeyType="search"
                                               onChangeText={(Electricity) => this.setState({Electricity})}
                                               defaultValue='12'
                                               underlineColorAndroid='transparent'
                                               keyboardType='numeric'
                                    />
                                    <View style={styles.CalibrationInstrument}>
                                        <Text style={styles.InstrumentText}>{BatteryElectricity == NaN ? BatteryElectricity:0}</Text>
                                    </View>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text style={{color:'#c0c0c0'}}>注：输入框内容以手动输入数据为准</Text>
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
                                :
                            <View style={styles.Calibration}>
                                <View style={styles.CalibrationRow}>
                                    <Text style={styles.CalibrationText}>电压校准值:</Text>
                                    <TextInput style={styles.CalibrationInput}
                                               returnKeyType="search"
                                               onChangeText={(voltager) => this.setState({voltager})}
                                               defaultValue='40'
                                               underlineColorAndroid='transparent'
                                               keyboardType='numeric'
                                    />
                                    <View style={styles.CalibrationInstrument}>
                                        <Text style={styles.InstrumentText}>{BatteryVoltager == NaN ? BatteryVoltager:0}</Text>
                                    </View>
                                </View>
                                <View style={styles.CalibrationRow}>
                                    <Text style={styles.CalibrationText}>电流校准值:</Text>
                                    <TextInput style={styles.CalibrationInput}
                                               returnKeyType="search"
                                               onChangeText={(Electricity) => this.setState({Electricity})}
                                               defaultValue='12'
                                               underlineColorAndroid='transparent'
                                               keyboardType='numeric'
                                    />
                                    <View style={styles.CalibrationInstrument}>
                                        <Text style={styles.InstrumentText}>{BatteryElectricity == NaN ? BatteryElectricity:0}</Text>
                                    </View>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text style={{color:'#c0c0c0'}}>注：输入框内容以手动输入数据为准</Text>
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
        width:50,
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