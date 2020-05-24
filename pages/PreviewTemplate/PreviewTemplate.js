// pages/PreviewTemplate/PreviewTemplate.js
const app = getApp();
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pretemplist:{},
    // 一开始遮罩层隐藏
    shows:false,
  },
  // 点击遮罩层，显示的遮罩层隐藏
  close:function(){
    this.setData({
      shows:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    const eventChannel = that.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    var  tempId,fAmount;
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data,"9999999999990999")
      tempId=data.tempId;
      fAmount = data.fAmount;
    })
    
    if (tempId = -1 && fAmount==undefined){//预览全部
      console.log("进来的对对对111111111111");
      wx.request({
        url: dataUrl + 'manage-api/resource/cardTemplate/queryList',
        data: {
          iDisplayStart: 1,
          iDisplayLength: 10,
          fCompare: 1
          // fAmount: ""
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': wx.getStorageSync('token').token
        },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log(res, '888888888888888888888888888');
          console.log(res.data.data.data,"00000000000000000000");
          let tempfile = res.data.data.data.map(item => {
            return item;
          })
          that.setData({
            pretemplist: tempfile
          })
        }
      })
    } else if (tempId = -1 && fAmount != undefined){//选择

    }else{

    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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