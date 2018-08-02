import React from 'react';
import {

} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
import Homescreen from '../CWHome/CWHome';
import TABscreen from '../CWSvg/TAB';
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
        Tab:{screen:TABscreen},
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
        navigationOptions.title = '首页';
            navigationOptions.headerStyle={
                height:0
            }
    }else if(routes[index].routeName === 'More'){
        navigationOptions.title = '更多';
            navigationOptions.headerStyle={
                height:40
            }
    }else if(routes[index].routeName === 'Tab'){
        navigationOptions.title = '数据';
            navigationOptions.headerStyle={
                height:40
            }
    }

    return navigationOptions;
};
export default Tabs;