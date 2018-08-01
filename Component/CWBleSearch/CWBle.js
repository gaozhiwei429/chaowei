import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeAppEventEmitter,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ListView,
    ScrollView,
    AppState,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const window = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
export default class CWBle extends Component {
    constructor(){
        super();
        this.state = {
            scanning:false,
            peripherals: new Map()
        };
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    }
    componentDidMount(){
        BleManager.start({showAlert: false})
            .then( ()=>{
                //检查蓝牙打开状态，初始化蓝牙后检查当前蓝牙有没有打开
                BleManager.checkState();
                console.log('Init the module success.');
            }).catch(error=>{
            console.log('Init the module fail.');
        });
        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        BleManager.scan([], 10000, true)
            .then(() => {
                console.log('Scan started');
            })
            .catch((err)=>{
                console.log('Scan started fail');
            });
    }

    handleDiscoverPeripheral(peripheral){
        var peripherals = this.state.peripherals;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals })
    }

    render() {
        const list = Array.from(this.state.peripherals.values());
        const dataSource = ds.cloneWithRows(list);
        const data = dataSource._dataBlob;
        console.log(data);
        return (
            <View style={styles.container}>
                <TouchableHighlight style={{marginTop: 40 ,padding:20}} onPress={() => this.componentDidMount() }>
                    <Text>刷新</Text>
                </TouchableHighlight>
                <ScrollView style={styles.scroll}>
                    <ListView
                        enableEmptySections={true}
                        dataSource={dataSource}
                        renderRow={(item) => {
                            return (
                                <View style={[styles.row,]}>{/*{backgroundColor: color}*/}
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.id}>{item.id}</Text>
                                    <Text>bytes:{item.advertising.bytes}</Text>
                                    <Text>data:{item.advertising.data}</Text>
                                    <Text>rssi:{item.rssi}</Text>
                                    {/*<Text>{console.log(item)}</Text>*/}
                                </View>
                            );
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    id:{
        fontSize: 8, textAlign: 'center', color: '#333333', padding: 10
    },
    name:{
        fontSize: 12, textAlign: 'center', color: '#333333', padding: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: window.width,
        height: window.height
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10
    },
});