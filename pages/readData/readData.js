// pages/scan/readData/readData.js
const app = getApp();
let imgurl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
const backgroundAudioManager = wx.getBackgroundAudioManager(); //创建背景音乐
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    showPop: false,
    contentTit: "识别失败，请重试！",
    direction: 0,
    link: 1,
    leftcolor: "#202020",
    leftBtnTit: "我知道了",
    rightBtnTit: "查看选择",
    list: [],
    flashImg: imgurl + 'lodingFlash.gif'
  },
  cancel() {
    let _this = this;
    this.setData({
      showPop: false
    })
    switch (this.data.link) {
      case 1:
        var pages = getCurrentPages();
        var prevpage = pages.find(item => {
          return item.route == "pages/scan/scan";
        }); // 上一个页面
        prevpage.setData({
          camera: true,
          checkImg: true,
          index: 0
        })
        console.log(pages)
        wx.navigateBack()
        break;
      case 2:
        // backgroundAudioManager.title = "5358";
        // backgroundAudioManager.src = imgurl + "5358.wav";
        // wx.navigateTo({
        //   url: '../searchScan/searchScan',
        //   events: {
        //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        //     acceptDataFromOpenedPage: function(data) {
        //       // console.log(data)
        //     },
        //     someEvent: function(data) {
        //       // console.log(data)
        //     }
        //   },
        //   success: res => {
        //     // 通过eventChannel向被打开页面传送数据
        //     console.log("-----------=====----", res, _this.data.list)
        //     let file = _this.data.list.map(item => {
        //       item.flahScan = false
        //     })
        //     res.eventChannel.emit('acceptDataFromOpenerPage', {
        //       setlist: _this.data.list
        //     })
        //     console.log("成功！")
        //   }
        // })
        var pages = getCurrentPages();
        var prevPage = pages[0]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          scanBack: true
        })
        wx.navigateBack({ //返回
          delta: 2
        })
        break;
      case 3:
        backgroundAudioManager.title = "5358";
        backgroundAudioManager.src = imgurl + "5358.wav";
        wx.removeStorage({
          key: 'lable'
        });
        wx.removeStorage({
          key: 'assignLable'
        });
        wx.navigateTo({
          url: '../addLable/addLable',
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            acceptDataFromOpenedPage: function(data) {
              // console.log(data)
            },
            someEvent: function(data) {
              // console.log(data)
            }
          },
          success: res => {
            console.log("成功！")
          }
        })
        break;
      default:
        break;
    }
  },
  confirm() {
    let _this = this;
    this.setData({
      showPop: false
    })
    backgroundAudioManager.title = "5358";
    backgroundAudioManager.src = imgurl + "5358.wav";
    wx.navigateTo({
      url: '../searchScan/searchScan',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          // console.log(data)
        },
        someEvent: function(data) {
          // console.log(data)
        }
      },
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          setlist: _this.data.list
        })
        console.log("成功！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '扫名片'
    })
    //请求接口数据;
    //获取被打开页面传送到当前页面的数据;
    backgroundAudioManager.title = "5358";
    backgroundAudioManager.src = imgurl + "5358.wav";

    wx.setNavigationBarTitle({
      title: '扫名片'
    })
    console.log(options)
    let token = wx.getStorageSync("token") ? wx.getStorageSync("token").token : "";
    let phone = options.phone;
    if (phone) { //分享进入
      wx.request({
        url: dataUrl + 'manage-api/resource/cardbag/queryByPhone',
        header: {
          "Content-Type": " application/json",
          "Authorization": token
        }
      })
    } else { //正常进入;
      let index = options.index;
      let temp = options.temp;
      console.log(index, temp)
      if (index == 2) {
        this.setResquest(temp, token)
      }
      // switch (index) {
      //   case "0":
      //     console.log("------00000000")
      //     this.setResquest(temp, token, "str")
      //     break;
      //   case "2":
      //     console.log("------111111")
      //     this.setResquest(temp, token)
      //     break;
      // }
    }
  },
  setResquest(temp, token, str) {
    let _this = this;
    wx.uploadFile({
      url: dataUrl + 'manage-api/resource/cardScan/scanCardFile', //仅为示例，非真实的接口地址
      filePath: temp,
      header: {
        "Content-Type": " application/json",
        "Authorization": token
      },
      name: 'file',
      success(res) {
        _this.setData({
          isLoading: false
        })
        if (res.statusCode == 200) {
          console.log(res, "------=-----------")
          const _data = JSON.parse(res.data);
          if (_data.status == "fail") {
            _this.setData({
              contentTit: "无法识别所选择图片",
              showPop: true,
              leftcolor: "#202020",
              leftBtnTit: "我知道了",
              direction: 0,
              link: 1
            })
          } else {
            console.log(_data, _data.is_exist)
            if (_data.is_exist == 0) {
              wx.setStorageSync("cardInfo", _data.list);
              wx.setStorageSync("takePhoto", _data.url);
              wx.navigateTo({
                url: '../addLable/addLable',
                events: {
                  // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                  acceptDataFromOpenedPage: function(data) {
                    // console.log(data)
                  },
                  someEvent: function(data) {
                    // console.log(data)
                  }
                },
                success: res => {
                  console.log("成功！")
                }
              })
            } else {
              wx.setStorageSync("cardInfo", _data.existList);
              wx.setStorageSync("takePhoto", _data.url);
              if (_data.list.length >= 5) {
                _this.setData({
                  contentTit: "已达到个人5张名片上限！",
                  showPop: true,
                  leftcolor: "#202020",
                  leftBtnTit: "我知道了",
                  rightBtnTit: "查看选择",
                  rightcolor: "#1081FF",
                  link: 2,
                  direction: 1,
                  list: _data.list,
                })
              } else {
                _this.setData({
                  contentTit: '检测到该手机号码已经有' + _data.list.length + '张名片',
                  showPop: true,
                  leftcolor: "#202020",
                  leftBtnTit: "继续创建",
                  rightBtnTit: "查看选择",
                  rightcolor: "#1081FF",
                  link: 3,
                  direction: 1,
                  list: _data.list
                })
              }

            }
          }
        } else {
          _this.setData({
            contentTit: "无法识别所选择图片",
            showPop: true,
            leftcolor: "#202020",
            leftBtnTit: "我知道了",
            direction: 0,
            link: 1
          })
        }
        //do something
      },
      fail(err) {
        _this.setData({
          isLoading: false
        })
        _this.setData({
          contentTit: "无法识别所选择图片",
          showPop: true,
          leftcolor: "#202020",
          leftBtnTit: "我知道了",
          direction: 0,
          link: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    backgroundAudioManager.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    backgroundAudioManager.stop();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var shareObj = {
      title: "纸质名片扫描仪，快速生成电子名片！",
      path: "/pages/scan/scan",
      imageUrl: imgurl + '扫码.png'
    }
    return shareObj;
  }
})