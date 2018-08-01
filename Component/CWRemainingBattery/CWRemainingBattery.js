import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'

export default class CWRemainingBattery extends Component {
    static navigationOptions = {
        headerTitle: '充电总量',
        headerStyle: {
            height:40,
            // backgroundColor: 'red',
            // elevation: null
        },
    };
    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <View style={styles.ElectricityStyle}>
                        <Text style={styles.ElectricityTop}>目前电量</Text>
                        <Image source={require('../../img/Electricity.png')}/>
                        <Text style={styles.ElectricityBootomTextStyle} >70%</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ElectricityStyle:{
        flex:5,
        justifyContent:'center',
        alignItems:'center',
    },
    ElectricityTop:{
        fontSize:20,
        marginBottom:30,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:150
    },
    ElectricityBootomTextStyle:{
        fontSize:50,
        position:'absolute',
        color:'#fff'
    }
});