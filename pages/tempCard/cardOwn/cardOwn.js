// pages/tempCard/cardOwn/cardOwb.js
const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
let picUrl = app.globalData.poxy.PICIMG //本地图片路径前缀
let imgurl = app.globalData.poxy.RESIMG;//接口返回图片路径前缀
Component({
  properties: {
    cmessage1: {  //姓名 + 职位 + 公司
      type: Object
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
   
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached(){},
    ready: function () { },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  methods: {
    _leftBtn() {
      this.triggerEvent('leftBtn', false)
    },
    _rightBtn() {
      this.triggerEvent('rightBtn', false)
    },
    _showModal() {

    }
  }
})