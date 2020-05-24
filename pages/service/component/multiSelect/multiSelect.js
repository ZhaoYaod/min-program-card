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
    blueBg: false, //是否选中
    selectList: [], //当前选中元素下标组成的数组
    typeId: '',
    noImg: imgUrl + 'icon_pic.png', //选中列表没有图片使用默认图片,
    imgUrl: imgUrl,
    title: '',
    warnFlash: 1,
    hideModal: false,
    link: '/pages/component/getPhone/getPhone'

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
  deleToList() {
    if (this.data.selectList.length) {
      this.setData({
        warnFlash: 1,
        hideModal: true,
        title: '数据加载中'
      })
      setTimeout(() => {
        let pages = getCurrentPages();
        let prevpage = pages[pages.length - 2];
        let prevpage2 = pages[pages.length - 3];
        let selectData = this.data.list.filter(item => !item.isCheck)
        let str = '';
        selectData.forEach(item => {
          str += `${item.fGoodsId},`
        })
        str = str.substring(0, str.lastIndexOf(','))
        let typeLen = selectData.length;
        prevpage.setData({
          list: selectData,
          typeId: str
        })
        switch (this.data.type) {
          case '产品':
            prevpage2.setData({
              PRODUCT: typeLen,
              productIds: str
            });
            break;
          case "服务":
            prevpage2.setData({
              SERVICE: typeLen,
              serviceIds: str
            });
            break;
          case "文章":
            prevpage2.setData({
              ARTICAL: typeLen,
              articleIds: str
            });
            break;
        }
        this.setData({
          warnFlash: 2,
          title: '已移除'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
          this.setData({
            hideModal: false
          })
        }, 800);
      }, 800);

    }



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

    this.setData({
      selectList: selectList,
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
    var token = wx.getStorageSync('token').token;
    if (options.typeId) {
      wx.request({
        url: dataUrl + 'manage-api/resource/cardgoods/queryGoodById',
        methods: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          type: fGoodsType,
          list: options.typeId,
          meOrFind: 1
        },
        success: function (res) {
          if (res.data.status == 404) {
            _this.setData({
              loginState: true
            })
          } else {
            res.data.data.forEach((item, index) => {
              if (fGoodsType == 3) {
                item.fCreateTime = _this.format(item.fCreateTime, 'yyyy-MM-dd');
                if (item.fGoodsImgUrl && item.fGoodsImgUrl.indexOf('video_') !== -1) {
                  item.fGoodsImgUrl = item.fGoodsImgUrl.substring(6, item.fGoodsImgUrl.length);
                }
              }
              item.isShow = true
            })
            _this.data.list = res.data.data;
            if (res.data.data) {
              _this.setData({
                list: _this.data.list,
                hideModal: false
              })
            }
          }

        }
      })
    } else {
      _this.setData({
        list: [],
        hideModal: false
      })
      return
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: `名片${this.data.type}列表`,
    })
    wx.hideShareMenu() //禁掉转发
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

  }
})