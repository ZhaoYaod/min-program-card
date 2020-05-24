// pages/service/component/subjectManage/subjectManage.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    jiantouImg: imgUrl + 'jiantou.png',
    fId:null,
    fName:null,
    partnerFlag:true,
    fLogo:null,
    friends: imgUrl + 'friends.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fId:options.fId,
      fName:options.fName,
      fLogo: options.fLogo
    })
  },
  partner(){
    if (this.data.partnerFlag) {
      this.setData({
        partnerFlag: false
      })
      wx.navigateTo({
        url: `/pages/service/component/partner/partner?fId=${this.data.fId}&fName=${this.data.fName}&fLogo=${this.data.fLogo}`,
      })
      setTimeout(() => {
        this.setData({
          partnerFlag: true
        })
      }, 1000);
     
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.fName,
    })
  },
  // 跳转到我的产品页面
  linkToAddPage(e) {
    wx.navigateTo({
      url: '/pages/service/component/my_product/my_product?type=' + e.currentTarget.dataset.type + '&fId=' + e.currentTarget.dataset.fid,
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