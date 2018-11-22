import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    AsyncStorage,
    Image,
    Modal,
    TextInput,
    FlatList,
} from 'react-native';

const {width,height} = Dimensions.get('window');
let dialogWidth = width-80;
import Dialogue from '../Alert/Dialogue'
import DatePicker from 'react-native-datepicker';//时间选择器
import Echarts from 'native-echarts';
import * as commonality from '../../commonality';
import EasyToast, {DURATION} from 'react-native-easy-toast';//tost
import { Dropdown } from 'react-native-material-dropdown';//下拉选择
import { SMART_BATTERY_STORAGE_KEY } from '../../config';
import * as storage from '../../storage';
import ModalDropdown from 'react-native-modal-dropdown';//下拉选择

var getOpts = {
    method: "GET",
    headers:{
        "api-key":"PtxuM9Hb1lMXk0Unkr570s2gPas="
    },
}
// var postUrl = "https://api.heclouds.com/register_de?register_code=4Fp5buMqDjyJyPKV";

var date = new Date();                  // 获取当前日期
var nowMonth = date.getMonth() + 1;     // 获取当前月份
var strDate = date.getDate();           // 获取当前是几号
var seperator = "-";                    // 添加分隔符“-”
if (nowMonth >= 1 && nowMonth <= 9) {   // 对月份进行处理，1-9月在前面添加一个“0”
    nowMonth = "0" + nowMonth;
}

if (strDate >= 0 && strDate <= 9) {     // 对月份进行处理，1-9号在前面添加一个“0”
    strDate = "0" + strDate;
}
        
var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;// 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期

export default class smart_battery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowDate,
            date:nowDate,
            smartBatteryId:'',
            modalVisible: false,
            locationValue:[],
            DatePickerDisabled:false,
        };
        
    }

    // 按天
    componentDidMount(){
        
        {/**
            var postUrl = "https://api.heclouds.com/register_de?register_code=4Fp5buMqDjyJyPKV";
            var postOpts = {
                method: "POST",
                body:JSON.stringify({
                    sn:'867959033018247',
                }) 
            }
            fetch(postUrl,postOpts)
            .then((response) => {
                return response.json();
            })
            .then( data => {
                console.log(data)
            })
            .catch( err => {
                console.log(err)
            })
        */}

        const { params } = this.props.navigation.state;
        if(params !== undefined){
            var { smart_battery } = params;
            this.setState({
                smartBatteryId:smart_battery
            })
        }
        
        this.storage();//本地存储查询,列到选项框
        if(this.state.smartBatteryId==''){
            storage.get(SMART_BATTERY_STORAGE_KEY, (error, result) => {
                if(result !== null){
                    this.setState({
                        smartBatteryId:result[0].split(",")[0],
                    },()=>{
                        this.demand(this.state.date,this.state.date);
                    })
                }
            })
        }else{
            this.demand(this.state.date,this.state.date);
        }
    }

    // 查询网络数据库
    demand(StartDate,EndDate){
        if(this.state.smartBatteryId.indexOf(',') == -1){
            storage.get(SMART_BATTERY_STORAGE_KEY, (error, result) => {
                if(result !== null){
                    for(var i=0;i<result.length;i++){
                        if(result[i].split(",")[0] == this.state.smartBatteryId){
                            var getUrl = "http://api.heclouds.com/devices/"+result[i].split(",")[1] +"/datapoints?start="+StartDate+"T00:00:00&end="+EndDate+"T23:59:59&limit=6000";
                            this.getFetch(getUrl,getOpts);
                        }
                    }
                }
            })
        }else{
            var getUrl = "http://api.heclouds.com/devices/"+this.state.smartBatteryId.split(",")[1] +"/datapoints?start="+StartDate+"T00:00:00&end="+EndDate+"T23:59:59&limit=6000";
            this.getFetch(getUrl,getOpts);
        }
    }

    // 获取数据
    getFetch(getUrl,getOpts){
        fetch(getUrl, getOpts)
            .then((response) => {
                return response.json();
            }).then( data => {
                if(data.data.datastreams.length===0) this.refs.toast.show('sorry，未查询到数据~',1200)
                let voltageTime = [];
                let voltageValue = [];
                let currentValue = [];
                let currentTime = [];
                let capTime = [];
                let capValue = [];
                let Temp_InValue = [];
                let Temp_InTime = [];
                let Temp_OutTime = [];
                let Temp_OutValue = [];
                let Open_AlarmValue = [];
                let locationValue = [];
                data.data.datastreams.map((item)=>{
                    if(item.id == 'voltage'){
                        item.datapoints.map((item)=>{
                            voltageTime.push(item.at.substr(0,19))
                            voltageValue.push(item.value)
                        })
                    }
                    if(item.id == 'current'){
                        item.datapoints.map((item)=>{
                            currentTime.push(item.at.substr(0,19))
                            currentValue.push(item.value)
                        })
                    }
                    if(item.id == 'cap'){
                        item.datapoints.map((item)=>{
                            capTime.push(item.at.substr(0,19))
                            capValue.push(item.value)
                        })
                    }
                    if(item.id == 'Temp_In'){
                        item.datapoints.map((item)=>{
                            Temp_InTime.push(item.at.substr(0,19))
                            Temp_InValue.push(item.value)
                        })
                    }
                    if(item.id == 'Temp_Out'){
                        item.datapoints.map((item)=>{
                            Temp_OutTime.push(item.at.substr(0,19))
                            Temp_OutValue.push(item.value)
                        })
                    }
                    if(item.id == 'Open_Alarm'){
                        item.datapoints.map((item)=>{
                            Open_AlarmValue.push(item.value.split(",")[0]);
                        })
                    }
                    if(item.id == 'GPS_Station'){
                        locationValue.push(item)
                    }
                    if(item.id == 'Base_Station'){
                        locationValue.push(item)
                    }
                })
                this.setState({
                    voltageTime,//电压时间
                    voltageValue,//电压
                    currentTime,//电流时间
                    currentValue,//电流
                    capTime,//容(电)量时间
                    capValue,//容(电)量
                    Temp_OutTime,//外部温度时间
                    Temp_OutValue,//外部温度
                    Temp_InTime,//内部温度时间
                    Temp_InValue,//内部温度
                    Open_AlarmValue,//开盒情况
                    locationValue,//GPS与基站 经纬度
                })
            })
            .catch((error) => {
                this.refs.toast.show('sorry，查询出错了~',1200);
            })
    }

    // 今天
    today(){
        this.setState({
            date:nowDate,
            DatePickerDisabled:false,

            voltageTime:[],//电压时间
            voltageValue:[ ],//电压
            currentTime:[],//电流时间
            currentValue:[ ],//电流
            capTime:[],//容(电)量时间
            capValue:[ ],//容(电)量
            Temp_OutTime:[],//外部温度时间
            Temp_OutValue:[ ],//外部温度
            Temp_InTime:[],//内部温度时间
            Temp_InValue:[ ],//内部温度
            Open_AlarmValue:[],//开盒情况
            locationValue:[],//GPS与基站 经纬度
        },()=>{
            this.demand(this.state.date,this.state.date);
        })
    }

    // 按周
    week(){
        this.setState({
            DatePickerDisabled:true,
            date:'本周',

            voltageTime:[],//电压时间
            voltageValue:[ ],//电压
            currentTime:[],//电流时间
            currentValue:[ ],//电流
            capTime:[],//容(电)量时间
            capValue:[ ],//容(电)量
            Temp_OutTime:[],//外部温度时间
            Temp_OutValue:[ ],//外部温度
            Temp_InTime:[],//内部温度时间
            Temp_InValue:[ ],//内部温度
            Open_AlarmValue:[],//开盒情况
            locationValue:[],//GPS与基站 经纬度
        },()=>{
            this.demand(commonality.getWeekStartDate(),commonality.getWeekEndDate());
        })
    }

    // 按月
    month(){
        this.setState({
            DatePickerDisabled:true,
            date:commonality.nowMonth(),

            voltageTime:[],//电压时间
            voltageValue:[ ],//电压
            currentTime:[],//电流时间
            currentValue:[ ],//电流
            capTime:[],//容(电)量时间
            capValue:[ ],//容(电)量
            Temp_OutTime:[],//外部温度时间
            Temp_OutValue:[ ],//外部温度
            Temp_InTime:[],//内部温度时间
            Temp_InValue:[ ],//内部温度
            Open_AlarmValue:[],//开盒情况
            locationValue:[],//GPS与基站 经纬度
        },()=>{
            this.demand(commonality.getMonthStartDate(),commonality.getMonthEndDate());
        })
    }

    // 本地存储查询
    storage(){
        storage.get(SMART_BATTERY_STORAGE_KEY, (error, result) => {
            let data = [];
            let choicebox = [];
            if(result !== null){
                result.forEach((item) => {
                    data.push( 
                        {value:item}
                    );
                    choicebox.push(
                        {value:item.split(",")[0]}
                    );
                });
            }
            this.setState({
                data,
                choicebox,
            })
        })
    }

    // input输入改变时调用
    onChangeText(value){
        this.setState({
            smartBatteryId:value
        })
    }

    // input输入确认事件
    confirmBtn(){
        var getUrl = "https://api.heclouds.com/devices";
        storage.get(SMART_BATTERY_STORAGE_KEY, (error, result) => {//数据采集
            var results = result
            if(results !== null){
                results = results.map( item => {
                    return item.split(",")[0]
                })
            }
            const set = new Set(results);
            if(set.has(this.state.smartBatteryId)!==true){
                fetch(getUrl, getOpts)
                    .then((response) => {
                        return response.json();
                    }).then((data)=>{
                        data.data.devices.map(item => {
                            if(this.state.smartBatteryId == item.title){
                                result= (result || []).concat(this.state.smartBatteryId+','+item.id);
                                storage.save(SMART_BATTERY_STORAGE_KEY, result, () => {
                                    this.setState({
                                        modalVisible:!this.state.modalVisible,
                                    },()=>{
                                        this.today();
                                        this.refs.toast.show('数据查询中~',1200);
                                    })
                                });
                            }else{
                                this.refs.toast.show('请检查您的设备ID是否正确~',1200);
                            }
                        })
                    })
            }else {
                this.setState({
                    modalVisible:!this.state.modalVisible
                },()=>{
                    this.today();
                })
                this.refs.toast.show('主人，我已存在~',1200);
            }
        });
    }

    // 打开modal
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    // 关闭modal
    onClose() {
        this.setState({modalVisible: false});
    }

    // 确认删除记录
    removeOk(){
        AsyncStorage.removeItem(SMART_BATTERY_STORAGE_KEY,(error)=>{
            if (error == null) {
                this.refs.toast.show('删除成功~',1200);
                this.setState({
                    smartBatteryId:'',
                    locationValue:[],
                    // date:'',

                    voltageTime:[],//电压时间
                    voltageValue:[],//电压
                    currentTime:[],//电流时间
                    currentValue:[],//电流
                    capTime:[],//容(电)量时间
                    capValue:[],//容(电)量
                    Temp_OutTime:[],//外部温度时间
                    Temp_OutValue:[],//外部温度
                    Temp_InTime:[],//内部温度时间
                    Temp_InValue:[],//内部温度
                    Open_AlarmValue:[],//开盒情况
                    locationValue:[],//GPS与基站 经纬度
                })
            };
        })
    }

    componentWillUnmount() {
        
    }

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>数据采集</Text>), 
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
    
    render() {
        // 容(电)量
        const capOption= {
            title: {
                text: '电量 '+this.state.date,
                x:'center',
                y:'bottom'
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            toolbox: {//各种表格
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)','rgb(255, 0, 203)','rgb(0,0,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                axisLine: {onZero: false},
                boundaryGap:false, //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                type : 'category',
                name : '时间',
                nameTextStyle:{
                    fontSize:9
                },
                data: this.state.capTime && this.state.capTime.map(function(item){
                    return item //.replace(' ', '\n') //return commonality.replaceTime(item);  
                }),
                axisLabel:{ 
                    textStyle:{ 
                        fontSize: 9,
                    },
                    formatter: function (value, idx) {
                        var date = new Date(value);
                        return [date.getDate()].join(' ')+'日' + new RegExp(/.*?((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)/,["i"]).exec(value)[1]
                    }
                }
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电量(%)',
                }
            ],
            series: [
                {
                    name: '电量(%)', 
                    type: 'line',
                    smooth:true,
                    data: this.state.capValue,
                    showSymbol: false,
                    connectNulls:true,
                }
            ],    
        };
        // 外部温度、内部温度
        const temperatureOption={
            title: {
                text: '温度 '+this.state.date,
                x:'center',
                y:'bottom'
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            toolbox: {//各种表格
                // orient: 'vertical',//改变icon的布局朝向
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)','rgb(255, 0, 203)','rgb(0,0,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                boundaryGap:false, //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                type : 'category',
                name : '时间',//时间
                nameTextStyle:{
                    fontSize:9
                },
                data: this.state.Temp_OutTime && this.state.Temp_OutTime.map(function(item){
                    return item //commonality.replaceTime(item);  
                }),        
                axisLabel:{
                    textStyle:{ 
                        fontSize: 9,
                    },
                    formatter: function (value, idx) {
                        var date = new Date(value);
                        return [date.getDate()].join(' ')+'日' + new RegExp(/.*?((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)/,["i"]).exec(value)[1]
                    }
                }
            },
            yAxis: [  
                {
                    type:'value',
                    name : '外部(°)',
                },{
                    type:'value',
                    name : '内部(°)',
                },
            ],
            series: [
                {
                    name: '外部温度(°)', 
                    type: 'line',
                    smooth:true,
                    data: this.state.Temp_OutValue,
                    showSymbol: false,
                    connectNulls:true,
                }, {
                    name: '内部温度(°)',
                    type: 'line',
                    smooth:true,
                    data:this.state.Temp_InValue,
                    showSymbol: false,
                    yAxisIndex:1,
                }
            ],    
        };
        // 电压、电流
        const option= {
            title: {
                text: '电压/流 '+this.state.date,
                x:'center',
                y:'bottom'
            },
            tooltip : { //点击某一个点的数据的时候，显示出悬浮窗
                trigger: 'none',//item,axis,none
            },
            toolbox: {//各种表格
                show : true,
                showTitle:true,
                feature : {
                    dataView : {
                        show: false, 
                        readOnly: true,
                    },//show是否显示表格，readOnly是否只读
                }
            },
            color:['rgb(67,205,126)','rgb(249,159,94)','rgb(255,106,106)','rgb(105,89,205)','rgb(255, 0, 203)','rgb(0,0,205)'],//图形的颜色组
            xAxis: {
                splitLine: {
                    show: false,
                },
                boundaryGap:false, //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                type : 'category',
                name : '时间',//时间
                nameTextStyle:{
                    fontSize:9
                },
                data: this.state.voltageTime && this.state.voltageTime.map(function(item){
                    return item //commonality.replaceTime(item);  
                }),        
                axisLabel:{ 
                    textStyle:{ 
                        fontSize: 9,
                    },
                    formatter: function (value, idx) {
                        var date = new Date(value);
                        return [date.getDate()].join(' ')+'日' + new RegExp(/.*?((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)/,["i"]).exec(value)[1]
                    }
                }
            },
            yAxis: [  
                {
                    type:'value',
                    name : '电压(V)',
                },{
                    type:'value',
                    name : '电流(A)',
                },
            ],
            series: [
                {
                    name: '电压(V)', 
                    type: 'line',
                    smooth:true,
                    data: this.state.voltageValue,
                    showSymbol: false,
                    connectNulls:true,
                }, {
                    name: '电流(A)',
                    type: 'line',
                    smooth:true,
                    data:this.state.currentValue,
                    showSymbol: false,
                    yAxisIndex:1,
                    clipOverflow:false,
                }
            ],    
        };
        
        return (
            <ScrollView style={styles.container} >
                <Dialogue ref='dialogue' msg='确认要删除全部设备号么？' leftFunc={()=>{ }} rightFunc={()=>{this.removeOk()}}/>

                {/* 信息选择栏 */}
                <View style={styles.caption}>
                    {/* 信息选择栏top */}
                    <View style={[styles.captionBtn,{borderBottomColor:'#eee',borderBottomWidth:1,paddingBottom:8,}]}>
                        {/* 序列号选择 */}
                        <View style={styles.dropdown}>
                            {/* 选择框 */}
                            <Dropdown
                                // label='Favorite Fruit'
                                data={this.state.choicebox}
                                value={this.state.smartBatteryId?this.state.smartBatteryId:"无设备"}
                                containerStyle={{//视图容器样式
                                    width:140,
                                    borderBottomColor: '#fff',
                                }}
                                fontSize={14}
                                labelFontSize={10}
                                pickerStyle={{//选择器
                                    width:145,
                                    borderRadius:5,
                                    marginTop:50,
                                    marginLeft:10,
                                    paddingLeft:4,
                                }}
                                overlayStyle={{//叠加视图样式
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                }}
                                onChangeText={(value)=>{//选择回调
                                    this.setState({
                                        smartBatteryId:value,

                                        voltageTime:[],//电压时间
                                        voltageValue:[],//电压
                                        currentTime:[],//电流时间
                                        currentValue:[],//电流
                                        capTime:[],//容(电)量时间
                                        capValue:[],//容(电)量
                                        Temp_OutTime:[],//外部温度时间
                                        Temp_OutValue:[],//外部温度
                                        Temp_InTime:[],//内部温度时间
                                        Temp_InValue:[],//内部温度
                                        Open_AlarmValue:[],//开盒情况
                                        locationValue:[],//GPS与基站 经纬度
                                    },()=>{
                                        this.state.ModalDropdownOnSelectValue == '今日' ? this.today() : this.state.ModalDropdownOnSelectValue == '本周' ? this.week() : this.month();
                                    })
                                }}
                                rippleCentered={true}
                            />
                        </View>
                        {/* 日周月选择框 */}
                        <View style={{flexDirection:'row',borderStyle:'solid',borderColor:'#BEBEBE',borderWidth:1,borderRadius:4,paddingRight:3}}>
                            <ModalDropdown 
                                defaultValue='今日'
                                options={['今日', '本周', '本月']}
                                style={{width:50,height:25,}} //按钮的样式
                                textStyle={{//按钮文本的样式
                                    paddingLeft:9,
                                    paddingTop:3,
                                    fontSize:16,
                                }}
                                defaultIndex={0}
                                dropdownStyle={{//下拉列表的样式。
                                    width:60,
                                    height:119,
                                    marginRight:-10,
                                    marginTop:-60, 
                                }}
                                dropdownTextStyle={{//下拉选项文本的样式。
                                    paddingLeft: 12,
                                    fontSize:16,
                                }}
                                dropdownTextHighlightStyle={{//下拉列表的样式选择了选项文本。
                                    color:'#000', 
                                }}
                                onSelect={(index,value) => {
                                    this.setState({
                                        ModalDropdownOnSelectValue:value,
                                        ModalDropdownOnSelectindex:index,
                                    })
                                    if ( value === '今日' ) {
                                        this.today();
                                        
                                    } else if ( value === '本周'){
                                        // this.refs.toast.show('当前不可用~',1200)
                                        this.week();
                                        
                                    } else if ( value === '本月'){
                                        // this.refs.toast.show('当前不可用~',1200)
                                        this.month();
                                    }
                                }}
                            />
                                
                            <View style={{
                                marginTop:8,
                                width:0,
                                height:0,
                                borderStyle:'solid',
                                borderWidth:5,
                                borderTopColor:'#9E9E9E',//下箭头颜色
                                borderLeftColor:'#fff',//右箭头颜色
                                borderBottomColor:'#fff',//上箭头颜色
                                borderRightColor:'#fff'//左箭头颜色
                            }}/>
                        </View> 
                    </View>
                     {/* 信息选择栏bottom */}
                    <View style={[styles.captionBtn,{marginTop:10,marginBottom:5,}]}>
                        {/* 开关 */}
                        <View>
                            <View style={[styles.circle,{backgroundColor:'#35E2F2'}]}>
                                <Image style={styles.switchImgOn} source={ this.state.Open_AlarmValue && this.state.Open_AlarmValue[this.state.Open_AlarmValue.length-1]==1?require('../../img/switch/switchOn.png'):require('../../img/switch/switchOff.png')}/>
                            </View>
                            <Text style={styles.circleText}>开盒状态</Text>
                        </View>
                        
                        <View onPress={()=>{ this.setModalVisible(true)} }>
                            <View style={[styles.circle,{backgroundColor:this.state.DatePickerDisabled?'#AAAAAA':'#259DF5',paddingLeft:9,}]}>
                                {/* 日期选择器 */}
                                <DatePicker
                                    style={styles.datePicker}
                                    date={this.state.date}
                                    mode="date"
                                    placeholder="选择日期"
                                    format="YYYY-MM-DD"
                                    minDate="2016-05-01"//可选择的最小时间
                                    maxDate={this.state.nowDate}//可选择的最大时间
                                    androidMode="spinner"
                                    showIcon={true}//图标
                                    hideText={true}//日期框隐藏
                                    disabled={this.state.DatePickerDisabled}//禁用选择器
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        }
                                    }}
                                    onDateChange={(date) => {
                                            this.setState({
                                                date
                                            },()=>{
                                                this.componentDidMount();
                                            })
                                        }
                                    }
                                />
                            </View>
                            <Text style={[styles.circleText,{color:this.state.DatePickerDisabled?'#AAAAAA':'#000'}]}>日期选择</Text>
                        </View>

                        {/* 搜索 */}
                        <TouchableOpacity onPress={()=>{ this.setModalVisible(true)} }>
                            <View style={[styles.circle,{backgroundColor:'#4EBE98'}]}>
                                <Image source={require('../../img/search/search.png')} style={{width:18,height:18}}/>
                            </View>
                            <Text style={styles.circleText}>手动输入</Text>
                        </TouchableOpacity>

                        {/* 删除存储 */}
                        <TouchableOpacity  onPress={()=>{this.refs.dialogue.open()}}>
                            <View style={[styles.circle,{backgroundColor:'#F8981F'}]}>
                                <Image style={styles.delete} source={require('../../img/delete/delete.png')}/>
                            </View>
                            <Text style={styles.circleText}>删除设备</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <TouchableOpacity style={styles.selected} onPress={()=>{this.componentDidMount()}}>
                        <Text style={styles.selectedText}>日</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={styles.selected}  onPress={()=>{this.week()}}>
                        <Text style={styles.selectedText}>周</Text>
                    </TouchableOpacity>*/}
                    {/*<TouchableOpacity style={styles.selected}  onPress={()=>{this.month()}}>
                        <Text style={styles.selectedText}>月</Text>
                    </TouchableOpacity> */}
                </View>
                
                {/* 地图 */}
                <View style={styles.EchartsView} >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{height:25,width:width-40,justifyContent:'center',flex:1,alignItems:'center'}} 
                        onPress={()=>{
                            this.state.locationValue.length?
                            this.props.navigation.navigate('smart_battery_map',{locationValue:this.state.locationValue})
                            :this.refs.toast.show('当前无数据可以查看~',1200);
                        }}
                        >
                        <Text style={{fontSize:18}}>位置</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{alignItems:'center',flex:5}} 
                        onPress={()=>{
                            this.state.locationValue.length?
                            this.props.navigation.navigate('smart_battery_map',{locationValue:this.state.locationValue})
                            :this.refs.toast.show('当前无数据可以查看~',1200);
                        }}
                        >
                        <Image source={require('../../img/mapImg/mapImg.jpg')} style={{width:width-50,height:width-60}}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={{height:25,width:width-40,justifyContent:'center',flex:1,alignItems:'center'}} 
                        onPress={()=>{
                            this.state.locationValue.length?
                            this.props.navigation.navigate('smart_battery_map',{locationValue:this.state.locationValue})
                            :this.refs.toast.show('当前无数据可以查看~',1200);
                     }}
                        >
                        <Text style={{fontSize:18}}>查看详细位置</Text>
                    </TouchableOpacity>
                </View>
                
                {/* 容(电)量 */}
                <View style={styles.EchartsView}>
                    <Echarts
                        option={capOption}
                        width={width-40}
                        height={230}
                    />
                </View>

                {/* 内部温度、外部温度 */}
                <View style={styles.EchartsView}>
                    <Echarts
                        option={temperatureOption}
                        width={width-40}
                        height={230}
                    />
                </View>

                {/* 电压、电流 */}
                <View style={styles.EchartsView}>
                    <Echarts
                        option={option}
                        width={width-40}
                        height={230}
                    />
                </View>

                {/* input弹窗 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setModalVisible(false)}}
                >
                    <View style={styles.containerView}>
                        <View style={styles.innerContainer}>
                            <TextInput
                                style={styles.inputtext}
                                placeholder="请输入设备id!"
                                onChangeText = {(value)=>{
                                    this.onChangeText(value)
                                }}
                                onFocus={()=>{
                                    this.setState({
                                        smartBatteryId:''
                                    })
                                }}//当文本框获得焦点的时候调用此回调函数。
                                keyboardType="numeric"
                                selectTextOnFocus={true}
                                enablesReturnKeyAutomatically = {true}
                                returnKeyType = 'go'
                                clearButtonMode = 'unless-editing'
                            />
                            <View style={styles.Modalbtn}>
                                <TouchableOpacity  style={[styles.btnContainer,styles.modalBtnBorder]} onPress={() => { this.onClose() }}>
                                    <Text  style={styles.hidemodalTxt}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity  style={styles.btnContainer} onPress={() => { this.confirmBtn() }}>
                                <Text  style={styles.hidemodalTxt}>确定</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* toast弹窗 */}
                <EasyToast
                    ref="toast"
                    style={{
                        backgroundColor:'rgba(0,0,0,0.5)',
                        padding:12
                    }}
                    position='top'  
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 15,
    },
    delete:{
        width:17, 
        height:19
    },
    EchartsView:{
        width:width-40,
        height:250, 
        marginLeft:20,
        marginBottom:10,
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    circle:{
        width:45,
        height:45,
        backgroundColor:'#13C8A2',
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        display:'flex',
    },
    circleText:{
        fontSize:11,
        fontWeight:'bold',
        color:'#000',
        marginTop:4,
    },
    dropdown:{
        width: 96,
        height:40, 
        position:'relative',
        top:-23,
    },
    switchImgOn:{
        width:40,
        height:15,
    },
    datePicker:{
        width: 40,
    },
    container: {
        flex: 1,
    },
    captionBtn:{
        justifyContent: 'space-around',
        flexDirection:'row',
        alignItems: 'center',
    },
    caption:{
        marginTop:10,
        marginBottom:10,
        width:width-40,
        borderRadius:10,
        marginLeft:20,
        paddingBottom:10,
        paddingTop:10,
        backgroundColor:'#fff'
    },
    selected:{
        width:40,
        height:25,
        paddingTop: 3,
        backgroundColor: '#3BB6FF',
        borderRadius: 4,
        alignItems: 'center',
        marginRight:7,
    },
    selectedText:{
        fontSize:15,
        color:'#fff',
    },
    unselected:{
        width:100,
        height:40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#F8F8FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },//////////
    containerView: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingLeft:20,
        paddingRight:20,
    },
    btnContainer:{
        width:dialogWidth/2,
        
        alignItems:'center',
        justifyContent:'center',
    },
    modalBtnBorder:{
        borderRightWidth:1,
        borderRightColor:'#eee',
    },
    Modalbtn:{
        flexDirection:'row',
        height:50,
        borderTopWidth:1,
        borderTopColor:'#F1F1F1',
    },
    inputtext:{
        width:dialogWidth-20,
        margin:10,
    },
    hidemodalTxt: {
        fontSize:18,
    },
});