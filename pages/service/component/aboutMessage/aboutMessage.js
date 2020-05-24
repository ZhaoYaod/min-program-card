const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
Page({
  data: {
    list: [{
        img: imgUrl + '长篇文学s.png',
        text: "长篇文学"
      },
      {
        img: imgUrl + '纪实文学s.png',
        text: "纪实文学"
      },
      {
        img: imgUrl + '旅游攻略s.png',
        text: "旅游攻略"
      },
      {
        img: imgUrl + '考试题s.png',
        text: "考试题"
      }
    ],
    messageText: [{
        title: '创建经营主体'
      },
      {
        title: '编辑文章'
      },
      {
        title: '发布文章'
      }
    ],
    messageImg: imgUrl + '关于资讯博客banner.png',
    lineImg: imgUrl + 'line.png',
    zmCardShare: 4,
    loginState: false, //控制登录页面显示隐藏,
    isFirst: false,
    flag: true,
    link: '/pages/component/getPhone/getPhone'
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
  //跳转添加页面
  linkToAdd() {
    var token = wx.getStorageSync('token').token;
    var zmtoken = wx.getStorageSync('zmToken');
    var zmcookie = wx.getStorageSync('token').zmCookie;
    var newZmToken;
    let _this = this;
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
          url = domain + '/addmain/2_2_2?zmsource=2&zmToken=' + newZmToken

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
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '关于发布文章'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "使用族蚂名片发布文章",
      path: "/pages/service/service?zmCardShare=" + this.data.zmCardShare,
      imageUrl: imgUrl + '文章.png'
    }
  }
})