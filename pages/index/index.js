// pages/index/index.js
let changeCh = require('./PinYin.js'); //中文转拼音
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL //static文件夹图片路径前缀
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
let backgroundAudioManager = wx.getBackgroundAudioManager();//ltt
let model = app.globalData.model
Page({
  /**
   * 页面的初始数据
   */
  data: {
    model:0,
    link: '../component/getPhone/getPhone',
    cardlist: [],
    lettersArr: [{
        letter: "↑",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "⭐",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "A",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "B",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "C",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "D",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "E",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "F",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "G",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "H",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "I",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "J",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "K",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "L",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "M",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "N",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "O",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "P",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "Q",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "R",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "S",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "T",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "U",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "V",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "W",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "X",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "Y",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "Z",
        isShow: false,
        isShow2: false,
      },
      {
        letter: "#",
        isShow: false,
        isShow2: false,
      }
    ],
    keyValue: '',
    forMarkList: [],
    dy: 0,
    dialogObj: {
      box1Show: -1, //该字母分组下第几条数据索引
      letter: "", //当前电机的数据属于哪个字母分组
      box2Show: false //是否显示删除框“确定要从名片夹中删除么？”
    },
    colorChange: { //点击字体颜色变化
      colorShow: false,
      index: 0
    },
    windowHeight: 0,
    isload: false,
    loginState: false, //true：显示登录页 false：不显示登陆页
    deleteObj: {},
    compontpass: false, //true:登录页点击了暂不登陆按钮,
    letterH: 0, //字母索引的高度
    topH: 0,
    zmCardShare: 1,
    imgArr: [
      imgUrl + 'weixinIndex.png',
      imgUrl + 'leida2.png',
      imgUrl + 'noAnyCard.png',
      imgUrl + 'jiantou.png'
    ],
    isChange: false,
    scrollTop: 0,
    scrollAnimation: true,
    scrollH: 0,
    letter: "",
    letter2: "",
    activityStatus: '',//mh
    showPublic:false,
    lodeShow:true,
    scanBack:false,
    lodingUrl: imgUrl + 'uploading.png',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('index---------------------------options', options)
    //通过扫小程序码(并不是名片二维码)获取参数scene进来的，获取type类型判断推广渠道（比如说从360或者百度扫码进来的）
    // if (options.scene && decodeURIComponent(options.scene)) {
    if (options.scene && options.scene.indexOf('type')>-1) {
      let arr = decodeURIComponent(options.scene).split("=")
      wx.setStorageSync('proType', {
        type:arr[1]
      })
    }else{
      wx.setStorageSync('proType', {
        type: ''
      })
    }
    // wx.getUserInfo({
    //   success(res){
    //     console.log(res,'000');
    //     console.log(res.userInfo.avatarUrl,'111');
    //     console.log(res.cloudID,'111');
    //   }
    // })
    //判断机型来改变公众号弹窗位置------flh
    if(model == 1){
      this.setData({
        model:1
      })
    }
    wx.setNavigationBarTitle({
      title: '名片夹',//页面标题
    })  
    if (options.otherP == 'scan') {
      wx.setNavigationBarTitle({
        title: '扫名片', //页面标题
      })
      wx.removeStorage({
        key: 'lable'
      });
      wx.removeStorage({
        key: 'assignLable'
      });
      wx.navigateTo({
        url: '/pages/scan/scan',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '名片夹', //页面标题
      })
    }
    //进名片详情页(通过在cardListFromIndex页面的转发进来的)
    if (options.fId && options.fcardtemplateurl && options.share) {
      wx.navigateTo({
        url: '../../' + options.fcardtemplateurl + '?fId=' + options.fId + '&bgm=' + (options.fbgm ? 2 : 1) + '&share=' + options.share
      })
    }



    let token = wx.getStorageSync('token').token
    if (token && token.length > 0) {
      // console.log('已登录0000')
      this.setData({
        isload: true
      })
      this.getData()
      this.methods.public(this)
      this.setData({
        lodeShow: true
      })
    } else {
      // console.log('未登录00000')
      this.setData({
        showPublic: true
      })
      this.setData({
        lodeShow: false
      })

    }

    if (options.zmCardShare) { //用户通过族蚂微名片首页分享过来
      switch (options.zmCardShare) {
        case "1":
          wx.removeStorage({
            key: 'lable'
          });
          wx.removeStorage({
            key: 'assignLable'
          });
          wx.navigateTo({
            url: '/pages/addLable/addLable',
          })
          break;
        case "2":
          wx.navigateTo({
            url: '/pages/addCardFromIndex/addCardFromIndex',
          })
          break;
      }
    }
    if (options.shareIn) { //用户通过海报分享过来
      wx.navigateTo({
        // url: '/pages/cardListFromIndex/cardListFromIndex?shareIn=shareFromQR&fPhone=' + options.fPhone + '&fId=' + options.fId,
        url: '/pages/cardQRcode/cardQRcode?shareIn=shareFromQR&fPhone=' + options.fPhone + '&fId=' + options.fId,
      })
    }
    if (options.fPhone && options.fromEditor) { //这是通过编辑名片页过来的（赵耀东）
      // wx.navigateTo({
      //   url: '/pages/cardListFromIndex/cardListFromIndex?phone=' + options.phone
      // })
      wx.navigateTo({
        url: '/pages/addCardFromIndex/addCardFromIndex?fPhone=' + options.fPhone + '&fromEditor=' + options.fromEditor
      })
    }

 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
  },
  // 获取页面DOM元素高度
  getDomH: function(v) {
    // 获取字母索引元素高度========================================start 
    let that = this
    let query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select(v).boundingClientRect() // 这段代码的意思是选择Id=productServe的节点，获取节点位置信息的查询请求
    query.selectViewport().scrollOffset() // 这段代码的意思是获取页面滑动位置的查询请求
    query.exec((res) => {

      if (!res[0] || !res[0].height) return
      let lineH = res[0].height
      if (v == '#lettersLine') {
        that.setData({
          letterH: lineH
        })
      } else if (v == '#topC') {
        // let topHeight = wx.getSystemInfoSync().windowHeight - lineH-48
        let topHeight = wx.getSystemInfoSync().windowHeight - 48
        that.setData({
          topH: topHeight
        })

      } else if (v == '#dialog1') {
        // console.log('res---------------res----',res)
        if ((res[0].top + res[0].height) > (that.data.windowHeight - 48)) {
          that.setData({
            isChange: true
          })
        } else {
          that.setData({
            isChange: false
          })
        }
      } else if (v == '#scrollH') {
        // console.log(res, 'scrollH---------------', res[0].height)
        that.setData({
          scrollH: res[0].height
        })
      }

    })
    // 获取字母索引元素高度==========================================end
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '名片夹',//页面标题
    })
    let that = this
    this.menuClick()
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

    let token = wx.getStorageSync('token').token
    if (token && token.length > 0) {
      // console.log('已登录onShow')
      this.setData({
        isload: true
      })
      this.getData()
    } else {
      // console.log('未登录onShow')
    }
    // 显示所有数据=======================================start
    // let changeList = this.pySegSort(this.data.cardlist, 'name')//按字母分组后的数据
    // this.setData({
    //   forMarkList: changeList
    // })
    // 显示所有数据========================================end
    this.getDomH('#lettersLine')
    this.getDomH('#topC')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    
    backgroundAudioManager.stop();//ltt
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  // 在引导登陆界面点击”微信用户快捷登录“按钮后并且后台成功返回token后执行的事件
  myEvent: function(e) {
    this.setData({
      loginState: e.detail.loginState
    })
    this.getData()
    this.methods.public(this)
    // console.log('myevent----------------------')
  },
  // 判断在引导登陆界面是否点击了”暂不登陆“按钮
  compontpass: function(e) {
    this.setData({
      compontpass: e.detail.compontpass
    })
    if (this.data.compontpass) {
      this.setData({
        isload: true
      })
    }
  },
  //点击”邀请微信好友创建名片“按钮判断登录状态
  loadClick: function() {
    this.menuClick()
    let that = this
    let token = wx.getStorageSync('token').token
    if (token && token.length > 0) {
      // console.log('已登录')
      // this.setData({
      //   isload:true
      // })
      this.getData()
    } else {
      // console.log('未登录')
      if (this.data.compontpass) return
      this.setData({
        loginState: true,
        success: res => {
          that.getData()
        }
      })
    }
  },
  //请求获取数据
  getData: function() {
    let token = wx.getStorageSync('token').token
    if (!token){
      that.setData({
        lodeShow: false
      })
      return
    } 
    let that = this
    wx.request({
      url: dataUrl + 'manage-api/resource/cardbag/queryCardBag', //开发环境
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      success: function(res) {
        console.log('ggggggggggg------------------',res)
        if (res.data.status == 404) {
          wx.removeStorage({
            key: 'token',
            success(res) {
              // console.log('token过期了请重新登录----------------')
              that.loadClick()
            }
          })
          return
        }
        let dataArr = []
        let newArr = []
        if (!res.data.data || !res.data.data.data || res.data.data.data.length == 0) return
        let imageDomain = res.data.data.imageDomain
        res.data.data.data.forEach((element, index) => {    
          if (element.data.length > 0) {
            element.data.forEach((ele, i) => {
              // console.log('ele.fCardName------------', ele.fCardName)
              newArr.push(ele)
              //该手机号超过两张名片时，名称只显示前两张名片的名称（用/分割）==============start
              let arr1 = []
              let str = ''
              arr1 = ele.fCardName?ele.fCardName.split("/"):['默认名称']
              if (arr1.length >=2){
                str = arr1[0] + "/"+ arr1[1]
                ele.fCardName = str
              }
              //该手机号超过两张名片时，名称只显示前两张名片的名称（用/分割）================end

              // 去掉标签字符串头尾的"[","]"字符=================================start
              let str1 = ele.fCardTags.replace("[", "")
              ele.fCardTags = str1.replace("]", "")
              // 去掉标签字符串头尾的"[","]"字符=================================end

              // 头像修改====================================================start
              // console.log('ele.fCardPics---------', ele.fCardPics)
              let picArr = ele.fCardPics?ele.fCardPics.split(","):['没有头像']
              ele.fCardPics = []
              picArr.forEach((elem, j) => {
                elem = imageDomain + elem
                ele.fCardPics.push(elem)
              })
              // 头像修改======================================================end

            })
            dataArr.push(element)
          }
        })
        that.setData({
          forMarkList: dataArr,
          cardlist: newArr
        })
        
        that.setData({
          lodeShow: false
        })

        setTimeout(() => {
          that.getDomH('#lettersLine')
          that.getDomH('#topC')
          that.getDomH('#scrollH')
          return
        }, 20)
      },
      fail: function(err) {
        // console.log('请求失败------------------')
        that.setData({
          lodeShow: false
        })
      },
      complete:()=>{
        // console.log('rrrrrrrrrrrrrrrrrrrrrrrcomplete---------')
        that.setData({
          lodeShow: false
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var that = this
    // console.log('loginState--------', that.data.loginState)
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: that.data.loginState ?'能够关联网站、公众号、小程序的智能微信名片！':'名片拍照扫描工具，建立自己的微信名片册', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index', // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl + (that.data.loginState ? '智慧.png' : '扫码.png'), //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function() {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function() {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    // 来自页面内的按钮的转发

    if (options.from == 'button') {
      var eData = options.target.dataset;
      // console.log('eData-------------', eData)
      if (eData.name == 'shareBtn2') {
        // 此处可以修改 shareObj 中的内容
        shareObj.title = '大家都在用的族蚂名片小程序！'
        // shareObj.path = '/pages/cardListFromIndex/cardListFromIndex'
        shareObj.path = '/pages/index/index'
        shareObj.imageUrl = imgUrl + '附近.png'
      } else if (eData.name == 'activity') { //马慧的红包分享
        shareObj.title = '大家都在用的族蚂名片小程序！'
        shareObj.path = '/pages/index/index'
        // shareObj.imageUrl = imgUrl + '附近.png'
      } else {
        let wxName = wx.getStorageSync('WechatRawData')?JSON.parse(wx.getStorageSync('WechatRawData')).nickName:''
        if (!wxName) {
          wxName = ''
        }
        // 此处可以修改 shareObj 中的内容
        shareObj.title = '微信好友' + wxName + '正在邀请你使用族蚂名片制作名片'
        shareObj.path = '/pages/index/index?zmCardShare=' + this.data.zmCardShare
        shareObj.imageUrl = imgUrl + '智慧.png'
      }

    }
    // 返回shareObj
    return shareObj
  },
  // 输入框聚焦时触发
  searchFocus: function(e) {
    wx.navigateTo({
      url: '../searchFromIndex/searchFromIndex'
    })
  },

  onShare: function() {
    wx.onShareAppMessage({
      path: '/pages/index/index'
    })
  },
  // 点击名片雷达页面跳转
  toRadar: function(e) {
    wx.navigateTo({
      url: '../radar/radar'
    })
    this.menuClick()
  },
  // 点击添加按钮页面跳转
  addCard: function(e) {
    wx.navigateTo({
      url: '../addCardFromIndex/addCardFromIndex',
    })
  },
  // 实现汉字按拼音首字母分组拼序
  pySegSort: function(arr, key) {
    if (!String.prototype.localeCompare) return null;
    // var letters = "*abcdefghjklmnopqrstwxyz".split('');
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var segs = [];
    var curr;
    let otherArr = []
    letters.forEach(function(item, i) {
      curr = {
        letter: item,
        data: []
      };
      arr.forEach(function(item2) {
        //把要排序的字段值转成大写字母字符串再把该字符串转成数组
        let keyWordArr = changeCh.CC2PY(item2[key]).toLocaleUpperCase().split("")
        // let keyWord = changeCh.CC2PY(item2[key]).toLocaleUpperCase()[0]
        //只存放字母的数组（其它元素如！@#￥123等自动忽略）
        let ziMudArr = []
        //首字母变量
        let firstWord = ""
        //只要该字段（key）包含有字母,isOk就是true
        let isOk = false

        keyWordArr.forEach((ele, index) => {
          // A~Z  ASCII码（只存放字母的数组（其它元素如！@#￥123等自动忽略））
          if (ele.charCodeAt() >= 65 && ele.charCodeAt() <= 90) {
            ziMudArr.push(ele)
            isOk = true
          }
        })
        //当该字段（key）不包含有任何一个字母时该字段所在的数据单独放到otherArr数组中
        if (!isOk) {
          otherArr.push(item2)
          otherArr = Array.from(new Set(otherArr))
        }

        //拿首字母进行排序
        firstWord = ziMudArr[0]
        if (item == firstWord) {
          curr.data.push(item2);
        }
      });

      if (curr.data.length) {
        segs.push(curr);
        // curr.data.sort(function (a, b) {//
        //   return a.localeCompare(b);
        // });
      }
    });
    //当该字段（key）不包含有任何一个字母时统一归类为“#”
    if (otherArr.length > 0) {
      let curr2 = {
        letter: "#",
        data: otherArr
      };
      segs.push(curr2);
    }
    return segs;
  },
  // “删除名片，转发” 弹窗点击事件(把该弹窗关闭)
  menuClick: function() {
    // console.log('menuClick--------------------')
    let showObj = {
      box1Show: -1,
      letter: "",
      box2Show: false
    }
    this.cnacelBGC()
    this.setData({
      ['dialogObj']: showObj
    })
  },
  // 给当前列添加背景色，其它列取消背景色，如果不传任何参数则所有列都不加灰色的背景色
  cnacelBGC: function(letter, index, v3) {
    let that = this
    this.data.forMarkList.forEach((element, i) => {
      if (element.letter == letter) {
        element.data.forEach((element, j) => {
          let each = "forMarkList[" + i + "]" + ".data[" + j + "].bgs"
          if (index == j) {
            that.setData({
              [each]: true
            })
            if (v3) {
              setTimeout(() => {
                that.setData({
                  [each]: false
                })
                return
              }, 200)
            }
          } else {
            that.setData({
              [each]: false
            })
          }
        })
      } else {
        element.data.forEach((element, j) => {
          let each = "forMarkList[" + i + "]" + ".data[" + j + "].bgs"
          that.setData({
            [each]: false
          })
        })
      }
    })
  },
  // 点击字母分组所在列
  cardLetterClick: function(event) {
    this.cnacelBGC()
    let showObj = {
      box1Show: -1,
      letter: "",
      box2Show: false
    }
    this.setData({
      ['dialogObj']: showObj
    })
  },
  // 关键字搜索时，在符合条件的数据列表中的点击事件
  searchClick: function(event) {
    let that = this
    let obj = event.currentTarget.dataset
    let phone = obj.phone
    wx.navigateTo({
      url: '../cardListFromIndex/cardListFromIndex?phone=' + phone
    })
  },
  // 点击名片列页面跳转
  cardClick: function(event) {
    let that = this
    let obj = event.currentTarget.dataset
    let index = obj.index
    let letter = obj.letter
    let phone = obj.phone
    let fnum = obj.fnum
    if (this.data.dialogObj.box1Show >= 0) {
      let showObj = {
        box1Show: -1,
        letter: "",
        box2Show: false
      }

      this.setData({
        ['dialogObj']: showObj
      })
      this.cnacelBGC()
      // console.log('取消弹框')
    } else {
      this.cnacelBGC(letter, index, "singleClick")

      // wx.setStorageSync('QRobj', {
      //   fPhone: phone,
      // })
      wx.navigateTo({
        url: '../cardListFromIndex/cardListFromIndex?phone=' + phone + '&fNum=' + fnum,
      })
    }

  },
  // 名片列长按事件
  cardLongtap: function(event) {
    let that = this

    let obj = event.currentTarget.dataset
    let index = obj.index
    let letter = obj.letter

    this.cnacelBGC(letter, index)
    let showObj = {
      box1Show: obj.index,
      letter: obj.letter
    }
    this.setData({
      dialogObj: showObj,
    })
    // setTimeout(()=>{
    that.getDomH('#dialog1', obj)
    // },0)
    // console.log(this.data.dialogObj, this.data.forMarkList,'event----------box1Show-----', event)
  },
  //批量取消收藏
  deleteCardList: function(obj) {
    let url = dataUrl + 'manage-api/resource/cardbag/deleteCardList'
    let token = wx.getStorageSync('token').token
    if (!token) return
    let that = this
    wx.request({
      url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      data: {
        "fOtherId": obj.phone,
        // "fCardId": obj.fcardid
      },
      success: function(res) {
        that.getData()
        // console.log('批量取消收藏------------------')
      },
      fail: function(err) {
        // console.log('请求失败------------------')
      }
    })
  },
  // 删除名片列
  deleteCard: function(event) {
    let obj = event.currentTarget.dataset
    let index = obj.index
    let letter = obj.letter

    this.setData({
      deleteObj: obj
    })
    // console.log('this.data.deleteObj--------------', this.data.deleteObj)
    this.setData({
      ['dialogObj.box1Show']: -1
    })
    if (index == 0) {
      this.setData({
        ['dialogObj.box2Show']: true,
        ['colorChange.colorShow']: true,
        ['colorChange.index']: 0,
      })
    } else {
      this.setData({
        ['dialogObj.box2Show']: false
      })
    }

    this.setData({
      ['colorChange.colorShow']: true,
      ['colorChange.index']: index
    })
    setTimeout(() => {
      this.setData({
        ['colorChange.colorShow']: false,
        ['colorChange.index']: -1
      })
      return
    }, 200)
  },
  // 是否确认删除名片（取消，删除弹窗）
  isCancelOrNot: function(event) {
    let that = this
    let obj = event.currentTarget.dataset
    let index = obj.index
    let nowIndex = 0 //分组索引（如：A ,B,C......）
    let nowIndex2 = this.data.dialogObj.box1Show //点击该分组下该条数据的索引（如A组下第一条数据的索引为0）
    this.setData({
      ['dialogObj.box2Show']: false,
      ['dialogObj.box1Show']: -1
    })
    if (index == 0) {
      this.cnacelBGC()
      return //点取消按钮只是关闭弹窗，不删除数据所以下面的数据删除功能不执行
    }
    this.deleteCardList(this.data.deleteObj)
    // this.data.lettersArr.forEach((element,i)=>{
    //   if (element.letter == this.data.dialogObj.letter){
    //     if (i >= 2) {//字母在数组lettersArr中从索引2开始
    //       nowIndex = i-2
    //     }
    //   }
    // })
    // let filterArr = []
    // let keyWork = ""
    // this.data.forMarkList.forEach(function (item, index) {
    //   let curr = {letter:item.letter,data:[]}
    //   if (item.letter == that.data.dialogObj.letter){
    //     item.data.forEach((ele,i)=>{
    //       if (i != nowIndex2){
    //         curr.data.push(ele)
    //       }
    //     })
    //     // keyWork = item.data[nowIndex2].name
    //   }else{
    //     item.data.forEach((ele, i) => {
    //       curr.data.push(ele)
    //     })
    //   }
    //   filterArr.push(curr)
    // })


    // let filterArr2 = []
    // filterArr2 = filterArr.filter(function (item, index) {
    //   return item.data.length != 0
    // })

    // this.setData({
    //   forMarkList: filterArr2
    // })
  },
  // 点击右边固定列表中的字母时该字母加上背景色并且与之对应的字母分组移动到页面最顶部
  letterClick: function(event) {
    // console.log('letterClick-----------------------')
    this.menuClick()
    this.cnacelBGC()
    let that = this
    let obj = event.currentTarget.dataset
    let index = obj.index
    let letter = obj.letter == '#' ? 'lastOne' : obj.letter
    this.setData({
      letter2: obj.letter
    })
    this.data.lettersArr.forEach((element, i) => {
      let eachL = 'lettersArr[' + i + '].isShow'
      let eachL2 = 'lettersArr[' + i + '].isShow2'
      if (index == i) {
        that.setData({
          [eachL]: true,
          [eachL2]: false
        })
      } else {
        that.setData({
          [eachL]: false,
          [eachL2]: false
        })
      }
    })
    // console.log(index, 'this.data.lettersArr----------------', this.data.lettersArr)
    if (index == 0 || index == 1) {
      // wx.pageScrollTo({
      //   scrollTop: 0,
      //   duration: 0
      // })
      this.setData({
        letter: 'topC'
      })
      that.setData({
        scrollTop: 0,
      })
    } else {
      this.setData({
        letter: letter
      })
      let moveH = (index / that.data.lettersArr.length) * that.data.scrollH
      // console.log('moveH--------------------', moveH)
      const query = wx.createSelectorQuery() // 创建节点查询器 query
      if (query.select('#' + letter)) {
        query.select('#' + letter).boundingClientRect() // 这段代码的意思是选择Id=productServe的节点，获取节点位置信息的查询请求       
        query.selectViewport().scrollOffset() // 这段代码的意思是获取页面滑动位置的查询请求
        query.exec((res) => {
          // res[0].top// #productServe节点的到页面顶部的距离
          // res[0].width// #productServe节点的宽度
          // res[0].height// #productServe节点的高度
          // console.log('res-----------------', res)
          if (res[0]) {
            // console.log(res, 'res[1].scrollTop + res[0].top-----------------', res[1].scrollTop + res[0].top)
            // wx.pageScrollTo({
            //   scrollTop: res[1].scrollTop + res[0].top+63,
            //   duration: 300
            // })
            // let topChange = res[1].scrollTop + res[0].top + 63
            let topChange = res[1].scrollTop + res[0].top
            that.setData({
              scrollTop: topChange,
            })
          }
        })
      }
    }
  },
  touch1Start: function(event) {
    this.menuClick()
    this.cnacelBGC()
    // let clientY = event.changedTouches[0].clientY
    let that = this
    let clientY = event.changedTouches[0].clientY
    let oriY = event.currentTarget.offsetTop
    let sub = clientY - oriY
    const query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select('#lettersLine').boundingClientRect() // 这段代码的意思是选择Id=productServe的节点，获取节点位置信息的查询请求
    query.selectViewport().scrollOffset() // 这段代码的意思是获取页面滑动位置的查询请求
    query.exec((res) => {
      let lineH = res[0].height
      let eachH = res[0].height / this.data.lettersArr.length
      // console.log(eachH, 'res-----------------', Math.ceil(sub / eachH) )
      let count = Math.ceil(sub / eachH)
      if (count >= 1 && count <= this.data.lettersArr.length) {
        let letter = this.data.lettersArr[count - 1].letter == '#' ? 'lastOne' : this.data.lettersArr[count - 1].letter

        that.data.lettersArr.forEach((element, i) => {
          let eachL = 'lettersArr[' + i + '].isShow'
          let eachL2 = 'lettersArr[' + i + '].isShow2'
          if (letter == element.letter) {
            that.setData({
              [eachL]: true,
              [eachL2]: false
            })
          } else {
            that.setData({
              [eachL]: false,
              [eachL2]: false
            })
          }
        })
        that.setData({
          letter2: letter
        })

        if (letter == "↑" || letter == that.data.lettersArr[1].letter) {
          that.setData({
            letter: 'topC'
          })
        } else {
          that.setData({
            letter: letter
          })
        }
      }
    })
  },
  // 在右边固定字母列表中的滑动时与之对应的字母分组移动到页面最顶部
  touch1Move: function(event) {
    let that = this
    let clientY = event.changedTouches[0].clientY
    let oriY = event.currentTarget.offsetTop
    let sub = clientY - oriY
    // console.log(event, 'event.currentTarget.dataset--------------')
    const query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select('#lettersLine').boundingClientRect() // 这段代码的意思是选择Id=productServe的节点，获取节点位置信息的查询请求
    query.selectViewport().scrollOffset() // 这段代码的意思是获取页面滑动位置的查询请求
    query.exec((res) => {
      // res[0].top// #productServe节点的到页面顶部的距离
      // res[0].width// #productServe节点的宽度
      // res[0].height// #productServe节点的高度
      let lineH = res[0].height
      let eachH = res[0].height / this.data.lettersArr.length

      let count = Math.ceil(sub / eachH)
      if (count >= 1 && count <= this.data.lettersArr.length) {

        let newArr = []
        newArr = that.data.lettersArr.map((element, i) => {
          if ((count - 1) == i) {
            element.isShow = true
            element.isShow2 = true
          } else {
            element.isShow = false
            element.isShow2 = false
          }
          return element;
        })

        that.setData({
          lettersArr: newArr
        })

        let letter = this.data.lettersArr[count - 1].letter == '#' ? 'lastOne' : this.data.lettersArr[count - 1].letter
        that.setData({
          letter2: letter
        })
        if (letter == "↑" || letter == that.data.lettersArr[1].letter) {

          that.setData({
            letter: 'topC'
          })
        } else {

          that.setData({
            letter: letter
          })

        }
      }
    })
  },
  // 滑动完毕时 给当前最后结束位置的字母加上背景色
  touch1Cancel: function(event) {
    // console.log('touch1Cancel-------------------')
    let newArr = []
    newArr = this.data.lettersArr.map((element, i) => {
      element.isShow2 = false
      return element;
    })
    this.setData({
      lettersArr: newArr
    })
    this.setData({
      letter2: '',
    })
  },
  // 获取参加活动状态
  getActivityStatus(res) {
    let token = wx.getStorageSync('token').token
    this.getData()
    if (res.detail.val) {
      this.setData({
        activityStatus: res.detail.val
      })
    }
    this.setData({
      isload: true
    })
  },
  methods: {
    public(that) {
      //判断关联公众号显示隐藏
      wx.request({
        url: dataUrl + 'manage-api/resource/carduser/subscribeState',   //是否关注公众号接口
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token').token
        },
        success(res) {
          let status = res.data.status
          if (status) {
            that.setData({
              showPublic: true
            })
          } else {
            that.setData({
              showPublic: false
            })
          }
        }
      })
    }
  },
  //在长按名片列时选择移除名片时，在弹出的蒙层中点击灰色蒙层取消选中状态和关闭弹窗
  cancelS:function(){
    let showObj = {
      box1Show: -1,
      letter: "",
      box2Show: false
    }
    this.setData({
      ['dialogObj']: showObj
    })
    this.cnacelBGC()
  },
  nothing:function(){}
})