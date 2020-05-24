// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useInfo: {
      // avatarUrl: "", //用户头像
      // nickName: "", //用户昵称
    },
    list: [
      { id: 0, text: '产品管理', select: true },
      { id: 1, text: '服务管理', select: true },
      { id: 2, text: '文章管理', select: true },
      { id: 3, text: '订单管理', select: true },
      { id: 4, text: '网站管理', select: true },
      { id: 5, text: '主体管理员设置（邀请合伙人）', select: false }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 勾选事件
  selectSet: function (e){
    const id = e.currentTarget.id;
    const list = this.data.list;
    for(let i=0; i<list.length; i++){
      if(list[i].id == id){
        list[i].select =!list[i].select;
      }
    }
    this.setData({
      list
    })
  },
  // 保存
  saveSet: function(e){
    wx.showLoading({
      title: '数据加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        mask: true,
        icon: 'success'
      })
    }, 2000)


  },
  onLoad: function (options) {
    var _this = this;
    wx.getUserInfo({
      success: function (res) {
        // var avatarUrl = 'userInfo.avatarUrl';
        // var nickName = 'userInfo.nickName';
        // var userInfo = res.userInfo;
        _this.setData({
          // [avatarUrl]: res.userInfo.avatarUrl,
          // [nickName]: res.userInfo.nickName,
          userInfo: res.userInfo
        })
      }
    })
    
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