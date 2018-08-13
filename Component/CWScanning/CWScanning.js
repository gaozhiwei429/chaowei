import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
    Alert,
} from 'react-native';
import * as storage from '../../storage';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY,PHONE_BIND_STORAGE_KEY } from '../../config';
import AlertS from '../Alert/Alert';
export default class CWScanning extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            dataBattery: '',
            dataCharger:'',
        }
    }

    //页面跳转
    detail() {
        this.props.navigation.goBack();
    }

    componentWillMount() {
        this.setState({dataBattery: '',dataCharger:'',});

        const { params } = this.props.navigation.state;
        const { index,chargerImg } = params;

        if(chargerImg === 0){
            // 充电器
            storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
                if (!result) {
                    this.refs.chargerBack.open();
                    return;
                }
                this.setState({ dataCharger: result });
            });
        }else {
            // 电池
            storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {
                if (!result) {
                    this.refs.batterBack.open();
                    return;
                }
                const value = result[index];
                this.setState({ dataBattery: value });
            });
        }
    };

    _removeBattery = ()=>{    // 解绑电池
        AsyncStorage.removeItem(BATTERY_BIND_STORAGE_KEY);
        AsyncStorage.removeItem(PHONE_BIND_STORAGE_KEY);
        this.refs.batterUnbing.open();
    };

    _removeCharger = ()=>{    // 解绑充电器
        AsyncStorage.removeItem(CHARGER_BIND_STORAGE_KEY);
        AsyncStorage.removeItem(PHONE_BIND_STORAGE_KEY);
        this.refs.chargerUnbing.open();
    };

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>绑定</Text>),
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
        // headerLeft:(
        //     <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        // ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'blue',
    };

    render() {
        const { params } = this.props.navigation.state;
        const { chargerImg } = params;
        return (
            <View style={styles.Binding}>
                <AlertS ref='chargerBack' title='提示' btnText='确定' msg='请先扫充电器二维码！' callback={()=>this.props.navigation.goBack()}/>
                <AlertS ref='batterBack' title='提示' btnText='确定' msg='请先扫蓄电池二维码！' callback={()=>this.props.navigation.goBack()}/>
                <AlertS ref='batterUnbing' title='提示' btnText='确定' msg='蓄电池已解绑！' callback={()=>this.props.navigation.goBack()}/>
                <AlertS ref='chargerUnbing' title='提示' btnText='确定' msg='充电器已解绑！' callback={()=>this.props.navigation.goBack()}/>
                <View>
                    { chargerImg == 0
                    ? <Text>恭喜绑定充电器ID为：{this.state.dataCharger}</Text>
                    : <Text>恭喜绑定蓄电池ID为：{this.state.dataBattery}</Text> }
                </View>
                <TouchableOpacity style={styles.releaseOpacity}>
                    { chargerImg == 0
                    ? <Text style={styles.release} onPress={this._removeCharger}>解除绑定</Text>
                    : <Text style={styles.release} onPress={this._removeBattery}>解除绑定</Text> }
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    releaseOpacity:{
        height:35,
        width:100,
        backgroundColor:'#0067B3',
        borderRadius:8,
        justifyContent:'center',
        marginTop:20,
    },
    release:{
        fontSize:20,
        color:'#fff',
        textAlign:'center',
    },
    Binding:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
});