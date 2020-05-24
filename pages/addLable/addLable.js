// pages/addLable/addLable.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
const backgroundAudioManager = wx.getBackgroundAudioManager(); //创建背景音乐
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warnTit: "请选择行业标签",
    hideModal: true,
    warnFlash: 1,
    deleteImg: imgUrl + 'XX.png',
    labelList: [],
    ischeckLable: [], //选中的当前数据列表;
    mineList: [], //自定义标签列表；
    hiddenmodalput: false, //弹出框隐藏
    hiddenmodalbtn: true, //添加自定义标签按钮隐藏显示
    minevalue: '', //自定义标签输入框值
    delLable: false, //删除自定义标签显示隐藏
    isempty: false, //输入框是否为空
    ischeck: false, //不提示超过五个的自定义标签提示
    ismark: true, //是否允许雷达找到;
    selectid: -1, //是否勾选模板;
    isupdate: false,
    cardid: -1, //选择过标签id,用来直接加载;
    read: false, //超出不可编辑
    showPop: false,
    contentTit: "最多选择4个官方标签",
    direction: 0,
  },
  leftBtn() {
    this.setData({
      showPop: false
    })
  },
  ischeck(event) {
    if (!this.data.ischeck) {
      this.setData({
        ischeck: true
      }, () => {
        let _num = event.currentTarget.dataset.index; //点击当前的下标;
        console.log(_num)
        let file = [...this.data.labelList];
        let _Check = this.data.ischeckLable; //选中当前的数据列表;
        file[_num].ischeck = !file[_num].ischeck; //设置选中或非选中;
        console.log(_Check)
        let _filter = file.filter(ele => {
          return ele.ischeck;
        });
        if (_filter.length > 4) { //选中当前的列表个数大于5
          file[_num].ischeck = false; //选中当前的数据不显示;
          this.setData({ //提示或不提示超过五个的提示;
            showPop: true
          });
        } else { //选中当前的列表个数没有超过5;
          if (file[_num].ischeck) { //将当前选中状态为true
            _Check.length < 5 ? _Check.push(file[_num]) : ""; //push当前的选中数据到_Check中;
          } else { //从_Check移除当前选中状态为false的数据;
            _Check.forEach((item, i) => {
              if (file[_num].title == item.title) {
                _Check.splice(i, 1);
                file[_num].ischeck = false; //选中当前的数据不显示;
              }
            })

          }
        };
        let nocheck = file.filter(item => !item.ischeck);
        let arr = _Check.filter(item => item.ischeck)
        let cont = [...arr, ...nocheck];
        console.log(nocheck, file, arr, "********(((((((((*")
        this.setData({
          labelList: cont,
          ischeckLable: _Check,
          ischeck: false
        });
      })
    }

  },
  showfunc(e) {
    let funcindex = 'mineList[' + e.currentTarget.dataset.index + '].functab';
    this.setData({
      [funcindex]: true
    })
  },
  deleteLable(e) {
    let newLable = this.data.mineList
    newLable.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      mineList: newLable,
      hiddenmodalbtn: true
    })
  },
  mineLable() { //自定义标签弹窗弹出
    this.setData({
      hiddenmodalput: true
    })
  },
  setValue(e) { //获取input框输入值
    this.setData({
      minevalue: e.detail.value
    })
  },
  setModal(e) { //提示输入字符大于8个字符
    var value = e.detail.value;
    var curr = this.getByteLen(value);
    var str = "";
    var unIcode = 0;
    for (let i = 0; i < value.length; i++) {
      unIcode = curr;
      str += value[i];
      if (unIcode > 20) {
        return this.data.minevalue;
      } else {
        this.setData({
          minevalue: str
        })
      }

    }
  },
  getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);
      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  },
  cancel(e) { //自定义标签弹窗关闭
    this.setData({
      hiddenmodalput: false,
      minevalue: '',
    })
  },
  setValue(e) {
    this.setData({
      minevalue: e.detail.minevalue
    })
  },
  confirm(e) { //确认自定义标签
    let val = e.detail;
    let valLength = val.length;
    let mineList = this.data.mineList
    if (!valLength) {
      this.setData({
        isempty: true
      })
      wx.vibrateShort({
        success: res => {
          console.log("------------")
        }
      })
      return;
    } else {
      this.data.mineList.push({
        mineLable: val,
        functab: true
      })
      console.log(this.data.mineList);
      if (this.data.mineList.length < 3) {
        this.setData({
          isempty: false, //输入框是否为空;
          hiddenmodalput: false, //弹出框隐藏;
          minevalue: '', //自定义标签输入框值;
          mineList: mineList, //自定义标签列表;
          hiddenmodalbtn: true //自定义标签按钮隐藏;
        })
      } else {
        this.setData({
          isempty: false,
          hiddenmodalput: false,
          minevalue: '',
          mineList: mineList,
          hiddenmodalbtn: false
        })
      }
    }
  },
  addmark() {
    this.setData({
      ismark: !this.data.ismark
    });
    wx.setStorageSync("isRadar", this.data.ismark)
  },
  uploading() {
    let _this = this;
    console.log(_this.data.selectid, "*******111111*******")
    let url = this.data.selectid != -1 ? '../forminput/forminput' : '../selecttemp/selecttemp';
    let minList = [];
    let ismark = this.data.ismark ? 1 : 0;
    if (_this.data.mineList.length != 0) {
      minList = _this.data.mineList.map(item => {
        return item.mineLable;
      });
    }
    if (this.data.selectid == true) {
      wx.setStorageSync('lable', _this.data.ischeckLable); //选中标签;
      wx.setStorageSync("assignLable", minList); //自定义标签;
      let file = _this.data.ischeckLable.map(item => {
        return item.title;
      });
      let label = [...file, ...minList].toString();
      if (!label) {
        if (!this.data.hideModal) {
          this.setData({
            hideModal: true
          }, () => {
            setTimeout(() => {
              this.setData({
                hideModal: false
              });
            }, 2000)
          });
        }
        return;
      }
      console.log([...file, ...minList].toString())
      let pages = getCurrentPages();
      let prevpage = pages.find(item => {
        return item.route == "pages/forminput/forminput";
      }); // 上一个页面
      prevpage.setData({
        lable: [...file, ...minList].toString(),
        customTag: minList.toString(),
        isgeo: ismark
      })
      console.log(prevpage)
      wx.navigateBack()
    } else {
      wx.setStorageSync('lable', _this.data.ischeckLable); //选中标签;
      wx.setStorageSync("assignLable", minList); //自定义标签;
      let cont = [..._this.data.ischeckLable, ...minList];
      if (!cont.length) {
        if (!this.data.hideModal) {
          this.setData({
            hideModal: true,
            warnFlash: 0,
            warnTit: "请选择行业标签"
          }, () => {
            setTimeout(() => {
              this.setData({
                hideModal: false
              });
            }, 2000)
          });
        }
        return;
      }
      wx.navigateTo({
        url: url
      })
    }
  },
  update() {
    let _this = this;
    if (!this.data.ischeck) {
      this.setData({
        isupdate: true,
        ischeck: true
      });
      let checkLen = this.data.ischeckLable.length; //选中的length;
      let splLen;
      let file = [];
      this.data.ischeckLable.forEach(item => {
        item.ischeck ? file.push(item.title) : "";
      })
      let minList = [];
      if (_this.data.mineList.length != 0) {
        minList = _this.data.mineList.map(item => {
          return item.mineLable;
        });
      }
      let str = [...file, ...minList].toString();
      this.setLable(checkLen, str, file)
    }

  },
  setLable(checkLen, str, file) {
    let _this = this;
    wx.request({
      url: dataUrl + 'manage-api/resource/cardTag/queryTag',
      data: {
        num: 11,
        arrStr: str
      },
      header: {
        "Content-Type": "application/json",
        "Content-MD5": wx.getStorageSync("token").token
      },
      success: res => {
        let sout = res.data.map(item => { //没有选中的标签;
          return {
            title: item,
            ischeck: false
          };
        }).splice(0, 11 - checkLen);
        let label = file.map(ele => { //选中的标签;
          return {
            title: ele,
            ischeck: true
          };
        })
        _this.setData({
          labelList: [...label, ...sout],
          isupdate: false,
          ischeck: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pages = getCurrentPages();
    let len = pages.length;

    if (pages[len - 2] && pages[len - 2].route == "pages/scan/scan") {
      backgroundAudioManager.title = "5358";
      backgroundAudioManager.src = imgUrl + "5358.wav";
    }
    wx.setNavigationBarTitle({
      title: '添加标签'
    })
    wx.setStorageSync("isRadar", this.data.ismark)
    let _this = this;
    let str = [];
    let file = wx.getStorageSync('lable') != undefined && wx.getStorageSync('lable') != "" ? wx.getStorageSync('lable') : [];
    let assignLable = wx.getStorageSync('assignLable') != undefined && wx.getStorageSync('assignLable') != "" ? wx.getStorageSync('assignLable') : [];
    if (file.length != 0) {
      str = file.map(ele => ele.title);
    }
    str = [...str, ...assignLable].toString();
    const eventChannel = this.getOpenerEventChannel();
    var selID = -1;
    var ismark = true;
    if (eventChannel.on) {
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log(data, "---------=======---")
        if (data.selectid || data.ismark) {
          selID = data.selectid;
          ismark = data.ismark;
        }
        console.log(data)
      })
    }
    wx.request({
      url: dataUrl + 'manage-api/resource/cardTag/queryTag',
      data: {
        num: 11,
        arrStr: str
      },
      header: {
        "Content-Type": "application/json",
        "Content-MD5": wx.getStorageSync("token").token
      },
      success: res => {
        if (res.statusCode == 200) {
          let sout = res.data.map(item => {
            return {
              title: item,
              ischeck: false
            };
          }).splice(0, 11 - file.length)
          let mineLable = assignLable.map(ele => {
            return {
              mineLable: ele,
              functab: true
            }
          })
          _this.setData({
            labelList: [...file, ...sout],
            ischeckLable: file,
            mineList: mineLable,
            hideModal: false,
            warnFlash: 0,
            selectid: selID,
            ismark: ismark
          }, () => {
            if (_this.data.mineList.length < 3) {
              _this.setData({
                hiddenmodalput: false,
                minevalue: '',
                hiddenmodalbtn: true
              })
            } else {
              _this.setData({
                hiddenmodalput: false,
                minevalue: '',
                hiddenmodalbtn: false
              })
            }
          })

          console.log(this.data.ischeckLable)
        } else {
          console.log("数据加载失败！")
        }
      },
      fail: err => {
        console.log("数据加载失败!!！", err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      labelList: this.data.labelList.splice(0, 11)
    });
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
    let pages = getCurrentPages();
    let prevpage = "";
    let pageLen = pages.length;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == "pages/readData/readData") {
        if (pages[i + 1].route == "pages/addLable/addLable") {
          prevpage = i - 1;
          break;
        }
      }
    }
    console.log(pages, prevpage, "((((((((()))))))))))))=========", pages[pageLen - 2].route)
    if (prevpage && pages[pageLen - 2].route == "pages/readData/readData") {
      wx.navigateBack({
        delta: prevpage
      })
    }
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
  onShareAppMessage: function() {
    var shareObj = {
      title: "电子名片自定义行业标签，让客户轻松找到你",
      path: "/pages/addLable/addLable",
      imageUrl: imgUrl + '附近.png'
    }
    return shareObj;
  }
})