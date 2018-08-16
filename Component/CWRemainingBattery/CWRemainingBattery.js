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
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>目前电量</Text>),
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
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
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