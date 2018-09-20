import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

export default class CWButton extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>RSSI</Text>),
        headerStyle: {
            height: 40,
        },
        // headerLeft:(
        //     <View/>
        // ),
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    constructor(){
        super();
        this.state = {
            rssi:'',
            BleScan:'',
            len:0
        };
        this.deviceMap = new Map();
    } 

    componentDidMount(){ 
        this.deviceMap.clear();
        BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                if(error.errorCode == 102){
                    this.refs.bleScan.open();
                }
                console.log(err);
                return;
            }else{
                this.deviceMap.set(device.id,device); //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
                var BleScan = [...this.deviceMap.values()];
            }
            for(var i=0;i<BleScan.length;i++){
                if(BleScan[i].id=='01:FF:FF:FF:F0:05'){
                    this.setState({
                        rssi:BleScan[i].rssi,
                        BleScan:BleScan[i].id,
                        len:BleScan.length 
                    }) 
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.bleRssi}>
                        <Text style={{fontSize:20}}>ID：{this.state.BleScan}</Text>
                        <Text style={{fontSize:20}}>RSSI：{this.state.rssi}</Text>
                </View>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    bleRssi:{
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#111',   
    },
    container:{
        flex:1,
        alignItems: 'center',
        // justifyContent:'center',
    }
});
