// pages/pwd/pwd.js
const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时长
    duration: 1000, //滑动动画时长
    circular: true, //是否采用衔接滑动
    indicatorColor: '#fff', //指示点颜色
    indicatorActiveColor: '#bfbfbf', //当前选中的指示点颜色
    list: [{
        'url': imgUrl + 'zuma site_shuffling_banner_01.png',
        'title': '建站不求人! 自助建设可交易的网站',
        'introduce': '助力企业进入电商快车道，全行业交易流程覆盖，我们承诺: 不能在线交易,全额退款',
        'chat': '联系客服'
      },
      {
        'url': imgUrl + 'zuma site_shuffling_banner_02.png',
        'title': '组件自由拖拽,操作便捷,一键发布',
        'introduce': '无需懂程序代码，全程可视化操作，操作简便，一键式发布，收费低廉',
        'chat': '免费咨询'
      },
      {
        'url': imgUrl + 'zuma site_shuffling_banner_03.png',
        'title': '让你的网站不仅仅是官网',
        'introduce': '交易流程覆盖全行业，直配微信、支付宝、银联支付功能，网站不能交易，我们承诺全额退款',
        'chat': '免费咨询'
      },
      {
        'url': imgUrl + 'zuma site_shuffling_banner_04.png',
        'title': '全新H5智能微商城新模式',
        'introduce': '聚能私域流量，提升转化率及复购率，助您打造智能商业体系',
        'chat': '免费咨询'
      }
    ],
    items: [{
        'title': '个人',
        'url': imgUrl + '个人站点.png'
      },
      {
        'title': '公司企业',
        'url': imgUrl + '企业站点.png'
      },
      {
        'title': '党政机关',
        'url': imgUrl + '党政机关.png'
      },
      {
        'title': '事业单位',
        'url': imgUrl + '事业单位.png'
      },
      {
        'title': '民办非企业',
        'url': imgUrl + '民办非企业.png'
      },
      {
        'title': '社会团体',
        'url': imgUrl + '社会团体.png'
      },
      {
        'title': '基金会',
        'url': imgUrl + '基金会.png'
      }
    ],
    perfectModel1: imgUrl + 'perfectModel1.png',
    perfectModel2: imgUrl + 'perfectModel2.png',
    perfectModel3: imgUrl + 'perfectModel3.png',
    perfectModel4: imgUrl + 'perfectModel4.png',
    site_img_banner: imgUrl + 'zuma site_img_banner.png',
    clientImg: imgUrl + '客服悬浮按.png',
    onlineServiceFlag: true,
    previousTimer:0
  },
  onlineService() {
    if (this.data.onlineServiceFlag) {
      this.setData({
        onlineServiceFlag: false
      })
      let url;
      let _this = this;
      //获取fRecordId
      console.log('请求接口数据');
      
      wx.request({
        url: 'https://m.zuma.com/z-chat/wap/skip/zm_service',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          fIsUrgency: 0,
          fTitle: '会员咨询'
        },
        success: function (res) {
          console.log(res, res.data.recordId ,'res``````````````````');
          
          if (res.data.status === 0) {
            _this.setData({
              onlineServiceFlag: true
            })
            if (res.data.recordId) {
              url = 'https://m.zuma.com/mobMemberCenter/memberConsultDetail?fRecordId=' + res.data.recordId +'&zmsource=2';
              wx.navigateTo({
                url: '/pages/webview/webview?url=' + encodeURIComponent(url)
              })
            }
          }

        },
        fail:function(a){
          console.log(a,'res````````````````````````')
        },
        complete:function(b){
          console.log(b,'b````````````````````````')
        }
      });
      console.log('接口请求完毕````')
    }

  },
  linkToModel() {
    let now = +new Date(); //1970 1.1 到现在的毫秒数 Date.now()
    if (now - this.data.previousTimer > 2000) {
      this.setData({
        previousTimer: now
      })
      let url = 'https://jz.zuma.com/model'
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent(url)
      });
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //修改标题名称
    wx.setNavigationBarTitle({
      title: '关于族蚂建站'
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

  }
})