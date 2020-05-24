// pages/scan/addLable/addLable.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
let getLocation = function (that, searchKey) {
  wx.getLocation({
    type: 'gcj02',
    success: function (loc) {
      if (loc.errMsg == 'getLocation:ok') {
        wx.navigateTo({
          url: '/pages/radarloading/radarloading?dataValue=' + searchKey + '&longitude=' + loc.longitude + '&latitude=' + loc.latitude
        });
      }
    },
    fail: function (result) {}
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    pageloading: false,
    loginState: false,
    loc: '',
    previousTimer: null,
    link: '/pages/component/getPhone/getPhone'
  },
  // 开启雷达触摸事件
  openRadar() {
    // 防止多次点击
    let previous = this.data.previousTimer
    let now = +new Date(); //1970 1.1 到现在的毫秒数 Date.now()
    if (now - previous > 2000) {
      this.setData({
        previousTimer: now
      })
      let _this = this;
      var searchKey = this.data.inputValue.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); //过滤掉前后空格拿到当前输入的内容;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userLocation'] == undefined) {
            //没有进行过授权验证
            getLocation(_this, searchKey);
          } else {
            //进行过授权验证拒绝获取地理位置
            if (res.authSetting['scope.userLocation'] != true) {
              wx.openSetting({
                success: function (data) {
                  if (data.authSetting["scope.userLocation"] !== true) {
                    return
                  }
                }
              })
            } else {
              getLocation(_this, searchKey);
            }
          }
        }
      })
    }
  },
  //超出50字符截取
  bindReplaceInput(e) {
    let str = e.detail.value;
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      let element = str[i];
      length = /[^\x00-\xff]/g.test(element) ? length + 2 : length + 1
      if (length == 51 || length == 52) {
        str = str.substring(0, i)
      }
    }
    this.setData({
      inputValue: str
    })
    return {
      value: str
    }


  },
  onMyEvent(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var token = wx.getStorageSync('token').token;
    if (!token) {
      this.setData({
        loginState: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      pageloading: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var shareObj = {
      title: "族蚂名片关键字搜索功能，精准找到附近的生意人",
      path: "/pages/radar/radar",
      imageUrl: imgUrl + 'leida-biaoqian.png'
    }
    return shareObj;
  }
})