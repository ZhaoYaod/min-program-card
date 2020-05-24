const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE
let api = app.globalData.poxy.API_BASE;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myProductShare: 1, //添加产品的第一个页面
    upRoadingRotate: 1, //加载动画
    loginState: false, //控制登录页面显示隐藏,
    type: '', //当前页面类型(产品,服务,文章)
    proSelected: null, //产品列表下标,
    placeholder: '',
    list: [],
    items: '',
    upLoading: imgUrl + 'uploading.png', //loadding图片路径,
    permission: 1,
    imgUrl: imgUrl,
    webview: 'zuma.com',
    typeId: '', //已选择产品id
    fGoodsType: 0,
    title: '',
    warnFlash: 1,
    hideModal: false,
    link: '/pages/component/getPhone/getPhone'
  },
  //点击微信登录成功回调
  onMyEvent(e) {
    this.setData({
      loginState: e.detail.loginState
    })
  },
  //名片操作方式 编辑 转发 删除
  operating(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index; //弹窗选择的下标
    let proSelected = this.data.proSelected;
    let lists = this.data.list;
    let typeIdArr = this.data.typeId.split(',');
    let type = this.data.type;
    //选中的商品ID
    let fId = this.data.fGoodsType == 1 ? this.data.list[proSelected].exProId : this.data.list[proSelected].fGoodsId;
    //选中的主体ID
    let ID = this.data.list[proSelected].fEntrepId;
    switch (index) {
      case '置顶':
        //置顶
        let newArr = lists.splice(proSelected, 1);
        lists.unshift(newArr[0]);
        proSelected = null
        break;

      case '移除':
        //移除
        wx.showModal({
          title: `确定要移除此${type}么?`,
          confirmText: '移除',
          cancelColor: '#474747', //取消颜色
          confirmColor: '#474747', //确认颜色
          success: function (res) {
            if (res.confirm) { //用户点击确定
              _this.setData({
                title: '数据加载中',
                warnFlash: 1,
                hideModal: true
              })
              // if (_this.data.permission) {
              var list = _this.data.list;
              //移出选中的列表和id
              list.splice(proSelected, 1);
              typeIdArr.splice(proSelected, 1);
              let len = typeIdArr.length;
              _this.data.typeId = typeIdArr.join(',');
              let str = _this.data.typeId;
              //更改编辑名片页面数据(id+len)
              let pages = getCurrentPages();
              let prevpage = pages[pages.length - 2];
              switch (_this.data.type) {
                case '产品':
                  prevpage.setData({
                    PRODUCT: len,
                    productIds: str
                  });
                  break;
                case "服务":
                  prevpage.setData({
                    SERVICE: len,
                    serviceIds: str
                  });
                  break;
                case "文章":
                  prevpage.setData({
                    ARTICAL: len,
                    articleIds: str
                  });
                  break;
              }
              _this.setData({
                list: list,
                typeId: _this.data.typeId,
                proSelected: null,
                hideModal: false
              })
              // } else {
              //   wx.showModal({
              //     title: '您无此操作权限',
              //     showCancel: false,
              //     confirmText: '我知道了',
              //   })
              // }
            } else if (res.cancel) {
              //弹窗消失
              _this.setData({
                proSelected: null
              })

            }
          },
          fail: function () {

          }
        })
        break;
      case '编辑':
        _this.setData({
          title: '数据加载中',
          warnFlash: 1,
          hideModal: true
        })
        var token = wx.getStorageSync('token').token;
        var zmtoken = wx.getStorageSync('zmToken');
        var zmcookie = wx.getStorageSync('token').zmCookie;
        var newZmToken;
        wx.request({
          url: api + 'manage-api/resource/carduser/loginZmToken',
          header: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          data: {
            zmtoken: zmtoken,
            zmcookie: zmcookie
          },
          success: (res) => {
            if (res.data.status == 404) {
              _this.setData({
                loginState: true
              })
            } else {
              newZmToken = res.data.data.zmToken;
              wx.setStorage({
                key: "zmToken",
                data: newZmToken
              })
              let url;
              let domain;
              if (api.indexOf('pre') != -1) {
                domain = 'pre-zuma'
              } else {
                domain = 'zuma'
              }
              switch (this.data.fGoodsType) {
                case 1:
                  url = `https://gouwu.m.${domain}.com/gouwu/editorproduct/${fId}_0_${ID}?zmsource=2&zmToken=${newZmToken}`;
                  break;
                case 2:
                  url = `https://fuwu.m.${domain}.com/fuwu/editorService/${fId}_${ID}_1_1?zmsource=2&zmToken=${newZmToken}`
                  break;
                case 3:
                  url = `https: //fuwu.m.${domain}.com/fuwu/editorService/3437_11431_1_1`;
                  break;
              }
              wx.navigateTo({
                url: '/pages/webview/webview?url=' + encodeURIComponent(url)
              });
               _this.setData({
                 hideModal: false
               })
            }

          }
        })
        proSelected = null
        break;
      case '多选':
        //多选
        wx.navigateTo({
          url: '/pages/service/component/multiSelect/multiSelect?type=' + this.data.type + '&typeId=' + this.data.typeId
        })
        proSelected = null
        break;
      case '转发':
        //转发
        proSelected = null
        break
    }

    this.setData({
      list: lists,
      proSelected: proSelected,
      modal: this.data.modal
    })
  },
  notSelect() {
    this.setData({
      proSelected: null
    })
  },
  // 列表长按事件
  productSelect(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      proSelected: index
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
  //选择服务 产品 文章按钮
  selectType() {
    wx.navigateTo({
      url: '/pages/service/component/addType/addType?type=' + this.data.type + '&typeId=' + this.data.typeId,
    })
  },
  //取消长按事件
  uncheck(e) {
    this.setData({
      proSelected: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.setData({
      title: '数据加载中',
      warnFlash: 1,
      hideModal: true
    })
    let type, typeId, fGoodsType,items;
    let eventChannel = _this.getOpenerEventChannel();
    let token = wx.getStorageSync('token').token;
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      switch (options.type) {
        case "product_2":
          type = '产品';
          typeId = data.productIds
          fGoodsType = 1;
          items = [{
              'name': '置顶'
            },
            {
              'name': '移除'
            },
            {
              'name': '编辑'
            },
            {
              "name": "多选"
            },
            {
              'name': '转发'
            }

          ]
          break;
        case "service_2":
          type = '服务';
          typeId = data.serviceIds;
          fGoodsType = 2;
          items = [{
              'name': '置顶'
            },
            {
              'name': '移除'
            },
            {
              'name': '编辑'
            },
            {
              "name": "多选"
            },
            {
              'name': '转发'
            }

          ]
          break;
        case "artical_2":
          type = '文章';
          typeId = data.articleIds;
          fGoodsType = 3;
          items = [{
              'name': '置顶'
            },
            {
              'name': '移除'
            },
            {
              "name": "多选"
            },
            {
              'name': '转发'
            }

          ]
          break;
      }
      _this.setData({
        type: type,
        typeId: typeId,
        fGoodsType: fGoodsType,
        items:items
      })
      //请求数据
      if (typeId) {
        wx.request({
          url: dataUrl + 'manage-api/resource/cardgoods/queryGoodById',
          methods: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          data: {
            type: fGoodsType,
            list: typeId,
            meOrFind: 1
          },
          success: function (res) {
            if (res.data.status == 404) {
              _this.setData({
                loginState: true
              })
            } else {
              if (fGoodsType == 3) {
                res.data.data.forEach((item, index) => {
                  item.fCreateTime = _this.format(item.fCreateTime, 'yyyy-MM-dd');
                  if (item.fGoodsImgUrl && item.fGoodsImgUrl.indexOf('video_') !== -1) {
                    item.fGoodsImgUrl = item.fGoodsImgUrl.substring(6, item.fGoodsImgUrl.length);
                  }
                })

              }
              _this.data.list = res.data.data;
              if (res.data.data) {
                _this.setData({
                  upRoadingRotate: 0,
                  list: _this.data.list,
                  hideModal: false
                })
              }
            }

          }
        })
      } else {
        _this.setData({
          upRoadingRotate: 0,
          list: [],
          hideModal: false
        })
        return
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: `名片${this.data.type}列表`,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },

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

    if (res.from === 'button') {
      let title = this.data.list[index].fGoodsName;
      let imgUrl = this.data.list[index].fGoodsImgUrl ? this.data.list[index].fGoodsImgUrl : initUrl;
      let url = this.data.list[index].fDetailUrl + '?zmsource=2';

      return {
        title: title,
        path: '/pages/webview/webview?url=' + encodeURIComponent(url),
        imageUrl: imgUrl
      }
    } else {
      return {
        title: `族蚂名片帮你销售${type}，快来添加名片、发布${type}吧！`,
        path: '/pages/service/service',
        imageUrl: initUrl
      }
    }
  }
})