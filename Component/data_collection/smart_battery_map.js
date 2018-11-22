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
const {width,height}=Dimensions.get('window');
import * as commonality from '../../commonality';

export default class Map extends Component {
    static navigationOptions = {
        headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>轨迹</Text>),
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
        const { params } = this.props.navigation.state;
        const { locationValue } = params;
        this.state = {
            location:[
                [
                    {id:"GPS_Station",latitude:39.9154795474915,longitude:116.40381584513632,time:"2018-11-09 09:30:18.807"},
                    {id:"GPS_Station",latitude:39.9154795474915,longitude:116.40381584513632,time:"2018-11-09 09:30:18.807"},
                ]
            ],
            GPSvalue:true,
            locationValue,
            Base_Station:[],
            GPS_Station:[]
        };
    }

    translatePoints(points) {
        
    }

    // 打开页面获取位置数据
    async componentDidMount() {
        const points = await this.state.locationValue
                    .map(item => item.datapoints.filter(point => point.value.split(',').length === 2)
                    .map(point => {
                        return {
                            ...point,
                            value: point.value.split(',').reverse().join(','),
                            id:item.id
                        };
                    }))//
        const pointsData = await commonality.del(points[0].concat(points[1])).sort(commonality.timeCompare("at"));//数组合并去重，按照时间正序排列
        const coords = await pointsData.map(point => point.value)//.join(';');//定位数据处理
        let coordslen = await coords.length;
        let m = 100;
        let coordslineNum = await coordslen % m === 0 ? coordslen / m : Math.floor( (coordslen / m) + 1 );
        let coordsres = [];
        for (let i = 0; i < coordslineNum; i++) {
            let temp  = coords.slice(i*m, i*m+m);
            coordsres.push(temp );
        }
        const coordsData = await coordsres.map( (item,i) => {
            return item.join(';')
        })
        const calibrationLocations = await coordsData.map( item => {
            return fetch(`http://api.map.baidu.com/geoconv/v1/?coords=${item}&ak=CGMiQEfQgQo2IxGq0u5RpWeAMLPX30wB`).then(response => response.json()).then( data => data.result );
        })
        const locationData = await Promise.all(calibrationLocations).then(item => {
                            return [].concat.apply([],item)
                        }).catch( err => {

                        })
        const location = await locationData.map( (item,i) => {
            return { longitude: item.x, latitude: item.y, id:pointsData[i].id ,time:pointsData[i].at}
        })
        
        let len = await location.length;
        let n= 2;
        let lineNum = await len % n === 0 ? len /n :Math.floor( (len/n) + 1);
        let res = [];
        for(let i = 0 ; i < lineNum ; i++ ){
            if( i != 0 ){
                let temp = location.slice( i*n-1, i*n+n)
                res.push(temp);
            } else {
                let temp = location.slice( i*n, i*n+n );
                res.push(temp);
            }
        }
        this.setState({
            location:res,
        })
    }

    // 页面卸载时
    componentWillUnmount() {
        
    }

    render() {
        return (
            <View style={{ flex: 1,}}>
                {/* 地图标注 */}
                <View style={styles.mapLabel}>
                    <View style={styles.labelContent}>
                        <Text style={[styles.labelLine,styles.baseColor]}/>
                        <Text style={styles.labeText}>基站数据</Text>
                    </View>
                    <View style={styles.labelContent}>
                        <Text style={[styles.labelLine,styles.gpsColor]}/>
                        <Text style={styles.labeText}>GPS数据</Text>
                    </View>
                </View>
                <MapView
                    style={{ flex: 1 }}  
                    // location={this.state.location}
                    center={this.state.location[0][0]}
                    locationMode='follow'
                    zoomLevel={16}//缩放级别，取值范围 [3, 21]
                    locationEnabled //显示定位图层    
                    overlookDisabled//禁用倾斜手势 
                    onClick={this.onClick}
                    onStatusChange={this.onStatusChange}
                    rotateDisabled//禁用选择手势
                    // buildingsDisabled//禁用3D建筑
                >

                    {
                        this.state.location.map((item,key) => {
                            return <MapView.Polyline
                                key={key}
                                points={item}
                                width={2}
                                color={item[1].id==='Base_Station'?"rgba(60, 60, 60, 0.5)":"rgba(0, 0, 255, 0.5)"}
                            />
                        })
                    }
                </MapView> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    labeText:{
        fontSize:12,
        marginTop:4,
        marginLeft:6,
    },
    labelLine:{
        marginLeft:6,
        marginTop:10,
        alignItems:'center',
        justifyContent:'center',
        width: 30,
        height:2,
        borderColor:'green',
        borderStyle:'solid',
        zIndex:111
    },
    gpsColor:{
        backgroundColor:'rgba(0, 0, 255, 0.5)',
    },
    baseColor:{
        backgroundColor:'rgba(60, 60, 60, 0.5)',
    },
    labelContent:{
        flexDirection:'row'
    },
    mapLabel:{
        position:'absolute',
        top:5,
        left:5,
        width:100,
        height:50,
        backgroundColor:'#fff',
        zIndex:10,
        borderColor:'#efefef',
        borderWidth:1,
        borderRadius:4,
    }
});