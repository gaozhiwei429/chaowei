import React from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
import Homescreen from '../CWHome/CWHome';
// import TABscreen from '../CWSvg/TAB';
import PresentationDatascreen from '../presentationData/PresentationData';//数据
import Buttonscreen from '../CWButton/CWButton';  

const tabBarConfig = {
    Home: {
        label: '首页',
        icon: 'home',
    },
    Tab:{
        label:'数据',
        icon:'stats'
    },
    More: {
        label: '更多',
        icon: 'list',
    },
};

const Tabs = createBottomTabNavigator(
    {
        Home: { screen: Homescreen },
        Tab: {screen:PresentationDatascreen},  
        More: { screen: Buttonscreen },
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: tabBarConfig[navigation.state.routeName].label,
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                const { icon } = tabBarConfig[routeName];
                const iconName = `ios-${icon}${focused ? '' : '-outline'}`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#3BB6FF',
            inactiveTintColor: 'gray',
        },
    }
);

Tabs.navigationOptions = ({ navigation }) => {
    const { routes, index } = navigation.state;
    const navigationOptions = {};

    // here's an example, but you can dynamically define title
    // however you like given `routes` & `index`

    if (routes[index].routeName === 'Home') {
        navigationOptions.headerTitle=(
            <Text style={{fontSize:20,flex:1, textAlign: 'center'}}>首页</Text>
            );
            navigationOptions.headerStyle={
                height:40,
            };
        navigationOptions.headerLeft=(
            <View/>  
        );
        navigationOptions.headerRight=(
            <TouchableOpacity style={{paddingRight:15} } onPress={()=>navigation.navigate('CWQRCode')}>
                <Image style={{width:20,height:20,}} source={require('../../img/saomiao01.png')}/>
            </TouchableOpacity>
        );
        navigationOptions.headerTitleStyle={
            alignSelf:'center',//居中显示
        }
    }else if(routes[index].routeName === 'More'){
        navigationOptions.headerTitle=(
            <Text style={{fontSize:20,flex:1, textAlign: 'center'}}>更多</Text>
        );
        navigationOptions.headerStyle={
            height:40
        };
        navigationOptions.headerTitleStyle={
            alignSelf:'center',//居中显示
        }
    }else if(routes[index].routeName === 'Tab'){
        navigationOptions.headerTitle=(
            <Text style={{fontSize:20,flex:1, textAlign: 'center'}}>数据</Text>
        );
        navigationOptions.headerStyle={
            height:40
        };
        navigationOptions.headerTitleStyle={
            alignSelf:'center',//居中显示
            color:'#00f'
        }
    }

    return navigationOptions;
};
export default Tabs;