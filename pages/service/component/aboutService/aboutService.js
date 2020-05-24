// abountService.js
const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myList1: [{
        url: imgUrl + "法律服务.png",
        text: "法律服务"
      },
      {
        url: imgUrl + "租赁服务.png",
        text: "租赁服务"
      },
      {
        url: imgUrl + "金融保险.png",
        text: "金融/保险"
      },
      {
        url: imgUrl + "科技服务.png",
        text: "科技服务"
      },
      {
        url: imgUrl + "餐饮及住宿.png",
        text: "餐饮及住宿"
      },
      {
        url: imgUrl + "医疗健康.png",
        text: "医疗健康"
      },
      {
        url: imgUrl + "商务服务.png",
        text: "商务服务"
      },
      {
        url: imgUrl + "体育文娱.png",
        text: "体育文娱"
      },
      {
        url: imgUrl + "教育培训.png",
        text: "教育培训"
      },
      {
        url: imgUrl + "美业.png",
        text: "美业"
      },
      {
        url: imgUrl + "居民服务.png",
        text: "居民服务业"
      },
      {
        url: imgUrl + "加工服务业.png",
        text: "加工服务业"
      },
      {
        url: imgUrl + "仓储运输.png",
        text: "仓储运输"
      },
      {
        url: imgUrl + "房地产.png",
        text: "房地产"
      }

    ],
    myList2: [{
        url: "",
        text: "仓储运输"
      },
      {
        url: "",
        text: "房地产"
      }
    ],
    myList3: [{
        url: imgUrl + "诚意金拍单.png",
        text: "诚意金拍单"
      },
      {
        url: imgUrl + "预付定金拍单.png",
        text: "预付定金拍单"
      },
      {
        url: imgUrl + "一次性付款.png",
        text: "一次性付款"
      },
      {
        url: imgUrl + "押金+分期付.png",
        text: "押金+分期付"
      },
      {
        url: imgUrl + "按分钟结算.png",
        text: "按分钟结算"
      },
      {
        url: imgUrl + "按小时结算.png",
        text: "按小时结算"
      },
      {
        url: imgUrl + "按天结算.png",
        text: "按天结算"
      },
      {
        url: imgUrl + "按月结算.png",
        text: "按月结算"
      },
      {
        url: imgUrl + "价格动态计算.png",
        text: "价格动态计算"
      },
      {
        url: imgUrl + "服务时间预约.png",
        text: "服务时间预约"
      },
      {
        url: imgUrl + "在线提问.png",
        text: "在线提问"
      },
      {
        url: imgUrl + "线上服务.png",
        text: "线上服务"
      },
      {
        url: imgUrl + "上门服务.png",
        text: "上门服务"
      },
      {
        url: imgUrl + "到店服务.png",
        text: "到店服务"
      },
      {
        url: imgUrl + "代跑腿.png",
        text: "代跑腿"
      }

    ],
    productImg1: imgUrl + '关于服务功能1.png',
    productImg2: imgUrl + '关于服务功能2.png',
    productImg3: imgUrl + '关于服务功能3.png',
    productImg4: imgUrl + '关于服务功能4.png',
    zmCardShare: 3,
    clientImg: imgUrl + '客服悬浮按.png',
    lineImg: imgUrl + 'line.png',
    loginState: false, //控制登录页面显示隐藏,
    isFirst: false,
    previousTimer: 0,
    flag: true,
    onlineServiceFlag: true,
    link: '/pages/component/getPhone/getPhone'

  },
  //点击微信登录成功回调
  onMyEvent(e) {
    if (!this.data.isFirst) {
      this.linkToAdd();
      this.setData({
        loginState: e.detail.loginState,
        flag: true
      })
    }
  },
  //在线客服
  onlineService() {
    if (this.data.onlineServiceFlag) {
      this.setData({
        onlineServiceFlag: false
      })
      let url;
      let _this = this;
      //获取fRecordId
      wx.request({
        url: 'https://m.zuma.com/z-chat/wap/skip/zm_service',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          fIsUrgency: 0,
          fTitle: '会员咨询'
        },
        success: function (res) {
          if (res.data.status === 0) {
            _this.setData({
              onlineServiceFlag: true
            })
            if (res.data.recordId) {
              url = 'https://m.zuma.com/mobMemberCenter/memberConsultDetail?fRecordId=' + res.data.recordId;
              wx.navigateTo({
                url: '/pages/webview/webview?url=' + encodeURIComponent(url)
              })
            }
          }

        }
      })
    }

  },
  //跳转添加页面
  linkToAdd() {
    let _this = this;
    var token = wx.getStorageSync('token').token;
    var zmtoken = wx.getStorageSync('zmToken');
    var zmcookie = wx.getStorageSync('token').zmCookie;
    var newZmToken;
    let domain, url;
    if (api.indexOf('pre') != -1) {
      domain = 'https://m.pre-zuma.com'
    } else {
      domain = 'https://m.zuma.com'
    }

    wx.request({
      url: api + 'manage-api/resource/carduser/loginZmToken',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: {
        zmtoken: zmtoken,
        zmcookie: zmcookie
      },
      success: (res) => {
        if (res.data.status == 404) {
          _this.setData({
            loginState: true
          })
        } else {
          newZmToken = res.data.data.zmToken;
          wx.setStorage({
            key: "zmToken",
            data: newZmToken
          })
          _this.setData({
            flag: true
          })
          url = domain + '/addmain/0_0_0?zmsource=2&zmToken=' + newZmToken

          wx.navigateTo({
            url: '/pages/webview/webview?url=' + encodeURIComponent(url)
          })
        }

      }
    })
  },
  //点击发布产品
  pubProduct() {
    var token = wx.getStorageSync('token').token;
    if (this.data.flag) {
      this.setData({
        flag: false
      })
      if (token) {
        this.linkToAdd()
      } else {
        this.setData({
          loginState: true,
          isFirst: false,
          flag:true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '关于发布服务',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    return {
      title: "使用族蚂名片发布服务",
      path: "/pages/service/service?zmCardShare=" + this.data.zmCardShare,
      imageUrl: imgUrl + '服务.png'
    }
  }
})