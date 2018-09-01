import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

export default class CWGLaunchlmage extends Component {
    static navigationOptions = {
        header:null,
    };
    //复杂操作：定时器，网络请求
    componentDidMount(){
        //定时：隔3秒切换到CWMain
        setTimeout(()=>{
            this.props.navigation.replace('CWMain')
        },3000)
    }
    render() {
        return (
            <View style={styles.launchImageStyle}>
                <TouchableOpacity
                    style={styles.skipBtn}
                    onPress={()=>this.props.navigation.replace('CWMain')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.skipText}>跳过</Text>
                </TouchableOpacity>
                <Image source={require('../../img/logo.png')} style={styles.launchImageStyle}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    skipText:{
        fontSize:14,
        paddingLeft:8,
        paddingRight:8,
    },
    skipBtn:{
        position: 'absolute',
        top:15,
        right:15,
        zIndex:20,
        backgroundColor:'#fff',
        borderRadius:15,
    },
    launchImageStyle:{
        flex:1
    },
});