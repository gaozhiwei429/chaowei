// import React, { Component } from 'react';
// import {
//     AppRegistry,
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     NativeModules,
//     Image
// } from 'react-native';
//
// // 引入手电筒模块
// // let FlashLight = NativeModules.FlashLight;
//
// class FlashLightModules extends Component {
//     constructor(){
//         super();
//
//         this.state = { switchFlash:true };
//     }
//
//     _switch (){
//         this.setState({
//             switchFlash: !this.state.switchFlash,
//
//         });
//         let flash =this.state.switchFlash;
//         FlashLight.switchState(flash, () => {
//         }, (message) => {
//             console.error(message);
//         })
//     }
//
//     render() {
//         return (
//             <TouchableOpacity style={styles.overlayBottom} onPress={() => {
//                        this._switch()
//                      }}>
//                 <Image style={{width:50,height:50 }} source={require('../../img/flashlight.png')}/>
//                 <Text style={styles.overlayBottomText}>
//                     {this.state.switchFlash?'打开手电筒':'关闭手电筒'}
//                 </Text>
//             </TouchableOpacity>
//         )
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
// });
//
// //输出类
// module.exports = FlashLightModules;