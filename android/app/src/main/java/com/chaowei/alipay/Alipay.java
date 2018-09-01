package com.chaowei.alipay;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.alipay.sdk.app.PayTask;
//import com.alipay.sdk.app.EnvUtils;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.chaowei.alipay.util.OrderInfoUtil2_0;

import java.util.Map;

/**
 * Created by admin on 2017/11/3.
 */

public class Alipay  extends ReactContextBaseJavaModule {
    /** 支付宝支付业务：入参app_id */
    public static final String APPID = "2018082761107607";

    /** 商户私钥，pkcs8格式 */
    /** 如下私钥，RSA2_PRIVATE 或者 RSA_PRIVATE 只需要填入一个 */
    /** 如果商户两个都设置了，优先使用 RSA2_PRIVATE */
    /** RSA2_PRIVATE 可以保证商户交易在更加安全的环境下进行，建议使用 RSA2_PRIVATE */
    /** 获取 RSA2_PRIVATE，建议使用支付宝提供的公私钥生成工具生成， */
    /** 工具地址：https://doc.open.alipay.com/docs/doc.htm?treeId=291&articleId=106097&docType=1 */
    public static final String RSA2_PRIVATE = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCgrc0JzhrO6O8JZtmdkgpBmgWkkJCDsUyBi/sBATEGSWVygLoP0W6tUi6SmHewg65ZxPpx0YJzZt5oDjIItZzac/labk8SifMR7tczyM/+8nHErMoq0TiglbAk5/wvNLuvPwZAhHWRD39BYWvy+0udxVqWe8OzHGkMJqow8v1RzaL9BLPY1d/guvwwskl7Lugn3GJB1wwYmV4YTQ3e7yXHoCUbtJHq7Z6PL5D6HpWYz5AgjDiMUWqam44AoqfbTYykDpEtwsUxUoPNb/jdySy2144aJIuo4jbu02mzmSaBqo2bgQkxCrlfNCVSrMOQ1pw/JKFCzJ68c2Neb3CJ2o3PAgMBAAECggEAFlrX8gtI04y45Rf4IuIUpzfknRa35HqgaE2vaF5gEb3YbWvXdyfuPBL5A9BOprJLaZXsOjWp7qBbRSLkdy29Wu9Tu+8o9S1YMiCGtF+2AIR+q5xWrEpblIv+68OS5IZzrlgYaJWFPd9oFxKU0EOCK7svdUxW1+6V9ujSOOk1sVGvW5n8765cfGq8xvPHlxvJccB6s1Ycf8Custh8dBi6R6CCmVjavAkAoGsuPhy5mGLk9L6FAZjRKrlsZfEKwjpCSvZN6+qb5nT1x+5k94zoxA2hfplqKWHyAhl0k6EXBriVUpP5wWumC9XO1MQOrp6VOxMEjg/PWoH1bGJFxjInkQKBgQD2vZU+hwwAgDfup4P7P/rZLOs+N3NNaE/PjczRIR3dg/nQnv/w16qMT2iq4Tp6uT4ge0IFyPybLY86OXDJaFJSxk2Oc378MdlfJbBAeiKyA0IAtaoiYov6drloPlZYG3SdmIBwaspMDfWJtecetDzZ36wfnE6ZwD2ms9fbo9jiqwKBgQCmtW41M9KgsFOgYkBfG7gdMyclnjeAToxsBTemzCjQT+zLl0f4tF8SqJAwA5T+fCoFeJtm7PIEKov8paGX1GCt5kW7EhKZvl49SADxx2GD083/mb3UR4NYCfHzKjG3qak3vgKqQT4jxZjTlJrfBFI5mDvtmgQg4lfEdkQww94hbQKBgQCeROFUqF+Eerpl9UHtig6n++4xjHQDdSOsqPJ2Ot3jV2KI9VSK8mvNcKpc4fgW/HfjcezZtSCDkWfMG0hDiQ01V0osU91ie79JDu3NjgpvUTOnLOAjCj9ru3gWa9YK0iGtbUMF2RpGSrXzTaEgytA1mQnZhPPOH8fsBHQzyRe33QKBgBbNUhms0O5xr76MMcnQfMphqMUYcvb1x3cu74G9AwgbJoRiWNHHuglPTQmEM+jrCsRczsSxPBkdyK/x57xgrCidCoSf4DNvOmyfYKGxZ8EkQ1TmrnROo8Ry98kOyGYaqq6ZKrwm2F0ENfcaqGRArw55qBjDrDTjQKX6lzEkWUmxAoGBAJc7we7Gy6/JvW1ZB6YvNiGNVVaXFFrbabG5L6XRJAG01xJOagsMgSgjonsMXE1KmflnrkfzmGMe4aSGD0PCxnmzJrRoq2u90EHsYsodeujXJ6F/NDFw7PoGyKbDLam1TeYawKxcJMqA9Uc45C63nRYdxIZKT53kol9chTj/raVp";
    public static final String RSA_PRIVATE = "";

    private static final int SDK_PAY_FLAG = 1;
    private Context mContext;
    //构造方法
    public Alipay(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        //EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX);
    }
    @Override
    public String getName() {
        // 需要此名字来调用该类方法
        return "Alipay";
    }
    //函数不能有返回值,被调用的原生代码是异步的,原生代码执行结束之后只能通过回调函数发送消息给RN
    @ReactMethod
    public void pay(Promise promise){
        /**
         * 这里只是为了方便直接向商户展示支付宝的整个支付流程；所以Demo中加签过程直接放在客户端完成；
         * 真实App里，privateKey等数据严禁放在客户端，加签过程务必要放在服务端完成；
         * 防止商户私密数据泄露，造成不必要的资金损失，及面临各种安全风险；
         *
         * orderInfo的获取必须来自服务端；
         */
        boolean rsa2 = (RSA2_PRIVATE.length() > 0);
        Map<String, String> params = OrderInfoUtil2_0.buildOrderParamMap(APPID, rsa2);
        String orderParam = OrderInfoUtil2_0.buildOrderParam(params);

        String privateKey = rsa2 ? RSA2_PRIVATE : RSA_PRIVATE;
        String sign = OrderInfoUtil2_0.getSign(params, privateKey, rsa2);
        final String orderInfo = orderParam + "&" + sign;

        PayTask alipay = new PayTask(getCurrentActivity());
        Map<String, String> result = alipay.payV2(orderInfo, true);
        PayResult payResult = new PayResult(result);
        Log.i("msp", result.toString());
        /**
         对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
         */
        String resultInfo = payResult.getResult();// 同步返回需要验证的信息
        String resultStatus = payResult.getResultStatus();
        // 判断resultStatus 为9000则代表支付成功
        if (TextUtils.equals(resultStatus, "9000")) {
            // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
            // Toast.makeText(mContext, "支付成功", Toast.LENGTH_SHORT).show();
            promise.resolve(resultInfo);
        } else {
            // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
            promise.reject("支付失败", new Exception("支付失败"));
        }


        
       // Runnable payRunnable = new Runnable() {
       //     @Override  
       //     public void run() {
       //         PayTask alipay = new PayTask(getCurrentActivity());
       //         Map<String, String> result = alipay.payV2(orderInfo, true);
       //         PayResult payResult = new PayResult(result);
       //         Log.i("msp", result.toString());f
       //         /**
       //          对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
       //          */
       //         String resultInfo = payResult.getResult();// 同步返回需要验证的信息
       //         String resultStatus = payResult.getResultStatus();
       //         // 判断resultStatus 为9000则代表支付成功
       //         if (TextUtils.equals(resultStatus, "9000")) {
       //             // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
       //             //Toast.makeText(mContext, "支付成功", Toast.LENGTH_SHORT).show();
       //             promise.resolve(resultInfo);
       //         } else {
       //             // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
       //             promise.reject("E_PAYMENT_ERROR", new Exception("E_PAYMENT_ERROR"));
       //         }
       //     }
       // };
       // Thread payThread = new Thread(payRunnable);
       // payThread.start();
    }
}
