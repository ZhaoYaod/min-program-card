//app.js
var poxy = require('poxy.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

    // 获取设备顶部窗口的高度（不同设备窗口高度不一样）
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight;
        if(res.model.indexOf('iPhone X') != -1 || res.model.indexOf('iPhone 11') != -1){
          this.globalData.model = 1;
        }
        // console.log('res.statusBarHeight',res)
      }
    })
  },
  globalData: {
    model:'',
    userInfo: null,
    height:0,
    // playIndex: 0, //hgj当前播放列表的index
    // currentTime: 0, //hgj当前播放时间
    // duration: 0, //hgj总时长
    // poxy: poxy.dev,//dev为开发环境,prod为生产环境,pd为生产环境,上传前修改参数
    poxy: poxy.prod,//dev为开发环境,prod为预生产环境,pd为生产环境,上传前修改参数
    // poxy: poxy.pd//dev为开发环境,prod为生产环境,pd为生产环境,上传前修改参数
  }
})