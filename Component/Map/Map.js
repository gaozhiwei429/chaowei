import React, { Component } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View ,
    Image,
    Dimensions,
} from 'react-native';
import { MapView,Location,Marker } from 'react-native-baidumap-sdk';  
import geolib from 'geolib';

const {width,height}=Dimensions.get('window');
export default class Map extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>地图</Text>),
        headerStyle: {
            height:40,
        },
        headerTitleStyle:{
            alignSelf:'center',//居中显示
        },
        headerRight: (
            <View />
        ),
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    constructor(props) {
        super(props);
        this.state = {
            location:undefined,  
            position:{
                longitude:116.40381584513632, 
                latitude:39.9154795474915,
            },
            logs: {},   
            distance:'', 
            distanceIs:false,
        };
    }
    // 打开页面获取位置数据
    async componentDidMount() {
        await Location.init();
        Location.setOptions({ gps: true ,distanceFilter:1});
        this.listener = Location.addLocationListener(location => {
            this.setState({ location })
        });
        Location.start();
    }
    // 页面卸载时
    componentWillUnmount() {
        Location.stop();
        this.listener.remove();
    }
    // 定位到当前位置
    location = () => { 
        this.mapView.setStatus({ 
            center: this.state.location,
            zoomLevel:18 
        }, 80)
    };

    _coordinates =  [
        {
            latitude: 30.364131,
            longitude: 120.110858,    
        },
        {
            latitude: 30.806901,
            longitude: 120.127972,
        },
        {
            latitude: 30.906901,
            longitude: 120.123972,
        },
        {
            latitude: 30.706901,
            longitude: 120.122972,
        },
    ];

    // 地图状态更新时调用，如地图滑动、缩放完成后执行的
    onStatusChange=()=>{
        this.setState({
            distanceIs:false,
        })
    }

    // 点击地图时  
    onClick=()=>{
        this.setState({
            distanceIs:false,
        })
    }

    markerClick(latitude,longitude){
        let distance = geolib.getDistance(
            {latitude: this.state.location.latitude, longitude: this.state.location.longitude},
            {latitude: latitude, longitude: longitude}
        );
        this.setState({
            distance ,
            distanceIs:true
        })
        // console.log(latitude,longitude,'图标位置');
        // console.log(this.state.location.latitude,this.state.location.longitude,'当前位置');
    }
    render() {
        return (
            <View style={{ flex: 1,}}> 
                {this.state.distanceIs?
                <View style={{justifyContent:'center'}}>
                    <View style={styles.geolib}>
                        <View style={{flex:1,alignItems:'center',}}>
                            <Text style={styles.disabled}>距离</Text>
                            <Text style={{fontSize:25,color:'#111'}}>{this.state.distance}米</Text>
                        </View>
                        {/* <View style={{flex:1,alignItems:'center',}}>
                            <Text>可步行</Text>
                            <Text>{this.state.distance}米</Text>
                        </View> */}
                    </View>
                </View>:<View/>
                }
                <MapView
                    ref={ref => this.mapView = ref}
                    style={{ flex: 1 }}  
                    location={this.state.location}
                    locationMode='follow'    
                    overlook={0}//倾斜角度，取值范围 [-45, 0]
                    rotation={0}//选择角度，取值范围 [0, 360] 
                    zoomLevel={18}//缩放级别，取值范围 [3, 21]
                    locationEnabled //是否显示定位图层    
                    zoomControlsDisabled//是否禁用缩放按钮
                    overlookDisabled//是否禁用倾斜手势 
                    onClick={this.onClick}    
                    onStatusChange={this.onStatusChange}
                >
                    {/* <MapView.Marker
                        title="充电桩"
                        coordinate={this._coordinates[0]}
                        onPress={
                            ()=>this.markerClick(this._coordinates[0].latitude,this._coordinates[0].longitude)
                        }
                    /> */}

                    {this._coordinates.map((item,key) => <MapView.Marker
                        key={key}
                        title="充电桩" 
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}  
                        onPress={
                            ()=>this.markerClick(item.latitude,item.longitude)
                        }
                        />
                    )}
                </MapView>      

                <TouchableOpacity style={styles.locationButton} onPress={this.location}>
                    <Image style={{width:20,height:20,margin: 5,tintColor: '#616161',}}  source={require('../../img/locationButton.png')}/>
                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    distance:{
        fontSize:16,
        color:'#111',
    },
    geolib:{
        flex:1,
        elevation:2,
        position:'absolute',
        top: 8,
        backgroundColor:'#fff',
        width:width-16,
        height: height/11,    
        flexDirection:'row',  
        alignItems:'center',
        // justifyContent:'space-around',  
        marginLeft:8,
        marginRight:8,
    },
    locationButton:{
        position:'absolute',
        right: 16,
        bottom: 30, 
        elevation: 2,
        backgroundColor:'#fff',
        borderRadius: 40,
    }, 
    customIcon: {
        width: 40,
        height: 40,
      },
});