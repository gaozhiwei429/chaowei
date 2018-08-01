import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Button,
    View,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import SQLiteText from '../SQLite/sqlite';
var sqLite = new SQLiteText();
var db;

import Echarts from 'native-echarts';
const {width} = Dimensions.get('window');
var electricCurrentData;
export default class CWSvgText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battery1:[2, 4, 7, 2, 2, 7, 13, 16,20,12,32,12,31,14,32,12,12,31],
            battery2: [6, 9,20,12,34,21,32,12, 9, 2,12,13,21,42,21,32,21,42],
            text: 'text',
        }
    }

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }
    async componentDidMount(){

        //开启数据库
        if(!db){
            db = await sqLite.open();
        }
        //建表
        // sqLite.createTable();
        //删除数据
        // sqLite.deleteData();

        //查询
        db.transaction((tx)=>{
            tx.executeSql("select id,my_timestamp,voltage,capacity from battery order by id desc limit 25", [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var u = results.rows.item(i);
                    electricCurrentData.push(parseInt(u.capacity));
                    this.setState({
                        battery1:electricCurrentData,
                    })
                }
            });
        },(error)=>{
            console.log(error);
        });

        const loop = () => {
            //查询
            db.transaction((tx)=>{
                tx.executeSql("select id,my_timestamp,voltage,capacity from battery order by id desc limit 1", [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var u = results.rows.item(i);
                        electricCurrentData.push(parseInt(u.capacity));
                        if(electricCurrentData.length>25){
                            electricCurrentData.shift();
                            this.setState({
                                battery1:electricCurrentData,
                            });
                        }else {
                            this.setState({
                                battery1:electricCurrentData,
                            });
                        }
                    }
                    setTimeout(loop, 1000);
                });
            },(error)=>{
                console.log(error);
            });
        };
        setTimeout(loop, 1000);
    }

    render() {
        const option = {
            //点击某一个点的数据的时候，显示出悬浮窗
            tooltip : {
                trigger: 'axis'
            },
            title: {
                text: '电流',
            },
            //可以手动选择现实几个图标
            legend: {
                data:['电池1','电池2']
            },
            //各种表格
            toolbox: {
                //改变icon的布局朝向
                // orient: 'vertical',
                show : true,
                showTitle:true,
                feature : {
                    //show是否显示表格，readOnly是否只读
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        //折线图  柱形图    总数统计 分开平铺
                        //type: ['line'],//'line', 'bar','stack' ,'tiled'
                    },

                }
            },
            xAxis : [
                {
                    //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                    boundaryGap:false,
                    type : 'category',
                    name : '',//时间
                    data : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '电流(A)'
                }
            ],
            //图形的颜色组
            color:['rgb(249,159,94)','rgb(67,205,126)'],
            //需要显示的图形名称，类型，以及数据设置
            series : [
                {
                    name:'电池1',
                    //默认显
                    type:'line',
                    data:this.state.battery1,
                    showSymbol: false,
                },
                {
                    name:'电池2',
                    type:'line',
                    data:this.state.battery2,
                    showSymbol: false,
                }
            ]
        };
        return (
            <View style={styles.container}>
                <Echarts option={option} height={300} width={width}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    titleView:{
        height:44,
        paddingTop:0,
        backgroundColor:'#ff6400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        color:'white',
        fontSize:20,
        textAlign:'center',
    },

});