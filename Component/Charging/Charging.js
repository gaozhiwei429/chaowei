import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import DatePicker from 'react-native-datepicker';//时间
import bleBroadcast from '../CWBleBroadcast/CWBleBroadcast';//蓝牙广播模块
import CountDown from 'react-native-countdown-component';
import * as commonality from '../../commonality';
import * as storage from "../../storage";
import {CHARGER_BIND_STORAGE_KEY} from "../../config";
import AlertS from '../Alert/Alert';

const {width,height} =Dimensions.get('window');
var currentTimestamp = Math.round(new Date().getTime()/1000);//当前时间戳

export default class Charging extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            charging: false,
            datetime:'',
            timestamp:'',
        }
    }
    componentDidMount() {

    };
    peakValley(){
        var selectTimestamp=this.state.timestamp;//选择时间戳
        if(selectTimestamp !==0 ){
            var TimeDifference=parseInt((selectTimestamp-currentTimestamp)/60);
            var H24=1440;
            var H24Time=commonality.padding(TimeDifference.toString(16),4);
            if(TimeDifference > H24){
                this.refs.suggest.open();
            }else {
                this.setState({
                    charging:!this.state.charging
                });
                storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
                    bleBroadcast.start('0132' ,'3826879215020000'+H24Time+result,()=>{alert('此手机不支持')});// 定时充电
                });
            }
        }
    }
    immediately(){
        this.setState({
            charging:!this.state.charging
        });
        storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
            bleBroadcast.start('0130' ,'3826879215020000'+result,()=>{alert('此手机不支持')});// 开启充电
        });
    }
    stopRecharge(){
        this.setState({
            charging:!this.state.charging
        });
        storage.get(CHARGER_BIND_STORAGE_KEY, (error, result) => {
            bleBroadcast.start('0131' ,'3826879215020000'+result,()=>{alert('此手机不支持')});// 关闭充电
        });
    }

    static navigationOptions =({ navigation }) =>  {
        var navigation =navigation;
        return{
            headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电</Text>),
            headerStyle: {
                height: 40,
            },
            // headerLeft:(
            //     <View />
            // ),
            headerRight: (
                <TouchableOpacity
                    style={{flex:1,justifyContent: 'center',paddingRight:10,flexDirection:'row',alignItems:'center'}}
                    onPress={()=>navigation.navigate('Help')}
                >
                    <Image source={require('../../img/help.png')} style={{width:15,height:15}}/>
                    <Text style={{fontSize:15,color:'#828282',marginLeft:3}}>充电帮助</Text>
                </TouchableOpacity>
            ),
            headerPressColorAndroid:'gray',
            headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
        }
    };

    render() {
        return (
            <View style={styles.Binding}>
                <AlertS ref='suggest' title='提示' btnText='确定' msg='建议选择24小时以内充电！' />

                <View style={{width:width,height:width,justifyContent:'center',alignItems:'center',backgroundColor:'#37B111'}}>
                    {this.state.charging?<Text style={{fontSize:17,color:'#fff'}}>充电中...</Text>:<Text style={{fontSize:17,color:'#fff',}}>启动充电</Text>}
                    <View style={{width:width,justifyContent:'center',alignItems:'center',}}>
                        <Image source={require('../../img/charging.png')} style={{width:width/3*2,height:width/3*2}}/>
                    </View>
                    <View>
                        <Text style={{fontSize:16,color:'#fff'}}>选择峰谷充电时间</Text>
                        <DatePicker
                            style={{width: 120,marginTop:5}}
                            date={this.state.datetime}
                            mode="time"
                            format="HH:mm"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            hideText={false}
                            showIcon={false}
                            androidMode='spinner'
                            customStyles={{
                                dateIcon: {
                                    // position: 'absolute',
                                    // left: 0,
                                    // top: 4,
                                    // marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 0
                                }
                            }}
                            minuteInterval={10}
                            onDateChange={(datetime) => {
                                this.setState({
                                    datetime:datetime,
                                    timestamp: (new Date(datetime.replace(/-/g, '/')).valueOf())/1000,
                                })
                            }}
                            // onCloseModal={this.peakValley()}
                        />
                    </View>
                </View>
                {/*<CountDown*/}
                    {/*style={{paddingTop:5}}*/}
                    {/*until={this.state.timestamp-currentTimestamp}//this.state.timestamp-currentTimestamp*/}
                    {/*onFinish={() => {}}*/}
                    {/*// onPress={() => {}}*/}
                    {/*size={20}*/}
                    {/*timeToShow={['H', 'M', 'S']}//'D',*/}
                    {/*labelD=''*/}
                    {/*labelH='时'*/}
                    {/*labelM='分'*/}
                    {/*labelS='秒'*/}
                {/*/>*/}
                {/*<Text>{this.state.timestamp-currentTimestamp}</Text>*/}
                <View style={{alignItems:'center',flex:1,justifyContent:'center',flexDirection:'row'}}>
                    {this.state.charging?<TouchableOpacity style={styles.rechargeUnselected}  onPress={()=>this.stopRecharge()}>
                            <Text style={{color:'#fff',fontSize:17}}>停止充电</Text>
                    </TouchableOpacity>:
                        <TouchableOpacity style={styles.recharge}  onPress={()=>this.immediately()}>
                            <Text style={{color:'#fff',fontSize:17}}>启动充电</Text>
                        </TouchableOpacity>
                    }
                    {this.state.timestamp==0?
                        <View style={styles.peakValleyUnselected}  >
                            <Text style={{color:'#fff',fontSize:17}}>峰谷充电</Text>
                        </View>
                        :
                        <TouchableOpacity style={styles.peakValley}  onPress={()=> this.peakValley()}>
                            <Text style={{color:'#fff',fontSize:17}}>峰谷充电</Text>
                        </TouchableOpacity>}
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    Binding: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#fff'
    },
    rechargeUnselected:{
        width:width/3,
        height:50,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#eee',
        borderBottomLeftRadius: 100,
        borderTopLeftRadius:100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth:1,
        borderRightColor:'#FF8226'
    },
    recharge:{
        width:width/3,
        height:50,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#FF8226',
        borderBottomLeftRadius: 100,
        borderTopLeftRadius:100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth:1,
        borderRightColor:'#eee'
    },
    peakValleyUnselected:{
        width:width/3,
        height:50,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#eee',
        borderBottomRightRadius: 100,
        borderTopRightRadius:100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    peakValley:{
        width:width/3,
        height:50,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#FF8226',
        borderBottomRightRadius: 100,
        borderTopRightRadius:100,
        alignItems: 'center',
        justifyContent: 'center',
    }
});