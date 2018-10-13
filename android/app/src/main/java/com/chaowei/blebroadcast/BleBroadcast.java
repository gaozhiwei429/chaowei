package com.chaowei.blebroadcast;

import android.app.Activity;
import android.widget.Toast;
import android.content.Context;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContext;
import android.os.ParcelUuid;
import com.facebook.react.bridge.Callback;
import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class BleBroadcast extends ReactContextBaseJavaModule {
    private BluetoothManager bluetoothManager;
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeAdvertiser mBluetoothLeAdvertiser;
    private Context context;

    public BleBroadcast(ReactApplicationContext reactContext) {
        super(reactContext);

        context = reactContext;
        // reactContext.addActivityEventListener(this);
    }

    private BluetoothAdapter getBluetoothAdapter() {
        if (bluetoothAdapter == null) {
            BluetoothManager manager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
            bluetoothAdapter = manager.getAdapter();
        }
        return bluetoothAdapter;
    }

    // private BluetoothManager getBluetoothManager() {
    // if (bluetoothManager == null) {
    // bluetoothManager = (BluetoothManager)
    // context.getSystemService(Context.BLUETOOTH_SERVICE);
    // }
    // return bluetoothManager;
    // }

    @Override
    public String getName() {
        return "BleBroadcast";
    }

    @ReactMethod
    public void start(String str2, String str, Callback error) {

        if (getBluetoothAdapter() == null) {
            toast("蓝牙不支持");
            return;
        }

        if (!bluetoothAdapter.isEnabled()) {
            // toast("请打开蓝牙开关");
            // error.invoke(true);
            return;
        }

        if (!bluetoothAdapter.isMultipleAdvertisementSupported()) {
            // toast("当前手机不支持蓝牙广播1");// BLE Advertise
            error.invoke(true);
            return;
        }
        mBluetoothLeAdvertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
        if (mBluetoothLeAdvertiser == null) {
            // toast("当前手机不支持蓝牙广播2");
            error.invoke(true);
            return;
        }

        AdvertiseSettings advertiseSettings = createAdvSettings(false, 0);

        if (advertiseSettings == null) {
            // toast("当前手机不支持蓝牙广播");
            error.invoke(true);
            return;
        }

        final byte[] broadcastData = BleBroadcast.hexStringToBytes(str);
        final byte[] broadcastData2 = BleBroadcast.hexStringToBytes(str2);
        mBluetoothLeAdvertiser.stopAdvertising(mAdvertiseCallback);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mBluetoothLeAdvertiser.startAdvertising(createAdvSettings(true, 0),
                        createAdvertiseData(broadcastData, broadcastData2), mAdvertiseCallback);

            }
        });

    }

    @ReactMethod
    public void stop() {
        mBluetoothLeAdvertiser.stopAdvertising(mAdvertiseCallback);
    }

    private void toast(String message) {
        Toast.makeText(getReactApplicationContext(), message, 4000).show();
    }

    public AdvertiseSettings createAdvSettings(boolean connectable, int timeoutMillis) {
        AdvertiseSettings.Builder mSettingsbuilder = new AdvertiseSettings.Builder();
        mSettingsbuilder.setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY);
        mSettingsbuilder.setConnectable(connectable);
        mSettingsbuilder.setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH);
        mSettingsbuilder.setTimeout(0);
        AdvertiseSettings mAdvertiseSettings = mSettingsbuilder.build();
        return mAdvertiseSettings;
    }

    public AdvertiseData createAdvertiseData(byte[] data, byte[] data1) {
        AdvertiseData.Builder mDataBuilder = new AdvertiseData.Builder();

        // mDataBuilder.addServiceUuid(
        // ParcelUuid.fromString("0000ffe1-0000-1000-8000-00805f9b34fb"));
        // mDataBuilder.addServiceData(
        // ParcelUuid.fromString("0000ae8f-0000-1000-8000-00805f9b34fb"),new
        // byte[]{0x64,0x12});

        // int a =data1[0];
        // int b =data1[0]<<8;
        // int h =(data1[0]<<8)+0x01;
        int h = (data1[0]) + (data1[1] << 8);
        // int h =a+b;
        // mDataBuilder.addManufacturerData(data1[1], data);
        mDataBuilder.addManufacturerData(h, data);
        AdvertiseData mAdvertiseData = mDataBuilder.build();
        return mAdvertiseData;
    }

    private AdvertiseCallback mAdvertiseCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            super.onStartSuccess(settingsInEffect);

            // ToastUtils.showToast(MainActivity.this, "开启广播成功", 2000);
        }

        @Override
        public void onStartFailure(int errorCode) {
            super.onStartFailure(errorCode);
            // ToastUtils.showToast(MainActivity.this, "开启广播失败 errorCode：" + errorCode,
            // 2000);
        }
    };

    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        if (hexString.length() % 2 != 0) {
            hexString = "0" + hexString;
        }

        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }

    public static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }
}