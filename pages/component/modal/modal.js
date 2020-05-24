// pages/component/login/login.js
Component({
  properties: {
    content: String,
    leftBtn: String,
    rightBtn: String,
    leftcolor: String,
    rightcolor: String,
    fweight: String,
    textAlign:String,
  },

  /**
   * 页面的初始数据
   */

  data: {
    winH:null,
    clickColorL:false,
    clickColorR:false
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      wx.getSystemInfo({
        success: (res)=>{
          this.setData({
            winH: res.windowHeight*2.34
          })
        },
      })
     },
    ready: function () {
     },
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
    _leftBtn(){
      this.setData({
        clickColorL:true
      })
      setTimeout(()=>{
        this.setData({
          clickColorL:false
        })
        this.triggerEvent('leftBtn', false)
      },200)
    },
    _rightBtn(){
      this.setData({
        clickColorR:true
      })
      setTimeout(()=>{
        this.setData({
          clickColorR:false
        })
        this.triggerEvent('rightBtn',false)
      },200)
    },
    _showModal() {
    
    }
  },
  externalClasses: ["box"]
})
