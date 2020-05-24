// pages/scan/serchScan/serchScan.js
const app = getApp();
let imgurl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fPhone: 18000000000,
    setlist: [{
      fPhone: 18000000000,
      fPhotoUrl: imgurl + "avatar.png",
      fUserName: "Michael Friedman",
      fPosition: "魔法天使",
      fAuthen: 1,
      fCorpName: "上海族蚂信息科技有限公司",
      fCreateName: "由Michael Friedman创建",
      fIsCollection: 0,
      fCardTag: "美女",
      fId: 123
    }],
    stateCollect: false,
    addImage: imgurl + "tianjia.png",
    loginState: false,
    link: '../component/getPhone/getPhone',
    isLoading:true
  },
  onMyEvent(e) {
    this.setData({
      loginState: e.detail.loginState
    })
  },
  addlink(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../' + url + '?fId=' + id,
    });
    console.log('../../' + url + '?fId=' + id, "---------====")
  },
  checkCollect(event) {
    console.log(event)
    let _this = this;
    let index = event.currentTarget.dataset.index;
    let type = event.currentTarget.dataset.type;
    let token = wx.getStorageSync("token") ? wx.getStorageSync("token") : "";
    let list = this.data.setlist[index];
    let url = list.fPhotoUrl.split("com")[1];
    let cardInfo = JSON.stringify([{
      fOtherId: list.fPhone, //收藏名片的电话号码
      fCardId: list.fId, //收藏名片的Id
      fCardName: list.fUserName, //收藏名片的姓名
      fCorpName: list.fCorpName, //收藏名片的公司名称
      fCardPic: url, //收藏名片的头像
      fCardTag: list.fCardTag, //收藏名片的标签
    }]);
    let newList;
    if (type >= 1) return;
    else if (type == 0) {
      if (token) {
        if (token.token) {
          if (!_this.data.stateCollect) {
            _this.setData({
              stateCollect: true
            }, () => {
              wx.request({
                method: 'POST',
                url: dataUrl + 'manage-api/resource/cardbag/collectCardList',
                header: {
                  "Content-Type": "application/json",
                  "Authorization": token.token
                },
                dataType: "json",
                data: cardInfo,
                success: res => {
                  if (res.statusCode == 200) {
                    console.log(res, "--------=-------******")
                    if (res.data.status == 0) {
                      newList = _this.data.setlist.map((item, i) => {
                        if (i == index) {
                          item.fIsCollection = 1;
                          item.flahScan = 1;
                        }
                        return item;
                      })
                      _this.setData({
                        setlist: newList
                      })
                    } else {
                      if (res.data.status == 404) {
                        wx.navigateTo({
                          url: '../login/login?assgin=2',
                        })
                      } else {
                        if (res.data.status == 500) {
                          console.log(res.data.status, "收藏失败！")
                        }
                      }
                    }
                  }
                  _this.setData({
                    stateCollect: false
                  })
                }
              })
            })
          }
        } else {
          wx.navigateTo({
            url: '../login/login?assgin=2',
          })
        }
      } else {
        this.setData({
          loginState: true
        })
      }
    }
  },
  input_txt(event) {
    this.setData({
      searchTxt: event.detail.value.trim()
    })
    this.btn_search()
  },
  btn_search() {
    let file = this.data.setlist.map((item, i) => {
      item.tel != this.data.searchTxt ? item.search = false : item.search = true;
      return item;
    })
    this.setData({
      setlist: file
    })
  },
  buildHistory(event) {
    console.log(wx.getStorageSync("history"))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '扫名片'
    })
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel.on) {
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        _this.setData({
          setlist: data.setlist,
          fPhone: data.setlist[0].fPhone
        },()=>{
          _this.setData({
            isLoading:false
          })
        })
        console.log(data)
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let pages = getCurrentPages();
    let pageLen = pages.length;
    console.log(pages, "((((((((()))))))))))))=========", pages[pageLen - 2].route == "pages/scan/scan")
    if (pages[pageLen - 2].route == "pages/readData/readData") {
      console.log("2222222222222222")
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (pages[pageLen - 2].route == "pages/scan/scan") {
        console.log("111111111111111111111111")
        wx.navigateBack({
          delta: 1
        })
      }
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
  onShareAppMessage: function(res) {
    var shareObj = {
      title: "纸质名片扫描仪，快速生成电子名片！",
      path: "/pages/scan/scan",
      imageUrl: imgurl + '扫码.png'
    }
    return shareObj;
  }
})