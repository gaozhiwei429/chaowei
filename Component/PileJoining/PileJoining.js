import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Picker,
    ScrollView
} from 'react-native';

export default class PileJoining extends Component {
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
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>充电桩加盟</Text>),
        headerStyle: {
            height: 40,
            // backgroundColor: 'red',
            // elevation: null
        },
        // headerLeft:(
        //     <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        // ),
        headerRight: (
            <View style={{height: 44,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerPressColorAndroid:'blue',
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{flex:1,marginTop:10,backgroundColor:'#fff'}}>
                    <Text style={{fontSize:20,margin:20}}>个人信息</Text>
                    <View style={{marginLeft:20,}}>
                        <Text>申请人姓名</Text>
                        <TextInput style={styles.CalibrationInput}
                            returnKeyType="search"
                            onChangeText={(voltager) => this.setState({voltager})}
                            placeholder ={'请输姓名'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginLeft:20,marginTop:7}}>
                        <Text>申请人联系方式</Text>
                        <TextInput style={styles.CalibrationInput}
                            onChangeText={(voltager) => {}}
                            placeholder ={'请输入手机号'}
                            underlineColorAndroid='transparent'
                            keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginLeft:20,marginTop:7}}>
                        <Text>安装地址</Text>
                        <TextInput style={styles.CalibrationInput}
                            onChangeText={(voltager) => {}}
                            placeholder ={'请输入安装地址'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{flex:1,marginLeft:20,marginTop:7}}>
                        <Text>建桩类型</Text>
                        <View style={{flex:1,width:130,borderColor:'#42CAFF',borderWidth:1,borderRadius:5,marginTop:7}}>
                            <Picker
                                selectedValue={this.state.language}
                                onValueChange={(lang) => this.setState({language: lang})}
                                style={{ height: 40, width: 130 ,}}
                            >
                                <Picker.Item label="个人充电" value="个人充电" />
                                <Picker.Item label="我有场地" value="我有场地" />
                                <Picker.Item label="申请换桩" value="申请换桩" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{flex:1,marginLeft:20,marginTop:7}}>
                        <Text>备注</Text>
                        <View style={{height:130}}>
                            <TextInput
                                style={styles.Remarks}
                                onChangeText={(voltager) => {}}
                                placeholder = {'请输入...'}
                                underlineColorAndroid='transparent'
                                // keyboardType='numeric'
                                editable={true}
                                multiline
                                maxLength={150}
                            />
                        </View>
                        <Text>注：最多可输入150个字</Text>
                    </View>
                    <View style={styles.BtnTouchable}>
                        <TouchableOpacity onPress={()=>{}} style={styles.CalibrationBtn}>
                            <Text style={{fontSize:18}}>提交</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    BtnTouchable:{
        flex:1,
        height:Dimensions.get('window').height/7,
        // backgroundColor:'#eee',
        // flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        // marginTop:35,
        // marginBottom:35,
    },
    CalibrationBtn:{
        width:Dimensions.get('window').width/3*2,
        height:40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#3BB6FF',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Remarks:{
        width:Dimensions.get('window').width-40,
        height:130,
        // maxHeight: 170,
        paddingVertical: 0,
        borderWidth:1,
        fontSize: 18,
        backgroundColor: '#fff',
        paddingLeft:5,
        borderColor: '#42CAFF',
        borderRadius: 4,
        marginTop:7,
        // marginRight:10,
    },
    CalibrationInput:{
        width:Dimensions.get('window').width/3*2,
        height:40,
        borderWidth:1,
        fontSize: 18,
        backgroundColor: '#fff',
        paddingLeft:5,
        borderColor: '#42CAFF',
        borderRadius: 4,
        marginTop:7,
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});