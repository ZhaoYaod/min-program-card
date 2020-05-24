// pages/siteType.js
var app = getApp()
let imgUrl = app.globalData.poxy.IMGURL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    isUrl:false,        //是否有url
    focus:false,
    checkUrl:false,     //校验url是否有效
    subing:false,       //提交中。。。
    code:false,
    link:true,
    address:'',
    top:'-70rpx'
  },
  onFocus(){
    this.setData({
      focus:true
    })
  },
  onBlur(e){
    let val = e.detail.value;
    let isUrl = this.IsURL(val);
    if(!isUrl){
      this.setData({
        checkUrl:true
      })
    }else{
      this.setData({
        checkUrl: false,
        focus:false,
      })
    }
  },
  iptUrl(e){  
    this.setData({
      isUrl:true,
      address: e.detail.value
    })
  },
  IsURL(str_url) {      //校验地址
    let flag = true;
    if(str_url.indexOf('.')==-1){
      flag = false
    }
    if (flag) {
      return true;
    } else {
      return false;
    }
  },
  mode(e){        //切换展示方式
    let id = e.currentTarget.dataset.id;
    let obj = {};
    if(id==0){
      obj.code = true;
      obj.link = false
    }else{
      obj.code = false;
      obj.link = true
    };
    this.setData(obj)
  }, 
  define(e){
    if(this.data.address==''){
      var obj = {};
      obj.webadress = '';
      obj.webSource = null;
      obj.isOtherOrder = null;
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];     //当前页
      var prevPage = pages[pages.length - 3]; //上一个页面
      prevPage.setData(obj);
      wx.navigateBack({
        delta: 2
      })
    }
    setTimeout(()=>{
      if(this.data.checkUrl){  
      }else{
        var obj = {};
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];     //当前页
        var prevPage = pages[pages.length - 3]; //上一个页面
        if (this.data.code) {
          obj.webOtherType = 0      //展示二维码
        } else {
          obj.webOtherType = 1      //复制链接
        }
        obj.webadress = this.data.address;
        obj.webSource = 1;
        obj.isOtherOrder = true;
        this.setData({
          subing: true
        })
        setTimeout(() => {
          prevPage.setData(obj);
          if (this.data.code) {    //展示二维码收费5元
            prevPage.data.payItem.push({ type: 2, price: 5 * 100 })
          }
          wx.navigateBack({
            delta: 2
          })
        }, 500)
      }
    },200)
    
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.link){
      let obj = {};
      obj.address = options.link
      if(options.showType==1){
        this.setData({
          link:true
        })
        obj.link = true;
        obj.code = false;
      }else{
        obj.link = false;
        obj.code = true;
      }
      this.setData(obj)
    }
    this.setData({
      top:0
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