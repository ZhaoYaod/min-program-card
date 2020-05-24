// pages/component/scan.js
Component({
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String, // 简化的定义方式
    showModal: Boolean
  },

  /**
   * 页面的初始数据
   */

  data: {
    index: -1,
    showModal: true,
    createCardeState: false, //true为自己创建,false为他人创建
    flog:1
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },
  methods: {
    onLoad: function(options) {
      // this.setData({
      //   showModal: true
      // })
      // wx.hideTabBar({
      //   animation: true //是否需要过渡动画
      // })
    },
    createcards() {
      let _this = this;
      if (wx.getStorageInfoSync("createCardeState") == undefined) {
        wx.setStorageSync("createCardeState", false)
      } else {
        wx.removeStorageSync("createCardeState");
        wx.setStorageSync("createCardeState", false)
      }
      this.setData({
        index: 0
      }, () => {
        wx.navigateTo({
          url: '/pages/scan/scan',
          success: res => {
            _this.setData({
              showModal: false,
              index: -1
            })
          }
        })
      })
    },
    scan(){
      let _this = this;
      if (wx.getStorageInfoSync("createCardeState") == undefined) {
        wx.setStorageSync("createCardeState", true)
      } else {
        wx.removeStorageSync("createCardeState");
        wx.setStorageSync("createCardeState", true)
      }
      this.setData({
        index: 1,
      }, () => {
        wx.navigateTo({
          url: '/pages/scan/scan',
          success: res => {
            _this.setData({
              showModal: false,
              index: -1
            })
          }
        })
      })
    },
    man() {
      if(!this.data.flog) return;
      let _this = this;
      this.setData({
        flog:0
      })
      if (wx.getStorageInfoSync("createCardeState") == undefined) {
        wx.setStorageSync("createCardeState", true)
      } else {
        wx.removeStorageSync("createCardeState");
        wx.setStorageSync("createCardeState", true)
      }
      this.setData({
        index: 1
      }, () => {
        wx.navigateTo({
          url: '/pages/addLable/addLable',
          success: res => {
            _this.setData({
              showModal: false,
              index: -1,
              flog:1
            })
          }
        })
      })

    }
  }
})