import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import CWScanning from '../CWScanning/CWScanning';
import ChargerSvgs from './ChargerSvgs';

export default class ChargerData extends Component {
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
        title: '充电器',
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
    };

    render() {
        return (
            <View style={styles.Binding}>
                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{
                    chargerImg:0
                })
                }>
                    <Text style={styles.BtnText}>绑定</Text>
                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('ChargerSvgs')
                }>
                    <Text style={styles.BtnText}>充电器数据曲线</Text>
                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    Binding: {

    },
    BtnImg:{
        width:20,
        height:20,
        position:'absolute',
        right:20,
    },
    Btn:{
        borderBottomColor:'#4f4f4f',
        borderBottomWidth:1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    BtnText:{
        fontSize:19,
        paddingTop:10,
        paddingBottom:10,
        marginLeft:15,
    }
});