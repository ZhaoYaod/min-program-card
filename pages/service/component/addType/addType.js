const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE
// }
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myProductShare: 1, //添加产品的第一个页面
    upRoadingRotate: 1, //加载动画
    loginState: false, //控制登录页面显示隐藏,
    type: '', //当前页面类型(产品,服务,文章)
    placeholder: '',
    list: [],
    operat: null, //当前点击的下标
    permission: 1,
    upLoading: imgUrl + 'uploading.png', //loadding图片路径,
    showA: [],
    blueBg: false, //是否选中
    selectList: [], //当前选中元素下标组成的数组
    scrollViewWidth: 0, //input框前面选中列表总宽
    scrollLeft: 0, //图片滑动距离,
    typeId: '',
    noImg: imgUrl + 'icon_pic.png', //选中列表没有图片使用默认图片,
    btnTextIsShow: true, //添加到名片文字初始显示
    btnImgIsLoad: false, //点击添加到名片后文字小时.loadding图片显示
    imgUrl: imgUrl,
    serachNoOne: true, //是否搜索到数据
    firstId: '',
    firstEntrepId: '',
    jiantouImg: imgUrl + 'jiantou.png',
    fangdajing: imgUrl + 'fangdajing.png',
    addClickFlag: true,
    title: '',
    warnFlash: 1,
    hideModal: false,
    link: '/pages/component/getPhone/getPhone',
    len:true
    //  fangdajing: '/static/fangdajing.png'
  },
  //点击微信登录成功回调
  onMyEvent(e) {
    this.setData({
      loginState: e.detail.loginState
    })
  },
  //点击添加数据按钮
  addClick() {
    if (this.data.addClickFlag) {
      this.setData({
        addClickFlag: false
      })
      let type = this.data.type;
      let domain, url;
      if (dataUrl.indexOf('pre') != -1) {
        domain = 'https://m.pre-zuma.com'
      } else {
        domain = 'https://m.zuma.com'
      }
      var token = wx.getStorageSync('token').token;
      var zmtoken = wx.getStorageSync('zmToken');
      var zmcookie = wx.getStorageSync('token').zmCookie;
      var newZmToken;
      var that = this;
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
          if (res.data.status == 404) {
            that.setData({
              loginState: true
            })
          } else {
            newZmToken = res.data.data.zmToken;
            wx.setStorage({
              key: "zmToken",
              data: newZmToken
            })
            if (type == '产品') {
              url = domain + '/addmain/1_1_1?zmsource=2&zmToken=' + newZmToken
            } else if (type == '服务') {
              url = domain + '/addmain/0_0_0?zmsource=2&zmToken=' + newZmToken
            } else if (type == '文章') {
              url = domain + '/addmain/2_2_3?zmsource=2&zmToken=' + newZmToken
            }
            wx.navigateTo({
              url: '/pages/webview/webview?url=' + encodeURIComponent(url)
            })
            that.setData({
              addClickFlag: true
            })
          }

        }
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
    if (inputValue.length == 0 && e.detail.keyCode == 8 && !this.data.len) {
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
    this.setData({
      len: inputValue.length != 0
    })
  }
  //时间转换
  ,format(time, format) {
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
  //添加到名片
  addToList() {
    let _this = this;
    //若没有选中,则不执行下方
    let len = this.data.selectList.length;
    if (len <= 0) return
    let str = this.data.typeId ? (this.data.typeId + ',') : ''
    this.data.list.forEach((item, index) => {
      if (item.isCheck) {
        str += `${item.fGoodsId},`
      }
    })
    //更改赵耀东页面数据 
    str = str.substring(0, str.lastIndexOf(','))
    let typeLen = str.split(',').length;
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 3];
    switch (this.data.type) {
      case '产品':
        prevpage.setData({
          PRODUCT: typeLen,
          productIds: str
        });
        break;
      case "服务":
        prevpage.setData({
          SERVICE: typeLen,
          serviceIds: str
        });
        break;
      case "文章":
        prevpage.setData({
          ARTICAL: typeLen,
          articleIds: str
        });
        break;
    }
    //更改addTypeList 页面数据
    let prevpage2 = pages[pages.length - 2];
    let selectData = this.data.list.filter(item => item.isCheck)
    selectData.forEach(item => {
      prevpage2.data.list.push(item)
    })
    prevpage2.setData({
      list: prevpage2.data.list,
      typeId: str
    })
    this.setData({
      btnTextIsShow: false,
      btnImgIsLoad: true
    })
    setTimeout(() => {
      _this.setData({
        btnImgIsLoad: false
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000);

    }, 1000);

  },
  delList(e) {
    this.productSelect(e)
  },
  // 列表选中效果
  productSelect(e) {
    //传入参数切换选中状态
    let index = e.currentTarget.dataset.index;
    this.data.list[index].isCheck = !this.data.list[index].isCheck
    //列表如果有选中状态,(添加到名片)按钮更改背景颜色
    let blueBg = this.data.list.some(item => {
      return item.isCheck
    })
    // 获取选中数据下标组成的数组
    let selectList = this.data.selectList;
    if (selectList.indexOf(index) == -1) {
      selectList.push(index)
    } else {
      let value = selectList.indexOf(index);
      selectList.splice(value, 1)
    }
    let width = selectList.length * 77.24;
    let scrollLeft = selectList.length * 77.24;
    if (width >= 280.8) {
      width = 280.8

    } else {
      width = selectList.length * 77.24;
    }
    this.setData({
      selectList: selectList,
      scrollViewWidth: width,
      scrollLeft: scrollLeft,
      list: this.data.list,
      blueBg: blueBg
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: '数据加载中',
      warnFlash: 1,
      hideModal: true
    })
    //隐藏右上角转发功能
    wx.hideShareMenu()
    //设置页面类型(产品服务or 文章)
    this.setData({
      type: options.type,
      typeId: options.typeId
    })
    let fGoodsType;
    switch (options.type) {
      case "产品":
        fGoodsType = 1;
        break;
      case "服务":
        fGoodsType = 2;
        break;
      case "文章":
        fGoodsType = 3;
        break;
    }
    let _this = this;

    let data = this.data.typeId ? {
      fGoodsType: fGoodsType,
      fGoodsIdList: this.data.typeId,
      meOrFind: 1
    } : {
      fGoodsType: fGoodsType,
      meOrFind: 1
    };
    var token = wx.getStorageSync('token').token;
    wx.request({
      url: dataUrl + 'manage-api/resource/cardgoods/queryGoods',
      methods: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: data,
      success: function (res) {
        if (res.data.status == 404) {
          _this.setData({
            loginState: true
          })
        } else {
          if (res.statusCode == 200) {
            let datas = res.data.data;
            datas.forEach((ele, index) => {
              ele.isShow = true
              ele.isCheck = false
              ele.fCreateTime = _this.format(ele.fCreateTime, 'yyyy-MM-dd');
              if (ele.fGoodsImgUrl && ele.fGoodsImgUrl.indexOf('video_') !== -1) {
                ele.fGoodsImgUrl = ele.fGoodsImgUrl.substring(6, ele.fGoodsImgUrl.length);
              }
            })
            if (datas) {
              let firstId, firstEntrepId;
              if (datas.length) {
                firstId = datas[0].exProId ? datas[0].exProId : datas[0].fGoodsId;
                firstEntrepId = datas[0].fEntrepId
              }
              _this.setData({
                list: datas,
                upRoadingRotate: 0,
                firstId: firstId,
                firstEntrepId: firstEntrepId,
                hideModal: false
              })

            }
          } else {
            _this.setData({
              list: [],
              upRoadingRotate: 0,

            })
            wx.hideLoading()
          }
        }


      },
      fail: function () {}
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: `选择${this.data.type}`,
    })
    wx.hideShareMenu() //禁掉转发
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

  }
})