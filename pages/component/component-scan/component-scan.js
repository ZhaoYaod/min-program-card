// pages/component/scan.js
const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
const backgroundAudioManager = wx.getBackgroundAudioManager(); //创建背景音乐
Component({
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String, // 简化的定义方式
    showModal: {
      type: Boolean,
      value: true
    },
    showCreat: {
      type: Boolean,
      value: true
    },
    selectid:{
     type:String,
     value:""
    }
  },

  /**
   * 页面的初始数据
   */

  data: {
    index: -1,
    showPop: false,
    showModal: true,
    isCheck: false,
    close: imgUrl + "close.png",
    clickState: false,
    createCardeState: false //true为自己创建,false为他人创建
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {
      backgroundAudioManager.stop()
    },
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
    closeHid() {
      this.setData({
        showModal: false,
        index: -1
      })
    },
    createcards() {
      let _this = this;
      wx.removeStorage({
        key: 'cardInfo',
      })
      if (this.data.showCreat) {
        if (!this.data.clickState) {
          wx.setStorageSync("createCardeState", false)
          this.setData({
            index: 0,
            clickState: true
          }, () => {
            backgroundAudioManager.title = "5358";
            backgroundAudioManager.src = imgUrl + "5358.wav";
            wx.removeStorage({
              key: 'lable'
            });
            wx.removeStorage({
              key: 'assignLable'
            });
            wx.navigateTo({
              url: '../scan/scan',
              success: res => {
                _this.setData({
                  showModal: false,
                  index: -1,
                  clickState: false
                })
              }
            })
          })
        }
      } else {
        wx.setStorageSync("createCardeState", false)
        console.log(_this.data.selectid, "**************")
        if (this.data.showCreat == "") {
          _this.setData({
            showModal: true,
            index: 0
          },()=>{
            wx.navigateTo({
              url: '../addLable/addLable',
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                  console.log(data)
                },
                someEvent: function (data) {
                  console.log(data)
                }
              },
              success: res => {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                  selectid: _this.data.selectid
                })
                _this.setData({
                  showModal: false,
                  index: -1
                })
                console.log("成功！")
              }
            })
          })
        } else {
          this.setData({
            showModal: true,
            index: 0
          }, () => {
            wx.navigateTo({
              url: '../forminput/forminput',
              success: res => {
                _this.setData({
                  showModal: false,
                  index: -1
                })
              }
            })
          })
        }
      }


      // wx.showTabBar({
      //   animation: true //是否需要过渡动画
      // })
    },
    cancel() {
      this.setData({
        showPop: false
      })
    },
    confirm() {
      this.setData({
        showPop: false,
        index: -1
      }, () => {
        let pages = getCurrentPages()
        console.log(pages,'pages');
        let url = pages[pages.length-1].route
        if(url != 'pages/mine/mine'){
          wx.navigateTo({
            url: '../mine/mine'
          })
        }
      })
    },
    mycards() {
      let _this = this;
      wx.removeStorage({
        key: 'cardInfo',
      })
      if (this.data.showCreat) {
        if (!this.data.clickState) {
          wx.setStorageSync("createCardeState", true)
          this.setData({
            index: 1,
            clickState: true
          }, () => {
            console.log("-----====--****", wx.getStorageSync("token").token)
            if (wx.getStorageSync("token").token && wx.getStorageSync("token").token !== undefined) { //有授权过账号;
              if (wx.getStorageSync('phone') !== undefined && wx.getStorageSync('phone') !== "") {
                wx.request({
                  url: dataUrl + 'manage-api/resource/cardout/queryCountByPhone',
                  data: {
                    fPhone: wx.getStorageSync("phone")
                  },
                  header: {
                    "Content-Type": 'application/json',
                    "Authorization": wx.getStorageSync("token").token
                  },
                  success: res => {
                    console.log(res.data.data)
                    if (res.data.data >= 5) {
                      // 超出5张名片;
                      _this.setData({
                        showPop: true,
                        clickState: false
                      })
                      return false;
                    } else {
                      backgroundAudioManager.title = "5358";
                      backgroundAudioManager.src = imgUrl + "5358.wav";
                      wx.removeStorage({
                        key: 'lable'
                      });
                      wx.removeStorage({
                        key: 'assignLable'
                      });
                      wx.navigateTo({
                        url: '../scan/scan',
                        success: res => {
                          _this.setData({
                            showModal: false,
                            index: -1,
                            clickState: false
                          })
                        }
                      })
                    }
                  }
                })
              } else {
                backgroundAudioManager.title = "5358";
                backgroundAudioManager.src = imgUrl + "5358.wav";
                wx.removeStorage({
                  key: 'lable'
                });
                wx.removeStorage({
                  key: 'assignLable'
                });
                wx.navigateTo({
                  url: '../scan/scan',
                  success: res => {
                    _this.setData({
                      showModal: false,
                      index: -1,
                      clickState: false
                    })
                  }
                })
              }

            } else { //没有授权过账号
              console.log("--------22222222222")
              backgroundAudioManager.title = "5358";
              backgroundAudioManager.src = imgUrl + "5358.wav";
              wx.removeStorage({
                key: 'lable'
              });
              wx.removeStorage({
                key: 'assignLable'
              });
              wx.navigateTo({
                url: '../scan/scan',
                success: res => {
                  _this.setData({
                    showModal: false,
                    index: -1,
                    clickState: false
                  })
                }
              })
            }
            // wx.navigateTo({
            //   url: '/pages/scan/scan',
            //   success: res => {
            //     _this.setData({
            //       showModal: false,
            //       index: -1
            //     })
            //   }
            // })
          })
        }
      } else {
        wx.setStorageSync("createCardeState", true)
        if (this.data.showCreat == "") {
          _this.setData({
            showModal: true,
            index: 1
          },()=>{
            wx.navigateTo({
              url: '../addLable/addLable',
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                  console.log(data)
                },
                someEvent: function (data) {
                  console.log(data)
                }
              },
              success: res => {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                  selectid: _this.data.selectid
                })
                _this.setData({
                  showModal: false,
                  index: -1
                })
                console.log("成功！")
              }
            })
          })
        } else {
          this.setData({
            showModal: true,
            index: 1
          }, () => {
            wx.navigateTo({
              url: '../forminput/forminput',
              success: res => {
                _this.setData({
                  showModal: false,
                  index: -1
                })
              }
            })
          })
        }
      }
    }
  }
})