import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

export default class BatteryData extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            chargerImg:0,
        }
    }

    componentWillMount() {

    };

    static navigationOptions =({ navigation }) => {
        const {params}=navigation.state;
        const { chargerImg } = params;
        return{
            headerTitle:(chargerImg == 0 ? <Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电器</Text>:<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>蓄电池</Text>),
            headerStyle: {
                height: 40,
                // backgroundColor: 'red',
                // elevation: null
            },
            // headerLeft:(
            //     <View/>
            // ),
            headerRight: (
                <View/>
            ),
            headerPressColorAndroid:'gray',
            headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
        }
    };

    render() {
        const { params } = this.props.navigation.state;
        const { index,chargerImg } = params;
        return (
            <View style={styles.Binding}>
                {
                    chargerImg===0?
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

                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Charging',//{chargerImg:0}
                            )
                            }>
                                <Text style={styles.BtnText}>启动/停止充电</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{chargerImg:0})
                            }>
                                <Text style={styles.BtnText}>校准</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>
                        </View>
                        :index===0 ?
                        <View>
                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 0 })
                            }>
                                <Text style={styles.BtnText}>绑定</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{index:0})
                            }>
                                <Text style={styles.BtnText}>校准</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>
                        </View>
                    :index===1?
                        <View>
                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 1 })
                            }>
                                <Text style={styles.BtnText}>绑定</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{index:1})
                            }>
                                <Text style={styles.BtnText}>校准</Text>
                                <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                            </TouchableOpacity>
                        </View>
                        :index===2?
                            <View>
                                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{index: 2 })}>
                                    <Text style={styles.BtnText}>绑定</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{index:2})
                                }>
                                    <Text style={styles.BtnText}>校准</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>
                            </View>
                            :index===3?<View>
                                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 3 })}>
                                    <Text style={styles.BtnText}>绑定</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{index:3})
                                    }>
                                    <Text style={styles.BtnText}>校准</Text>
                                    <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                </TouchableOpacity>
                            </View>
                                    :index===4?<View>
                                    <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 4 })}>
                                        <Text style={styles.BtnText}>绑定</Text>
                                        <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{index:4})
                                    }>
                                        <Text style={styles.BtnText}>校准</Text>
                                        <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                    </TouchableOpacity>
                                </View>
                                    :<View>
                                        <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('CWScanning',{ index: 5 })}>
                                            <Text style={styles.BtnText}>绑定</Text>
                                            <Image style={styles.BtnImg} source={require('../../img/next.png')}/>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Calibration',{index:5})
                                        }>
                                            <Text style={styles.BtnText}>校准</Text>
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
    }
});