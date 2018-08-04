import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native'
const {width,height}=Dimensions.get('window');
export default class CWRemainingBattery extends Component {
    static navigationOptions = {
        headerTitle: '目前电量',
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
                        <Image style={{width:width,height:height}} source={require('../../img/background.jpg')}/>
                        <Text style={styles.ElectricityTop}>目前电量</Text>
                        {/*<Image style={{position:'absolute'}} source={require('../../img/Electricity.png')}/>*/}
                        <Text style={styles.ElectricityBootomTextStyle}>70%</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ElectricityStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    ElectricityTop:{
        fontSize:25,
        marginBottom:30,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:150
    },
    ElectricityBootomTextStyle:{
        fontSize:50,
        position:'absolute',
        // color:'#fff',
    }
});