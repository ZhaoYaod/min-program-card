// pages/scan/scan.js
// const iconList = require('../../utils/iconPath.js');
const app = getApp();
let imgurl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
const backgroundAudioManager = wx.getBackgroundAudioManager(); //创建背景音乐
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    src: "",
    borderImg: imgurl + 'tou1.png',
    flashImg: imgurl + "gou2.png",
    xiangjiImg: imgurl + "xiangji.png",
    checkImg: true,
    iconList: [{
      takecard: imgurl + "scanpic.png",
      selectTack: imgurl + "scanispic.png",
    }, {
      takecard: imgurl + "scanno.png",
      selectTack: imgurl + "scanis.png",
    }, {
      takecard: imgurl + "isphoto2.png",
      selectTack: imgurl + "photo1.png",
    }],
    iconTitle: [{
      title: "拍名片",
    }, {
      title: "扫小程序码"
    }, {
      title: "相册"
    }],
    contBoxW:262,
    screenHeight: 0,
    screenWidth: 0,
    btnTop: 0,
    boxTop: 0,
    showPop2: false,
    showPop: false,
    contentTit: "识别失败，请重试！",
    direction: 0,
    link: 1,
    leftBtnTit: "我知道了",
    leftcolor: "#202020",
    rightBtnTit: "查看选择",
    isLoading: false,
    camera: true,
    warnBoxTit: "图片识别中~"
  },
  cancel() {
    this.setData({
      showPop2: false
    })
  },
  confirm() {
    this.setData({
      showPop2: false
    })
  },
  changeIndex(event) {
    console.log(event)
    let _this = this;
    let _num = event.currentTarget.dataset.index;
    this.setData({
      index: _num
    });
    if (this.data.index == 1) {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res.path, res.scanType,"************")
          if (res.errMsg == "scanCode:ok") {
            console.log(res.scanType,"___________+_____")
            if (res.scanType == "WX_CODE") {
              console.log(res.path)
              let _url;
              _url= res.path.indexOf("cardId") > -1 ? res.path : '';
              if(_url.indexOf("cardId")>-1){
                let url=decodeURIComponent(res.path).split("=");
                console.log(url,"888888888888888888****************");
                let _url2=url[0].replace('?scene',"");
                let fId=url[2];
                _url=_url2+'?fId='+fId;
              }
              if (_url) {
                wx.navigateTo({
                  url: '../../' +  _url
                })
                console.log("--------&&&&&&&33333333333&&&&&&")
              } else {
                // wx.showModal({
                //   content: '非法名片小程序码',
                //   showCancel: false,
                //   confirmText: "我知道了",
                //   success(res) {
                //     if (res.confirm) {
                //       console.log('用户点击确定')
                //     }
                //   }
                // })
                console.log("--------&&&&2222222222&&&&&&&&&")
                _this.setData({
                  showPop2: true
                })
              }

            } else {
              console.log("--------&&1111111&&&&&&&&&&&")
              _this.setData({
                showPop2: true
              })
              // wx.showModal({
              //   content: '非法名片小程序码',
              //   showCancel: false,
              //   confirmText: "我知道了",
              //   success(res) {
              //     if (res.confirm) {
              //       console.log('用户点击确定')
              //     }
              //   }
              // })
            }
          } else {
            console.log("--------&&&&&&&&&&&&&")
            _this.setData({
              showPop2: true
            })
            // wx.showModal({
            //   content: '非法名片小程序码',
            //   showCancel: false,
            //   confirmText: "我知道了",
            //   success(res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定')
            //     }
            //   }
            // })
          }
        },
        fail(err) {
          // _this.setData({
          //   showPop2: true
          // })
          var pages = getCurrentPages();
          var prevPage = pages[1]; //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            camera: true,
            checkImg: true,
            index: 0
          })
          // wx.navigateBack({//返回
          //   delta: 2
          // })
        }
      })
    } else {
      if (this.data.index == 2) {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths[0];
            console.log(tempFilePaths);
            wx.navigateTo({
              url: '../readData/readData?index=' + _this.data.index + '&temp=' + tempFilePaths,
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function(data) {
                  console.log(data)
                },
                someEvent: function(data) {
                  console.log(data)
                }
              },
              success: res => {
                console.log("成功！")
              }
            })
          },
          fail(err) {
            // _this.setData({
            //   showPop2: true
            // })
            var pages = getCurrentPages();
            var prevPage = pages[1]; //上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
              camera: true,
              checkImg: true,
              index: 0
            })
            // wx.navigateBack({//返回
            //   delta: 1
            // })
          }
        })
      }
    }
  },
  takePhoto() {
    console.log("-------22222222-=======")
    //创建 camera 上下文 CameraContext 对象
    let _this = this;
    this.setData({
      index: 0
    }, () => {
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: 'high',
        success: res => {
          let temp = res.tempImagePath;
          console.log(temp)
          _this.setData({
            src: temp
          }, () => {
            _this.setData({
              checkImg: false
            })
          });
        },
        fail: err => {
          // wx.navigateBack({
          //   delta: 1
          // });
          console.log(err)
        }
      })
    })

  },
  leftBtn() {
    this.setData({
      showPop: false
    })
  },
  cancel2() {
    let _this = this;
    this.setData({
      showPop: false
    })
    switch (this.data.link) {
      case 1:
        // let pages = getCurrentPages();
        // let prevpage = pages.find(item => {
        //   return item.route == "pages/scan/scan";
        // }); // 上一个页面
        // prevpage.setData({
        //   checkImg: true,
        //   index: 0
        // })
        // console.log(pages)
        // wx.navigateBack()
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
        var prevPage = pages[1]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          scanBack: true
        })
        wx.navigateBack({ //返回
          delta: 1
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
      case 4:
        wx.redirectTo({
          url: '../index/index',
        })
        break;
      default:
        break;
    }
  },
  confirm2() {
    let _this = this;
    this.setData({
      showPop: false
    })
    if (this.data.link == 4) {
      wx.openSetting({
        success(suc) {
          suc.authSetting = {
            "scope.camera": true
          };
          wx.getSetting({
            success(res) {
              console.log(res, res.authSetting['scope.camera'], "_______^^^^^^^^^^^^^^")
            }
          });
        }
      });
      return;
    }
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
  setResquest(temp, token) {
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
              contentTit: "识别失败，请重试！",
              showPop: true,
              leftcolor: "#202020",
              leftBtnTit: "我知道了",
              direction: 0,
              link: 1
            })
            // if (str) {
            //   _this.setData({
            //     contentTit: "识别失败，请重试！",
            //     showPop: true,
            //     link: 1
            //   })
            // } else {
            //   _this.setData({
            //     contentTit: "无法识别所选择图片",
            //     showPop: true,
            //     link: 1
            //   })
            // }

            // wx.showModal({
            //   content: '无法识别所选择图片',
            //   showCancel: false,
            //   confirmText: "我知道了",
            //   confirmColor: "#202020",
            //   success(res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定')
            //       let pages = getCurrentPages();
            //       let prevpage = pages.find(item => {
            //         return item.route == "pages/scan/scan";
            //       }); // 上一个页面
            //       prevpage.setData({
            //         checkImg: false,
            //         index: 0
            //       })
            //       console.log(pages)
            //       wx.navigateBack()
            //     }
            //   }
            // })
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
                  list: _data.list
                })
                // wx.showModal({
                //   content: '已达到个人5张名片上限！',
                //   showCancel: false,
                //   confirmText: "查看选择",
                //   confirmColor: "#1081FF",
                //   success(res) {
                //     if (res.confirm) {
                //       console.log('用户点击确定')
                //       wx.navigateTo({
                //         url: '../searchScan/searchScan',
                //         events: {
                //           // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                //           acceptDataFromOpenedPage: function(data) {
                //             // console.log(data)
                //           },
                //           someEvent: function(data) {
                //             // console.log(data)
                //           }
                //         },
                //         success: res => {
                //           // 通过eventChannel向被打开页面传送数据
                //           let file = _data.list.map(item => {
                //             item.flahScan = false
                //           })
                //           res.eventChannel.emit('acceptDataFromOpenerPage', {
                //             setlist: _data.list
                //           })
                //           console.log("成功！")
                //         }
                //       })
                //     }
                //   }
                // })
              } else {
                _this.setData({
                  contentTit: '检测到该手机号码已经有' + _data.list.length + '张名片',
                  showPop: true,
                  leftBtnTit: "继续创建",
                  rightBtnTit: "查看选择",
                  rightcolor: "#1081FF",
                  link: 3,
                  direction: 1,
                  list: _data.list
                })
                // wx.showModal({
                //   content: '检测到该手机号码已经有' + _data.list.length + '张名片',
                //   cancelText: "继续创建",
                //   confirmText: "查看选择",
                //   confirmColor: "#1081FF",
                //   success(res) {
                //     if (res.confirm) {
                //       console.log('用户点击查看选择')
                //       wx.navigateTo({
                //         url: '../searchScan/searchScan',
                //         events: {
                //           // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                //           acceptDataFromOpenedPage: function(data) {
                //             // console.log(data)
                //           },
                //           someEvent: function(data) {
                //             // console.log(data)
                //           }
                //         },
                //         success: res => {
                //           // 通过eventChannel向被打开页面传送数据
                //           res.eventChannel.emit('acceptDataFromOpenerPage', {
                //             setlist: _data.list
                //           })
                //           console.log("成功！")
                //         }
                //       })
                //     } else {

                //       wx.navigateTo({
                //         url: '../addLable/addLable',
                //         events: {
                //           // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                //           acceptDataFromOpenedPage: function(data) {
                //             // console.log(data)
                //           },
                //           someEvent: function(data) {
                //             // console.log(data)
                //           }
                //         },
                //         success: res => {
                //           console.log("成功！")
                //         }
                //       })
                //       console.log('用户点击继续创建')
                //     }
                //   }
                // })
              }

            }
          }
        } else {
          // wx.showModal({
          //   content: '无法识别所选择图片',
          //   showCancel: false,
          //   confirmText: "我知道了",
          //   confirmColor: "#202020",
          //   success(res) {
          //     if (res.confirm) {
          //       console.log('用户点击确定')
          //       let pages = getCurrentPages();
          //       let prevpage = pages.find(item => {
          //         return item.route == "pages/scan/scan";
          //       }); // 上一个页面
          //       prevpage.setData({
          //         checkImg: false,
          //         index: 0
          //       })
          //       console.log(pages)
          //       wx.navigateBack()
          //     }
          //   }
          // })
          _this.setData({
            contentTit: "识别失败，请重试！",
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
          contentTit: "识别失败，请重试！",
          showPop: true,
          leftcolor: "#202020",
          leftBtnTit: "我知道了",
          direction: 0,
          link: 1
        })
        // wx.showModal({
        //   content: '无法识别所选择图片',
        //   showCancel: false,
        //   confirmText: "我知道了",
        //   confirmColor: "#202020",
        //   success(res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //       let pages = getCurrentPages();
        //       let prevpage = pages.find(item => {
        //         return item.route == "pages/scan/scan";
        //       }); // 上一个页面
        //       prevpage.setData({
        //         checkImg: false,
        //         index: 0
        //       })
        //       console.log(pages)
        //       wx.navigateBack()
        //     }
        //   }
        // })
      }
    })
  },
  rePhoto() {
    this.setData({
      checkImg: true
    })
  },
  takePhotoLink() {
    let _this = this;
    let token = wx.getStorageSync("token") ? wx.getStorageSync("token").token : "";
    this.setData({
      isLoading: true,
      warnBoxTit: "图片识别中~"
    }, () => {
      _this.setResquest(_this.data.src, token)
    })
  },
  binderror(event) {
    this.setData({
      showPop: true,
      link: 4,
      contentTit: "请点击确定，开启相机权限",
      direction: 1,
      leftBtnTit: "取消",
      rightBtnTit: "确定",
      camera: false
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log("---------00000000")
        let _width = parseInt(res.screenWidth / (100 / 82));
        let _height = res.screenHeight;
        let btnH = 86;
        let footH = 48;
        let boxTop = _height <= 568 ? 78 : _height <= 750 ? 100 : 170;
        _this.setData({
          screenHeight: res.screenHeight,
          screenWidth: res.screenWidth,
          contBoxW: _width,
          btnTop: 112.32,
          boxTop: boxTop
        })
      }
    })
    // let _height = this.data.screenHeight;
    // let btnH = 86;
    // let footH = 48;
    // let boxTop = _height <= 568 ? 78 : _height <= 750 ? 100 : 170;
    // this.setData({
    //   btnTop: 112.32,
    //   boxTop: boxTop
    // })
    wx.setNavigationBarTitle({
      title: '扫名片'
    })
    // 将 base64 的文件保存到当前page的data中
    let icon = this.data.iconList.map((item, index) => {
      this.data.iconTitle.forEach((ele, i) => {
        if (index == i) {
          item.title = ele.title
        }
      })
      return item;
    });
    console.log(icon)
    this.setData({
      iconList: icon
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera'] && res.authSetting['scope.camera'] !== undefined) {
          console.log("我重新授权中！")
          wx.authorize({
            scope: 'scope.camera',
            success(ces) {
              console.log("授权成功", ces)
              _this.setData({
                camera: true
              })
            },
            fail(err) {
              console.log(err, "授权失败")
              _this.setData({
                showPop: true,
                link: 4,
                contentTit: "请点击确定，开启相机权限",
                direction: 1,
                leftBtnTit: "取消",
                rightBtnTit: "确定",
                camera: false
              })
            }
          });

        } else {
          if (res.authSetting['scope.camera']) {
            _this.setData({
              isLoading: true,
              warnBoxTit: "页面加载中~",
            }, () => {
              _this.setData({
                camera: true
              }, () => {
                _this.setData({
                  isLoading: false
                })
              })
            })
          }

        }
      }
    })
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
    // let pages = getCurrentPages();
    // let len = pages.length;
    // for (let i = 0; i < pages.length; i++) {
    //   //上一页面;
    //   console.log("dddddddddddddd", pages[i])
    //   if (pages[i].route == "pages/readData/readData") {
    //     if (pages[i - 1].route == "pages/scan/scan") {
    //       len = len - i;
    //       break;
    //     }
    //   }
    // }
    // if (len == 2) {
    //   wx.navigateBack({
    //     delta: len
    //   })
    // }

    // let url = router.split("pages/")[1];
    // wx.navigateTo({
    //   url: "../" + url
    // })
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