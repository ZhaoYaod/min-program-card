// pages/selecttemp/selecttemp.js
const app = getApp();
let imgurl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
let throttle = function(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000
  }

  let _lastTime = null;
  // 返回新的函数
  return function(e) {
    console.log(this)
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      // fn.apply(this, arguments)   //将this和参数传给原函数
      fn(this, e) //上方法不可行的解决办法 改变this和e
      _lastTime = _nowTime
    }
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // templist: [{
    //     fCode: 1,
    //     fImgUrl: '',
    //     fName: '模版名称',
    //     fAmount: '0',
    //     issearch: true
    //   },
    //   {
    //     fCode: 2,
    //     fImgUrl: '',
    //     fName: '名片分四官方',
    //     fAmount: '9.00',
    //     issearch: false
    //   },
    //   {
    //     fCode: 3,
    //     fImgUrl: '',
    //     fName: '名片',
    //     fAmount: '19.00',
    //     issearch: false
    //   },
    //   {
    //     fCode: 4,
    //     fImgUrl: '',
    //     fName: '名片分四等等',
    //     fAmount: '9.00',
    //     issearch: false
    //   },
    //   {
    //     fCode: 5,
    //     fImgUrl: '',
    //     fName: '名片分四',
    //     fAmount: '9.00',
    //     issearch: false
    //   }
    // ],
    // toView: 'green',
    // scrollState: true,
    // recordTop: "", //记录滚动的top值
    // boxTop: "", //最终展示的top值;
    // boxState: false, //设置展示的值;
    showCreat: false,//只为他人创建弹出框写入状态;
    showModal: false, //控制为他人创建弹出框展示;
    templist: [],
    selectid: -1, //选择的id,用于模板数据预览;
    priceList: [{
      fAmount: "0",
      list: []
    }, {
      fAmount: "9",
      list: []
    }, {
      fAmount: "19",
      list: []
    }, {
      fAmount: "29",
      list: []
    }, {
      fAmount: "39",
      list: []
    }],
    checkImg: imgurl + "right.png",
    warnTit: "请选择模板",
    hideModal: false,
    warnFlash: 1,
    time: null,
    isCheck: 0,
    lable: [],
    isSelect: false,
    loginState: false,
    isprice: 0,
    phone: "",
    tempEdit: false, //true为二次模板编辑;
    createState: true, //true为自己创建，默认为他人创建
    screenW: 0,
    screenH: 0,
    warpW: 0,
    moveLeft: 0,
    addphone: () => {},
    num: 0

  },
  tempView() {
    var tmpId = this.data.selectid;
    let _this = this;
    // var pric = this.data.priceList[this.data.isCheck];
    if (this.data.selectid != -1) {
      var _find = this.data.templist.find(item => {
        return item.fCode == tmpId;
      })
      console.log(_find,'000000000000');
      wx.navigateTo({
        url: '../../' + _find.fXmlPath + '?assign=' + JSON.stringify(_find)
      })

      wx.request({
        url: dataUrl + '/manage-api/resource/cardTemplate/updatePreNum?templateCode=' + tmpId,
        header: {
          "Content-Type": "application/json"
        },
        success: res => {
          if (res.data.status == 0) {
            console.log(res.data.message, "----=----")
          } else {
            console.log(res.data.message, "----=----")
          }
        },
        file: err => {
          console.log(err)
        }
      })

    } else {
      if (!this.data.hideModal) {
        this.setData({
          hideModal: true,
          warnFlash: 0,
          warnTit: "请选择模板",
        }, () => {
          setTimeout(() => {
            this.setData({
              hideModal: false
            });
          }, 2000)
        });
      }
    }
  },
  isCheckPic(event) {
    let index = event.currentTarget.dataset.index;
    console.log(index)
    let price = this.data.priceList[index].fAmount;
    console.log(price, "************(((((((()))))))))))555555555")
    //当前选中价格;
    this.setData({
      isCheck: index,
      isprice: price,
      hideModal: true,
      warnFlash: 1,
      warnTit: "数据加载中",
    }, () => {
      //过滤选中的价格;
      this.setTempList(price, "pric", index)

    })

    console.log(this.data.moveLeft)
    // let _filter = this.data.templist.map(item => {
    //   item.fAmount == filpic ? item.issearch = true : item.issearch = false;
    //   return item;
    // });
    // this.setData({
    //   templist: _filter
    // })
  },
  // 事件
  onMyEvent(e) {
    this.setData({
      loginState: e.detail.loginState
    })
  },
  selecttemp(e) {
    console.log(e.currentTarget.dataset.id,"********(((((((()))")
    if (this.data.selectid !== e.currentTarget.dataset.id) {
      this.setData({
        selectid: e.currentTarget.dataset.id
      })
    } else {
      this.setData({
        isSelect: true
      }, () => {
        if (this.data.isSelect) {
          this.setData({
            selectid: -1,
            isSelect: false
          })
        } else {
          this.setData({
            selectid: e.currentTarget.dataset.id,
            isSelect: false
          })
        }
      })
    }

  },
  setTempList(pice, str, index) {
    let _this = this;
    let num = this.data.num;
    wx.request({
      url: dataUrl + 'manage-api/resource/cardTemplate/queryList',
      data: {
        iDisplayStart: 0,
        iDisplayLength: 100,
        fCompare: 1,
        fAmount: pice
      },
      header: {
        "Content-Type": "application/json",
        "Authorization": wx.getStorageSync('token').token
      },
      success: res => {
        let file = _this.data.priceList;
        let _list = file[_this.data.isCheck].list;
        if (str) {
          file[_this.data.isCheck].list.splice(0, file[_this.data.isCheck].list.length);
        }
        res.data.data.data.forEach(item => {
          item.fPrice = item.fAmount == 0 ? '免费' : '￥' + item.fAmount;
          if (str) {
            file.forEach((ele, i) => {
              if (i == _this.data.isCheck) {
                file[_this.data.isCheck].list.push(item)
              } else {
                file[i].list = [];
              }
            })

          } else {
            switch (item.fAmount) {
              case 0:
                file[0].list.push(item)
                break;
              case 9:
                file[1].list.push(item)
                break;
              case 19:
                file[2].list.push(item)
                break;
              case 29:
                file[3].list.push(item)
                break;
              case 39:
                file[4].list.push(item)
                break;
              default:
                break;
            }
          }
        })
        _this.setData({
          templist: res.data.data.data,
          priceList: file,
          hideModal: false
          // boxTop: this.data.recordTop
        }, () => {
          if (index > num) {
            num = index;
            this.setData({
              moveLeft: -(index * 100) + '%',
              num: index
            })

          } else {
            if (index < num) {
              num = index;
              let result = -(index * 100) + '%';
              this.setData({
                moveLeft: result,
                num: index
              })
            }

          }
        });
      },
      fail: err => {}
    })
  },
  useTemplate() {
    let _this = this;
    let file = this.data.lable;
    let assign = "";
    if (wx.getStorageSync("lable")) {
      file = wx.getStorageSync("lable")
    }
    if (wx.getStorageSync("assignLable")) {
      assign = wx.getStorageSync("assignLable")
    }
    this.setData({
      lable: [...file, ...assign],
      phone: wx.getStorageSync('phone') ? wx.getStorageSync('phone'):""
    }, () => {
      console.log(this.data.lable.length, "---------==---------00", this.data.lable, file)
    })
    if (!wx.getStorageSync('token')) {
      _this.setData({
        loginState: true
      })

    } else {
      if (!wx.getStorageSync('phone')){
       wx.navigateTo({
          url: "../component/getPhone/getPhone?assign=1"
        })
        return;
      }
      if (_this.data.lable.length == 0) {
        let _find = {
          fName: null,
          fCode: null,
          fXmlPath: null,
          fHeadType: null,
          fAmount: null
        };
        if (_this.data.selectid != -1) {
          _find = _this.data.templist.find(item => {
            return item.fCode == _this.data.selectid
          });
          // 通过eventChannel向被打开页面传送数据
          wx.setStorageSync('tempData', {
            fName: _find.fName, //模板名称
            fCode: _find.fCode, //名片模板编号
            fXmlPath: _find.fXmlPath, //模板XML路径
            fHeadType: _find.fHeadType, //名片头像类型 1-小头像 2-大头像
            fAmount: _find.fAmount,
            fPosterAllUrl: _find.fPosterAllUrl
          })
        }
        console.log(_this.data.selectid,"**************")
        this.setData({
          showCreat:"",
          showModal: true,
          selectid:_this.data.selectid
        })
        // wx.navigateTo({
        //   url: '../addLable/addLable',
        //   events: {
        //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        //     acceptDataFromOpenedPage: function (data) {
        //       console.log(data)
        //     },
        //     someEvent: function (data) {
        //       console.log(data)
        //     }
        //   },
        //   success: res => {
        //     // 通过eventChannel向被打开页面传送数据
        //     res.eventChannel.emit('acceptDataFromOpenerPage', {
        //       selectid: _this.data.selectid
        //     })
        //     _this.setData({
        //       showModal: false,
        //       showCreat: false
        //     })
        //     console.log("成功！")
        //   }
        // })
        
      } else {
        if (_this.data.tempEdit) {
          let pages = getCurrentPages();
          let prevpage = pages.find(item => {
            return item.route == "pages/forminput/forminput";
          }); // 上一个页面
          let _filter = _this.data.templist.find(item => {
            return item.fCode == _this.data.selectid
          });
          console.log(_filter, "--------*****")
          prevpage.setData({
            tempname: _filter.fName,
            tempId: _filter.fCode,
            tempPath: _filter.fXmlPath,
            headType: _filter.fHeadType,
            tempPrice: _filter.fAmount,
            fPosterAllUrl: _filter.fPosterAllUrl,
            // bgm: _filter.fMusicName,
            // bgmurl: _filter.fMusicUrl,
            // bgmid: _filter.fMusicId,
            tempBgmId: _filter.fMusicId
          })
          wx.navigateBack()
        } else {
          let _find = {
            fName: null,
            fCode: null,
            fXmlPath: null,
            fHeadType: null,
            fAmount: null
          };
          if (_this.data.selectid != -1) {
            _find = _this.data.templist.find(item => {
              return item.fCode == _this.data.selectid
            });
            // 通过eventChannel向被打开页面传送数据
            wx.setStorageSync('tempData', {
              fName: _find.fName, //模板名称
              fCode: _find.fCode, //名片模板编号
              fXmlPath: _find.fXmlPath, //模板XML路径
              fHeadType: _find.fHeadType, //名片头像类型 1-小头像 2-大头像
              fAmount: _find.fAmount,
              fPosterAllUrl: _find.fPosterAllUrl,
              fMusicId: _find.fMusicId,
              fMusicName: _find.fMusicName,
              fMusicUrl: _find.fMusicUrl
            });
            if (wx.getStorageSync("createCardeState") === "") {
              this.setData({
                showModal: true,
                showCreat:false
              })
            } else {
              wx.navigateTo({
                url: '../forminput/forminput'
              })
            }

            // this.setData({
            //   clickState: !this.data.clickState
            // }, () => {
            //   if (this.data.clickState) {
            //     wx.removeStorageSync({
            //       clickState: ''
            //     })
            //   } else {
            //     return
            //   }

            // })
            // wx.setStorageSync("clickState", true);
            // console.log(wx.getStorageSync("clickState") == "", wx.getStorageSync("clickState") != false, "______+++_____________")
            // if (wx.getStorageSync("clickState") == "" && wx.getStorageSync("clickState") != false) {
            //   console.log("1111111111111111111")
            //   wx.setStorageSync("clickState", false);
            //   wx.navigateTo({
            //     url: '../forminput/forminput'
            //   })
            // } else {
            //   console.log("2222222222222")
            //   return;
            // }

          } else {
            if (!this.data.hideModal) {
              this.setData({
                hideModal: true,
                warnFlash: 0,
                warnTit: "请选择模板",
              }, () => {
                setTimeout(() => {
                  this.setData({
                    hideModal: false
                  });
                }, 2000)
              });
            }
          }
        }
      }
    };
  },
  bindscroll(event) {
    console.log(event, "(((((((((******&&&&&&&&&&^^^^^^")
    // this.setData({
    //   recordTop: event.detail.scrollTop
    // })
    // if (this.data.boxTop == event.detail.scrollTop) {
    //   // this.setData({
    //   //   scrollState:false
    //   // })
    // } else {
    // this.setData({
    //   recordTop: event.detail.scrollTop
    // })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    this.addphone = throttle(this.useTemplate, 2000),
      wx.getSystemInfo({
        success(res) {
          console.log(res, "---------00000000")
          let _height = res.screenHeight - (41 + 43);
          _this.setData({
            screenW: res.screenWidth,
            screenH: _height,
            warpW: res.screenWidth * _this.data.priceList.length
          })
        }
      })
    try {
      const eventChannel = this.getOpenerEventChannel();
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log(data)
        _this.setData({
          selectid: data.selectid,
          tempEdit: data.tempEdit,
          isprice: data.fAmount
        });

      })

    } catch (err) {

    }
    let index;
    let pric = this.data.priceList.find(item => item.fAmount == this.data.isprice);
    switch (pric.fAmount) {
      case "0":
        index = 0;
        break;
      case "9":
        index = 1;
        break;
      case "19":
        index = 2;
        break;
      case "29":
        index = 3;
        break;
      case "39":
        index = 4;
        break;
      default:
        break;
    }
    this.setData({
      isCheck: index,
      hideModal: true,
      warnFlash: 1,
      warnTit: "数据加载中",
    })
    this.setTempList(pric.fAmount, "", index);
    console.log(index, "==========-((((((((((((((", pric)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('下拉刷新')
    wx.stopPullDownRefresh({
      success: res => {
        let isprice = this.data.isprice;
        this.setTempList(isprice)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var shareObj = {
      title: "海量个性电子名片模板任意选",
      path: "/pages/selecttemp/selecttemp?share=3",
      imageUrl: imgurl + 'mineShare.png'
    }
    return shareObj;
  }
})