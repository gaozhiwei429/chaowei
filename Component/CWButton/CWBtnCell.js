import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

export default class CWBtnCell extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.CWButtonBtn}>
                <Text
                    style={styles.CWBtnText}
                    onPress={this.props.onPress}
                >{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    CWButtonBtn:{
        flex:1,
        height:60,
        width:160,
        backgroundColor:'#0067B3',
        borderRadius:15,
        justifyContent:'center',
        marginTop:20,
    },
    CWBtnText:{
        textAlign:'center',
        color:'#fff',
        fontSize:20,
        width:100,
        marginLeft:30
    },
    button:{
        height:40,
        width:100,
        borderRadius:1000,
        backgroundColor:'red',
        justifyContent:'center'
    },
    buttonText:{
        textAlign: 'center',
        color: 'white'
    }
});
