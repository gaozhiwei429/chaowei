import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    WebView
} from 'react-native';
import { Table, TableWrapper,Col, Cols, Cell } from 'react-native-table-component';

export default class PeakValley extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            tableData: [
                ['时段', '08:00-22:00(高峰)', '22:00-次日8:00(低谷)',],
                ['充电单价(元/度)', '0.5680', '0.2880',],
                // ['服务费(元/度)', '1', 'c',],
                ['实际费用(元/度)','0.5680', '0.2880',],
            ]
        }
    }

    componentWillMount() {

    };

    static navigationOptions = {
        headerTitle: (<Text style={{fontSize: 20, flex: 1, textAlign: 'center'}}>峰谷电价</Text>),
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
        // headerLeft:(
        //     <View />
        // ),
        headerRight: (
            <View style={{height: 44, width: 55, justifyContent: 'center', paddingRight: 15}}/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                <Text style={{fontSize:19,color:'#0DA4E4'}}>Q:峰谷平电价是什么意思？</Text>
                <Text style={{fontSize:17,marginTop:10}}>峰谷分时电价是指根据电网的负荷变化情况，将每天24小时划分为高峰、平段、低谷等多个时段，对各时段分别制定不同的电价水平，以鼓励用电客户合理安排用电时间，削峰填谷，提高电力资源的利用效率。</Text>
                <Text style={{fontSize:17,marginTop:10}}>高峰用电，一般指用电单位较集中，供电紧张时的用电，如在白天，收费标准较高；低谷用电，一般指用电单位较少、供电较充足时的用电，如在夜间，收费标准较低。</Text>
                <Text style={{fontSize:17,marginTop:10}}>以下为部分省市的示例:</Text>
                <View style={{paddingTop:10,paddingBottom:10}}>
                    <Table style={{flexDirection: 'row'}}>
                        {/* Left Wrapper */}
                        <TableWrapper style={{width: 40}}>
                            <Cell data="省市" style={styles.singleHead}/>
                            <TableWrapper style={{flexDirection: 'row'}}>
                                <Col data={['杭州']} style={styles.head} heightArr={[80]} textStyle={styles.text} />
                            </TableWrapper>
                        </TableWrapper>
                        {/* Right Wrapper */}
                        <TableWrapper style={{flex:1}}>
                            <Cols data={state.tableData} heightArr={[40, 40, 40,]} textStyle={styles.text}/>
                        </TableWrapper>
                    </Table>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#fff',
        paddingLeft:20,
        paddingRight:15,
        paddingTop:10
    },
    singleHead: {
        width: 40,
        height: 40,
        backgroundColor: '#c8e1ff'
    },
    head: {
        flex: 1,
        backgroundColor: '#c8e1ff'
    },
    title: {
        flex: 2,
        backgroundColor: '#f6f8fa'
    },
    titleText: {
        marginRight: 6,
        textAlign:'right'
    },
    text: {
        textAlign: 'center'
    },
    btn: {
        width: 58,
        height: 18,
        marginLeft: 15,
        backgroundColor: '#c8e1ff',
        borderRadius: 2
    },
    btnText: {
        textAlign: 'center'
    }
});