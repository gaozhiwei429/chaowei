import { AppRegistry ,YellowBox} from 'react-native';
import App from './App';

// 如果不是开发模式，将所有影响性能的console重写为空函数
if (!__DEV__) {
    global.console = {
        info: () => {},
        log:() => {},
        warn:() => {},
        error:() => {}
    };
}

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader','Module RNFetchBlob']);
AppRegistry.registerComponent('chaoWei', () => App);
