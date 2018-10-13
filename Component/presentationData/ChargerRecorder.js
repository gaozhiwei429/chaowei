import React, { Component } from 'react'
import { 
    StyleSheet,
    Text, 
    View,
    Image,
} from 'react-native'

import CWBtnCell from "../CWButton/CWBtnCell";
import * as commonality from '../../commonality';
import { LOGGER_STORAGE_KEY } from '../../config';
import * as storage from '../../storage';
import AlertS from '../Alert/Alert';

export default class ChargerRecorder extends Component {

    constructor(){
        super();
        this.state = {
            ChargerRecorder:[],
            status:'',
            BleScanErr:false,
        };
        this.deviceMap = new Map();
    } 

    componentDidMount() {
        var chargerDetectorIdentifier = '048a382687921502';//充电器检测仪识别固定码  048a382687921502
        storage.get(LOGGER_STORAGE_KEY, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            this.setState({
                ChargerRecorder:result
            })
        })
        
        /**蓝牙搜索*/
        this.deviceMap.clear();
        BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                if(error.errorCode == 102){
                    this.refs.bleScan.open();
                    this.setState({
                        BleScanErr:true
                    })
                }
                return;  
            }else{
                this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                var BleData=[...this.deviceMap.values()];
                
                if(BleData !== undefined){
                    for (let i = 0;i<BleData.length;i++) {
                        var BleDataArray=commonality.CharToHex(commonality.base64decode(BleData[i].manufacturerData)).replace(/\\x/g,'').replace(/\s+/g,'').toLowerCase();
                        var BleScanArrayId = BleData[i].id.replace(/\:/g, "").toLowerCase();
                        var Interception=BleDataArray.slice(0,16);
                        let BleScanId1 = BleScanArrayId.slice(0, 2); 
                        let BleScanId2 = BleScanArrayId.slice(2, 4);
                        let BleScanId3 = BleScanArrayId.slice(4, 6);
                        let BleScanId4 = BleScanArrayId.slice(6, 8);
                        let BleScanId5 = BleScanArrayId.slice(8, 10);
                        let BleScanId6 = BleScanArrayId.slice(10, 12);
                        var BleScanId = BleScanId6.concat(BleScanId5, BleScanId4, BleScanId3, BleScanId2, BleScanId1).toLowerCase();
                        if(BleScanId == this.state.ChargerRecorder[0] && Interception==chargerDetectorIdentifier){
                            this.setState({
                                status:paseInt(BleDataArray.slice(32,34),16),
                            })
                        }
                    }
                }
            }
        })
    };

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪</Text>),
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

        return (
            <View style={styles.container}>
                <AlertS ref='bleScan' title='提示' btnText='确定' msg='请先打开蓝牙开关！' />
                <View style={styles.status}>
                    <Text style={styles.statusHeader}>状态：</Text>
                    <Text style={styles.statusText}>{
                        this.state.status===0?'开机'
                        :this.state.status===1?'充电安全监测模式'
                        :this.state.status===2?'充电器快速检测模式'
                        :this.state.status===3?'数据记录模式'
                        :this.state.status===4?'充电故障保护状态'
                        :this.state.status===5?'零点校准模式'
                        :this.state.status===6?'参数校准模式'
                        :this.state.BleScanErr===true?'蓝牙未开启'
                        :'搜索中...'
                        }</Text>
                </View>
                <CWBtnCell
                    title='绑定'
                    onPress={() => this.props.navigation.navigate('CWScanning',{ Logger : 0 } )}
                />
                <CWBtnCell
                    title='数据'
                    onPress={() => this.props.navigation.navigate('ChargerDetector')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    statusText:{
        fontSize:15,
    },
    statusHeader:{
        fontSize:19,
    },
    status:{
        height:45,
        backgroundColor:'#B4ED81',
        justifyContent:'center',
        alignItems: 'center',
        flexDirection:'row',
    },
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
})