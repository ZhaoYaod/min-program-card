const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL
let api = app.globalData.poxy.API_BASE;
// propub/propub/propub.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        'title': '诚意金拍单',
        'url': imgUrl + '诚意金拍单.png'
      },
      {
        'title': '预付定金拍单',
        'url': imgUrl + '预付定金拍单.png'
      },
      {
        'title': '在线签约',
        'url': imgUrl + '在线签约.png'
      },
      {
        'title': '批发分销',
        'url': imgUrl + '批发分销.png'
      },
      {
        'title': '在线砍价',
        'url': imgUrl + '在线砍价.png'
      },
      {
        'title': '同城交易',
        'url': imgUrl + '同城交易.png'
      },
      {
        'title': '价格动态计算',
        'url': imgUrl + '价格动态计算.png'
      },
      {
        'title': '在线提问',
        'url': imgUrl + '在线提问.png'
      },
      {
        'title': '二手/翻新',
        'url': imgUrl + '二手翻新.png'
      },
    ],
    items: [{
        'title': '手机/数码',
        'url': imgUrl + '手机.数码.png'
      },
      {
        'title': '办公用品',
        'url': imgUrl + '办公用品.png'
      },
      {
        'title': '户外/运动',
        'url': imgUrl + '户外运动.png'
      },

      {
        'title': '服装服饰',
        'url': imgUrl + '服装服饰.png'
      },
      {
        'title': '食品',
        'url': imgUrl + '食品.png'
      },
      {
        'title': '家用电器',
        'url': imgUrl + '家用家电.png'
      },
      {
        'title': '家居/家具',
        'url': imgUrl + '家具家居.png'
      },
      {
        'title': '美妆个护',
        'url': imgUrl + '美妆个护.png'
      },
      {
        'title': '医药保健',
        'url': imgUrl + '医药保健.png'
      },
      {
        'title': '珠宝/眼镜',
        'url': imgUrl + '珠宝眼镜.png'
      },
      {
        'title': '汽车/摩托',
        'url': imgUrl + '汽车摩托.png'
      },
      {
        'title': '图书/音像',
        'url': imgUrl + '图书影像.png'
      },
      {
        'title': '卡券票',
        'url': imgUrl + '卡券票.png'
      },
      {
        'title': '藏品文玩',
        'url': imgUrl + '藏品文玩.png'
      },
      {
        'title': '鲜花园艺',
        'url': imgUrl + '鲜花园艺.png'
      },
      {
        'title': '宠物水族',
        'url': imgUrl + '宠物水族.png'
      },
      {
        'title': '农资农具',
        'url': imgUrl + '农资农具.png'
      },
      {
        'title': '农林产品',
        'url': imgUrl + '农林产品.png'
      },
      {
        'title': '畜牧养殖',
        'url': imgUrl + '畜牧养殖.png'
      },
      {
        'title': '母婴/玩具',
        'url': imgUrl + '母婴玩具.png'
      },
      {
        'title': '房产',
        'url': imgUrl + '房产.png'
      },
      {
        'title': '民俗/乐器',
        'url': imgUrl + '民俗乐器.png'
      },
      {
        'title': '外卖',
        'url': imgUrl + '外卖.png'
      },
      {
        'title': '五金电料',
        'url': imgUrl + '五金电料.png'
      },
      {
        'title': '生产原料',
        'url': imgUrl + '生产原料.png'
      },
      {
        'title': '安防/汽配',
        'url': imgUrl + '安防汽配.png'
      },
      {
        'title': '医疗器械',
        'url': imgUrl + '医疗器械.png'
      },
      {
        'title': '行业机械',
        'url': imgUrl + '行业机械.png'
      }
    ],
    productImg1: imgUrl + '关于产品发布1.png',
    productImg2: imgUrl + '关于产品发布2.png',
    productImg3: imgUrl + '关于产品发布3.png',
    productImg4: imgUrl + '关于产品发布4.png',
    zmCardShare: 2,
    clientImg: imgUrl + '客服悬浮按.png',
    lineImg: imgUrl + 'line.png',
    loginState: false, //控制登录页面显示隐藏,
    isFirst: false,
    flag: true,
    onlineServiceFlag:true,
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
    var token = wx.getStorageSync('token').token;
    var zmtoken = wx.getStorageSync('zmToken');
    var zmcookie = wx.getStorageSync('token').zmCookie;
    let _this=this;
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
        }else{
          newZmToken = res.data.data.zmToken;
          wx.setStorage({
            key: "zmToken",
            data: newZmToken
          })
          _this.setData({
            flag: true
          })
          url = domain + '/addmain/1_1_1?zmsource=2&zmToken=' + newZmToken

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
      title: '关于产品发布'
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
      title: "使用族蚂名片发布商品",
      path: "/pages/service/service?zmCardShare=" + this.data.zmCardShare,
      imageUrl: imgUrl + '产品.png'
    }
  }
})