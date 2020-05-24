// pages/service/component/subjectManage/subjectManage.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectHeadBg: imgUrl + 'subjectHeadBg.png',
    useInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
    subjectData: [],
    jiantouImg: imgUrl + 'jiantou.png',
    isSubject: false, //是否有主体
    api: api,
    imgUrl: imgUrl,
    isLoading: true, // 请求数据中loading显示
    fId: null, //主体ID,
    subjectNameFlag: true,
    notSubject: imgUrl + 'not-subject.png',
    title: '',
    warnFlash: 1,
    hideModal: false,
    loginState: false,
    link: '/pages/component/getPhone/getPhone',
    createSubjectFlag:true
  },
  subjectName(event) {
    if (this.data.subjectNameFlag) {
      this.setData({
        subjectNameFlag: false
      })
      let fId = event.currentTarget.dataset.fid;
      let fName = event.currentTarget.dataset.fname;
      let fLogo = event.currentTarget.dataset.flogo;
      var token = wx.getStorageSync('token').token;
      var zmtoken = wx.getStorageSync('zmToken');
      var zmcookie = wx.getStorageSync('token').zmCookie;
      var newZmToken, newcookie;
      let that = this;
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
          let domains;
          console.log(api, 'api```````````````````````````````');

          if (api.indexOf('pre') != -1) {
            domains = 'pre-zuma'
          } else {
            domains = 'zuma'
          }
          newZmToken = res.data.data.zmToken;
          newcookie = res.data.data.zmCookie;
          wx.setStorage({
            key: "zmToken",
            data: newZmToken
          })
          let url = `https://m.${domains}.com/seller?fEntrepId=${fId}&zmsource=2&zmToken=${newZmToken}&zmCookie=${newcookie}`;
          console.log(url, 'url``````````````````````````````');

          wx.navigateTo({
            url: '/pages/webview/webview?url=' + encodeURIComponent(url),
          })
          setTimeout(() => {
            that.setData({
              subjectNameFlag: true
            })
          }, 1000);
        }
      })

    }

  },
  createSubject() {
    if (this.data.createSubjectFlag){
      this.setData({
        createSubjectFlag:false
      })
      let _this = this;
      var token = wx.getStorageSync('token').token;
      var zmtoken = wx.getStorageSync('zmToken');
      var zmcookie = wx.getStorageSync('token').zmCookie;
      let newZmToken;
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
            let domains;
            if (api.indexOf('pre') != -1) {
              domains = 'pre-zuma'
            } else {
              domains = 'zuma'
            }
            newZmToken = res.data.data.zmToken;
            wx.setStorage({
              key: "zmToken",
              data: newZmToken
            })
            let url = `https://m.${domains}.com/mobMemberCenter/addSiteStart?zmsource=2&zmToken=${newZmToken}`
            wx.navigateTo({
              url: '/pages/webview/webview?url=' + encodeURIComponent(url),
            })
            _this.setData({
              createSubjectFlag:true
            })
          }
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取用户头像昵称
    var that = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
    this.setData({
      title: '数据加载中',
      warnFlash: 1,
      hideModal: true
    })
    //请求数据
    wx.request({
      url: api + 'manage-api/resource/cardout/queryEntrepList',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token').token
      },
      success: function (res) {
        if (res.data.status == 404) {
          that.setData({
            loginState: true,
            hideModal: false
          })
        } else {
          if (res.data.status == 1) {
            that.setData({
              isSubject: true,
              hideModal: false,
              isLoading: false
            })
          } else {
            that.setData({
              subjectData: res.data.data,
              isLoading: false,
              isSubject: false,
              hideModal: false
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: '主体信息管理',
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
      title: "族蚂名片小程序帮你发现附近的供应商,客户和手艺人！",
      path: "/pages/service/service",
      imageUrl: imgUrl + '搜索1.png'
    }
  }
})