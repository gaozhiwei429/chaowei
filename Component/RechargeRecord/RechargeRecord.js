import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

export default class RechargeRecord extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        }
    }

    componentWillMount() {

    };

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电记录</Text>),
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
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
    };

    render() {
        return (
            <View style={styles.Binding}>
                <View style={styles.Record}>
                    <View style={styles.RecordLeft}>
                        <Text style={styles.RecordLeftText}>充电站：</Text>
                        <Text style={styles.RecordLeftText}>插座编号：</Text>
                        <Text style={styles.RecordLeftText}>开始时间：</Text>
                        <Text style={styles.RecordLeftText}>充电时长：</Text>
                        <Text style={styles.RecordLeftText}>计费：</Text>
                    </View>
                    <View style={styles.RecordRight}>
                        <Text style={styles.RecordRightText}>好又快充电站</Text>
                        <Text style={styles.RecordRightText}>232432</Text>
                        <Text style={styles.RecordRightText}>2014-5-13 15:12</Text>
                        <Text style={styles.RecordRightText}>3小时10分钟</Text>
                        <Text style={styles.RecordRightText}>6.2元</Text>
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    RecordLeftText:{
        fontSize:20,
        color:'#929292'
    },
    RecordRightText:{
        fontSize:20,
        color:'#3a3a3a',
    },
    RecordRight:{
        paddingTop:30,
        paddingBottom:30,
    },
    RecordLeft:{
        marginLeft:30,
        paddingTop:30,
        paddingBottom:30,
    },
    Record:{
        flexDirection:'row',
        backgroundColor:'#fff',
        margin:10,
        borderRadius:5,
    },
    Binding: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});