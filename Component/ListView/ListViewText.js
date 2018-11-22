import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    ScrollView,
} from 'react-native';

export default class ListViewText extends Component {

    _renderItem = (item) => {
        alert(JSON.stringify(item))
        var txt = '第' + item.index + '个' + ' title=' + item.item.title;
        var bgColor = item.index % 2 == 0 ? 'red' : 'blue';
        return <Text onPress={()=>{ alert(item.index) }} style={[{flex:1,height:100,},styles.txt]}>{txt}</Text>
    }

    // _header = () => {
    //     return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是头部</Text>;
    // }//头部组件

    // _footer = () => {
    //     return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是尾部</Text>;
    // }//尾部组件

    _separator = () => {
        return <View style={{backgroundColor:'#fff',paddingLeft:15}}/>;
    }

    render() {
        var data = [];
        for (var i = 0; i < 4; i++) {
            data.push({key: i+'', title: i + ''});
        }
        // alert(JSON.stringify(data))
        return (
            <ScrollView style={{flex:1}}>
                {/* <Button title='滚动到指定位置' onPress={()=>{
                    this._flatList.scrollToEnd();
                    this._flatList.scrollToIndex({viewPosition:0,index:8});
                    this._flatList.scrollToOffset({animated: true, offset: 2000});
                }}/> */}
                <View style={{flex:1,}}>
                    <FlatList
                        ref={(flatList)=>this._flatList = flatList}
                        // ListHeaderComponent={this._header}//头部组件
                        // ListFooterComponent={this._footer}//尾部组件
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem}

                        //numColumns ={3}
                        //columnWrapperStyle={{borderWidth:2,borderColor:'black',paddingLeft:20}}

                        horizontal={true}

                        //getItemLayout={(data,index)=>(
                        //{length: ITEM_HEIGHT, offset: (ITEM_HEIGHT+2) * index, index}
                        //)}

                        //onEndReachedThreshold={5}
                        //onEndReached={(info)=>{
                        //console.warn(info.distanceFromEnd);
                        //}}

                        //onViewableItemsChanged={(info)=>{
                        //console.warn(info);
                        //}}
                        data={data}>
                    </FlatList>
                </View> 
                
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 30,
    }
});
