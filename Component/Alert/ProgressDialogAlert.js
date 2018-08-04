
'use strict';

import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Modal,
    Text,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import * as Progress from 'react-native-progress';
export default class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
        };
    }
    static defaultProps = {
        title: '标题',
        msg: 0,
        callback: () => {},
        btnText: '确定',
        progress:0.7,
        width:100,
        color:'red',
    };
    static propTypes = {
        msg: PropTypes.number.any, //提示信息
        title: PropTypes.string,
        callback: PropTypes.func,
        btnText: PropTypes.string,
        progress:PropTypes.number,
        width:PropTypes.number,
        color:PropTypes.string,
    };
    open = () => {
        this.setState({
            flag: true
        });
    };
    _onPress = () => {
        this.setState({
            flag: false
        });
        this.props.callback();
    };
    render() {
        return (
            <Modal animationType={"none"}
                   transparent={true}
                   visible={this.state.flag}
                   onRequestClose={() => {}}>
                <View style={styles.alertModal}>
                    <View style={[styles.alert]}>
                        {/*<View style={styles.title}>*/}
                        {/*<Text style={styles.titleCon}>{this.props.title}</Text>*/}
                        {/*</View>*/}
                        <View style={styles.content}>
                            <Progress.Bar progress={this.props.progress} width={this.props.width} color={this.props.color}/>
                            <Text style={styles.text}>{this.props.msg}</Text>
                        </View>
                        <View style={styles.btn}>
                            <TouchableOpacity underlayColor='#eee' onPress={this._onPress} style={styles.btnClick}>
                                <Text style={styles.btnText}>{this.props.btnText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
let _width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    content: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        minHeight: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,.45)'
    },
    alert: {
        width: _width * .7,
        backgroundColor: 'rgba(255,255,255,1)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderBottomColor: '#eee',
        borderBottomWidth: .5,
    },
    titleCon: {
        flex: 1,
        textAlign: 'center',
        fontSize: 25
    },
    text: {
        // height:80,
        // paddingTop: 10,
        // paddingBottom: 10,
        paddingTop: 15,
        // marginBottom: 5,
        fontSize: 18
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderTopColor: '#eee',
        // borderTopWidth: .5,
        overflow: 'hidden'
    },
    btnClick: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    btnText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden',
        fontSize: 20,
        fontWeight: '700'
    }
});
