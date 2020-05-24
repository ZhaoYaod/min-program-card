// pages/service/component/subjectManage/subjectManage.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let api = app.globalData.poxy.API_BASE;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    jiantouImg: imgUrl + 'jiantou.png',
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
    fName: null,
    fId: null,
    ownerData: {},
    partnerData: {},
    buttonBlue: true,
    isLoading: false,
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
    userId: '',
    api: api,
    fLogo: '',
    title: '',
    warnFlash: 1,
    hideModal: false,
    link: '/pages/component/getPhone/getPhone'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  setLimit() {
    // wx.navigateTo({
    //   url: "/pages/service/component/find/find"
    // })
    this.setData({
      showPop: true,
      textAlign: 'left',
      contentTit: `请登录【zuma.com】→【商家总台】进行权限设置。`,
      leftBtnTit: '我知道了',
      leftcolor: "#202020",
      contColor: '#474747',
      leftWeight: 'bold',
      btnFsize: 14,
      direction: 0,
      hideModal: null,
      warnFlash: '',
      title: ''
    })
  },
  cancel(e) {
    this.setData({
      showPop: false
    })
  },
  confirm(e) {
    let _this = this;
    this.setData({
      showPop: false,
      hideModal: true,
      warnFlash: 1,
      title: '数据加载中'
    })
    wx.request({
      url: api + 'manage-api/resource/cardout/SignOutEntrep',
      header: {
        'Content-Type': 'application/json',
        "Authorization": wx.getStorageSync('token').token
      },
      data: {
        fEntrepId: _this.data.fId
      },
      success: function (res) {
        if (res.data.status == 404) {
          _this.setData({
            loginState:true
          })
        }else if(res.data.status==0){
          _this.setData({
            warnFlash:2,
            title:'退出成功'
          })
          setTimeout(() => {
            _this.setData({
              hideModal:false
            })
            wx.navigateTo({
              url: '/pages/service/service'
            })
          }, 800);
        }else{
          _this.setData({
            warnFlash: 2,
            title: '退出失败'
          })
          setTimeout(() => {
            _this.setData({
              hideModal: false
            })
            wx.navigateTo({
              url: '/pages/service/service'
            })
          }, 800);
        }
      }
    })
  },
  //点击退出主体
  quit() {
    // if (this.data.buttonBlue){
    this.setData({
      showPop: true,
      textAlign: 'left',
      contentTit: '退出后主体的产品、服务、文章无法使用!',
      leftBtnTit: '取消',
      rightBtnTit: '确认退出',
      leftcolor: "#202020",
      contColor: '#474747',
      leftWeight: 'bold',
      rightWeight: 'bold',
      btnFsize: 14,
      direction: 1
    })
    // }
  },
  onLoad: function (options) {
    this.setData({
      title: '数据加载中',
      warnFlash: 1,
      hideModal: true
    })
    this.setData({
      fName: options.fName,
      fId: options.fId,
      fLogo: options.fLogo
    })
    //当前用户手机号
    let phone = wx.getStorageSync('phone');
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
    });
    let nowTime = new Date().getTime();
    wx.request({
      url: api + 'manage-api/resource/cardout/queryShopUsers',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token').token
      },
      data: {
        fEntrepId: options.fId
      },
      success: function (res) {
        if (res.data.status == 404) {
          that.setData({
            loginState: true
          })
        } else {
          if (res.statusCode == 200) {
            if (res.data.status == 0) {
              let domain = res.data.data.descOrAsc;
              res.data.data.data.forEach((item, index) => {
                //获取用户头像完整路径
                item.fHeadLogo = domain + item.fHeadLogo;
                //是否是新用户
                if ((nowTime - (item.fCreateTime/1000)) / 86400000 > 24) {
                  item.isNew = false
                } else {
                  item.isNew = true
                }
                //是否为所有者
                if (item.fServiceId == 0) {
                  that.setData({
                    ownerData: item
                  });
                  //判断当前用户是否是该主体所有者(通过手机号判断)
                  if (item.fUserPhone == phone) {
                    //主体所有者
                    that.setData({
                      buttonBlue: false
                    })
                  } else {
                    that.setData({
                      buttonBlue: true
                    })
                  }
                  res.data.data.data.splice(index, 1);
                  that.setData({
                    partnerData: res.data.data.data,
                    isLoading: true,
                    hideModal: false
                  })
                }
              })
            }
          }
        }

      }
    })
    wx.request({
      url: api + 'manage-api/resource/cardout/getZumaUserId',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token').token
      },
      success: function (res) {
        if (res.statusCode = 200) {
          that.setData({
            userId: res.data.data
          })
        }
      }
    })
  },
  partnerShare() {
    let img = this.data.ownerData.fHeadLogo;
    let phone = this.data.ownerData.fUserPhone;
    let name = this.data.userInfo.nickName;
    let fName = this.data.fName;
    let fId = this.data.fId;
    let userId = this.data.userId;
    wx.navigateTo({
      url: `/pages/service/component/partnerShare/partnerShare?phone=${phone}&name=${name}&fName=${fName}&fId=${fId}&userId=${userId}&img=${img}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: '合伙人信息',
    })
  },
  // 跳转到我的产品页面
  linkToAddPage(e) {
    wx.navigateTo({
      url: '/pages/service/component/my_product/my_product?type=' + e.currentTarget.dataset.type,
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
  onShareAppMessage: function (res) {
    let title = `注册成为合伙人，渠道共享，分享赚佣金！`;
    let imgUrls = this.data.imgUrl + 'partnerShare.jpg';
    let img = this.data.ownerData.fHeadLogo;
    let phone = this.data.ownerData.fUserPhone;
    let name = this.data.userInfo.nickName;
    let fName = this.data.fName;
    let fId = this.data.fId;
    let userId = this.data.userId;
    let fLogo=this.data.fLogo;
    if (res.from === 'button') {
      return {
        title: title,
        path: `/pages/service/component/partnerShare/partnerShare?phone=${phone}&name=${name}&fName=${fName}&fId=${fId}&userId=${userId}&img=${img}&fLogo=${fLogo}`,
        imageUrl: imgUrls
      }
    }else{
      return {
        title: "族蚂名片小程序帮你发现附近的供应商,客户和手艺人！",
        path: "/pages/service/service",
        imageUrl: imgUrl + '搜索1.png'
      }
    }
  }
})