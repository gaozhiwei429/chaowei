import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';

const {width,height} =Dimensions.get('window');
export default class Charging extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            charging: false,
        }
    }

    componentWillMount() {

    };


    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电</Text>),
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
    };

    chargingIs(){
        this.setState({
            charging:!this.state.charging
        })
    }

    render() {
        return (
            <View style={styles.Binding}>
                <View style={{width:width,height:width,justifyContent:'center',alignItems:'center',backgroundColor:'#37B111'}}>
                    {this.state.charging?<Text style={{fontSize:17,color:'#fff'}}>充电中...</Text>:<Text style={{fontSize:17,color:'#fff',}}>启动充电</Text>}
                    <View style={{width:width,justifyContent:'center',alignItems:'center',}}>
                        <Image source={require('../../img/charging.png')} style={{width:width/3*2,height:width/3*2}}/>
                    </View>
                </View>
                <View style={{alignItems:'center',flex:1,justifyContent:'center'}}>
                    <TouchableOpacity style={styles.unselected}  onPress={()=>this.chargingIs()}>
                        {this.state.charging?<Text style={{color:'#fff',fontSize:17}}>停止充电</Text>:<Text style={{color:'#fff',fontSize:17}}>启动充电</Text>}
                    </TouchableOpacity>
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
    },
    unselected:{
        width:width/3*2,
        height:50,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#FF8226',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});