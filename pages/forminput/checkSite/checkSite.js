// pages/checkSite.js
var app = getApp()
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus:false,
    imgUrl: imgUrl,
    siteList: [],
    isCheck: false,
    isPublish:false,
    banClick:false,
    token: wx.getStorageSync('token').token,
    getData:true
  },
  selectSite(e){
   if(this.data.banClick)return;
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];     //当前页
    var prevPage = pages[pages.length - 3]; //上一个页面
    var status = e.currentTarget.dataset.status;
    var url = e.currentTarget.dataset.url;
    console.log(e)
    if (status!=1){      //判断站点是否发布
     this.setData({
       isPublish:true,
       banClick:true,
     })
     setTimeout(() => {
       this.setData({
         isPublish: false,
         banClick: false
       })
     }, 1500)
   }else{
     this.setData({
       isCheck: true,
     })
     setTimeout(()=>{
       prevPage.setData({ 
         'webadress': url,
         'webSource':0,
         'isOtherOrder':true
       })
       prevPage.data.payItem.push({type:1,price:10*100})
       wx.navigateBack({
         delta:2
       })
     },1000)
   }
  },
  createSite(){
    var token = wx.getStorageSync('token').token;
    var zmtoken = wx.getStorageSync('zmToken');
    var zmcookie = wx.getStorageSync('token').zmCookie;
    var newZmToken;
    var domain;
    if (api.indexOf('pre') != -1) {
      domain = 'https://jz.m.pre-zuma.com'
    } else {
      domain = 'https://jz.m.zuma.com'
    }
    wx.request({
      url: api + 'manage-api/resource/carduser/loginZmToken',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: { zmtoken: zmtoken, zmcookie: zmcookie },
      success: (res) => {
        newZmToken = res.data.data.zmToken;
        wx.setStorage({
          key: "zmToken",
          data: newZmToken
        })
        var url = domain + '/model?zmsource=2&zmToken=' + newZmToken;
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + encodeURIComponent(url)
        })
      }
    })
  },
  onMyEvent(e) {
    let pages = getCurrentPages().pop();
    pages.onLoad();
    this.setData({
      loginStatus: e.detail.loginState,
      getData:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    var token = wx.getStorageSync('token').token;
    wx.hideShareMenu();
    console.log(this.data.token)
    wx.request({
      url: api+'manage-api/resource/cardgoods/queryWebSiteByUserId',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: (res) => {
        if (res.data.status==200){
          _this.setData({
            siteList: res.data.data,
            getData: false
          })
        } else if (res.data.status == 404){
          _this.setData({
            loginStatus:true,
            getData: false
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(this.siteList)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})