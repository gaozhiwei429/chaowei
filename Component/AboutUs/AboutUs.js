import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default class CWButton extends Component {

    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>关于我们</Text>),
        headerStyle: {
            height: 40,
        },
        // headerLeft:(
        //     <View/>
        // ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'blue',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
    };

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            version: '',
            phoneNumber:''
        } 
    }

    componentDidMount(){
        const version = DeviceInfo.getVersion();
        this.setState({
            version:version,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>关于我们</Text>
                <Text>版本号:{this.state.version}</Text>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
