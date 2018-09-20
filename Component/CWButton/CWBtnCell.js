import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

export default class CWBtnCell extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.Btn} onPress={this.props.onPress} activeOpacity={0.5}>
                <Text style={styles.BtnText}>{this.props.title}</Text>
                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    Binding: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#fff'
    },
    BtnImg:{
        width:15,
        height:15,
        position:'absolute',
        right:20,
    },
    Btn:{
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:1,
        justifyContent: 'center',
        // alignItems: 'center',
        marginLeft:15,
    },
    BtnText:{
        fontSize:19,
        paddingTop:10,
        paddingBottom:10,
    },
});