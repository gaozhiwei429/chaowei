import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Picker,
    ScrollView,
    Image,
} from 'react-native';
import { List, TextareaItem } from 'antd-mobile-rn';

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
        //     <View />
        // ),
        headerRight: (
            <View/>
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{flex:1,marginTop:10,backgroundColor:'#fff'}}>
                    <Text style={{fontSize:20,margin:20}}>个人信息</Text>
                    <View style={{marginLeft:20,}}>
                        <Text>*申请人姓名</Text>
                        <TextInput style={styles.CalibrationInput}
                            returnKeyType="search"
                            onChangeText={(voltager) => this.setState({voltager})}
                            placeholder ={'请输入姓名'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginLeft:20,marginTop:7}}>
                        <Text>*申请人联系方式</Text>
                        <TextInput style={styles.CalibrationInput}
                            onChangeText={(voltager) => {}}
                            placeholder ={'请输入手机号'}
                            underlineColorAndroid='transparent'
                            keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginLeft:20,marginTop:7}}>
                        <Text>*安装地址</Text>
                        <TextInput style={styles.CalibrationInput}
                            onChangeText={(voltager) => {}}
                            placeholder ={'请输入安装地址'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{flex:1,marginLeft:20,marginTop:7}}>
                        <Text>*建桩类型</Text>
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
                    <View style={{flex:1,marginLeft:20,marginRight:20,marginTop:7}}>
                        <Text>备注</Text>
                        {/*<View style={{height:130}}>*/}
                            {/*<TextInput*/}
                                {/*style={styles.Remarks}*/}
                                {/*onChangeText={(voltager) => {}}*/}
                                {/*placeholder = {'请输入...'}*/}
                                {/*underlineColorAndroid='transparent'*/}
                                {/*// keyboardType='numeric'*/}
                                {/*editable={true}*/}
                                {/*multiline*/}
                                {/*maxLength={150}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        <View style={{borderColor:'#42CAFF',borderWidth:1,borderRadius:3,}}>
                            <TextareaItem
                                rows={4}
                                placeholder="备注"
                                count={100}
                                onChange={(text)=>{this.setState({text:text})}}
                            />
                        </View>
                        {/*<Text>{this.state.text}</Text>*/}
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
        justifyContent:'center',
        alignItems:'center',
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
        paddingVertical: 0,
        borderWidth:1,
        fontSize: 18,
        paddingLeft:5,
        borderColor: '#42CAFF',
        borderRadius: 4,
        marginTop:7,
    },
    CalibrationInput:{
        width:Dimensions.get('window').width/3*2,
        height:40,
        borderWidth:1,
        fontSize: 18,
        paddingLeft:5,
        borderColor: '#42CAFF',
        borderRadius: 4,
        marginTop:7,
    },
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
});