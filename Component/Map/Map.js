import React, { Component } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View ,
    Image,
    Dimensions,
    Linking,
} from 'react-native';
import { MapView,Location,Marker } from 'react-native-baidumap-sdk';
import geolib from 'geolib';
import MapLinking from './MapLinking';
import ActionSheet from 'react-native-actionsheet';
 
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
            iconLat:undefined,
            iconLon:undefined,
            actionSheetConfig: []
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
        Location.setOptions({ gps: true ,distanceFilter:1});
        Location.addLocationListener(location => {
            this.setState({ location })
        });
        Location.start();

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
            iconLat:undefined,
            iconLon:undefined,
        })
    }

    // 点击地图时  
    onClick=()=>{
        this.setState({
            distanceIs:false,
            iconLat:undefined,
            iconLon:undefined,  
        })
    }

    markerClick(latitude,longitude){
        let distance = geolib.getDistance(
            {latitude: this.state.location.latitude, longitude: this.state.location.longitude},
            {latitude: latitude, longitude: longitude}
        );
        this.setState({
            distance ,
            distanceIs:true,
            iconLat:latitude,
            iconLon:longitude,
        })
        // console.log(latitude,longitude,'图标位置');
        // console.log(this.state.location.latitude,this.state.location.longitude,'当前位置');
    }
    async openMap(){
        
        this.ActionSheet.show();
        const { location, iconLat, iconLon } = this.state;
  
        var dataIntArr=fetch('https://restapi.amap.com/v3/assistant/coordinate/convert?locations='+location.longitude+','+location.latitude+'|' + iconLon +','+ iconLat + '&coordsys=baidu&output=json&key=14d59bc23db0c0755b4c33f0cadbf974')
            .then((response) => //当前位置经纬数据
                response.json()
            )
            .then((responseJson) => {
                var dataStrArr=responseJson.locations.replace(/\;/g, ",").split(",");//分割成字符串数组
                var dataIntArr=[];//保存转换后的整型字符串
                return dataIntArr=dataStrArr.map(function(data){
                    return +data;
                });
            })
            .catch((error) =>{
              
            });
        const Position = await Promise.all([dataIntArr]);

        const urls = [  
            {
                text: '使用高德地图导航',
                downloadText: '下载高德地图',
                downloadUrl: 'http://wap.amap.com',
                openUrl: 'androidamap://route?sourceApplication=com.chaowei&dev=0&m=0&t=4&slat=' + Position[0][1] +'&slon=' + Position[0][0] + '&sname=当前位置&dlat=' + Position[0][3] + '&dlon=' + Position[0][2] + '&dname=充电桩',//&div=0&m=0
            }, 
            {
                text: '使用百度地图导航',
                downloadText: '下载百度地图',
                downloadUrl: 'https://map.baidu.com/zt/client/index/',
                openUrl: `baidumap://map/direction?origin=${location.latitude + ',' + location.longitude}&destination=${iconLat},${iconLon}&mode=walking&src=com.chaowei`,
            },
        ];

        const actions = urls.map(item => Linking.canOpenURL(item.openUrl));
        const results = await Promise.all(actions);
    
        const actionSheetConfig = results.map((result, i) => {
            return {
                text: result ? urls[i].text : urls[i].downloadText,
                url: result ? urls[i].openUrl : urls[i].downloadUrl,
                isInstalled: result,
            };
        });

        this.setState({
            actionSheetConfig,
        });
    }

    handleActionSheetClick = (index) => {
        const { actionSheetConfig } = this.state;
        const item = actionSheetConfig[index];
        if (item) {
            Linking.openURL(item.url);
        }
    }

    render() {
        const actionSheetText = [
            ...this.state.actionSheetConfig.map(item => item.text),
            '取消',
        ];
        return (
            <View style={{ flex: 1,}}> 
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    // title={''}
                    options={actionSheetText}
                    cancelButtonIndex={actionSheetText.length - 1}
                    // destructiveButtonIndex={1}
                    onPress={this.handleActionSheetClick}
                />
                {this.state.distanceIs?
                    <View style={{justifyContent:'center'}}>
                        <View style={styles.geolib}>
                            <View style={styles.geolibModal}>
                                <Text style={styles.disabled}>距离</Text> 
                                <Text style={{fontSize:25,color:'#808080'}}>{this.state.distance}米</Text>
                            </View>
                            {/* <View style={{flex:1,alignItems:'center',}}>
                                <Text>可步行</Text>
                                <Text>{this.state.distance}米</Text>
                            </View> */}
                            <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={()=>this.openMap()}>
                                <Text style={{fontSize:25,color:'#808080'}}>点击导航</Text>
                            </TouchableOpacity>
                        </View>
                    </View>:<View/>
                }
                <MapView
                    ref={ref => this.mapView = ref}
                    style={{ flex: 1 }}  
                    location={this.state.location}
                    locationMode='follow'
                    zoomLevel={18}//缩放级别，取值范围 [3, 21]
                    locationEnabled //显示定位图层    
                    zoomControlsDisabled//禁用缩放按钮
                    overlookDisabled//禁用倾斜手势 
                    onClick={this.onClick}
                    onStatusChange={this.onStatusChange}
                    rotateDisabled//禁用选择手势
                    buildingsDisabled//禁用3D建筑
                >
                    
                    {this._coordinates.map((item,key) => 
                        <MapView.Marker
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
                    <Image style={styles.locationIcon}  source={require('../../img/locationButton.png')}/>
                </TouchableOpacity>
        
            </View>
        )
    }
}

const styles = StyleSheet.create({
    geolibModal:{
        flex:1,
        alignItems:'center',
        borderRightWidth:1,
        borderColor:'#f5f5f5',
    },
    locationIcon:{
        width:20,
        height:20,
        margin: 5,
        tintColor: '#616161',
    },
    distance:{
        fontSize:16,
        color:'#111',
    },
    geolib:{
        flex:1,
        zIndex:2, 
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
        borderWidth:1,
        borderColor:'#e8e8e8',
        borderRadius:5,
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