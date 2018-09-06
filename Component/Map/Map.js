import React, { Component } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View ,
    Image,
    Dimensions,
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
        headerPressColorAndroid:'gray',
        headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
    };

    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            time: new Date(),
            mLatitude:'',
            mLongitude:'',
            mAccuracy:'',
            position:{
                accuracy:100,
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


    _log(event, data) {
        this.setState({
            logs: [
                {
                    key: Date.now(),
                    time: new Date().toLocaleString(),
                    event,
                    data: JSON.stringify(data, null, 2),
                },
                ...this.state.logs,
            ],
        })
    }

    _logPressEvent = ({ nativeEvent }) => this._log(console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`));

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
                    // locationInterval={5000}//时间间隔
                    // distanceFilter={5}//定位的最小更新距离
                    zoomLevel={17}//缩放基本
                    mapType='standard'//地图模式
                    showsBuildings={true}//建筑物
                    // tilt='30'//倾斜角度，取值范围 [0, 60]
                    showsTraffic={false}//路况
                    showsLabels={true}    //是否显示文本标签
                    onLocation={({nativeEvent}) =>this.setState({
                         mLatitude: nativeEvent.latitude,
                         mLongitude: nativeEvent.longitude,
                         mAccuracy:nativeEvent.accuracy,
                    })
                    }
                    region={{
                        latitude: 39.90980,
                        longitude: 116.37296,
                        latitudeDelta: 0.3,
                        longitudeDelta: 0.3,
                    }}//显示区域
                    showsZoomControls={false}//是否显示放大缩小按钮
                    rotateEnabled={false}//启用旋转手势，用于调整方向
                    // showsCompass={true}//指南针
                    // showsTraffic={true}//交通
                    onPress={this._logPressEvent}
                >
                    <MapView.Marker
                        draggable
                        title="一个可拖拽的标记"
                        description={this.state.time.toLocaleTimeString()}
                        // onInfoWindowPress={this._onInfoWindowPress}
                        coordinate={{
                            latitude: 30.307006443158734,
                            longitude: 120.06473261354672,
                        }}
                        // infoWindowDisabled
                        onPress={(e ) => {
                            console.log((e.nativeEvent))}}
                    />
                    {/*<MapView.Marker*/}
                        {/*// active*/}
                        {/*title='这是一个标注点'*/}
                        {/*color='red'*/}
                        {/*description='Hello world!'*/}
                        {/*coordinate={{*/}
                            {/*latitude: 30.307006443158734,*/}
                            {/*longitude: 120.06473261354672,*/}
                        {/*}}*/}
                        {/*// infoWindowDisabled={true}*/}
                        {/*onPress={this._onDragEvent}*/}
                        {/*// onLocation={this._logPressEvent}*/}
                    {/*/>*/}
                    {/*<MapView.Marker*/}
                        {/*color="green"*/}
                        {/*coordinate={this._coordinates[1]}*/}
                        {/*active*/}
                        {/*infoWindowDisabled={true}*/}
                        {/*clickDisabled={true}*/}
                    {/*>*/}
                        {/*<TouchableOpacity activeOpacity={0.9} onPress={this._onInfoWindowPress}>*/}
                            {/*<View style={styles.customInfoWindow}>*/}
                                {/*<Text>自定义信息窗口</Text>*/}
                                {/*<Text>{this.state.time.toLocaleTimeString()}</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</MapView.Marker>*/}
                    {/*<MapView.Marker*/}
                        {/*title='天安门'*/}
                        {/*// icon={() => (*/}
                        {/*//     <View style={styles.customMarker}>*/}
                        {/*//         <Image style={{width:10,height:10}}  source={require('../../img/background.jpg')}/>*/}
                        {/*//     </View>*/}
                        {/*// )}*/}
                        {/*active*/}
                        {/*infoWindowDisabled={true}*/}
                        {/*coordinate={this._coordinates[2]}*/}
                    {/*/>*/}
                    {/*<MapView.Marker*/}
                        {/*title="自定义 View"*/}
                        {/*active*/}
                        {/*infoWindowDisabled={true}*/}
                        {/*icon={() => (*/}
                            {/*<View style={styles.customMarker}>*/}
                                {/*<Text style={styles.markerText}>{this.state.time.toLocaleTimeString()}</Text>*/}
                            {/*</View>*/}
                        {/*)}*/}
                        {/*coordinate={this._coordinates[3]}*/}
                    {/*/>*/}
                </MapView>
                {/*<TouchableOpacity style={styles.locationButton} >*/}
                    {/*<Image style={{width:35,height:35}}  source={require('../../img/locationButton.png')}/>*/}
                {/*</TouchableOpacity>*/}
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