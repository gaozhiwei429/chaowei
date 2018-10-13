import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import Echarts from 'native-echarts';
import SQLiteText from '../SQLite/sqlite';
// import * as storage from '../../storage';
import * as commonality from '../../commonality';
// import { CHARGER_BIND_STORAGE_KEY,LOGGER_STORAGE_KEY} from '../../config';
var sqLite = new SQLiteText();
var db;

class VoltageCurrent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chargerVoltage:[],
            chargerElectricCurrent:[],
            chargerTimeData:[],
            chargerTime:[],
            ChargerDetector:[],
            xTime:[],
        };
    }

    async componentDidMount(){

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        /** 充电器检测仪*/

        //查询数据库总数据
        let Database = new Promise(function (resolve,reject){
            return db.transaction((tx)=>{
                tx.executeSql("select ChargerDetector_id,my_timestamp,voltage,electric_current from ChargerDetector where ChargerDetector_id order by my_timestamp asc", [],(tx,results)=>{
                    var len = results.rows.length;
                    let Database=[];
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        Database.push(u);
                    }
                    resolve(Database);
                });
            },(error)=>{
                reject(error);
            });
        })

        let ChargerDetector = await Promise.all([Database]);

        // 取到时间
        const repeatTime=ChargerDetector[0].map((item,i) => {
            return item.my_timestamp
        })

        //时间去重后排序
        const xTime = Array.from(new Set(repeatTime)).sort(function(a, b){
            return a > b ? 1 : -1; // 这里改为大于号
        })

        this.setState({
            ChargerDetector:commonality.uniqeByKeys(...ChargerDetector,['my_timestamp']),
            xTime, 
        })


    }

    componentWillUnmount() {
        chargerVoltageData = [];
        chargerElectricCurrentData=[];
        chargerTimeData=[];
        this.ChargerDetectorClearTime && clearTimeout(this.ChargerDetectorClearTime);
    }

    table(){
        this.props.navigation.navigate('Table',{
            detectorVoltageCurrent:true,
            localData:[this.state.ChargerDetector],
        })
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        const option= {
            title : {
                text: '电压/电流',
                left: '3%', 
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电压(V)','电流(A)'],
                y:'top',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)',],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.xTime.map(function(item){
                    return commonality.replaceTime(item); 
                }),
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电压',//   V /A /℃ /C
                },{
                    type:'value',
                    name : '电流',//   V /A /℃ /C
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 70,
                end: 100,
            },
            series: [
                {
                    name: '电压(V)',
                    type: 'line',
                    smooth:true,
                    data:this.state.ChargerDetector && this.state.ChargerDetector.map(item=>{
                        return item.voltage
                    }),
                    showSymbol: false,
                }, {
                    name: '电流(A)',
                    type: 'line',
                    smooth:true,
                    data:this.state.ChargerDetector && this.state.ChargerDetector.map(item=>{
                        return item.electric_current
                    }),
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        };
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft:'90%',width:25,height:25}}  
                    onPress={()=>this.table()}
                >
                    <Image
                        style={{width:25,height:25}}
                        source={require('../../img/dataTable/dataTable.png')}
                    />
                </TouchableOpacity>
                <Echarts
                    option={option} 
                    width={Dimensions.get('window').width}
                />
            </View>
        );
    }
}

class Temperature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BoardTemperature:[],
            AmbientTemperature:[],
            TimeData:[],

            ChargerDetector:[],
            xTime:[],
        };
    }

    async componentDidMount(){

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        //查询数据库总数据
        let Database = new Promise(function (resolve,reject){
            return db.transaction((tx)=>{
                tx.executeSql("select ChargerDetector_id,my_timestamp,BoardTemperature,AmbientTemperature from ChargerDetector where ChargerDetector_id order by my_timestamp asc", [],(tx,results)=>{
                    var len = results.rows.length;
                    let Database=[];
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        Database.push(u);
                    }
                    resolve(Database);
                });
            },(error)=>{
                reject(error);
            });
        })

        let ChargerDetector = await Promise.all([Database]);

        // 取到时间
        const repeatTime=ChargerDetector[0].map((item,i) => {
            return item.my_timestamp
        })

        //时间去重后排序
        const xTime = Array.from(new Set(repeatTime)).sort(function(a, b){
            return a > b ? 1 : -1; // 这里改为大于号
        })

        this.setState({
            ChargerDetector:commonality.uniqeByKeys(...ChargerDetector,['my_timestamp']),
            xTime, 
        })
    }

    componentWillUnmount() {
        BoardTemperatureData = [];
        AmbientTemperatureData=[];
        TimeData=[];
        this.TemperatureClearTime && clearTimeout(this.TemperatureClearTime);
    }

    table(){
        this.props.navigation.navigate('Table',{
            detectorTemperature:true,
            localData:[this.state.ChargerDetector],
        })
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render(){
        const option= {
            title : {
                text: '温度',
                left: '3%', 
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['电路板温度(°)','环境温度(°)'],
                y:'top',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)',],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.xTime.map(function(item){
                    return commonality.replaceTime(item); 
                }),
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电路板温度',//   V /A /℃ /C
                },{
                    type:'value',
                    name : '环境温度',//   V /A /℃ /C
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 70,
                end: 100,
            },
            series: [
                {
                    name: '电路板温度(°)',
                    type: 'line',
                    smooth:true,
                    data:this.state.ChargerDetector && this.state.ChargerDetector.map(item=>{
                        return item.BoardTemperature
                    }),
                    showSymbol: false,
                }, {
                    name: '环境温度(°)',
                    type: 'line',
                    smooth:true,
                    data:this.state.ChargerDetector && this.state.ChargerDetector.map(item=>{
                        return item.AmbientTemperature
                    }),
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        };
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft:'90%',width:25,height:25}}  
                    onPress={()=>this.table()}
                >
                    <Image
                        style={{width:25,height:25}}
                        source={require('../../img/dataTable/dataTable.png')}
                    />
                </TouchableOpacity>
                <Echarts
                    option={option} 
                    width={Dimensions.get('window').width}
                />
            </View>
        );
    }
}

class CapacityPower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            capacityData:[],
            CapacityPowerData:[],
            TimeData:[],

            ChargerDetector:[],
            xTime:[],
        };
    }

    async componentDidMount(){

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //删除数据
        // sqLite.deleteData();

        /** 充电器检测仪*/
       
        //查询数据库总数据
        let Database = new Promise(function (resolve,reject){
            return db.transaction((tx)=>{
                tx.executeSql("select ChargerDetector_id,my_timestamp,capacity,voltage,electric_current from ChargerDetector where ChargerDetector_id order by my_timestamp asc", [],(tx,results)=>{
                    var len = results.rows.length;
                    let Database=[];
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        Database.push(u);
                    }
                    resolve(Database);
                });
            },(error)=>{
                reject(error);
            });
        })

        let ChargerDetector = await Promise.all([Database]);

        // 取到时间
        const repeatTime=ChargerDetector[0].map((item,i) => {
            return item.my_timestamp
        })

        //时间去重后排序
        const xTime = Array.from(new Set(repeatTime)).sort(function(a, b){
            return a > b ? 1 : -1; // 这里改为大于号
        })

        this.setState({
            ChargerDetector:commonality.uniqeByKeys(...ChargerDetector,['my_timestamp']),
            xTime, 
        })
    }

    componentWillUnmount() {
        capacityData = [];
        CapacityPowerData=[];
        TimeData=[];
        this.TemperatureClearTime && clearTimeout(this.TemperatureClearTime);
    }

    table(){
        this.props.navigation.navigate('Table',{
            CapacityPower:true,
            localData:[this.state.ChargerDetector],
        })
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据图</Text>),
        headerStyle: {
            height: 40,
        },
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render(){
        const option= {
            title : {
                text: '容量/功率',
                left: '3%', 
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            legend: {//可以手动选择现实几个图标
                data:['容量(Ah)','功率(W)'],
                y:'top',
            },
            toolbox: {//各种表格
                orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)',],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                boundaryGap:false,
                type : 'category',
                name : '时间',//时间
                data: this.state.xTime.map(function(item){
                    return commonality.replaceTime(item); 
                }),
            },
            yAxis: [  
                {
                    type:'value',
                    name : '容量',//   V /A /℃ /C
                },{
                    type:'value',
                    name : '功率',//   V /A /℃ /C
                },
            ],
            dataZoom: {
                type: 'slider',
                filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                start: 70,
                end: 100,
            },
            series: [
                {
                    name: '容量(Ah)',
                    type: 'line',
                    smooth:true,
                    data:this.state.ChargerDetector && this.state.ChargerDetector.map(item=>{
                        return item.capacity
                    }),
                    showSymbol: false,
                }, {
                    name: '功率(W)',
                    type: 'line',
                    smooth:true,
                    data:this.state.ChargerDetector && this.state.ChargerDetector.map(item=>{
                        return item.voltage*item.electric_current
                    }),
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],
        }; 
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft:'90%',width:25,height:25}}  
                    onPress={()=>this.table()}
                >
                    <Image
                        style={{width:25,height:25}}
                        source={require('../../img/dataTable/dataTable.png')}
                    />
                </TouchableOpacity>
                <Echarts
                    option={option} 
                    width={Dimensions.get('window').width}
                />
            </View>
        );
    }
}


const ChargerDetector = TabNavigator({
        VoltageCurrent: {
            screen: VoltageCurrent,
            navigationOptions: {
                tabBarLabel: '电压/电流',
            }
        },
        Temperature: {
            screen: Temperature,
            navigationOptions: {
                tabBarLabel: '温度',
            },
        },
        CapacityPower: {
            screen: CapacityPower,
            navigationOptions: {
                tabBarLabel: '容量/功率',
            }
        },
    }, {
        //设置TabNavigator的位置
        tabBarPosition: 'bottom',
        swipeEnabled:false,
        animationEnabled:true,
        // lazy:false,
        backBehavior:'none',
        tabBarOptions: {
            activeTintColor: '#3BB6FF',     // 文字和图片选中颜色
            activeBackgroundColor:'#fff',       //文字和图片选中的背景色
            inactiveTintColor: '#999',      // 文字和图片默认颜色
            inactiveBackgroundColor:'#fff',     //文字和图片默认的背景色
            indicatorStyle: {height: 0},    // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了 暂时解决这个问题
            labelStyle: {
                fontSize: 17,
            },
            tabStyle: {
                height:50,
            },
            scrollEnabled:false,//是否启用可滚动选项卡
            style: {
                backgroundColor: '#F5FCFF',
                paddingBottom:0,
                borderColor:'#fff',
    
            },
        },
    });
    
    ChargerDetector.navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器检测仪数据</Text>),
        headerStyle:{
            height:40,
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
    
export default ChargerDetector;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
    },
    switching:{
        marginTop:15,
        marginBottom:20
    },
});