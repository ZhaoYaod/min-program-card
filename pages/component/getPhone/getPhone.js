// pages/component/scan.js
const app = getApp();
let imgurl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
// Component({
//   properties: {
//     myProperty: { // 属性名
//       type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
//       value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
//       observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
//     },
//     myProperty2: String, // 简化的定义方式
//     showModal: Boolean,
//   },
//   /**
//    * 页面的初始数据
//    */

//   data: {
//     index: -1,
//     indexImg: imgurl + 'zuma2.png',
//     weChat: imgurl + 'WeChat.png',
//     showModal: true,
//     assgin: "",
//     createCardeState: false //true为自己创建,false为他人创建
//   },
//   lifetimes: {
//     // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
//     attached: function() {},
//     moved: function() {},
//     detached: function() {},
//   },

//   // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
//   attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
//   ready: function() {},

//   pageLifetimes: {
//     // 组件所在页面的生命周期函数
//     show: function() {},
//   },
//   methods: {
//     onLoad(options) {
//       console.log(options, "*******((((((((")
//       this.setData({
//         assgin: options.assgin
//       })
//       // wx.hideTabBar({
//       //   animation: true //是否需要过渡动画
//       // })
//     },
//     getPhoneNumber(e) {
//       console.log("------==--------")
//       let _this = this;
//       let detail = e.detail;
//       let assign = this.data.assgin == "" ? 1 : this.data.assgin;
//       wx.request({
//         url: dataUrl + 'manage-api/resource/carduser/getPhoneNumAndRegist',
//         data: {
//           encryptedData: detail.encryptedData,
//           iv: detail.iv
//         },
//         header: {
//           'content-type': 'application/json',
//           'Authorization': wx.getStorageSync("token").token
//         },
//         success: res => {
//           console.log(res, "---------**********")
//           if (res.statusCode == 200) {
//             if (res.data.status == 200) {
//               let _data = res.data.data;
//               wx.setStorageSync('phone', _data.fPhone);
//               wx.setStorageSync('zmToken', _data.zmToken);
//               wx.navigateBack({
//                 delta: assign
//               })
//             } else {
//               if (res.data.status == 404) {
//                 if (res.data.message == "token参数不能为空") {
//                   wx.navigateBack({
//                     delta: 1
//                   })
//                 } else {
//                   if (res.data.message == "token失效") {
//                     wx.navigateBack({
//                       delta: 1
//                     })
//                   }
//                 }
//               }
//             }



//           }
//           // if (wx.getStorageSync('phone') == undefined) {
//           //   wx.setStorageSync('phone', res.data.data);
//           // } else {
//           //   wx.removeStorageSync('phone');
//           //   wx.setStorageSync('phone', res.data.data);
//           // }

//         },
//         fail: err => {
//           console.log(err, "222222222")
//         },
//         complete: mes => {
//           console.log(mes, "333333333")
//         }
//       })
//     }
//   }
// })
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    indexImg: imgurl + 'zuma2.png',
    weChat: imgurl + 'WeChat.png',
    showModal: true,
    assgin: "",
    createCardeState: false //true为自己创建,false为他人创建
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求接口数据;
    console.log(options, "*******((((((((")
    this.setData({
      assgin: options.assgin
    })
    wx.setNavigationBarTitle({
      title: '注册'
    })
      // wx.hideTabBar({
      //   animation: true //是否需要过渡动画
      // })
  },
  getPhoneNumber(e) {
    console.log("------==--------")
    let _this = this;
    let detail = e.detail;
    let assign = this.data.assgin == "" ? 1 : this.data.assgin;
    let _chan = wx.getStorageSync("proType") ? wx.getStorageSync("proType").type:"";
    wx.request({
      url: dataUrl + 'manage-api/resource/carduser/getPhoneNumAndRegist',
      data: {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        channel: _chan
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("token").token
      },
      success: res => {
        console.log(res, "---------**********")
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            let _data = res.data.data;
            wx.setStorageSync('phone', _data.fPhone);
            wx.setStorageSync('zmToken', _data.zmToken);
            wx.navigateBack({
              delta: assign
            })
          } else {
            if (res.data.status == 404) {
              if (res.data.message == "token参数不能为空") {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                if (res.data.message == "token失效") {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            }
          }



        }
        // if (wx.getStorageSync('phone') == undefined) {
        //   wx.setStorageSync('phone', res.data.data);
        // } else {
        //   wx.removeStorageSync('phone');
        //   wx.setStorageSync('phone', res.data.data);
        // }

      },
      fail: err => {
        console.log(err, "222222222")
      },
      complete: mes => {
        console.log(mes, "333333333")
      }
    })
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
  onUnload: function () { },

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
    var shareObj = {
      title: "能够关联网站、公众号、小程序的智能微信名片！",
      path: "/pages/index/index",
      imageUrl: imgurl + '智慧.png'
    }
    return shareObj;
  }
})