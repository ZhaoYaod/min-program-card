// pages/service/service.js
const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
let model = app.globalData.model;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    model: 0,
    showSubject: false,
    imgUrl: imgUrl,
    showPublic: false,
    jiantouImg: imgUrl + 'jiantou.png',
    redirectUrlFlag: true,
    loginState: false,
    assgin: '',
    scanBack:false,
    link: '../component/getPhone/getPhone'
  },
  methods: {
    public(that) {
      //判断关联公众号显示隐藏
      wx.request({
        url: api + 'manage-api/resource/carduser/subscribeState', //是否关注公众号接口
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token').token
        },
        success(res) {
          let status = res.data.status
          if (status) {
            that.setData({
              showPublic: true
            })
          } else {
            that.setData({
              showPublic: false
            })
          }
        }
      })
    }
  },
  //跳转到何广进族蚂名片页面
  zmCard() {
    wx.navigateTo({
      url: '/pages/zumaCard/zumaCard'
    })
  },
  // 显示主体信息
  showSubject() {
    var showSubject = this.data.showSubject = !this.data.showSubject
    this.setData({
      showSubject: showSubject
    })
  },
  // 跳转到雷达页面
  radarlink() {
    wx.navigateTo({
      url: '/pages/radar/radar'
    })
  },
  // 跳转到族蚂建站页面
  buildlink(e) {
    wx.navigateTo({
      url: '/pages/service/component/buildstation/buildstation',
    })
  },
  //点击销售订单 
  saleOrder() {
    // wx.showModal({
    //   title: '研发中，将在下一个版本发布',
    //   confirmText: '我知道了',
    //   showCancel: false,
    //   confirmColo: '#161616'
    // })
    var token = wx.getStorageSync('token').token;
    if (token) {
      wx.navigateTo({
        url: "/pages/service/component/subjectManages/subjectManages"
      })
      this.setData({
        loginState: false
      })
    } else {
      this.setData({
        loginState: true
      })
    }
  },

  //主体信息管理
  selectSubject() {
    var token = wx.getStorageSync('token').token;
    if (token) {
      if (wx.getStorageSync('phone') == '') {
        wx.navigateTo({
          url: '/pages/component/getPhone/getPhone?assign=' + this.data.assgin //获致手机号页面返回的页数;
        })
      } else {
        wx.navigateTo({
          url: "/pages/service/component/subjectManage/subjectManage"
        })
      }
      this.setData({
        loginState: false
      })
    } else {
      this.setData({
        loginState: true
      })
    }

  },
  redirectUrl() {
    var token = wx.getStorageSync('token').token;
    if (token) {
      if (this.data.redirectUrlFlag) {
        this.setData({
          redirectUrlFlag: false
        })
        var domain;
        if (api.indexOf('pre') != -1) {
          domain = 'https://m.pre-zuma.com'
        } else {
          domain = 'https://m.zuma.com'
        }
        var token = wx.getStorageSync('token').token;
        var zmtoken = wx.getStorageSync('zmToken');
        var zmcookie = wx.getStorageSync('token').zmCookie;
        var newZmToken;
        let _this = this;
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
              _this.setData({
                redirectUrlFlag: true
              })
              newZmToken = res.data.data.zmToken;
              wx.setStorage({
                key: "zmToken",
                data: newZmToken
              })
              var url = domain + '/mobMemberCenter/?zmsource=2&zmToken=' + newZmToken
              wx.navigateTo({
                url: '/pages/webview/webview?url=' + encodeURIComponent(url)
              })
            }
          }
        })
      }
    } else {
      this.setData({
        loginState: true
      })
    }



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断机型来改变公众号弹窗位置
    if (model == 1) {
      this.setData({
        model: 1
      })
    }
    //分享需要先跳转到首页然后在跳转到相对应的页面 否则没有返回按钮
    var token = wx.getStorageSync('token').token;
    if (token) {
      this.methods.public(this)
    } else {
      this.setData({
        showPublic: true
      })
    }
    //跳转到我的产品页面 
    if (options.myProductShare) {
      switch (options.myProductShare) {
        case "1":
          wx.navigateTo({
            url: '/pages/service/component/my_product/my_product',
          })
          break;
      }
    }
    // 跳转到雷达搜页面
    if (options.radarShare) {
      switch (options.radarShare) {
        case "1":
          wx.navigateTo({
            url: '/pages/radar/radar'
          })
          break;
        case "2":
          wx.navigateTo({
            url: '/pages/radarloading/radarloading',
          })
          break;
        case "3":
          wx.navigateTo({
            url: '/pages/peoplenearby/peoplenearby',
          })
          break;
      }
    }
    //跳转到何广进族蚂名片页面
    if (options.zmCardShare) {
      switch (options.zmCardShare) {
        case "1":
          wx.navigateTo({
            url: '/pages/zumaCard/zumaCard',
          })
          break;
        case '2':
          wx.navigateTo({
            url: '/pages/service/component/aboutProduct/propub',
          })
          break;
        case '3':
          wx.navigateTo({
            url: '/pages/service/component/aboutService/aboutService',
          })
          break;
        case '4':
          wx.navigateTo({
            url: '/pages/service/component/aboutMessage/aboutMessage',
          })
          break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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
      title: "族蚂名片小程序帮你发现附近的供应商,客户和手艺人！",
      path: "/pages/service/service",
      imageUrl: imgUrl + '搜索1.png'
    }
  }
})