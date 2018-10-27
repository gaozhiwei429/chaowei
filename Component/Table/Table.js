import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  ListView,
  Image,
} from 'react-native';
import {
  Cell,
  DataTable,
  Header,
  HeaderCell,
  Row,
  EditableCell,
  CheckableCell,
} from 'react-native-data-table';
import { BATTERY_BIND_STORAGE_KEY,CHARGER_BIND_STORAGE_KEY } from '../../config';
import * as storage from '../../storage';

// import localData from './data.json';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { params } = this.props.navigation.state;
    const { localData } = params;

    this.state = {
      ds: this.ds.cloneWithRows(localData),
      battery:false,
    };
    this.renderHeader = this.renderHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }
 

  async componentDidMount(){
    const { params } = this.props.navigation.state;
    const { localData,capacity,electric_current,temperature,voltage,power,xTime } = params;
    
    let promise2=new Promise(function (resolve,reject) {
      return storage.get(BATTERY_BIND_STORAGE_KEY, (error, result) => {
          if (error) {
              reject(error);
              return;
          }
          resolve(result);
      })}
    );

      //蓄电池存储数据
    const batteryBind = await Promise.all([promise2]);

    if(capacity||electric_current||temperature||voltage||power){
      let dsData =localData
      var ds={}
      var New=new Array();
      dsData.forEach(v=>{
        !ds[v.my_timestamp]?(ds[v.my_timestamp]=[v]):ds[v.my_timestamp].push(v);
      })
      var i=0;
      for(var o in ds){
        New[i]={
          "my_timestamp":o,
          "oarr":ds[o]
        }
        i++;
      }
    
      this.setState({
        batteryBind,
        ds: this.ds.cloneWithRows(New)
      }) 
    }else{
      this.setState({
        batteryBind,
        ds: this.ds.cloneWithRows(localData),
      }) 
    }

  }

  
  //APP顶部
  static navigationOptions = {
    headerTitle:(<Text style={{fontSize:20,flex: 1, textAlign: 'center'}}>数据视图</Text>),
    headerStyle: {
        height: 40,
    },
    headerRight: (
        <View/>
    ),
    headerPressColorAndroid:'gray',
    headerBackImage: (<Image source={require('../../img/leftGoBack.png')} style={{width:18,height:14,marginLeft:15,marginRight:15}}/>),
};

  render() {
    
    return (
      <View style={styles.container}>
        <DataTable
          style={styles.container}
          listViewStyle={styles.container}
          dataSource={this.state.ds}
          renderRow={this.renderRow}
          renderHeader={this.renderHeader}
        />
      </View>
    );
  }
  
  renderHeader() {
    const { params } = this.props.navigation.state;
    const { charger,batteryBind,detectorVoltageCurrent,detectorTemperature,CapacityPower, } = params;

    return (
      <Header>
        <HeaderCell
          style={styles.headerCell}
          key="0"
          text="时间"
          width={2}
        />
        
        {
          CapacityPower?
          <HeaderCell 
            width={0}
          />:detectorTemperature?
          <HeaderCell width={0}/>:
          detectorVoltageCurrent?
          <HeaderCell
            style={styles.headerCell}
            key="1"
            text='电压'
            width={1}
            isAscending={false}
          />:charger?
          <HeaderCell
            style={styles.headerCell}
            key="1"
            text='电压'
            width={1}
            isAscending={false}
          />:batteryBind[0].length>=1?
          <HeaderCell
            style={styles.headerCell}
            key="1"
            text='电池1'
            width={1}
            isAscending={false}
          />:<HeaderCell width={0}/>
          }
        
        {
          CapacityPower?
          <HeaderCell  width={0}/>:
          detectorTemperature?
          <HeaderCell width={0}/>:
          detectorVoltageCurrent?
          <HeaderCell
            style={styles.headerCell}
            key="2"
            text={'电流'}
            width={1}
            isAscending={false}
          />:charger?
          <HeaderCell
            style={styles.headerCell}
            key="2"
            // text={charger==0?'电流':localData[0][0].voltage&&localData[0][0].electric_current?'功率':localData[0][0].voltage?'电压':localData[0][0].temperature?'温度':localData[0][0].electric_current?'电流':localData[0][0].capacity?'容量':''}
            text={'电流'}
            width={1}
            isAscending={false}
          />:batteryBind[0].length>=2?
          <HeaderCell
            style={styles.headerCell}
            key="2"
            text='电池2'
            width={1}
            isAscending={false}
          />:<HeaderCell width={0}/>
        }

        {
          CapacityPower?
          <HeaderCell  width={0}/>:
          detectorTemperature?
          <HeaderCell
          style={styles.headerCell}
          key="3"
          text='电路板温度'
          width={1}
        />:
          detectorVoltageCurrent?
          <HeaderCell width={0}/>:charger?
          <HeaderCell
            style={styles.headerCell}
            key="3"
            text='温度'
            width={1}
          />:batteryBind[0].length>=3?
        <HeaderCell
          style={styles.headerCell}
          key="3"
          text='电池3'
          width={1}
          isAscending={false}
        />:<HeaderCell width={0}/>
      }

        {
          CapacityPower?
          <HeaderCell 
            style={styles.headerCell}
            key="4"
            text='容量'
            width={1}
            isAscending={false}
          />:
          detectorTemperature?
          <HeaderCell
          style={styles.headerCell}
          key="4"
          text='环境温度'
          width={1}
        />:detectorVoltageCurrent?
          <HeaderCell width={0}/>:charger?
          <HeaderCell
          style={styles.headerCell}
          key="4"
          text='容量'
          width={1}
        />:batteryBind[0].length>=4?
        <HeaderCell
          style={styles.headerCell}
          key="4"
          text='电池4'
          width={1}
          isAscending={false}
        />:<HeaderCell width={0}/>
      }

      {
          CapacityPower?
          <HeaderCell 
            style={styles.headerCell}
            key="5"
            text='功率'
            width={1}
            isAscending={false}
          />:
          detectorTemperature?
          <HeaderCell width={0}/>:
          detectorVoltageCurrent?
          <HeaderCell width={0}/>:
          charger?
          <HeaderCell width={0}/>:
          batteryBind[0].length>=5?
          <HeaderCell
            style={styles.headerCell}
            key="5"
            text='电池5'
            width={1}
            isAscending={false}
          />:<HeaderCell width={0}/>
      }

      {
        CapacityPower?
        <HeaderCell  width={0}/>:
        detectorTemperature?
        <HeaderCell width={0}/>:
        detectorVoltageCurrent?
        <HeaderCell width={0}/>:
        charger?
        <HeaderCell width={0}/>:
        batteryBind[0].length>=6?
        <HeaderCell
          style={styles.headerCell}
          key="6"
          text='电池6'
          width={1}
          isAscending={false}
        />:<HeaderCell width={0}/>
      }
      
      </Header>
    );
  }

  renderRow(item) {
    let rowStyle = item.id%2 === 0  ? styles.whiteRow : styles.row;
    const { params } = this.props.navigation.state;
    const { charger,batteryBind,capacity,electric_current,temperature,voltage,power,detectorVoltageCurrent,detectorTemperature,CapacityPower } = params;
    var battery1;
    item.oarr&&item.oarr.forEach(item=>{
      (item.battery_id==batteryBind[0][0])&&capacity?battery1=item.capacity:
      (item.battery_id==batteryBind[0][0])&&electric_current?battery1=item.electric_current:
      (item.battery_id==batteryBind[0][0])&&temperature?battery1=item.temperature:
      (item.battery_id==batteryBind[0][0])&&voltage?battery1=item.voltage:
      (item.battery_id==batteryBind[0][0])&&power?battery1=item.voltage*item.electric_current:null
    })

    var battery2;
    item.oarr&&item.oarr.forEach(item=>{
      (item.battery_id==batteryBind[0][1])&&capacity?battery2=item.capacity:
      (item.battery_id==batteryBind[0][1])&&electric_current?battery2=item.electric_current:
      (item.battery_id==batteryBind[0][1])&&temperature?battery2=item.temperature:
      (item.battery_id==batteryBind[0][1])&&voltage?battery2=item.voltage:
      (item.battery_id==batteryBind[0][1])&&power?battery2=item.voltage*item.electric_current:null
    })

    var battery3;
    item.oarr&&item.oarr.forEach(item=>{
      (item.battery_id==batteryBind[0][2])&&capacity?battery3=item.capacity:
      (item.battery_id==batteryBind[0][2])&&electric_current?battery3=item.electric_current:
      (item.battery_id==batteryBind[0][2])&&temperature?battery3=item.temperature:
      (item.battery_id==batteryBind[0][2])&&voltage?battery3=item.voltage:
      (item.battery_id==batteryBind[0][2])&&power?battery3=item.voltage*item.electric_current:null
    })

    var battery4;
    item.oarr&&item.oarr.forEach(item=>{
      (item.battery_id==batteryBind[0][3])&&capacity?battery4=item.capacity:
      (item.battery_id==batteryBind[0][3])&&electric_current?battery4=item.electric_current:
      (item.battery_id==batteryBind[0][3])&&temperature?battery4=item.temperature:
      (item.battery_id==batteryBind[0][3])&&voltage?battery4=item.voltage:
      (item.battery_id==batteryBind[0][3])&&power?battery4=item.voltage*item.electric_current:null
    })

    var battery5;
    item.oarr&&item.oarr.forEach(item=>{
      (item.battery_id==batteryBind[0][4])&&capacity?battery5=item.capacity:
      (item.battery_id==batteryBind[0][4])&&electric_current?battery5=item.electric_current:
      (item.battery_id==batteryBind[0][4])&&temperature?battery5=item.temperature:
      (item.battery_id==batteryBind[0][4])&&voltage?battery5=item.voltage:
      (item.battery_id==batteryBind[0][4])&&power?battery5=item.voltage*item.electric_current:null
    })

    var battery6;
    item.oarr&&item.oarr.forEach(item=>{
      (item.battery_id==batteryBind[0][5])&&capacity?battery6=item.capacity:
      (item.battery_id==batteryBind[0][5])&&electric_current?battery6=item.electric_current:
      (item.battery_id==batteryBind[0][5])&&temperature?battery6=item.temperature:
      (item.battery_id==batteryBind[0][5])&&voltage?battery6=item.voltage:
      (item.battery_id==batteryBind[0][5])&&power?battery6=item.voltage*item.electric_current:null
    })

    return (
      <Row style={rowStyle}>
        {/* 时间 */}
        <Cell style={styles.cell} width={2}>
          {item.my_timestamp}
        </Cell>

        {
          CapacityPower?
          <Cell width={0}/>:
          detectorTemperature?
          <Cell width={0}/>:detectorVoltageCurrent?
          <Cell style={styles.cell} width={1}>
            {item.voltage}
          </Cell>:charger?  //充电器电压
          <Cell style={styles.cell} width={1}>
            {item.voltage}
          </Cell>:
          capacity&&batteryBind[0].length>=1?//电池1
          <Cell style={styles.cell} width={1}>
            {battery1}
          </Cell>:
          electric_current&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {battery1}
          </Cell>:
          temperature&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {battery1}
          </Cell>:
          voltage&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {battery1}
          </Cell>:
          power&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {battery1}
          </Cell>:
          <Cell width={0}/>
        }

        {
          CapacityPower?
          <Cell width={0}/>:
          detectorTemperature?
          <Cell width={0}/>:
          detectorVoltageCurrent?
          <Cell style={styles.cell} width={1}>
            {item.electric_current} 
          </Cell>:
          charger?  //充电器电流
          <Cell style={styles.cell} width={1}>
            {item.electric_current} 
          </Cell>:
          capacity&&batteryBind[0].length>=2?//电池2
          <Cell style={styles.cell} width={1}>
            {battery2}
          </Cell>:
          electric_current&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {battery2}
          </Cell>:
          temperature&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {battery2}
          </Cell>:
          voltage&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {battery2}
          </Cell>:
          power&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {battery2}
          </Cell>:
          <Cell width={0}/>
        }
        
        {
          CapacityPower?
          <Cell width={0}/>:
          detectorTemperature?//检测仪电路板温度
          <Cell style={styles.cell} width={1}>
            {item.BoardTemperature}
          </Cell>:
          detectorVoltageCurrent?
          <Cell width={0}/>:charger?    //充电器温度
          <Cell style={styles.cell} width={1}>
            {item.chargerTemperature}
          </Cell>:
          capacity&&batteryBind[0].length>=3?//电池3
          <Cell style={styles.cell} width={1}>
            {battery3}
          </Cell>:
          electric_current&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {battery3}
          </Cell>:
          temperature&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {battery3}
          </Cell>:
          voltage&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {battery3}
          </Cell>:
          power&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {battery3}
          </Cell>:
          <Cell width={0}/>
        }

        {
          CapacityPower?//充电器检测仪容量
          <Cell style={styles.cell} width={1}>
            {item.capacity}
          </Cell>:
          detectorTemperature?//检测仪环境温度
          <Cell style={styles.cell} width={1}>
            {item.AmbientTemperature}
          </Cell>:
          detectorVoltageCurrent?
          <Cell width={0}/>:
          charger? //充电器容量
          <Cell style={styles.cell} width={1}>
            {item.capacity}
          </Cell>:
          capacity&&batteryBind[0].length>=4?//电池4
          <Cell style={styles.cell} width={1}>
            {battery4}
          </Cell>:
          electric_current&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {battery4}
          </Cell>:
          temperature&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {battery4}
          </Cell>:
          voltage&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {battery4}
          </Cell>:
          power&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {battery4}
          </Cell>:
          <Cell width={0}/>
        }

        {
          CapacityPower?
          <Cell style={styles.cell} width={1}>
            {(item.voltage)*(item.electric_current)}
          </Cell>:
          detectorTemperature?
          <Cell width={0}/>:
          detectorVoltageCurrent?
          <Cell width={0}/>:
          capacity&&batteryBind[0].length>=5?//电池5
          <Cell style={styles.cell} width={1}>
            {battery5}
          </Cell>:
          electric_current&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {battery5}
          </Cell>:
          temperature&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {battery5}
          </Cell>:
          voltage&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {battery5}
          </Cell>:
          power&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {battery5}
          </Cell>:
          <Cell width={0}/>
        }

        {
          CapacityPower?
          <Cell width={0}/>:
          detectorTemperature?
          <Cell width={0}/>:
          detectorVoltageCurrent?
          <Cell width={0}/>:
          capacity&&batteryBind[0].length>=6?//电池6
          <Cell style={styles.cell} width={1}>
            {battery6}
          </Cell>:
          electric_current&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {battery6}
          </Cell>:
          temperature&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {battery6}
          </Cell>:
          voltage&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {battery6}
          </Cell>:
          power&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {battery6}
          </Cell>:
          <Cell width={0}/>
        }

        {/* <Cell style={styles.cell} width={1}>
          {charger==0?item.electric_current:localData[0][0].voltage&&localData[0][0].electric_current?
            (item.voltage*item.electric_current).toFixed(2):localData[0][0].voltage?
            item.voltage:localData[0][0].temperature?
            item.temperature:localData[0][0].electric_current?
            item.electric_current:localData[0][0].capacity?item.capacity:
            ''} 
        </Cell> */}

      </Row>
    );
  }

  onCheckablePress() {}

  onColumnSort() {
  }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      backgroundColor: 'white',
    },
    headerCell: {
      height: 40,
      borderBottomWidth: 1,
      backgroundColor: 'white',
      borderColor: 'gray',
      justifyContent: 'center',
    },
    cell: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    alignTextLeft: {
      marginLeft: 20,
      textAlign: 'left',
    },
    whiteRow: {
      height: 35,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderColor: 'gray',
    },
    row: {
      height: 35,
      borderBottomWidth: 1,
      borderColor: 'gray',
    },
    alignTextCenter: {
      textAlign: 'center',
      justifyContent: 'center',
    },
  });