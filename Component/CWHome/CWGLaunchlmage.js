import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import CWMain from '../CWMain/CWMain';

export default class CWGLaunchlmage extends Component {
    static navigationOptions = {
        header:null,
    };
    render() {
        return (
            <Image source={require('../../img/logo.png')} style={styles.launchImageStyle}/>
        )
    }
    //复杂操作：定时器，网络请求
    componentDidMount(){
        //定时：隔两秒切换到Home
        setTimeout(()=>{
            this.props.navigation.replace('CWMain')
        },50)
    }
}

const styles = StyleSheet.create({
    launchImageStyle:{
        flex:1
    },
});