// pages/component/login/login.js
const app = getApp();
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
Component({
  properties: {
    loginState: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {
        console.log(newVal, oldVal, "-----------==========--")
      }, // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    link:{
      type:String,
      value:"../getPhone/getPhone"
    },
    myProperty2: String, // 简化的定义方式
    showModal: Boolean
  },

  /**
   * 页面的初始数据
   */

  data: {
    index: -1,
    login: true,
    assgin: "",
    warnTit: "加载中",
    hideModal: false,
    warnFlash: 1,
    contentTit: "授权失败！请重新授权！",
    showPop: false,
    // linkTarget: ''
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created() {
      // 查看是否授权
    },
    attached: function() {},
    ready: function() {},
    moved: function() {},
    detached: function() {},
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  methods: {
    onLoad(options) {
      console.log(options, "*******((((((((")
      if (options.assgin) {
        this.setData({
          assgin: options.assgin
        })
      }
      // if (options.linkTarget != undefined) {
      //   this.setData({
      //     linkTarget: options.linkTarget
      //   })
      // }
      // wx.hideTabBar({
      //   animation: true //是否需要过渡动画
      // })
    },
    cancel() {
      this.setData({
        showPop: false
      })
    },
    bindGetUserInfo(e) {
      let _this = this;
      wx.login({
        fail: err => {},
        success: ces => {
          let code = ces.code;
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              wx.setStorageSync("WechatRawData", res.rawData);
              _this.setData({
                hideModal:true
              })
              wx.request({
                url: dataUrl + 'manage-api/resource/carduser/getAuthCode2',
                data: {
                  code: code,
                  signature: res.signature,
                  rawData: res.rawData,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                header: {
                  'content-type': 'application/json'
                },
                success: res => {
                  console.log(res, "----=---", res.data.status, _this.data.assgin)
                  //写入本地缓存;
                  _this.setData({
                    hideModal: false
                  })
                  if (res.statusCode == 200) {
                    if (res.data.status == 200) {
                      let _data = res.data.data;
                      wx.setStorageSync('token', {
                        token: _data.token,
                        unionId: _data.unionId,
                        zmCookie: _data.zmCookie
                      });
                      wx.setStorageSync('taskStatus', _data.taskStatus);
                      wx.setStorageSync('activity', _data.activity);
                      _this.setData({
                        loginState: false,
                        login: false
                      }, () => {
                        try {
                          if (_data.phone == "") {
                            wx.navigateTo({
                              url: _this.data.link+'?assign=' + _this.data.assgin //获致手机号页面返回的页数;
                            })
                          } else {
                            wx.setStorageSync('phone', _data.phone);
                            if (_data.zmToken == "") {
                              wx.navigateTo({
                                url:  _this.data.link+'?assign=' + _this.data.assgin //获致手机号页面返回的页数;
                              })
                            } else {
                              wx.setStorageSync('zmToken', _data.zmToken);
                            }
                            if (_this.data.assgin != "") {
                              wx.navigateBack({
                                delta: 1
                              })
                            }
                          }
                          _this.triggerEvent('myevent', {
                            loginState: false
                          });
                        } catch (err) {

                        }
                      });
                    } else {
                      _this.setData({
                        showPop: true
                      });
                      console.log("登录接口异常")
                    }
                  } else {
                    _this.setData({
                      showPop: true
                    });
                  }
                }
              })
            },
            fail: function(err) {
              wx.hideLoading();
              _this.setData({
                showPop: true
              });
              // _this.setData({
              //   loginState: false,
              //   login: false
              // });
              // try {
              //   _this.triggerEvent('myevent', {
              //     loginState: false
              //   });
              // } catch (err) {

              // }
            }
          })
        }
      })

    },
    addAnimation(event) {
      let _this = this;
      console.log(event)
      this.setData({
        loginState: false,
        login: false
      }, () => {
        try {
          this.triggerEvent('compontpass', {
            compontpass: true
          });

        } catch (err) {

        }
        if (_this.data.assgin != "") {
          wx.navigateBack({
            delta: 1
          })
        }
      })

    }
  }
})