// pages/service/component/partnerShare/partnerShare.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let height = app.globalData.height;
let api = app.globalData.poxy.API_BASE;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareBg: imgUrl + "shareBg.png",
    cardLogo: imgUrl + 'cardLogo.png',
    yinhao: imgUrl + 'yinhao.png',
    shareButton: imgUrl + 'share-button.png',
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
    winHeight: 0,
    status: 0,
    navHeight: 0,
    //弹窗样式
    showPop: false,
    contentTit: '',
    leftBtnTit: "",
    rightBtnTit: '',
    leftcolor: '',
    rightcolor: '',
    direction: 1,
    contColor: '',
    textAlign: '',
    btnFsize: '',
    rightWeight: "",
    leftWeight: '',
    img: "",
    name: '',
    phone: '',
    fName: '',
    fId: '',
    showPop: false,
    userId: '',
    api: api,
    title: '',
    warnFlash: 1,
    hideModal: false,
    link: '/pages/component/getPhone/getPhone',
    fLogo:''

  },
  //导航栏高度计算
  setNavSize: function () {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    that.setData({
      status: statusHeight,
      navHeight: navHeight,
    })
  },
  //左上角按钮.跳转到名片首页
  backtCard() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  cancel(e) {
    this.setData({
      showPop: false
    })
    wx.navigateTo({
      url: `/pages/service/component/subjectName/subjectName?fId=${this.data.fId}&fName=${this.data.fName}&fLogo=${this.data.fLogo}`,
    })
  },
  confirm(e) {
    this.setData({
      showPop: false
    })
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },
  //点击成为合伙人
  buttonClick() {
    var token = wx.getStorageSync('token').token;
    let that = this;
    this.setData({
      title: '数据加载中',
      warnFlash: 1,
      hideModal: true
    })
    console.log(token,'token````````````````');
    
    if (token) {
      wx.request({
        url: api + 'manage-api/resource/cardout/JoinEntrep',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          fEntrepId: that.data.fId,
          fSendUserId: that.data.userId

        },
        success: function (res) {
          console.log(res,'res``````````````````````````');
          
          if (res.data.status == 404) {
            that.setData({
              loginState: true
            })
          } else {
            if (res.data.status == 0 || res.data.status == 5) {
              that.setData({
                showPop: true,
                textAlign: 'left',
                contentTit: `您已成为${that.data.fName}合伙人！`,
                leftBtnTit: '查看共享资源',
                rightBtnTit: '创建营销名片',
                leftcolor: "#202020",
                contColor: '#474747',
                leftWeight: 'bold',
                rightWeight: 'bold',
                btnFsize: 14,
                direction: 1,
                hideModal: false
              })
            }
          }
        }
      })

    } else {
      this.setData({
        loginState: true,
        hideModal:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'optiom`````````````````````');

    let fName = options.fName;
    let name = options.name;
    let phone = options.phone;
    let img = options.img;
    let fId = options.fId;
    let userId = options.userId;
    let fLogo=options.fLogo;
    this.setData({
      winHeight: wx.getSystemInfoSync().windowHeight,
      fName: fName,
      name: name,
      phone: phone,
      img: img,
      fId: fId,
      userId: userId,
      fLogo:fLogo
    })
    this.setNavSize()
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