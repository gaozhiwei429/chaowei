import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import { List, TextareaItem } from 'antd-mobile-rn';

export default class RepairJoining extends Component {
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
        headerTitle: (<Text style={{fontSize: 20, flex: 1, textAlign: 'center'}}>维修加盟</Text>),
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
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15}}/>),
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.JoiningTop}>
                    <Text style={styles.JoiningTopText}>1.请确保您的个人信息准确无误</Text>
                    <Text style={styles.JoiningTopText}>2.请保持手机畅通，会有专员与您联系</Text>
                </View>
                <View style={{paddingLeft:20,paddingRight:20,marginTop:8,backgroundColor:'#fff',}}>
                    <View style={{marginTop:10}}>
                        <Text>*姓名：</Text>
                        <TextInput
                            style={styles.NameInput}
                            returnKeyType="search"
                            onChangeText={(voltager) => this.setState({voltager})}
                            placeholder ={'请输入姓名'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginTop:10}}>
                        <Text>*联系方式：</Text>
                        <TextInput
                            style={styles.NameInput}
                            returnKeyType="search"
                            onChangeText={(voltager) => this.setState({voltager})}
                            placeholder ={'请输入联系方式'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginTop:10}}>
                        <Text>*维修点地址：</Text>
                        <TextInput
                            style={styles.SiteInput}
                            returnKeyType="search"
                            onChangeText={(voltager) => this.setState({voltager})}
                            placeholder ={'请输入地址'}
                            underlineColorAndroid='transparent'
                            // keyboardType='numeric'
                            editable={true}
                        />
                    </View>
                    <View style={{marginTop:7}}>
                        <Text>备注：</Text>
                        {/*<View style={{borderColor:'#42CAFF',borderWidth:1,borderRadius:3,}}>*/}
                            {/*<TextareaItem*/}
                                {/*rows={4}*/}
                                {/*placeholder="备注"*/}
                                {/*count={100}*/}
                                {/*onChange={(text)=>{this.setState({text:text})}}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        <TextareaItem
                            rows={4}
                            placeholder="请输入相关信息..."
                            count={100}
                            onChange={(text)=>{this.setState({text:text})}}
                        />
                    </View>
                </View>
                <View style={styles.BtnTouchable}>
                    <TouchableOpacity onPress={()=>{}} style={styles.CalibrationBtn}>
                        <Text style={{fontSize:18}}>确认提交</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    BtnTouchable:{
        // flex:1,
        height:Dimensions.get('window').height/7,
        // justifyContent:'center',
        alignItems:'center',
        marginTop:40,
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
    SiteInput:{
        width:Dimensions.get('window').width/3*2,
        height:40,
        borderWidth:1,
        fontSize: 18,
        paddingLeft:5,
        borderColor: '#42CAFF',
        borderRadius: 4,
        marginTop:7,
    },
    NameInput:{
        width:Dimensions.get('window').width/5*2,
        height:40,
        borderWidth:1,
        fontSize: 18,
        paddingLeft:5,
        borderColor: '#42CAFF',
        borderRadius: 4,
        marginTop:7,
    },
    JoiningTopText:{
      fontSize:17,
      color:'#919191'
    },
    JoiningTop:{
        backgroundColor:'#fff',
        paddingLeft:20,
        paddingTop:14,
        paddingBottom:14,
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#eee',
    },
});