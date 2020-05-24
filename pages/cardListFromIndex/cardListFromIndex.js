// cardListFromIndex.js
// let sharePic = require('../../utils/sharePic.js')
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardlist: [],
    dailogS:false,
    windowHeight:0,//设备可见区域高度
    addAnm: false,//是否添加动画
    eachBgcS:false,//是否显示背景色
    nowIndex:-1,//当前选中的名片列的索引
    colorChange: {//点击字体颜色变化
      colorShow: false,
      index: 0
    },
    fOtherId:'',
    fNum:0,
    deleteObj:{},
    canClick:false,

    bgImgPath0: '',
    bgImgPath1: '',
    bgImgPath2: '',
    bgImgPath3: '',
    bgImgPath4: '',
    bgImgPath5: '',
    textArr:[],
    shareImgSrc:'',
    title:'确定要移除该名片？',
    lineP:true,
    warnTitle: '',
    num: 1,//1:loading  2:success 0:!
    isShareIn: false,
    cardName:'',
    clickNum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // console.log('options-----------------------@@@@', options)
    if (options.shareIn) {//用户通过海报分享过来
      wx.navigateTo({
        url: '/pages/cardQRcode/cardQRcode?shareIn=shareFromQR&fPhone=' + options.fPhone + '&fId=' + options.fId,
      })
      
    }
    this.setData({
      fOtherId: options.phone,
      fNum: options.fNum
    })
    that.setData({
      warnTitle: '数据加载中',
      num: 1,//1:loading  2:success 0:!
      isShow: true,
    })
    // console.log('that.data.fOtherId--------------', that.data.fOtherId)
    that.getData(that.data.fOtherId)
    that.getAllData(that.data.fOtherId)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.setNavigationBarTitle({
    //   title: '名片列表'//页面标题
    // }) 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('onShow-----------------------@@@@', this.data.fOtherId)
    // wx.setNavigationBarTitle({
    //   title: '名片列表'//页面标题
    // }) 
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })

    this.data.cardlist.forEach((element, i) => {
      element.bgc = false
      element.menuS = false
    })
    this.setData({
      cardlist: this.data.cardlist,
      eachBgcS: false,
      nowIndex: -1
    })
    // 为了解决当用户通过点击名片二维码分享出去的页面进到“名片二维码”再返回此页没有数据的情况
    // if (wx.getStorageSync('QRobj').fPhone) {
    //   this.getData(wx.getStorageSync('QRobj').fPhone)
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this
    if (that.data.cardlist.length > 0){
      that.data.cardlist.forEach((element, i) => {
        element.dailogS = false
        element.bgs = false
        element.menuS = false
      })
      that.setData({
        cardlist: that.data.cardlist
      })
    }
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
  onShareAppMessage: function (options) {
    let shareObj = {
      title: '大家都在用的族蚂名片小程序！',    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl + '附近.png'
    }
    if (options.from == 'button') {
      let eData = options.target.dataset;
      // console.log('eData-------------------', eData)
      if (eData.name == 'shareBtn') {
        let unionId = wx.getStorageSync('token').unionId
        
        // taskStatus （0：什么活动都没有参加 1：代表参加了第一个活动  2：代表参加了两个活动）
        // share(1: 参加了活动 0：没有参加活动)
        let share = wx.getStorageSync('taskStatus') == 2 ? 1 : 0
        shareObj.title = '这是' + eData.fusername+'的名片，推荐给您！'
        shareObj.path = '/pages/index/index?fcardtemplateurl=' + eData.fcardtemplateurl + '&fId=' + eData.fid + '&share=' + share + '&unionId=' + unionId + '&bgm=' + (eData.fbgm ? 2 : 1)
        if (this.data.shareImgSrc.length<=0){
          shareObj.imageUrl = imgUrl+'附近.png'
        }else{
          shareObj.imageUrl = this.data.shareImgSrc
          // shareObj.imageUrl = 'https://image.pre-zuma.com/basic/1176779730764371647.png'
        }
      }
    }
    return shareObj
  },
  getData: function (v) {//请求获取数据
    // console.log('getData--------------v',v)
    let that = this
    let token = wx.getStorageSync('token').token
    if (!token) return
    wx.request({
      url: dataUrl+'manage-api/resource/cardbag/queryCards',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      // data: { "fOtherId": '15601956980' },
      data: { "fOtherId": v },
      success: function (res) {
        console.log('res.data.data---------------', res.data.data)
        let strName = ''
        let nameArr = []
        res.data.data.forEach((element,index)=>{
          if (!element.fPhotoUrl){
            element.fPhotoUrl = imgUrl + 'default2.png'
          }
          element.fPosition = element.fPosition.substr(0,8)
          nameArr.push(element.fUserName) 
          // switch(index){
          //   case 0 :
          //     strName = element.fUserName
          //     break;
          //   case 1 :
          //     strName += '/'+element.fUserName
          // }

          // wx.setNavigationBarTitle({
          //   title: strName+'的名片',//页面标题
          // })
          element.fCardTemplateName = element.fCardTemplateName.substr(0,3)
        })

        nameArr = [...new Set(nameArr)] 
        nameArr.forEach((element,index)=>{
          switch (index) {
            case 0:
              strName = element
              break;
            case 1:
              strName += '/' + element
              break;
            default :
              break;
          }
          wx.setNavigationBarTitle({
            title: strName + '的名片',//页面标题
          })

        })

        that.setData({
          cardlist: res.data.data
        })
        that.setData({
          warnTitle: '数据加载中',
          num: 1,//1:loading  2:success 0:!
          isShow: false,
        })
      },
      fail: function (err) {
        // console.log('请求失败------------------')
      }
    })
  },
  cnacelC: function () {
    this.data.cardlist.forEach((element, i) => {
      element.bgc = false
      element.menuS = false
    })
    this.setData({
      cardlist: this.data.cardlist,
      eachBgcS: false,
      nowIndex: -1
    })
  },
  // 是否要删除名片
  isCancelOrNot: function (event) {
    let that = this
    let obj = event.currentTarget.dataset
    let index = parseInt(obj.index)
    let deleteIndex = parseInt(obj.deleteindex)
    if(index == 0){

    }else{
      // let filterArr = []
      // filterArr = that.data.cardlist.filter(function (item, i) {
      //   return deleteIndex != i
      // })
      // that.setData({
      //   cardlist: filterArr
      // })
      if (that.data.cardlist.length == 1){
        that.setData({
          warnTitle: '正在返回名片夹',
          num: 1,//1:loading  2:success 0:!
          isShow: true,
        })
        setTimeout(()=>{
          wx.reLaunch({
            url: '/pages/index/index'
          })
          return
        },1000)
        
      }
      this.getData2(this.data.deleteObj)
    }

    that.data.cardlist.forEach((element, i) => {
      element.dailogS = false
      element.bgs = false
      element.menuS = false
    })
    that.setData({
      cardlist: that.data.cardlist
    })
    that.cnacelC()//取消选中状态
  },
  getData2: function (obj) {
    // console.log('getData2------------------',obj)
    let index = parseInt(obj.index)
    let deleteIndex = parseInt(obj.deleteindex)
    let url = ''
    if(index == 0){
      // url = 'http://192.168.0.147:8083/manage-api/resource/cardbag/toTopCardList'
      url = dataUrl+'manage-api/resource/cardbag/toTopCardList'
    }else if(index == 1){
      // url = 'http://192.168.0.147:8083/manage-api/resource/cardbag/deleteCardList'
      url = dataUrl+'manage-api/resource/cardbag/deleteCardList'
    }
    let poxy = app.globalData.poxy.CARD_LIST
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
        "fCardId": obj.fid
      },
      success: function (res) {
        // let index = parseInt(obj.index)
        // let deleteIndex = parseInt(obj.deleteindex)
        if(index == 0){
          let filterArr = []
          let nowArr = []
          nowArr = that.data.cardlist.filter(function (item, i) {
            return deleteIndex == i
          })
          filterArr = that.data.cardlist.filter(function (item, i) {
            return deleteIndex != i
          })
          filterArr.unshift(nowArr[0])

          filterArr.forEach((element, i) => {
            element.dailogS = false
            element.bgs = false
            element.menuS = false
          })

          that.setData({
            cardlist: filterArr
          })
          that.setData({
            warnTitle: '置顶中',
            num: 1,//1:loading  2:success 0:!
            isShow: false,
          })
        }else if(index == 1){
          that.getData(that.data.fOtherId)
        }
        that.cnacelC()//取消选中状态
      },
      fail: function (err) {
        console.log('请求失败------------------')
      }
    })
  },
  // “置顶，删除名片，转发，生产二维码”弹窗点击事件
  menuClick: function (event) {
    // console.log('obj---------------menuClick---000')
    let that = this  
    let obj = event.currentTarget.dataset
    let index = parseInt(obj.index)
    let deleteIndex = parseInt(obj.deleteindex)
    let nowS = this.data.cardlist[index]
    let fstate = obj.fstate
    let newObj = event.currentTarget.dataset
    switch(index){
      case 0 :
        that.setData({
          warnTitle: '置顶中',
          num: 1,//1:loading  2:success 0:!
          isShow: true,
        })
        // that.getData2(obj)
        // let filterArr = []
        // let nowArr = []
        // nowArr = that.data.cardlist.filter(function (item, i) {
        //   return deleteIndex == i
        // })
        // filterArr = that.data.cardlist.filter(function (item, i) {
        //   return deleteIndex != i
        // })
        // filterArr.unshift(nowArr[0])

        // filterArr.forEach((element, i) => {
        //   element.dailogS = false
        //   element.bgs = false
        //   element.menuS = false
        // })

        // that.setData({
        //   cardlist: filterArr
        // })
        
        let otherArr = []
        that.data.cardlist.forEach((element, i) => {
          element.dailogS = false
          element.bgs = false
          element.menuS = false
        })
        that.setData({
          cardlist: that.data.cardlist
        })
        that.getData2(newObj)
        break;
      case 1 :
        that.data.cardlist.forEach((element, i) => {
          element.menuS = false
          if (deleteIndex == i) {
            element.dailogS = true 
          } else {
            element.dailogS = false
          }
        })
        that.setData({
          cardlist: that.data.cardlist,
          deleteObj: newObj,
          title:'确定要移除该名片么？'
        })

        // let otherArr = []
        // that.data.cardlist.forEach((element, i) => {
        //   element.dailogS = false
        //   element.bgs = false
        //   element.menuS = false
        // })
        // that.setData({
        //   cardlist: that.data.cardlist
        // })
        // that.getData2(obj)
        break;
      case 2 :
        
        // fstate：0-未删除，1-删除'
        if (fstate && fstate == 1) {
          this.setData({
            title: '该名片已被所有者删除，是否移除该名片？',
            lineP: false
          })
          that.data.cardlist.forEach((element, i) => {
            element.menuS = false
            if (deleteIndex == i) {
              element.dailogS = true
            } else {
              element.dailogS = false
            }
          })
          obj.index = 1
          that.setData({
            cardlist: that.data.cardlist,
            deleteObj: obj
          })
        }
        break;
      case 3 :
        // console.log(index, 'this.data.cardlist[index]----', this.data.cardlist[this.data.nowIndex])
        // let fstate = obj.fstate
        // fstate：0-未删除，1-删除'
        if (fstate && fstate == 1) {
          this.setData({
            title: '该名片已被所有者删除，是否移除该名片？',
            lineP: false
          })
          let arrL = that.data.cardlist
          arrL.forEach((element, i) => {
            element.menuS = false
            if (deleteIndex == i) {
              element.dailogS = true
            } else {
              element.dailogS = false
            }
          })
          obj.index = 1
          that.setData({
            cardlist: arrL,
            deleteObj: obj
          })
        }else{
          let otherObj = {
            fId: this.data.cardlist[this.data.nowIndex].fId, //名片主键Id
            fUserName: this.data.cardlist[this.data.nowIndex].fUserName,//名片名称
            // fCardUrl: this.data.cardlist[this.data.nowIndex].fCardUrl,//manage后台的海报图片
            fPosterUrl: this.data.cardlist[this.data.nowIndex].fPosterUrl,//manage后台的海报图片
            fPosition: this.data.cardlist[this.data.nowIndex].fPosition,//职位
            fPhone: this.data.cardlist[this.data.nowIndex].fPhone,//手机号
            fCorpName: this.data.cardlist[this.data.nowIndex].fCorpName,//公司名称
            fCardUrl: this.data.cardlist[this.data.nowIndex].fCardUrl,//对应名片二维码
            fAddress: this.data.cardlist[this.data.nowIndex].fAddress,//地址（公司？）
            fWechat: this.data.cardlist[this.data.nowIndex].fWechat,//微信号
            fMail: this.data.cardlist[this.data.nowIndex].fMail,//邮箱
          }
          // console.log('this.data.cardlist[this.data.nowIndex]-------', this.data.cardlist[this.data.nowIndex])
          let objJSON = JSON.stringify(otherObj)
          wx.navigateTo({
            // url: '../cardQRcode/cardQRcode?obj=' + objJSON
            url: '../cardQRcode/cardQRcode?fPhone=' + otherObj.fPhone + '&fId=' + otherObj.fId,
          })
        }
        break;
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
    // console.log('that.data.cardlist---------------22', that.data.cardlist)
  },
  // 是否要删除名片
  cardClick: function (event) {
    // console.log('cardClick------------------------------------')
    let that = this
    let obj = event.currentTarget.dataset
    let index = obj.index
    let fid = obj.fid
    let fbgm = obj.fbgm
    let fcardtemplateurl = obj.fcardtemplateurl
    let fstate = obj.fstate
    let isTrue = false
    this.data.cardlist.forEach((element, i) => {
      if (element.bgc || element.menuS) {
        isTrue = true
      }
    })

    if (isTrue){
      this.data.cardlist.forEach((element, i) => {
        element.bgc = false
        element.menuS = false
      })
      this.setData({
        cardlist: this.data.cardlist
      })
    }else{
      this.setData({
        eachBgcS: true,
        nowIndex:index
      })
      setTimeout(()=>{
        this.setData({
          eachBgcS: false,
          nowIndex: -1
        })
        return
      },200)
    }
    
    this.setData({
      title: '该名片已被所有者删除，是否移除该名片？',
      lineP:false
    })
    // fstate：0-未删除，1-删除'
    if (fstate && fstate==0){
      // fbgm:true(有音乐2) false:没有音乐（1）
      wx.navigateTo({
        url: '../../' + fcardtemplateurl + '?fId=' + fid + '&bgm=' + (fbgm ? 2 : 1)
      })
    }else if(fstate && fstate == 1){

      that.data.cardlist.forEach((element, i) => {
        element.menuS = false
        if (index == i) {
          element.dailogS = true
        } else {
          element.dailogS = false
        }
      })
      obj.index = 1
      that.setData({
        cardlist: that.data.cardlist,
        deleteObj: obj
      })
    }else{
      // fbgm:true(有音乐2) false:没有音乐（1）
      wx.navigateTo({
        url: '../../' + fcardtemplateurl + '?fId=' + fid + '&bgm=' + (fbgm ? 2 : 1)
      })
    }
  },
  //为了长按的时候不去执行点击事件，所以注册一个空的长按事件
  cardLongpress2:function(){
    // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
  },
  // 长按名片
  cardLongpress: function (event) {
    let that = this
    let obj = event.currentTarget.dataset
    let index = obj.index
    
    this.data.cardlist.forEach((element,i)=>{
      if(index == i){
        element.bgc = true
        element.menuS = true
      }else{
        element.bgc = false
        element.menuS = false
      }
    })
    this.setData({
      cardlist: this.data.cardlist,
      nowIndex:index,
      title:'确定要移除该名片么？',
      lineP:true,
      shareImgSrc: this.data.cardlist[index].fShareImgUrl
    })  
  },
  // 给该元素注册空的点击事件是为了防止在点击弹窗的时候点击事件穿透（会执行cardClick事件）
  doNothing:function(){

  },
  // 给该元素注册空的点击事件是为了防止在点击弹窗的时候点击事件穿透（会执行cardClick事件）
  dialogBox2Click: function () {
    // console.log('dialogBox2Click--------------------')
    let that = this
    that.data.cardlist.forEach((element, i) => {
      element.dailogS = false
      element.bgs = false
      element.menuS = false
    })
    that.setData({
      cardlist: that.data.cardlist
    })
  },
  // 个人名片数上限弹窗整个蒙层事件（当“个人名片数上限弹窗”没有关闭时用户又去点击其他地方，白色弹窗就会发生左右抖动提醒用户关闭弹窗）
  dialogBoxClick: function () {
    // console.log('dialogBoxClick--------------------')
    this.setData({
      dailogS: false
    })
  },
  getAllData: function (v) {//请求获取数据,获取该手机号下名片总数量
    // console.log('getAllData----------------',v)
    let that = this
    let token = wx.getStorageSync('token').token
    let noName = ''
    let obj = {
      'content-type': 'application/json',
      'Authorization': ''
    }
    if (token) {
      obj = {
        'content-type': 'application/json',
        'Authorization': token
      }
    } else {
      obj = {
        'content-type': 'application/json',
      }
    }
    wx.request({
      url: dataUrl + 'manage-api/resource/cardbag/queryByPhone',
      method: 'GET',
      header: obj,
      data: { "fOtherId": v },
      success: function (res) {
        // console.log('res.data.data-------------555', res.data.data)
        if (res.data.data && res.data.data.length > 0) {
          that.setData({
            fNum: res.data.data.length
          },()=>{
            // that.numF(v)
          })
        } else {
          that.setData({
            searchArray: 0
          })
        }
      },
      fail: function (err) {
        console.log('请求失败------------------')
      }
    })
  },
  // 点击“帮忙做一个”按钮
  helpClick: function () {
    let that = this
    this.data.cardlist.forEach((element, i) => {
      element.bgc = false
      element.menuS = false
    })
    this.setData({
      cardlist: this.data.cardlist,
      eachBgcS: false,
      nowIndex: -1
    })
    // console.log('that.data.fOtherId--------', that.data.fOtherId)

    // wx.removeStorage({//flh 为他人为自己创建名片时候把cardInfo清掉 
    //   key: 'cardInfo',
    // })
    // wx.removeStorage({//ltt
    //   key: 'lable'
    // });
    // wx.removeStorage({//ltt
    //   key: 'assignLable'
    // });
    // that.getAllData(that.data.fOtherId)
    that.numF(that.data.fNum)
  },
  //判断该手机号下名片总数量大于或小于五张时不同处理
  numF: function (v){
    let that = this
    // console.log('that.data.fNum-----------', that.data.fNum)
    if (that.data.fNum >= 5) {
      that.setData({
        dailogS: true
      })
    } else {
      let phone = wx.getStorageSync('phone')
      if (parseInt(v) == parseInt(phone)){
        // console.log('为自己创建')
        wx.setStorageSync("createCardeState", true)
      }else{
        // console.log('为他人创建')
        wx.setStorageSync("createCardeState", false)
      }
      wx.removeStorage({//flh 为他人为自己创建名片时候把cardInfo清掉 
        key: 'cardInfo',
      })
      wx.removeStorage({
        key: 'lable'
      });
      wx.removeStorage({
        key: 'assignLable'
      });
      wx.navigateTo({
        url: '../addLable/addLable'
      })
    }
  },
  //个人名片数上限弹窗事件（点击“我知道了”按钮）
  dailogClick: function () {
    // console.log('dailogClick------------------------------')
    this.setData({
      dailogS: false
    })
    wx.navigateTo({
      url: '/pages/cardListFromAdd/cardListFromAdd?fPhone=' + this.data.fOtherId
    });
  },
  // 虽说这个函数什么都没有做但是也不能去掉，这是为了解决在点击该元素的时候去执行了父级的事件（加了这函数就只会执行自己的事件而不会去执行父级时间了）
  dailogClick2: function () {
  }
})