import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
} from 'react-native';
import PopupDialog, { SlideAnimation ,DialogTitle ,DialogButton } from 'react-native-popup-dialog';
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const {width,height} = Dimensions.get('window');

export default class Alert extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title="Show Dialog"
                    onPress={() => {
                        this.popupDialog.show();
                    }}
                />
                <PopupDialog
                    width={300}
                    height={200}
                    dialogTitle={<DialogTitle title="提示" />}
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    actions={
                        [<DialogButton
                            text="确定"
                            align="center"
                            textStyle={{fontSize:17}}
                            buttonStyle={{ width:300 }}
                            onPress={() => this.popupDialog.dismiss()}
                            key
                        />]
                    }
                    dismissOnTouchOutside={false}
                >
                    <View style={{height:88,justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:'#F5F5F5'}}>
                        <Text>请绑定充电器</Text>
                    </View>
                </PopupDialog>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container:{

    },
});

