// pages/siteType.js
var app = getApp()
let imgUrl = app.globalData.poxy.IMGURL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    ccreatetype:null,
    showModal:false,
    link:null,
    type:null,
    showType:null,
  },
  redirectUrl(e){
    let id = parseInt(e.currentTarget.dataset.id);
    switch(id){
      case 1:
        if (!this.data.ccreatetype) {       //为他人创建名片不能添加
          this.setData({
            showModal: true,
          })
        }else{
          wx.navigateTo({
            url: '../checkSite/checkSite'
          })
        }
        break;
      case 2:
        if(this.data.link){
          wx.navigateTo({
            url: '../diyurl/diyurl?link=' + this.data.link + '&showType=' + this.data.showType
          })
        }else{
          wx.navigateTo({
            url: '../diyurl/diyurl'
          })
        }
    } 
  },
  closeModal(){
    this.setData({
      showModal: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.link){
      this.setData({
        link:options.link,
        type: options.type,
        showType: options.showType
      })
    }
    wx.hideShareMenu();
    this.setData({
      ccreatetype: wx.getStorageSync('createCardeState')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu()    //禁掉转发
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
   
  }
})