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
      ds: this.ds.cloneWithRows(...localData),
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }


  async componentDidMount(){
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
      
      this.setState({
        batteryBind
      })

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
    const { localData,charger,batteryBind, } = params;

    return (
      <Header>
        <HeaderCell
          style={styles.headerCell}
          key="0"
          text="时间"
          width={2}
        />
        
        {charger==0?
          <HeaderCell
            style={styles.headerCell}
            key="1"
            text='电压'
            width={1}
            isAscending={false}
          />:batteryBind[0].length>=1?
          <HeaderCell
            style={styles.headerCell}
            key="2"
            text='电池1'
            width={1}
            isAscending={false}
          />:<HeaderCell width={0}/>
          }
        
        {charger==0?
          <HeaderCell
            style={styles.headerCell}
            key="3"
            // text={charger==0?'电流':localData[0][0].voltage&&localData[0][0].electric_current?'功率':localData[0][0].voltage?'电压':localData[0][0].temperature?'温度':localData[0][0].electric_current?'电流':localData[0][0].capacity?'容量':''}
            text={'电流'}
            width={1}
            isAscending={false}
          />:batteryBind[0].length>=2?
          <HeaderCell
            style={styles.headerCell}
            key="4"
            text='电池2'
            width={1}
            isAscending={false}
          />:<HeaderCell width={0}/>
        }

        {charger==0?
          <HeaderCell
          style={styles.headerCell}
          key="5"
          text='温度'
          width={1}
        />:batteryBind[0].length>=3?
        <HeaderCell
          style={styles.headerCell}
          key="6"
          text='电池3'
          width={1}
          isAscending={false}
        />:<HeaderCell width={0}/>
      }

        {charger==0?
          <HeaderCell
          style={styles.headerCell}
          key="7"
          text='容量'
          width={1}
        />:batteryBind[0].length>=4?
        <HeaderCell
          style={styles.headerCell}
          key="8"
          text='电池4'
          width={1}
          isAscending={false}
        />:<HeaderCell width={0}/>
      }

      {charger==0?<HeaderCell width={0}/>:
        batteryBind[0].length>=5?
        <HeaderCell
          style={styles.headerCell}
          key="9"
          text='电池5'
          width={1}
          isAscending={false}
        />:<HeaderCell width={0}/>
      }

      {
        charger==0?<HeaderCell width={0}/>:
        batteryBind[0].length>=6?
        <HeaderCell
          style={styles.headerCell}
          key="10"
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
    const { charger,batteryBind,capacity,electric_current,temperature,voltage,power } = params;
    return (
      <Row style={rowStyle}>
        {/* 时间 */}
        <Cell style={styles.cell} width={2}>
          {item.my_timestamp}
        </Cell>

        {charger==0?  //充电器电压
          <Cell style={styles.cell} width={1}>
            {item.voltage}
          </Cell>:
          capacity===true&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][0]==item.battery_id?item.capacity:null}
          </Cell>:
          electric_current===true&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][0]==item.battery_id?item.electric_current:null}
          </Cell>:
          temperature===true&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][0]==item.battery_id?item.temperature:null}
          </Cell>:
          voltage===true&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][0]==item.battery_id?item.voltage:null}
          </Cell>:
          power===true&&batteryBind[0].length>=1?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][0]==item.battery_id?item.voltage*item.electric_current:null}
          </Cell>:
          <Cell width={0}/>
        }

        {charger==0?  //充电器温度
          <Cell style={styles.cell} width={1}>
            {item.electric_current} 
          </Cell>:
          capacity===true&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][1]==item.battery_id?item.capacity:null}
          </Cell>:
          electric_current===true&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][1]==item.battery_id?item.electric_current:null}
          </Cell>:
          temperature===true&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][1]==item.battery_id?item.temperature:null}
          </Cell>:
          voltage===true&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][1]==item.battery_id?item.voltage:null}
          </Cell>:
          power===true&&batteryBind[0].length>=2?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][1]==item.battery_id?item.voltage*item.electric_current:null}
          </Cell>:
          <Cell width={0}/>
        }
        
        {charger==0?    //充电器电流
          <Cell style={styles.cell} width={1}>
            {item.chargerTemperature}
          </Cell>:
          capacity===true&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][2]==item.battery_id?item.capacity:null}
          </Cell>:
          electric_current===true&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][2]==item.battery_id?item.electric_current:null}
          </Cell>:
          temperature===true&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][2]==item.battery_id?item.temperature:null}
          </Cell>:
          voltage===true&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][2]==item.battery_id?item.voltage:null}
          </Cell>:
          power===true&&batteryBind[0].length>=3?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][2]==item.battery_id?item.voltage*item.electric_current:null}
          </Cell>:
          <Cell width={0}/>
        }

        {charger==0?    //充电器容量
          <Cell style={styles.cell} width={1}>
            {item.capacity}
          </Cell>:
          capacity===true&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][3]==item.battery_id?item.capacity:null}
          </Cell>:
          electric_current===true&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][3]==item.battery_id?item.electric_current:null}
          </Cell>:
          temperature===true&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][3]==item.battery_id?item.temperature:null}
          </Cell>:
          voltage===true&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][3]==item.battery_id?item.voltage:null}
          </Cell>:
          power===true&&batteryBind[0].length>=4?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][3]==item.battery_id?item.voltage*item.electric_current:null}
          </Cell>:
          <Cell width={0}/>
        }

        {capacity===true&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][4]==item.battery_id?item.capacity:null}
          </Cell>:
          electric_current===true&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][4]==item.battery_id?item.electric_current:null}
          </Cell>:
          temperature===true&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][4]==item.battery_id?item.temperature:null}
          </Cell>:
          voltage===true&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][4]==item.battery_id?item.voltage:null}
          </Cell>:
          power===true&&batteryBind[0].length>=5?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][4]==item.battery_id?item.voltage*item.electric_current:null}
          </Cell>:
          <Cell width={0}/>
        }

        {capacity===true&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][5]==item.battery_id?item.capacity:null}
          </Cell>:
          electric_current===true&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][5]==item.battery_id?item.electric_current:null}
          </Cell>:
          temperature===true&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][5]==item.battery_id?item.temperature:null}
          </Cell>:
          voltage===true&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][5]==item.battery_id?item.voltage:null}
          </Cell>:
          power===true&&batteryBind[0].length>=6?
          <Cell style={styles.cell} width={1}>
            {batteryBind&&batteryBind[0][5]==item.battery_id?item.voltage*item.electric_current:null}
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