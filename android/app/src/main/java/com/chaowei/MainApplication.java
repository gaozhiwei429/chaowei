package com.chaowei;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import com.polidea.reactnativeble.BlePackage;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import it.innove.BleManagerPackage;
import org.reactnative.camera.RNCameraPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.theweflex.react.WeChatPackage;

import java.util.Arrays;
import java.util.List;

import com.chaowei.alipay.AlipayPackage;
import com.chaowei.blebroadcast.BleBroadcastPackage;
import com.chaowei.openfolder.OpenfolderPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new SplashScreenReactPackage(),
          new AMap3DPackage(),
          new BlePackage(),
          new SvgPackage(),
          new RNDeviceInfo(),
          /*把视图控制器注册到应用中*/
          new FlashLightPackage(),
          new BleBroadcastPackage(),
          new BleManagerPackage(),
          new RNCameraPackage(),
          new VectorIconsPackage(),
          new SQLitePluginPackage(),   // register SQLite Plugin here
          new WeChatPackage(),
          new AlipayPackage(),
          new OpenfolderPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}