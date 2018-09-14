import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Linking,
} from 'react-native';

const {width,height} = Dimensions.get('window');

export default class PresentationData extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>商城</Text>),
        headerStyle: {
            height: 40,
        },
        // headerLeft:(
        //     <View/>
        // ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    MallUrl(){
        Linking.canOpenURL('taobao://item.taobao.com/item.htm?spm=a217f.8051907.312171.29.3cb53308tPtvL3&id=565661790983').then(supported => {
            if (supported) {
                Linking.openURL('taobao://item.taobao.com/item.htm?spm=a217f.8051907.312171.29.3cb53308tPtvL3&id=565661790983'); 
            } else { 
                alert('请先安装淘宝APP');  
            }
        });      
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Mallbattery}>
                    <View style={styles.MallTitle}>
                        <Text style={styles.MallTitleStyle}>黑金高能电池</Text>
                    </View>
                    <View style={styles.MallContent}>
                        <TouchableOpacity 
                            style={ styles.MallBtn}
                            onPress={()=> this.MallUrl()}
                            >
                            <Image source={require('../../img/shopping/battery.jpg')} style={styles.MallBtnImage}/>
                            <Text>点击跳转</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={ styles.MallBtn}
                            onPress={()=> this.MallUrl()}
                            >
                            <Image source={require('../../img/shopping/battery.jpg')} style={styles.MallBtnImage}/>
                            <Text>点击跳转</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    MallBtnImage:{
        width:(width-30)/2, 
        height:(width-30)/2,
        borderRadius: 6,
    },
    MallBtn:{
        width:(width-30)/2, 
        height:height/3,    
        // justifyContent:'center',
        alignItems: 'center',
        // borderRadius: 5,
        // borderWidth: 1,
        // borderColor: '#5f5f5f',
    },
    MallContent:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginLeft: 10,
        marginRight: 10,
    },
    Mallbattery:{
        backgroundColor:'#fff',
    },  
    MallTitleStyle:{
        fontSize:16,
        color:'#5f5f5f'
    },
    MallTitle:{
        height:40,
        justifyContent:'center',
        marginLeft:18, 
    },
    container:{
        flex:1,
    }
});
