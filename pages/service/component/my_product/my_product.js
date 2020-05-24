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
    type: '', //当前页面类型(产品,服务,文章)
    proSelected: null, //产品列表下标,
    selectIndex:null,
    placeholder: '',
    list: [],
    editorIndex: '',
    items:'',
    upLoading: imgUrl + 'uploading.png', //loadding图片路径,
    inputIsClick: true,
    webview: "www.baidu.com",
    shareAppTitle: '',
    shareAppImgUrl: '',
    imgUrl: imgUrl,
    fGoodsType: '',
    dev: 'http://m.dev-zuma.com/authority-sitebackend/userPermission/checkPermission',
    pre: "https://m.pre-zuma.com/authority-sitebackend/userPermission/checkPermission",
    pd: 'https://m.zuma.com/authority-sitebackend/userPermission/checkPermission',

    webview: 'www.baidu.com',
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
    firstId: '',
    firstEntrepId: '',
    isFirst: true,
    jiantouImg: imgUrl + 'jiantou.png',
    fangdajing: imgUrl + 'fangdajing.png',
    addTypeFlag: true,
    uncheckFlag: true,
    title: '',
    warnFlash: 1,
    hideModal: false,
    editorFlag: true,
    link: '/pages/component/getPhone/getPhone',
    fId:'',
    ID:""
  },
  //跳转添加页面
  linkToAdd() {
    if (this.data.addTypeFlag) {
      this.setData({
        addTypeFlag: false,
        title: '数据加载中',
        warnFlash: 1,
        hideModal: true,
      })
      var token = wx.getStorageSync('token').token;
      let _this = this;
      let type = this.data.type;
      let URL;
      //type对应的url地址
      switch (type) {
        case '产品':
          URL = '/product/productDeleteOrRestore';
          break;
        case '服务':
          URL = '/zmNoteService/deleteOrRestoreService';
          break;
        case '文章':
          URL = '/shopBlog/batchDelete';
          break;
      }
      let domain, url, domains;
      if (api.indexOf('pre') != -1) {
        domain = 'pre-zuma.com';
        domains= 'https://m.pre-zuma.com/authority-sitebackend/userPermission/checkPermission'
      } else {
        domain = 'zuma.com';
        domains = 'https://m.zuma.com/authority-sitebackend/userPermission/checkPermission'
      }
      var zmtoken = wx.getStorageSync('zmToken');
      var zmcookie = wx.getStorageSync('token').zmCookie;
      var newZmToken, newzmCookie;
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
            newzmCookie=res.data.data.zmCookie;
            _this.setData({
              addTypeFlag: true
            })
            wx.setStorage({
              key: "zmToken",
              data: newZmToken
            })
            wx.request({
              url: domains,
              methods: 'POST',
              header: {
                'Content-Type': 'application/json',
                "cookie": newzmCookie
              },
              data: {
                fEntrepId: _this.data.ID,
                requestUrl: URL
              },
              success(res) {
                if (res.data.status == 0) {
                    _this.setData({
                      hideModal: false
                    })
                    if (type == '产品') {
                      url = `https://gouwu.m.${domain}/gouwu/selectCategory/1_1_${_this.data.ID}?zmsource=2&zmToken=${newZmToken}`
                    } else if (type == '服务') {
                      url = ` https://fuwu.m.${domain}/fuwu/selectCategory/${_this.data.ID}?zmsource=2&zmToken=${newZmToken}`
                    } else if (type == '文章') {
                      url = `https://wenzhang.m.${domain}/wenzhang/texteditor/${_this.data.ID}?zmsource=2&zmToken=${newZmToken}`
                    }
                    wx.navigateTo({
                      url: '/pages/webview/webview?url=' + encodeURIComponent(url)
                    })
                   
                }else{
                  //没有权限
                  _this.setData({
                    hideModal:false,
                    showPop: true,
                    textAlign: 'left',
                    contentTit: '您暂无权限,请联系主体所有者开通权限！',
                    leftBtnTit: '我知道了',
                    direction: 0,
                    leftcolor: "#202020",
                    contColor: '#474747',
                    leftWeight: 'bold'
                  })
                }
              }
            })
            
          }

        }
      })
    }
  },
  cancel(e) {
    let index = this.data.editorIndex;
    switch (index) {
      //编辑
      case '编辑':
        this.setData({
          showPop: false
        });
        break;
      case '删除':
        this.setData({
          proSelected: null,
          showPop: false,
          selectIndex:null
        })
        break;
        case '':
        this.setData({
          showPop: false
        });
        break;
    }
  },
  confirm(e) {
    let token = wx.getStorageSync('token').token;
    //选中下标
    let proSelected = this.data.selectIndex;
    //选中的主体ID
    let ID = this.data.ID;
    //类型-->(产品-服务-文章)
    let type = this.data.fGoodsType;
    //选中的商品ID
    let fId = this.data.fId;
    let _this = this;
    this.setData({
      title: '正在发送请求',
      warnFlash: 1,
      hideModal: true,
      showPop:false
    })
    wx.request({
      url: dataUrl + 'manage-api/resource/cardgoods/removeGoods',
      methods: 'POST',
      header: {
        'Content-Type': 'application/json',
        "Authorization": token
      },
      data: {
        type: type,
        fEntrepId: ID,
        fId: fId
      },
      success(res) {
        if (res.data.status == 404) {
          _this.setData({
            loginState: true
          })
        } else {
          if (res.data.message == '删除成功') {
            var list = _this.data.list;
            list.splice(proSelected, 1);
            _this.setData({
              list: list,
              hideModal: false
            })
            _this.setData({
              proSelected: null,
              selectIndex:null,
              showPop: true,
              textAlign: 'left',
              contentTit: '已成功为您删除',
              leftBtnTit: '我知道了',
              direction: 0,
              leftcolor: "#202020",
              contColor: '#474747',
              leftWeight: 'bold'
            })
          } else {
            console.log('删除失败````````');
          }
        }

      }
    })
  },
  //名片操作方式 编辑 转发 删除
  operating(e) {
    var _this = this;
    let tp;
    //编辑-转发-删除
    var index = e.currentTarget.dataset.index;
    this.setData({
      editorIndex: index
    })
    //选中下标
    let proSelected = this.data.proSelected;
    //选中的商品ID
    let fId = this.data.fGoodsType == 1 ? this.data.list[proSelected].exProId:this.data.list[proSelected].fGoodsId;
    //选中的主体ID
    let ID = this.data.list[proSelected].fEntrepId;
    //权限接口需要的url
    let URL;
    this.setData({
      fId: this.data.list[proSelected].fGoodsId,
      ID:ID
    })
    //类型-->(产品-服务-文章)
    let type = this.data.fGoodsType;
    let zmCookie = wx.getStorageSync('token').zmCookie;
    let token = wx.getStorageSync('token').token;
    //type对应的url地址
    switch (type) {
      case 1:
        URL = '/product/productDeleteOrRestore';
        tp = "产品"
        break;
      case 2:
        URL = '/zmNoteService/deleteOrRestoreService';
        tp = "服务"
        break;
      case 3:
        URL = '/shopBlog/batchDelete';
        tp = "文章"
        break;
    }
    let domain;
    if (api.indexOf('pre') != -1) {
      domain = 'https://m.pre-zuma.com/authority-sitebackend/userPermission/checkPermission'
    } else {
      domain = 'https://m.zuma.com/authority-sitebackend/userPermission/checkPermission'
    }
    switch (index) {
      case '编辑':
        //编辑
        if (this.data.editorFlag) {
          this.setData({
            editorFlag: false,
            title: '数据加载中',
            warnFlash: 1,
            hideModal: true,
            proSelected: null
          })
          var zmtoken = wx.getStorageSync('zmToken');
          var zmcookie = wx.getStorageSync('token').zmCookie;
          var newzmCookie, newZmToken ;
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
                newzmCookie = res.data.data.zmCookie;
                newZmToken=res.data.data.zmToken;
                wx.setStorage({
                  key: "zmCookie",
                  data: newzmCookie
                })
                wx.request({
                  url: domain,
                  methods: 'POST',
                  header: {
                    'Content-Type': 'application/json',
                    "cookie": newzmCookie
                  },
                  data: {
                    fEntrepId: ID,
                    requestUrl: URL
                  },
                  success(res) {
                    if (res.data.status == 0) {
                      //有权限-->跳转编辑页
                      let url, domains;
                      if (api.indexOf('pre') != -1) {
                        domains = 'pre-zuma'
                      } else {
                        domains = 'zuma'
                      }
                      switch (_this.data.fGoodsType) {
                        case 1:
                          url = `https://gouwu.m.${domains}.com/gouwu/editorproduct/${fId}_0_${ID}?zmsource=2&zmToken=${newZmToken}`;
                          break;
                        case 2:
                          url = `https://fuwu.m.${domains}.com/fuwu/editorService/${fId}_${ID}_1_1?zmsource=2&zmToken=${newZmToken}`
                          break;
                        case 3:
                          url = `https://wenzhang.m.${domains}.com/wenzhang/texteditor/${ID}?zmsource=2&zmToken=${newZmToken}`;
                          break;
                      }
                      wx.navigateTo({
                        url: '/pages/webview/webview?url=' + encodeURIComponent(url)
                      });
                      _this.setData({
                        editorFlag: true,
                        hideModal: false
                      })
                    } else {
                      //没有权限
                      _this.setData({
                        showPop: true,
                        textAlign: 'left',
                        contentTit: '您暂无权限，请联系主体所有者开通权限！',
                        leftBtnTit: '我知道了',
                        direction: 0,
                        leftcolor: "#202020",
                        contColor: '#474747',
                        leftWeight: 'bold'
                      })
                    }
                    _this.setData({
                      proSelected: null,
                      editorFlag: true,
                      hideModal: false
                    })
                  }
                })
              }
            }
          })
        }
        break;
      case '转发':
        //转发
        _this.setData({
          proSelected: null
        })
        break;
      case '删除':
        var zmtoken = wx.getStorageSync('zmToken');
        var zmcookie = wx.getStorageSync('token').zmCookie;
        var newzmCookie;
        this.setData({
          proSelected: null
        })
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
              newzmCookie = res.data.data.zmCookie;
              wx.setStorage({
                key: "zmCookie",
                data: newzmCookie
              })
              wx.request({
                url: domain,
                methods: 'POST',
                header: {
                  'Content-Type': 'application/json',
                  "cookie": newzmCookie
                },
                data: {
                  fEntrepId: ID,
                  requestUrl: URL
                },
                success(res) {
                  if (res.data.status == 0) {
                    //有权限-->执行删除操作
                    _this.setData({
                      showPop: true,
                      textAlign: 'left',
                      contentTit: `确定要删除此${tp}么?`,
                      leftBtnTit: '取消',
                      rightBtnTit: '删除',
                      leftcolor: "#202020",
                      contColor: '#474747',
                      leftWeight: 'bold',
                      rightWeight: 'bold',
                      btnFsize: 14,
                      direction: 1
                    })
                  } else {
                    //没有权限
                    _this.setData({
                      showPop: true,
                      textAlign: 'left',
                      contentTit: '您暂无权限，请联系主体所有者开通权限！',
                      leftBtnTit: '我知道了',
                      direction: 0,
                      leftcolor: "#202020",
                      contColor: '#474747',
                      leftWeight: 'bold'
                    })
                  }
                }
              })
            }
          }
        })
        //删除

        break;
    }
  },
  //取消长按事件
  uncheck(e) {
    let type = this.data.type;
    let _this = this;
    let url = e.currentTarget.dataset.url;
    if (this.data.proSelected != null) {
      this.setData({
        proSelected: null,
        selectIndex:null
      })
    } else { //进入详情页
      if (this.data.uncheckFlag) {
        this.setData({
          uncheckFlag: false
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
              url = url + '?zmsource=2&zmToken=' + newZmToken
              wx.navigateTo({
                url: '/pages/webview/webview?url=' + encodeURIComponent(url)
              })
              _this.setData({
                uncheckFlag: true
              })
            }

          }
        })
      }
    }
  },
  selectClick() {
    this.setData({
      proSelected: null,
      selectIndex:null
    })
  },
  //点击添加数据按钮-->跳转添加页
  addClick(e) {
    var token = wx.getStorageSync('token').token;
    if (token) {
      this.linkToAdd()
    } else {
      this.setData({
        isFirst: false
      })
    }
  },
  //点击搜索input框
  searchKey(e) {
    //输入文字高亮
    let inputValue = e.detail.value;;
    const reg = new RegExp(`[${inputValue}]+`, 'g');
    let datatype = this.data.type;
    this.data.list.forEach((item, index) => {
      if (datatype == '产品' || datatype == '服务') {
        if (inputValue == '') {
          item.isShow = true
          item.fGoodsName = item.fGoodsName.replace(/<span style="color:red;">/g, '').replace(/<\/span>/g, '')
        } else {
          item.isShow = false
          item.fGoodsName = item.fGoodsName.replace(/<span style="color:red;">/g, '').replace(/<\/span>/g, '')
          item.fGoodsName = item.fGoodsName.replace(reg, function (res) {
            item.isShow = true
            return `<span style="color:red;">${res}</span>`
          })
        }
      } else {
        if (inputValue == '') {
          item.isShow = true;
          item.fGoodsContentShow = false
          item.fGoodsName = item.fGoodsName.replace(/<span style="color:red;">/g, '').replace(/<\/span>/g, '')
          item.fGoodsContent = item.fGoodsContent.replace(/<span style="color:red;">/g, '').replace(/<\/span>/g, '')
        } else {
          item.isShow = false
          item.fGoodsContentShow = false
          item.fGoodsName = item.fGoodsName.replace(/<span style="color:red;">/g, '').replace(/<\/span>/g, '')
          item.fGoodsName = item.fGoodsName.replace(reg, function (res) {
            item.isShow = true
            return `<span style="color:red;">${res}</span>`
          })
          item.fGoodsContent = item.fGoodsContent.replace(/<span style="color:red;">/g, '').replace(/<\/span>/g, '')
          item.fGoodsContent = item.fGoodsContent.replace(reg, function (res) {
            item.fGoodsContentShow = true
            item.isShow = true
            return `<span style="color:red;">${res}</span>`
          })
        }
      }
    })
    let isSHow = this.data.list.some((item) => {
      return item.isShow
    })
    this.setData({
      list: this.data.list,
      serachNoOne: isSHow
    })
    //键盘退格键删除元素
    if (inputValue.length == 0 && e.detail.keyCode == 8) {
      let scrollLeft, width, selectLength;
      let select = this.data.list.filter(item => {
        return item.isCheck
      });
      this.data.selectList.pop()
      let selectList = this.data.selectList;
      if (select.length) {
        select[select.length - 1].isCheck = false;
        select.splice(selectList[selectList.length - 1], 1);
        selectLength = select.length;
        width = selectLength * 77.24;
        scrollLeft = selectLength * 77.24;
        if (width >= 280.8) {
          width = 280.8
        } else {
          width = selectLength * 77.24;
        }
        this.setData({
          scrollViewWidth: width,
          scrollLeft: scrollLeft,
          list: this.data.list,
          selectList: this.data.selectList
        })
      }
    }
  },
  // 列表选中效果
  productSelect(e) {
    this.setData({
      proSelected: e.currentTarget.dataset.index,
      selectIndex: e.currentTarget.dataset.index
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type, fGoodsType,items;
    let _this = this;
    console.log(options,'options`````````````````');
    
    switch (options.type) {
      case "product_1":
        type = '产品';
        fGoodsType = 1;
        items = [
          {
            'name': '编辑'
          },
          {
            'name': '转发'
          },
          {
            'name': '删除'
          }
        ]
        break;
      case "service_1":
        type = '服务';
        fGoodsType = 2;
        items = [{
            'name': '编辑'
          },
          {
            'name': '转发'
          },
          {
            'name': '删除'
          }
        ]
        break;
      case "artical_1":
        type = '文章';
        fGoodsType = 3;
        items = [
          {
            'name': '转发'
          },
          {
            'name': '删除'
          }
        ]
        break;
    }
    this.setData({
      type: type,
      fGoodsType: fGoodsType,
      ID:options.fId,
      items:items

    })
    var token = wx.getStorageSync('token').token;
    if (token) {
      wx.request({
        url: dataUrl + 'manage-api/resource/cardgoods/queryGoods',
        methods: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          fGoodsType: fGoodsType,
          meOrFind: 2,
          fEntrepId: options.fId
        },
        success: function (res) {
          if (res.data.status == 404) {
            _this.setData({
              loginState: true
            })

          } else {
            if (res.data.status == 200) {
              res.data.data.forEach((item, index) => {
                item.fCreateTime = _this.format(item.fCreateTime, 'yyyy-MM-dd');
                item.isShow = true;
                if (item.fGoodsImgUrl && item.fGoodsImgUrl.indexOf('video_') !== -1) {
                  item.fGoodsImgUrl = item.fGoodsImgUrl.substring(6, item.fGoodsImgUrl.length);
                }
              })
              _this.data.list = res.data.data;
              let firstId, firstEntrepId;
              if (res.data.data.length) {
                firstId = res.data.data[0].exProId ? res.data.data[0].exProId : res.data.data[0].fGoodsId;
                firstEntrepId = res.data.data[0].fEntrepId
              }
              _this.setData({
                list: _this.data.list,
                upRoadingRotate: 0,
                firstId: firstId,
                firstEntrepId: firstEntrepId
              })
            } else {
              _this.setData({
                list: [],
                upRoadingRotate: 0
              })
            }
          }
        }
      })
      return
    } else {
      this.setData({
        upRoadingRotate: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: `我的${this.data.type}`,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: `我的${this.data.type}`,
    })
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
    let index = this.data.selectIndex;
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
      var token = wx.getStorageSync('token').token;
      var zmtoken = wx.getStorageSync('zmToken');
      let _this = this;
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
          }

        }
      })
      let url = this.data.list[index].fDetailUrl + '?zmsource=2&zmToken' + newZmToken;
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