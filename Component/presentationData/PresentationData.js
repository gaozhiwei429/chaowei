import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';

const {width,height} = Dimensions.get('window');

export default class PresentationData extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>更多</Text>),
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.presentaionPart}>
                    <View style={styles.PresentationTitle}>
                        <Text style={styles.TitleStyle}>数据</Text>
                    </View>
                    <View style={styles.presentaionDetails}>
                        <TouchableOpacity
                            style={styles.PresentationBtn}
                            onPress={()=>this.props.navigation.navigate('ChargerSvg') } >
                            <Text>充电器数据</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.PresentationBtn}   
                            onPress={ ()=>this.props.navigation.navigate('TAB') } >
                            <Text>蓄电池数据</Text>  
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.PresentationBtn} 
                            onPress={() => this.props.navigation.navigate('ChargerRecorder')}
                            >
                            <Text>充电器检测仪</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.PresentationBtn} 
                            onPress={() => this.props.navigation.navigate('smart_battery')}
                            >
                            <Text>智能电池数据</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.shopping}>
                    <View style={styles.PresentationTitle}> 
                        <Text style={styles.TitleStyle}>限时推广</Text>
                    </View>
                    <View style={styles.presentaionDetails}>
                        <TouchableOpacity
                            style={styles.PresentationBtn}
                            onPress={ ()=>this.props.navigation.navigate('Shopping') } >
                            <Image source={require('../../img/shopping/shopping.png')} style={styles.BtnImage}/> 
                            <Text>商城</Text>   
                        </TouchableOpacity> 
                    </View>
                </View>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    BtnImage:{
        width:width/8,
        height:width/8,  
    },
    TitleStyle:{
        fontSize:15,
        color:'#5C5A62', 
    },
    shopping:{
        marginTop: 18,
        backgroundColor:'#fff',
    },
    PresentationTitle:{
        height:40,
        justifyContent:'center',  
        paddingLeft: 20,  
    },
    presentaionPart:{
        backgroundColor:'#fff',
    },
    presentaionDetails:{
        flexDirection: 'row',  
        flexWrap: 'wrap',
        borderColor: '#f5f5f5',
        borderTopWidth: 1,
    },
    PresentationBtn:{
        width:width/3, 
        height:width/3,
        borderColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        alignItems: 'center',
        justifyContent:'center',
    },
    container:{
        flex:1,
        marginTop: 18,
    }
});
