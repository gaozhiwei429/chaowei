import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import CWScanning from '../CWScanning/CWScanning';

export default class BatteryData extends Component {
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
        title: '蓄电池',
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
    };

    render() {
        const { params } = this.props.navigation.state;
        const { index,chargerImg } = params;
        return (
            <View style={styles.Binding}>
                {
                    chargerImg==0?
                        <View style={styles.Binding}>
                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ chargerImg:0})}>
                                <Text style={styles.BtnText}>绑定</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('ChargerSvg')
                            }>
                                <Text style={styles.BtnText}>充电器数据曲线</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>
                        </View>
                        :index==0 ?
                        <View>
                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 0 })
                            }>
                                <Text style={styles.BtnText}>绑定</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.Btn} onPress={() => {}
                            }>
                                <Text style={styles.BtnText}>蓄电池{index+1}数据曲线</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>
                        </View>
                    :index==1?
                        <View>
                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 1 })
                            }>
                                <Text style={styles.BtnText}>绑定</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.Btn} onPress={() => {}
                            }>
                                <Text style={styles.BtnText}>蓄电池{index+1}数据曲线</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>
                        </View>
                        :index==2?
                            <View>
                                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{index: 2 })}>
                                    <Text style={styles.BtnText}>绑定</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.Btn} onPress={() => {}
                                }>
                                    <Text style={styles.BtnText}>蓄电池{index+1}数据曲线</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>
                            </View>
                            :<View>
                                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 3 })}>
                                    <Text style={styles.BtnText}>绑定</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.Btn} onPress={() => {}
                                }>
                                    <Text style={styles.BtnText}>蓄电池{index+1}数据曲线</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>
                            </View>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    Binding: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#fff'
    },
    BtnImg:{
        width:20,
        height:20,
        position:'absolute',
        right:20,
    },
    Btn:{
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:1,
        justifyContent: 'center',
        // alignItems: 'center',
        // marginLeft:15,
    },
    BtnText:{
        fontSize:19,
        paddingTop:10,
        paddingBottom:10,
        marginLeft:15,
    }
});