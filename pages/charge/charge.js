// pages/charge/charge.js
import regeneratorRuntime from '../../utils/runtime.js'

const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chrgeType: '产品', // 当前页面类型(产品,服务,文章)
    items: [{
      'name': '转发'
    }],
    loginState: false, //控制登录页面显示隐藏,
    proSelected: null, //产品列表下标,
    placeholder: '',
    titleList: [],
    list: [],
    permission: 1,
    upRoadingRotate:1,//loading
    upLoading: imgUrl + 'uploading.png', //loadding图片路径,
    upLoading: imgUrl + 'uploading.png', //loadding图片路径,
    type: '',
    noAuthen:false,//模板跳过来没有
    previousTimer:0,//
    clickFlag: true,
  },
  //点击微信登录成功回调
  onMyEvent(e) {
    this.setData({
      loginState: e.detail.loginState
    })
  },
  //名片操作方式转发
  operating(e) {
    this.setData({
      proSelected: null
    })
  },
  //时间转换
  format(time, format) {
    var t = new Date(time);
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      };
    });
  },
  //点击添加数据按钮
  addClick() {
    var token = wx.getStorageSync('token').token;
    if (token) {
      return
    } else {}
  },
  // 列表长按事件
  productSelect(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      proSelected: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options,'options`````````````')
    let cardId = options.cardId;
    let type;
    switch (options.type) {
      case '1':
        type = '产品';
        break;
      case '2':
        type = '服务';
        break;
      case '3':
        type = '文章';
        break;
    }
    this.setData({
      type: type
    })
    let token = wx.getStorageSync('token').token;
    if (cardId !== "undefined" && cardId){
      console.log(1111)
      this.getData(token, options.cardId,options.type)
    }else{
      console.log(2222)
      let newobj = JSON.parse(options.modeObj)
      console.log(newobj,'newobj```````````')
      this.getAnotherData(token, options.type, newobj)
    }
  },
  // 页面数据(有cardId 名片)
  async getData(token, fId, type) {
    let id = '';
    switch (type) {
      case "1":
        id = 'productIds';
        break;
      case "2":
        id = 'serviceIds';
        break
      case "3":
        id = 'articleIds';
        break;

    }
    
    let _this = this;
    let result = await new Promise((resolve, reject) => {
      wx.request({
        url: dataUrl + 'manage-api/resource/cardout/queryById', // 名片编辑页回显查询  头部信息
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        data: {
          fId: fId
        },
        success(res) {
          if (res.data.status === 200) {
            _this.setData({
              titleList: res.data.data
            })
            wx.setNavigationBarTitle({
              title: `${res.data.data.cname.trim()}的${_this.data.type}`,
            })
            console.log(id,res.data.data[id], 'res.data.data[id]res.data.data[id]');
            
            resolve(res.data.data[id]) //返回第二个接口需要的参数 list
          } else if (res.data.status === 404) {
            _this.setData({
              loginState: true,
            })
            reject(false)
          }
        }
      })
    })
    if (result) { //list 参数回来后
      let data = result == '' ? {
        type,
        list: ''
      } : {
        type,
        list: result
      }
      wx.request({
        url: dataUrl + 'manage-api/resource/cardgoods/queryGoodById', // 根据商品ID 查询对应的商品详情

        data: data,
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        success(res) {
          if (res.data.status === 200) {
            if (type == 3) {
              res.data.data.forEach((item, index) => {
                item.fCreateTime = _this.format(item.fCreateTime, 'yyyy-MM-dd');
              })
            }
            _this.data.list = res.data.data;
            if (res.data.data) {
              _this.setData({
                upRoadingRotate: 0,
                list: _this.data.list
              })
            }

          } else if (res.data.status === 404) {
            _this.setData({
              upRoadingRotate: 0,
              loginState: true,
            })
          }
        }
      })
    } else {
      _this.setData({
        list: []
      })
    }


  },
  // 页面数据(没有cardId 模板)
  getAnotherData(token, type, message){
    this.data.titleList = { cname: message.name, ctitle: message.company, cpost: message.job, tag: '电子名片，微信名片，数字名片，云名片', photolist: message.headImg }
    this.setData({
      titleList: this.data.titleList,
      noAuthen: true
    })
    wx.setNavigationBarTitle({
      title: `${message.name.trim()}的${this.data.type}`,
    })
    let _this = this;
    wx.request({
      url: dataUrl + 'manage-api/resource/cardgoods/queryStaffGoodsByType', // 查询商品员工库
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      data: {
        type
      },
      success(res) {
        if (res.data.status === 200) {
          res.data.data.forEach((item, index) => {
            item.fCreateTime = _this.format(item.fCreateTime, 'yyyy-MM-dd');
          })
          _this.data.list = res.data.data;
          if (res.data.data) {
            _this.setData({
              upRoadingRotate: 0,
              list: _this.data.list
            })
          }
          
        } else if (res.data.status === 404) {
          _this.setData({
            upRoadingRotate: 0,
            loginState: true,
          })
          reject(false)
        }else{
          _this.setData({
            upRoadingRotate: 0
          })
          wx.showToast({
            title: '查询失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  goBack(){
    // let previous = this.previousTimer
    // let now = + new Date(); //1970 1.1 到现在的毫秒数 Date.now()
    // console.log(now);
    // if (now - previous > 2000){
    //   this.previousTimer = now
      wx.navigateBack({
        delta: 1
      })
    // }   
  },
  // 跳详情页
  goDetail(e){
    var token = wx.getStorageSync('token').token;
    let index = e.currentTarget.dataset.index;
    let url = this.data.list[index].fDetailUrl;
    
    if (!this.data.clickFlag) {
      return;
    }
    this.setData({
      addTypeFlag: false
    })
    if (token){
      if (this.data.proSelected != null) {
        this.setData({
          proSelected: null
        })
      } else { //进入详情页
        var token = wx.getStorageSync('token').token;
        var zmtoken = wx.getStorageSync('zmToken');
        var zmcookie = wx.getStorageSync('token').zmCookie;
        var newZmToken;
        let _this = this;
        wx.request({
          url: dataUrl + 'manage-api/resource/carduser/loginZmToken',
          header: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          data: {
            zmtoken: zmtoken,
            zmcookie: zmcookie
          },
          success: (res) => {

            if(res.data.status === 404) {
              _this.setData({
                upRoadingRotate: 0,
                loginState: true,
              })
            }
            else if (res.data.status === 200){
              _this.setData({
                addTypeFlag: true
              })
              newZmToken = res.data.data.zmToken;
              wx.setStorage({
                key: "zmToken",
                data: newZmToken
              })
              url = url + '?zmsource=2&zmToken=' + newZmToken
              wx.navigateTo({
                url: '/pages/webview/webview?url=' + encodeURIComponent(url)
              })
            }
            
          }
        })
      }
    }else{
      this.setData({
        addTypeFlag: true
      });
       wx.navigateTo({
         url: '/pages/webview/webview?url=' + encodeURIComponent(url)
       })
    }
   
     
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
   
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
  onUnload: function () {},

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
    let index = this.data.proSelected;
    let type = this.data.type;
    let initUrl;
    switch (type) {
      case "产品":
        initUrl = `${imgUrl}fxchanpin.png`;
        break;
      case "文章":
        initUrl = `${imgUrl}fxwengzhang.png`;
        break;
      case "服务":
        initUrl = `${imgUrl}fxfuwu.png`;
        break;
    }
    let url = this.data.list[index].fDetailUrl + '?zmsource=2&zmToken=' + wx.getStorageSync('zmToken');
    if (res.from === 'button') {
      let title = this.data.list[index].fGoodsName;
      let imgUrl = this.data.list[index].fGoodsImgUrl ? this.data.list[index].fGoodsImgUrl : initUrl;
      return {
        title: title,
        path: '/pages/webview/webview?url=' + encodeURIComponent(url),
        imageUrl: imgUrl
      }
    } else {
      return {
        title: `族蚂名片帮你销售${type}，快来添加名片、发布${type}吧！`,
        path: '/pages/charge/charge/',
        imageUrl: initUrl
      }
    }
  }
})