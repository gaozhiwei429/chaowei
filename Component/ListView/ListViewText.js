import React, {Component} from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    SectionList
} from "react-native";

export default class Listiew extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2  });
        this.state = {
            dataSource: ds.cloneWithRows(data)
        }
    }

    render() {
        const overrideRenderItem = ({ item, index, section: { title, data } }) => <Text key={index}>Override{item}</Text>
        return (
            <View style={styles.container}>
                <SectionList
                    renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                    sections={[
                        { title: 'Title1', data: ['item1', 'item2'] },
                        { title: 'Title2', data: ['i em3', 'item4'] },
                        { title: 'Title3', data: ['item5', 'item6'] },
                    ]}
                />
            </View>
        )
    }

    _renderRow = (rowData) => {
        return (
            <View style={styles.cellContainer} onPress={() => {}}>
                <Text style={styles.title}>{rowData.title}</Text>
                <Text style={styles.title}>{rowData.title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cellContainer: {
        borderBottomWidth: 1,
        borderColor: '#dcdcdc',
        flexDirection:'row',
        alignItems:'center',
        padding:15
    },
    image: {
        width: 50,
        height: 50,
    },
    title: {
        marginLeft: 15,
    }
});