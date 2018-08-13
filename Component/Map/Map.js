import React, { Component } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View ,
    Image,
    Dimensions
} from 'react-native'
import { MapView } from 'react-native-amap3d'

export default class Map extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>地图</Text>),
        headerStyle: {
            height:40,
            // backgroundColor: 'red',
            // elevation: null
        },
        headerTitleStyle:{
            alignSelf:'center',//居中显示
        },
        // headerLeft:(
        //     <View />
        // ),
        headerRight: (
            <View />
        ),
        headerPressColorAndroid:'blue',
    };

    constructor(props) {
        super(props);
        this.state = {
            time: new Date(),
            mLatitude:'',
            mLongitude:'',
            mAccuracy:'',
            position:{
                accuracy:0,
                longitude:116.3972282409668,
                latitude:39.90960455039752,
            },
        };
    }

    componentDidMount() {
        this.mounted = true;
        setInterval(() => {
            if (this.mounted) {
                this.setState({
                    time: new Date(),
                })
            }
        }, 1000)


    }

    componentWillUnmount() {
        this.mounted = false
    }

    _coordinates = [
        {
            latitude: 39.806901,
            longitude: 116.397972,
        },
        {
            latitude: 39.806901,
            longitude: 116.297972,
        },
        {
            longitude:116.3974292409668,
            latitude:39.90869465039752,
        },
        {
            latitude: 39.706901,
            longitude: 116.397972,
        },
    ];

    _onMarkerPress = () => Alert.alert('onPress');
    _onInfoWindowPress = () => Alert.alert('onInfoWindowPress');
    _onDragEvent = ({ nativeEvent }) => Alert.alert(`${nativeEvent.latitude}, ${nativeEvent.longitude}`);

    locationB(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const positionData = position.coords;
                /**  经度：positionData.longitude*/
                /** 纬度：positionData.latitude*/
                this.setState({
                    mLatitude: positionData.latitude,
                    mLongitude: positionData.longitude
                })
            }
        );
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <MapView style={StyleSheet.absoluteFill}
                    locationStyle={{
                        image: "flag",
                        fillColor: "rgba(176, 224, 255, 0.5)",
                        strokeColor: "rgba(176, 224, 255, 0.5)",
                        strokeWidth: 0
                    }}
                    locationEnabled={true}//定位开启
                    locationType='locate'//定位模式
                    showsLocationButton={true}//定位按钮
                    coordinate={{
                         latitude: this.state.position.latitude,
                         longitude: this.state.position.longitude,
                    }}
                    locationInterval={1000}
                    distanceFilter={5}
                    zoomLevel={17}//缩放基本
                    mapType='standard'//地图模式
                    showsBuildings={true}//建筑物
                    showsTraffic={false}//路况
                    showsLabels={true}    //是否显示文本标签
                    onLocation={({nativeEvent}) =>this.setState({
                         mLatitude: nativeEvent.latitude,
                         mLongitude: nativeEvent.longitude,
                         mAccuracy:nativeEvent.accuracy
                    })
                    }
                    region={{
                        latitude: 39.90980,
                        longitude: 116.37296,
                        latitudeDelta: 0.3,
                        longitudeDelta: 0.3,
                    }}//显示区域
                    showsZoomControls={false}//是否显示放大缩小按钮
                    rotateEnabled={false}//
                    // showsCompass={true}//指南针
                    // showsTraffic={true}//交通
                >
                    <MapView.Marker
                        active
                        title='这是一个标注点'
                        color='red'
                        description='Hello world!'
                        coordinate={{
                            latitude: 30.305637,
                            longitude: 120.063449,
                        }}
                        infoWindowDisabled={true}

                    />
                    <MapView.Marker
                        color="green"
                        coordinate={this._coordinates[1]}
                        active
                        infoWindowDisabled={true}
                    >
                        <TouchableOpacity activeOpacity={0.9} onPress={this._onInfoWindowPress}>
                            <View style={styles.customInfoWindow}>
                                <Text>自定义信息窗口</Text>
                                <Text>{this.state.time.toLocaleTimeString()}</Text>
                            </View>
                        </TouchableOpacity>
                    </MapView.Marker>
                    <MapView.Marker
                        // active
                        // title='天安门'
                        // onPress={this._onMarkerPress}
                        icon={() => (
                            <View style={styles.customMarker}>
                                <Image style={{width:10,height:10}}  source={require('../../img/background.jpg')}/>
                            </View>
                        )}
                        active
                        infoWindowDisabled={true}
                        coordinate={this._coordinates[2]}
                    />
                    <MapView.Marker
                        title="自定义 View"
                        active
                        infoWindowDisabled={true}
                        icon={() => (
                            <View style={styles.customMarker}>
                                <Text style={styles.markerText}>{this.state.time.toLocaleTimeString()}</Text>
                            </View>
                        )}
                        coordinate={this._coordinates[3]}
                    />
                </MapView>
                <TouchableOpacity style={styles.locationButton} onPress={()=>{ this.locationB()}}>
                    <Image style={{width:35,height:35}}  source={require('../../img/locationButton.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    locationButton:{
        position:'relative',
        top:Dimensions.get('window').height-110,
        left:10,
    },
    customIcon: {
        width: 40,
        height: 40,
    },
    customInfoWindow: {
        backgroundColor: '#8bc34a',
        padding: 10,
        borderRadius: 10,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#689F38',
        marginBottom: 5,
    },
    customMarker: {
        backgroundColor: '#009688',
        alignItems: 'center',
        borderRadius: 5,
        padding: 5,
    },
    markerText: {
        color: '#fff',
    },
});