// pages/peoplenearby/peoplenearby.js
const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectedIndex:null,//名片列表的下标
    radarShare: 3,//名片雷达的第一个页面
    list:[],//存放用户数据
    iDisplayStart: 0, //请求数据起始位置
    searchKeyWord:'' ,//标签选择页的关键字
    showLoading:false,
    ReachBottomLength:25,//下拉增加25条
    renderList:[]
    

  },
  //列表长按转发
  personalMsg(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex:index
    })
  },
  //列表单击跳转
  linkTo(e){
    var index = e.currentTarget.dataset.index;
    let path = this.data.list[index].fCardTemplateUrl;
    let fd = this.data.list[index].fId;
    wx.navigateTo({
      url: '/'+path + '?fId=' + fd
    })
    //隐藏转发按钮
    this.setData({
      selectedIndex: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var list = wx.getStorageSync('newArr');
    var searchKeyWord = wx.getStorageSync('searchKeyWord');
    this.setData({
      list: list,
      searchKeyWord: searchKeyWord,
      renderList: list.slice(0, this.data.ReachBottomLength)

    })
    wx.removeStorageSync('searchKeyWord')
    wx.removeStorageSync('newArr')
     //添加音效
     var innerAudioContext = wx.createInnerAudioContext();
     innerAudioContext.autoPlay = true;
     wx.setInnerAudioOption({ //ios在静音状态下能够正常播放音效
       obeyMuteSwitch: false, // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
       success: function (e) {},
       fail: function (e) {}
     })
     innerAudioContext.src = 'http://downsc.chinaz.net/Files/DownLoad/sound1/201711/9360.mp3'; //微信扫一扫音乐
     innerAudioContext.play();
     innerAudioContext.onPlay(() => { //监听播放事件
       console.log('开始播放')
     })
     innerAudioContext.onError((res) => { //播放错误事件
       console.log(res, '播放失败')
     })

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.setData({
      selectedIndex: null
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '名片雷达'
    })
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
    this.setData({
      showLoading: true,
      renderList: this.data.list.slice(0, this.data.ReachBottomLength + 25),
      ReachBottomLength: this.data.ReachBottomLength+25
    })
    setTimeout(() => {
         this.setData({
            showLoading:false
         })
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "快用族蚂名片看看哪些人在附近吧！",
      path: "/pages/radar/radar",
      imageUrl: imgUrl+'leida.png'
    }
  }
})