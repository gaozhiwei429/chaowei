import React, { Component } from 'react';
import {
    StyleSheet,
    AppRegistry,
    ListView,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import SQLiteText from '../SQLite/sqlite';
var sqLite = new SQLiteText();
var db;

// const data = [
//     {
//         title:'啤酒',
//     },
//     {
//         title:'面包',
//     },
//     {
//         title:'蛋糕',
//     },
//     {
//         title:'糖果',
//     },
//     {
//         title:'辣椒',
//     },
//     {
//         title:'薯条',
//     },
//     {
//         title:'饮料',
//     },
//     {
//         title:'鸡蛋',
//     },
//     {
//         title:'火腿',
//     },
//     {
//         title:'热狗',
//     },
//     {
//         title:'冰激凌',
//     },
//     {
//         title:'冰棍',
//     },
//     {
//         title:'柠檬',
//     },
//     {
//         title:'蘑菇',
//     },
//     {
//         title:'橘子',
//     },
//     {
//         title:'披萨',
//     },
//     {
//         title:'萝卜',
//     },
//     {
//         title:'西瓜',
//     },{
//         title:'啤酒',
//     },
//     {
//         title:'面包',
//     },
//     {
//         title:'蛋糕',
//     },
//     {
//         title:'糖果',
//     },
//     {
//         title:'辣椒',
//     },
//     {
//         title:'薯条',
//     },
//     {
//         title:'饮料',
//     },
//     {
//         title:'鸡蛋',
//     },
//     {
//         title:'火腿',
//     },
//     {
//         title:'热狗',
//     },
//     {
//         title:'冰激凌',
//     },
//     {
//         title:'冰棍',
//     },
//     {
//         title:'柠檬',
//     },
//     {
//         title:'蘑菇',
//     },
//     {
//         title:'橘子',
//     },
//     {
//         title:'披萨',
//     },
//     {
//         title:'萝卜',
//     },
//     {
//         title:'西瓜',
//     },{
//         title:'啤酒',
//     },
//     {
//         title:'面包',
//     },
//     {
//         title:'蛋糕',
//     },
//     {
//         title:'糖果',
//     },
//     {
//         title:'辣椒',
//     },
//     {
//         title:'薯条',
//     },
//     {
//         title:'饮料',
//     },
//     {
//         title:'鸡蛋',
//     },
//     {
//         title:'火腿',
//     },
//     {
//         title:'热狗',
//     },
//     {
//         title:'冰激凌',
//     },
//     {
//         title:'冰棍',
//     },
//     {
//         title:'柠檬',
//     },
//     {
//         title:'蘑菇',
//     },
//     {
//         title:'橘子',
//     },
//     {
//         title:'披萨',
//     },
//     {
//         title:'萝卜',
//     },
//     {
//         title:'西瓜',
//     },{
//         title:'啤酒',
//     },
//     {
//         title:'面包',
//     },
//     {
//         title:'蛋糕',
//     },
//     {
//         title:'糖果',
//     },
//     {
//         title:'辣椒',
//     },
//     {
//         title:'薯条',
//     },
//     {
//         title:'饮料',
//     },
//     {
//         title:'鸡蛋',
//     },
//     {
//         title:'火腿',
//     },
// ];

export default class SQLiteDemo extends Component{
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2  });
        this.state = {
            dataSource: ds.cloneWithRows(this.componentDidMount()),
            showFoot:0,
        };
    }

    //制作假数据
    // getRows(){
    //     var Arr = [];
    //     for(var i = 0; i<100000; i++){
    //         Arr.push(
    //             {
    //                 id: i,
    //                 price:555
    //             }
    //         )
    //     }
    //     return Arr;
    // }

    compennetDidUnmount(){
        //关闭数据库
        sqLite.close();
    }

    async componentDidMount(){
        var temp = [];
        var self = this;
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
            tx.executeSql("select * from battery order by id  limit 0,20", [],(tx,results)=>{//order by id  limit 0,50
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    temp.push(results.rows.item(i));
                    this.setState({
                        dataSource: self.state.dataSource.cloneWithRows(temp),
                    });
                }
            })
        },(error)=>{
            console.log(error);
        });
        return temp;
    }


    render(){
        return (
            <View style={{marginBottom:38}}>
                <View style={styles.cellContainer}>
                    <Text >id</Text>
                    <Text >电池id</Text>
                    <Text >时间</Text>
                    <Text >电压</Text>
                    <Text >电流</Text>
                    <Text >温度</Text>
                    <Text >容量</Text>
                    <Text >均衡时间</Text>
                    <Text >定位(经度)</Text>
                    <Text>定位(纬度)</Text>
                </View>
                <Text>{console.log(this.state.dataSource)}</Text>
                {/*<ListView*/}
                    {/*dataSource={this.state.dataSource}*/}
                    {/*renderRow={this._renderRow()}*/}
                {/*/>*/}
            </View>
        );
    }
    _renderRow = (rowData) => {
        return (
            <TouchableOpacity style={styles.cellContainer} onPress={() => {}}>
                {/*<Text style={styles.title}>{rowData}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.battery_id}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.my_timestamp}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.voltage}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.capacity}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.electric_current}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.temperature}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.equilibrium_time}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.P_longitude}</Text>*/}
                    <View style={{height:10,width:1,backgroundColor:'#dcdcdc'}}/>
                {/*<Text style={styles.title}>{rowData.P_latitude}</Text>*/}
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cellContainer: {
        borderBottomWidth: 1,
        borderColor: '#dcdcdc',
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        justifyContent:'space-between',
        height:38
    },
    title: {
        // marginLeft: 25,
    }
});
