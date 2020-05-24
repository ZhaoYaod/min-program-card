// pages/siteType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var url = options.url;
    var that = this;
    console.log(decodeURIComponent(url))
    if(options.payData){  //支付跳转
      console.log(JSON.parse(options.payData))
      that.goPay(JSON.parse(options.payData), url)
    }else{                //一般跳转
      this.setData({
        path: decodeURIComponent(url)
      })
    }
  },
  goPay(payData,url) {
    wx.requestPayment({
      appId: payData.appid,
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonce_str,
      package: "prepay_id=" + payData.prepay_id,
      signType: 'MD5',
      paySign: payData.sign,
      success(res) {
        console.log("支付成功", res)
        wx.navigateTo({
          url: url,
        })
      },
      fail(res) {
        console.log("支付失败", res)
      }
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