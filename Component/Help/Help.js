import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    WebView
} from 'react-native';

export default class Help extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            text: '',

        }
    }

    componentWillMount() {

    };

    static navigationOptions = {
        headerTitle: (<Text style={{fontSize: 20, flex: 1, textAlign: 'center'}}>充电帮助</Text>),
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
        // headerLeft:(
        //     <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        // ),
        headerRight: (
            <View style={{height: 44, width: 55, justifyContent: 'center', paddingRight: 15}}/>
        ),
        headerPressColorAndroid: 'blue',
    };

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row',height:100,marginTop:10,}}>
                    <View style={{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',width:100}}>
                        <Image source={require('../../img/FAQ.png')} style={{width:25,height:25}}/>
                        <Text style={{fontSize:15}}>常见问题</Text>
                    </View>
                    <View style={{flex:1,height:100,justifyContent:'center',}}>
                        <TouchableOpacity style={{flex:1,backgroundColor:'#eee',marginBottom:5,marginLeft:5,padding:10,flexDirection:'row',alignItems:'center'}} onPress={()=>this.props.navigation.navigate('PeakValley')}>
                            <Text style={{fontSize:18}}>峰谷平电价是什么意思</Text>
                            <Image source={require('../../img/next.png')} style={{width:15,height:15}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,backgroundColor:'#eee',marginLeft:5,padding:10,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:18}}>为什么充不上电</Text>
                            <Image source={require('../../img/next.png')} style={{width:15,height:15}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },

});