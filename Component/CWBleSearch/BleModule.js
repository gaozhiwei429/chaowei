import { BleManager  } from 'react-native-ble-plx';

export default class BleModule{
    constructor(){
        this.manager = new BleManager();
        this.isConnecting = false;  //蓝牙是否连接
    }

     /**
     * 搜索蓝牙
     * */
    scan(){
        return new Promise( (resolve, reject) =>{
            this.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    // console.log('startDeviceScan error:',error)
                    if(error.errorCode == 102){
                        this.alert('请打开手机蓝牙后再搜索');
                    }
                    reject(error);            
                }else{
                    resolve(device);                        
                }              
            })
        });
    }
    
    /**      
     * 停止搜索蓝牙
     * */
    stopScan(){
        this.manager.stopDeviceScan();
        console.log('stopDeviceScan');
    }

    /**
     * 连接蓝牙
     * */
    connect(id){
        console.log('isConneting:',id);      
        this.isConnecting = true;  
        return new Promise( (resolve, reject) =>{
            this.manager.connectToDevice(id)
                .then(device=>{                           
                    console.log('connect success:',device.name,device.id);    
                    this.peripheralId = device.id;       
                    // resolve(device);
                    return device.discoverAllServicesAndCharacteristics();
                })
                .then(device=>{
                    return this.fetchServicesAndCharacteristicsForDevice(device)
                })
                .then(services=>{
                    console.log('fetchServicesAndCharacteristicsForDevice',services);    
                    this.isConnecting = false;
                    this.getUUID(services);     
                    resolve();                           
                })
                .catch(err=>{
                    this.isConnecting = false;
                    console.log('connect fail: ',err);
                    reject(err);                    
                })
        });
    }

    /**
     * 断开蓝牙
     * */
    disconnect(){
        return new Promise( (resolve, reject) =>{
            this.manager.cancelDeviceConnection(this.peripheralId)
                .then(res=>{
                    console.log('disconnect success',res);
                    resolve(res);
                })
                .catch(err=>{
                    reject(err);
                    console.log('disconnect fail',err);
                })     
        });
    }

     /**
     * 读取数据 
     * */
    read(index){
        return new Promise( (resolve, reject) =>{
            this.manager.readCharacteristicForDevice(this.peripheralId,this.readServiceUUID[index], this.readCharacteristicUUID[index])
                .then(characteristic=>{                    
                    let buffer = Buffer.from(characteristic.value,'base64');  
                    let value = buffer.toString();                 
                    console.log('read success',value);
                    // console.log('read success',characteristic.value);
                    resolve(value);     
                },error=>{
                    console.log('read fail: ',error);
                    this.alert('read fail: ' + error.reason);
                    reject(error);
                })
        });
    }

    /**
     * 卸载蓝牙管理器
     * */
    destroy(){
        this.manager.destroy();
    }

}