// addCardFromIndex.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isValue: false,
    isFocus: false,
    dailogS:false,
    colorS:false,
    colorIndex:-1,
    cardlist: [
      // {
      //   id: '',
      //   picUrl: '',
      //   pnumber: '15720986997',
      //   name: 'cb^^^$%^%',
      //   cName: '京东',
      //   cardNum: 1,
      //   tag: 'sM，导游，购物，出轨',
      //   pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      //   bgs: false
      // }
    ],
    searchArray: [],
    isPhone:false,
    phoneValue:'',
    phoneNum:1,
    seachIng:false,
    lodingUrl: imgUrl +'uploading.png',
    clickWhich:0,
    loginState: false,//true：显示登录页 false：不显示登陆页
    compontpass: false,//true:登录页点击了暂不登陆按钮,
    isHas:false
  },
  /**
   * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    // console.log(options);
    //可以在页面 onLoad 中去获取页面 url 中的参数( 下面 onShareAppMessage 函数中配置)
    // if (options.isshare == 1) {
    //   console.log('是分享进入');
    //   this.setData({
    //     'isshare': options.isshare
    //   })
    // }
    if (options.fPhone && options.fromEditor) { //这是通过编辑名片页过来的（赵耀东）
      // wx.navigateTo({
      //   url: '/pages/cardListFromIndex/cardListFromIndex?phone=' + options.phone
      // })
      wx.navigateTo({
        url: '/pages/cardListFromAdd/cardListFromAdd?fPhone=' + options.fPhone
      })

    }
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '添加名片'    //页面标题
    }) 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      dailogS:false
    })
    wx.setNavigationBarTitle({
      title: '添加名片'    //页面标题
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
    return {
      title: '看看哪些朋友拥有了自己的族蚂商务名片？',    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index?zmCardShare=2',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl + '附近.png'
    }
  },
  allSearch: function (e) {
    // console.log('this.data.phoneNum---------------', this.data.phoneNum)
    this.setData({
      searchArray: []
    })
    if (this.data.isPhone){
      this.setData({
        seachIng: true
      })
      this.getData(this.data.phoneNum)
    }
  },
  getData: function (v) {//请求获取数据
    // let poxy = app.globalData.poxy.CARD_LIST
    let that = this
    let token = wx.getStorageSync('token').token
    let noName = ''
    let obj = {
      'content-type': 'application/json',
      'Authorization': ''
    }
    if (token){
      obj = {
        'content-type': 'application/json',
        'Authorization': token
      }
    }else{
      obj = {
        'content-type': 'application/json',
      }
    }
    setTimeout(()=>{
      wx.request({
        url: dataUrl + 'manage-api/resource/cardbag/queryByPhone',
        method: 'GET',
        header: obj,
        data: { "fOtherId": v },
        success: function (res) {
          console.log('@@@@@@------------------', res)
          if (res.data.data && res.data.data.length > 0) {
            let newArr = []
            let nameArr = []
            let fPhotoUrlArr = []

            res.data.data.forEach((element, index) => {
              // if (index < 2) {
              //   if (!element.fUserName) {
              //     nameArr.push(noName)
              //   } else {
              //     nameArr.push(element.fUserName)
              //   }
                
              // }
              nameArr.push(element.fUserName)
              if (!element.fPhotoUrl) {

                fPhotoUrlArr.push(imgUrl + 'default2.png')
              } else {
                if (element.fPhotoUrl == '/static/default.png') {
                  fPhotoUrlArr.push(imgUrl + 'default2.png')
                } else {
                  fPhotoUrlArr.push(element.fPhotoUrl)
                }
              }
              element.fPhotoUrl = fPhotoUrlArr
              // console.log('element.fPhotoUrl--------------', element.fPhotoUrl)
            })
            // let str = nameArr.join("/")
            let strName = ''
            nameArr = [...new Set(nameArr)]
            nameArr.forEach((element, index) => {
              switch (index) {
                case 0:
                  strName = element
                  break;
                case 1:
                  strName += '/' + element
                  break;
                default:
                  break;
              }
            })
            let obj = {
              fPhone: v,
              cardNum: res.data.data.length,
              fUserName: strName,
              fPhotoUrlArr: fPhotoUrlArr
            }
            newArr.push(obj)
            that.setData({
              searchArray: newArr,
              seachIng: false,
              isHas: false
            })
          } else {
            that.setData({
              searchArray: [],
              seachIng: false,
              isHas: true,
              isValue: true
            })
          }
          
        },
        fail: function (err) {
          console.log('请求失败------------------')
          that.setData({
            searchArray: [],
            seachIng: false,
            isHas:true,
            isValue:true
          })
          
        }
      })
    },1000)
    
  },
  // 整体页面点击事件
  closeDl: function (e) {
    this.setData({
      dailogS: false
    })
  },
  // 键盘输入时触发
  searchInputAction: function (e) {
    let that = this
    let value = e.detail.value.trim()
    // console.log('value-----------------', value)
    let searched = []
    this.setData({
      phoneNum: value
    })
    if (value == ""){
      that.setData({
        searchArray: searched,
        isValue: false,
        isFocus: true,
        isHas: false
      })
    }else{
      that.setData({
        searchArray: searched,
        isValue: true,
        isFocus: true,
        isHas: false
      }) 
    }
    that.checkPhone(value)
  },
  // 输入框聚焦时触发
  searchFocus: function (e) {
    this.setData({
      isFocus: true
    })
  },
  // 输入框失去焦点时触发
  searchBlur: function (e) {
    this.setData({
      isFocus: false
    })
  },
  // 在引导登陆界面点击”微信用户快捷登录“按钮后并且后台成功返回token后执行的事件
  myEvent: function (e) {
    this.setData({
      loginState: e.detail.loginState
    })
    this.setData({
      dailogS: true
    })
    // console.log('myevent----------------------')
  },
  // 判断在引导登陆界面是否点击了”暂不登陆“按钮
  compontpass: function (e) {
    this.setData({
      compontpass: e.detail.compontpass
    })
    this.setData({
      dailogS: true
    })
  },
  // 扫名片，手动录入，雷达搜点击事件
  menuClick: function (e) {
    let that = this
    let obj = e.currentTarget.dataset
    let index = obj.index
    if(this.data.dailogS){
      this.setData({
        dailogS: false
      })
    }else{
      if (index == 0 || index == 1) {
        let token = wx.getStorageSync('token').token
        if (token && token.length > 0) {
          // console.log('已登录')
          this.setData({
            dailogS: true,
            clickWhich: index
          })
        } else {
          // console.log('未登录')
          if (this.data.compontpass){
            this.setData({
              dailogS: true,
              clickWhich: index
            })
          }else{
            this.setData({
              loginState: true,
            })
          }
          
        }
        this.setData({
          // dailogS: true,
          clickWhich:index
        })
      } else {
        wx.navigateTo({
          url: '../radar/radar',
        })
        this.setData({
          dailogS: false
        })
      }
    }
  },
  dialog2C:function(){
    // console.log('dailogClick-----------------333')
    this.setData({
      dailogS: false
    })
  },
  // 弹框点击事件ain
  dailogClick: function (e) {
    // console.log('dailogClick-----------------444')
    let that = this
    let obj = e.currentTarget.dataset
    let index = obj.index
    wx.removeStorage({//flh 为他人为自己创建名片时候把cardInfo清掉 
      key: 'cardInfo',
    })
    wx.removeStorage({//ltt
      key: 'lable'
    });
    wx.removeStorage({//ltt
      key: 'assignLable'
    });
    if (index == 0 ) {
      wx.setStorageSync("createCardeState", false)
      if (this.data.clickWhich == 0){   
        // wx.reLaunch({
        //   url: '../index/index?otherP=scan'
        // })
        wx.navigateTo({
          url: '../scan/scan'
        })
      } else if (this.data.clickWhich == 1){
        wx.navigateTo({
          url: '../addLable/addLable'
        })
      }
    } else {
      wx.setStorageSync("createCardeState", true)
      if (this.data.clickWhich == 0) {

        wx.navigateTo({
          url: '../scan/scan'
        })

      } else if (this.data.clickWhich == 1) {
        wx.navigateTo({
          url: '../addLable/addLable'
        })
      }

    }
    
    this.setData({
      colorS: true,
      colorIndex:index,
    })
    setTimeout(()=>{
      that.setData({
        colorS: false,
        colorIndex: -1
      })
    },200)
  },
  detailC: function (event) {
    let obj = event.currentTarget.dataset
    let fPhone = obj.fphone
    wx.navigateTo({
      url: '../cardListFromAdd/cardListFromAdd?fPhone=' + fPhone
    })
  },
  //手机号码规范验证
  checkPhone: function (v){ 
    this.setData({
      phoneValue: v
    })
    /*
    *手机号搜索规则：1开头的十一位数字
    */
    // if(!(/^1[3456789]\d{9}$/.test(v))){
    //   // console.log("手机号码有误，请重填");
    //   this.setData({
    //     isPhone:false
    //   })
    // }else{
    //   // console.log("手机号码正确");
    //   this.setData({
    //     isPhone: true
    //   })
    // }
    /*
    * 手机号搜索规则：
    * 1.大于5位纯数字
    * 2.精准匹配手机号
    * 3.不匹配国家码
    */
    if (!(/^\d{6,20}$/.test(v))) {
      // console.log("手机号码有误，请重填");
      this.setData({
        isPhone: false
      })
    } else {
      // console.log("手机号码正确");
      this.setData({
        isPhone: true
      })
    }
  }
})