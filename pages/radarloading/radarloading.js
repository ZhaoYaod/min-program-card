const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL

let dataUrl = app.globalData.poxy.API_BASE
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radarShare: 2, //名片雷达的第一个页面
    zhuan: imgUrl + 'leida-zhuan.png',
    bg: imgUrl + 'bj.png',
    quan: imgUrl + "quan.png",
    yuan: imgUrl + 'yuan.png',
    buttonImg: imgUrl + 'leida-search-no.png',
    loaddingImg: imgUrl + 'leida-search.png',
    list: [],
    pointerIsShow: false,
    lengthNum: false,
    status: true,
    search: '',
    //弹窗样式
    showPop: false,
    contentTit: '',
    leftBtnTit: "",
    rightBtnTit: '',
    leftcolor: '',
    rightcolor: '',
    direction: 1,
    contColor: '',
    textAlign: '',
    btnFsize: '',
    rightWeight: "",
    leftWeight: '',
    longitude: '',
    latitude: '',
    previousTimer: null,
    link: '/pages/component/getPhone/getPhone'
  },
  //点击进入按钮---搜索到的数据
  clickToSearch() {
    wx.redirectTo({
      url: '/pages/peoplenearby/peoplenearby'
    })
  },
  //(附近的人)按钮(进入搜索到的列表页)需重新请求不带标签的数据
  clickToAllList() {
    let previous = this.data.previousTimer
    let now = +new Date(); //1970 1.1 到现在的毫秒数 Date.now()
    if (now - previous > 2000) {
      this.setData({
        previousTimer: now
      })
      var _this = this;
      var token = wx.getStorageSync('token').token;
      // 获取经纬度
      wx.getLocation({
        type: 'gcj02',
        success: function (loc) {
          wx.request({
            url: dataUrl + 'manage-api/resource/radar/radarsearch',
            methods: 'POST',
            header: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            data: {
              fLongitude: loc.longitude,
              fDimension: loc.latitude,
              iDisplayStart: 0,
              iDisplayLength: 100
            },
            success: function (res) {
              if (res.data.status == 404) {
                _this.setData({
                  loginState: true
                })
              } else {
                var newArr = [];
                if (res.statusCode == 200) {
                  res.data.data.data.forEach((item, i) => {
                    var str = item.distance;
                    var num = /^\d+/.exec(str) //正则匹配小数点前的数字;
                    item.distance = Math.floor(item.distance * 100) / 100; /* 保留两位小数 */
                    //超过100km显示100km+
                    if (num >= 100) {
                      item.distance = '100km+';
                    } else {
                      item.distance = item.distance + 'km'
                    }
                    newArr.push(item)
                  })
                  wx.setStorageSync('newArr', newArr);
                  wx.redirectTo({
                    url: '/pages/peoplenearby/peoplenearby'
                  })
                }
              }
            },
            fail: function (res) {}
          })
        },
        fail: function (loc) {
          console.log(loc, '位置获取失败')
        }
      })
    }
  },
  //点击我知道了
  cancel(e) {
    this.setData({
      showPop: false
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //点击重新扫码
  confirm(e) {
    this.cardRequest(this.data.search, this.data.longitude, this.data.latitude)
    this.setData({
      showPop: false
    })
  },
  //重新搜索 按钮--搜索无数据,进入标签输入页
  searchAgain() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 请求数据
  cardRequest(search = '', longitude, latitude) {
    var token = wx.getStorageSync('token').token;
    this.setData({
      status: true
    })
    var _this = this;
    var searchKeyWord = search.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); //过滤掉前后空格
    var token = wx.getStorageSync('token').token;
    wx.request({
      url: dataUrl + 'manage-api/resource/radar/radarsearch',
      methods: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: {
        fLongitude: longitude,
        fDimension: latitude,
        fCardTag: searchKeyWord,
        iDisplayStart: 0,
        iDisplayLength: 100
      },
      success: function (res) {
        if (res.data.status == 404) {
          _this.setData({
            loginState: true
          })
        } else {
          var newArr = [];
          console.log(res, 'res````````````````');

          if (res.statusCode == 200) {
            if (res.data.data.data.length) {
              _this.setData({
                lengthNum: true
              })
            } else {
              _this.setData({
                lengthNum: false
              })
            }
            res.data.data.data.forEach((item, i) => {
              var str = item.distance;
              var num = /^\d+/.exec(str) //正则匹配小数点前的数字;
              item.distance = Math.floor(item.distance * 100) / 100; /* 保留两位小数 */
              //超过100km显示100km+
              if (num >= 100) {
                item.distance = '100km+';
              } else {
                item.distance = item.distance + 'km'
              }
              newArr.push(item)
            })
            let len = newArr.length < 8 ? newArr.length : 8;
            for (let j = 0; j < len; j++) {
              setTimeout(() => {
                if (newArr[j].fPhotoUrl) {
                  newArr[j].isShow = true
                  _this.setData({
                    list: newArr
                  })
                }
              }, j * 800);
            }
            var rand = Math.floor(Math.random() * 900) + 100;
            setTimeout(() => {
              _this.setData({
                pointerIsShow: true
              })

            }, (len + 1) * 800 + rand);

            wx.setStorageSync('newArr', newArr);
            wx.setStorageSync("searchKeyWord", searchKeyWord) //缓存中存取搜索到的数据
          } else {
            //网络不好接口获取失败
            setTimeout(() => {
              _this.setData({
                showPop: true,
                textAlign: 'left',
                contentTit: '数据请求失败，请检查手机是否开启定位！',
                leftBtnTit: '我知道了',
                rightBtnTit: '重新扫码',
                leftcolor: "#202020",
                contColor: '#474747',
                leftWeight: 'bold',
                rightWeight: 'bold',
                btnFsize: 14,
                direction: 1,
                pointerIsShow: false,
                status: false,
              })
            }, 15000);
          }
        }


      },
      fail: function (res) {}
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.setData({
      search: options.dataValue,
      longitude: options.longitude,
      latitude: options.latitude
    })
    this.cardRequest(options.dataValue, options.longitude, options.latitude);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: '名片雷达'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

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
  onShareAppMessage: function () {
    var shareObj = {
      title: "开启族蚂名片雷达扫描，迅速搜索附近的联系人",
      path: "/pages/radarloading/radarloading",
      imageUrl: imgUrl + 'leidasaomiaozhong.png'
    }
    return shareObj;
  }
})