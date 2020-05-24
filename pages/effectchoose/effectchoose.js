// pages/effectchoose/effectchoose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { index: 0, value: '无效果', checked: 'true' },
      { index: 1, value: '洒金粉' },
      { index: 2, value: '飘花瓣' },
      { index: 3, value: '爱心光斑' },
      { index: 4, value: '彩虹光斑' },
      { index: 5, value: '下雨' },
      { index: 6, value: '下雪' },
      { index: 7, value: '波纹' },
      { index: 8, value: '蝴蝶' },
      { index: 9, value: '流光' },
      { index: 10, value: '羽毛' },
      { index: 11, value: '抖动' },
      { index: 12, value: '斑驳' },
    ],
    showSnow:false,
    showRain:false,
  },
  radioChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value,this)
    switch(e.detail.value){
      case '0': 
        this.noEffect();
        break;
      case '1':
        break;
      case '2':
        break;
      case '3':
        break;
      case '4':
        break;
      case '5': 
        this.rainy();
        break;
      case '6':
        this.snowy();
      break;
      case '7':
        break;
      case '8':
        break;
      case '9':
        break;
      case '10':
        break;
      case '11':
        break;
      case '12':
        break;
    }
  },
  selectEffect:function(e){
    console.log(e, '点击事件触发')
  },
  // 无效果
  noEffect(){
    this.setData({
      showSnow:false,
      showRain:false,
    })
  },
  //下雪
  snowy:function(){
    this.setData({
      showSnow:true,
      showRain:false,
    })
  },
  // 下雨
  rainy:function(){
    this.setData({
      showRain:true,
      showSnow:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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