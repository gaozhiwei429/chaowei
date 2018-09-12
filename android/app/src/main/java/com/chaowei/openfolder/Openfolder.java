package com.chaowei.openfolder;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.net.Uri;

public class Openfolder extends ReactContextBaseJavaModule {
    
    private Context mContext;

    //构造方法
    public Openfolder(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        // 需要此名字来调用该类方法
        return "Openfolder";
    }

    @ReactMethod
    public void open() {  //String path
        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri uri = Uri.parse("/storage/emulated/0/Android/data/com.chaowei/files/");
        intent.setDataAndType(uri, "resource/folder");
        mContext.startActivity(Intent.createChooser(intent, "Open folder"));
    }
}
