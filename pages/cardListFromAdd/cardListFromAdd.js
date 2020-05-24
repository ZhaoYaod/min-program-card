// cardListFromAdd.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: '../component/getPhone/getPhone',//ltt
    cardlist: [],
    isCollectionArr:[ 
    ],
    dailogS: false,
    windowHeight: 0,//设备可见区域高度
    addAnm: false,//是否添加动画
    eachBgcS: false,//是否显示背景色
    nowIndex: -1,//当前选中的名片列的索引
    colorChange: {//点击字体颜色变化
      colorShow: false,
      index: 0
    },
    isDone:false,
    loginState: false,//true：显示登录页 false：不显示登陆页
    compontpass: false,//true:登录页点击了暂不登陆按钮,
    fPhone:0,
    strName:'',
    warnTitle: '数据加载中',
    num: 1,//1:loading  2:success 0:!
    isShow: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options^^^^^^^^^^^^^^^^^^^^^^^^^',options)
    let that = this
    this.setData({
      fPhone: options.fPhone
    })

    setTimeout(()=>{
      that.setData({
        warnTitle: '数据加载中',
        num: 1,//1:loading  2:success 0:!
        isShow: true,
      })
      this.getData(options.fPhone)
    },1000)

    // this.data.cardlist.forEach((element, i) => {
    //   that.data.isCollectionArr.push(element.isCollection)
    // })
    // this.setData({
    //   isCollectionArr: that.data.isCollectionArr
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '名片列表'//页面标题
    }) 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    wx.setNavigationBarTitle({
      title: '名片列表'//页面标题
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
      title: '微信好友都在用的名片小程序',    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl + '附近.png'
    }
  },
  getData: function (v) {//请求获取数据
    // let poxy = app.globalData.poxy.CARD_LIST

    let that = this
    let token = wx.getStorageSync('token').token
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
      url: dataUrl+'manage-api/resource/cardbag/queryByPhone',
      method: 'GET',
      header: obj,
      data: { "fOtherId": v },
      success: function (res) {
        if (res.data.data.length > 0) {
            // console.log('res.data.data-----------------', res.data.data)
            let nameA = []
            let strName = ''
            res.data.data.forEach((element,index)=>{
              if (element.isCollect == 0) {//是否收藏 0-未收藏 1-已收藏
                element.isCollection = false
              }else{
                element.isCollection = true
              }
              if (element.fCreateType == 1) {
                element.fCreateName += '本人'
              }
              // element.fUserName = element.fUserName.substr(0,6)
              nameA.push(element.fUserName)
              element.fCardTemplateName = element.fCardTemplateName.substr(0,4)
              if (!element.fPhotoUrl) {
                element.fPhotoUrl = imgUrl + 'default2.png'
              } else {
                if (element.fPhotoUrl == '/static/default.png') {
                  element.fPhotoUrl = imgUrl + 'default2.png'
                } else {
                }
              }
            })
          nameA = [...new Set(nameA)]
          nameA.forEach((element, index) => {
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
            // that.setData({
            //   cardlist:res.data.data
            // })
            that.data.cardlist.forEach((element, i) => {
              that.data.isCollectionArr.push(element.isCollection)
            })
            that.setData({
              cardlist: res.data.data,
              isCollectionArr: that.data.isCollectionArr,
              strName
            })
        }
      },
      fail: function (err) {
        console.log('请求失败------------------')
      },
      complete:function (){
        that.setData({
          warnTitle: '数据加载中',
          num: 1,//1:loading  2:success 0:!
          isShow: false,
        })
      }
    })
  },
  // 在引导登陆界面点击”微信用户快捷登录“按钮后并且后台成功返回token后执行的事件
  myEvent: function (e) {
    this.setData({
      loginState: e.detail.loginState
    })
    this.getData(this.data.fPhone)
    // console.log('myevent----------------------', this.data.fPhone)
  },
  /*
    v:收藏的名片数据
    v2 : 值为1单个收藏 2为全部收藏，
    v3:当单个收藏时 该值为收藏名片的索引
  */
  CollectData: function (v,v2,v3,v4) {//请求获取数据
    let token = wx.getStorageSync('token').token
    if (!token) return
    let that = this
    wx.request({
      url: dataUrl+'manage-api/resource/cardbag/collectCardList',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      dataType:'json',
      data: v,
      success: function (res) {
        // console.log('CollectData-----------------',res)
        if (res.data.status == 404) {
          wx.removeStorage({
            key: 'token',
            success(res) {
              // console.log('token过期了请重新登录----------------')
              that.isLogin()
            }
          })
          return
        }
        // ---------------------start
        let isCollectionArr = that.data.cardlist
        if(v2 && v2 == 2){
          isCollectionArr.forEach((element, index) => {
            element.isCollection = true
          })

        } else if (v2 && v2 == 1){
          isCollectionArr.forEach((element, index) => {
            if(index == v3){
              element.isCollection = true
              element.fPhotoUrl = v4
            }
          })
        }
        // -----------------------end

        that.setData({
          isDone: false,
          cardlist: isCollectionArr
        })
      },
      fail: function (err) {
        console.log('请求失败------------------')
      }
    })
  },
  isLogin: function (v) {
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
          // that.getData()
        }
      })
    }
  },
  cardClick: function (event){
    let that = this
    let obj = event.currentTarget.dataset
    let fid = obj.fid
    let fbgmid = obj.fbgmid
    let fstate = obj.fstate
    let fcardtemplateurl = obj.fcardtemplateurl
    // fbgm:true(有音乐2) false:没有音乐（1）
    wx.navigateTo({
      url: '../../' + fcardtemplateurl + '?fId=' + fid + '&bgm=' + ((fbgmid&&fbgmid.length>0) ? 2 : 1)
    })
  },
  cardLongpress:function(){

  },
  allCollection: function (event) {//全部收藏
    let that = this
    let newArr = []
    let token = wx.getStorageSync('token').token
    // console.log(this.data.cardlist,'this.data.isCollectionArr--------00', this.data.isCollectionArr)
    if(token){
      // this.data.isCollectionArr.forEach((element, index) => {
        this.data.cardlist.forEach((element, index) => {
        // element = true
          newArr.push(true)
      })
      this.setData({
        isCollectionArr: newArr
      },()=>{
        console.log('this.data.isCollectionArr--------', this.data.isCollectionArr)
      })
      // this.getData('12', this.data.cardlist)
      let jsonArr = []
      // this.data.cardlist.forEach((element,index)=>{
      //   if (element.isCollect == 0){
      //     let obj = {
      //       fOtherId: element.fPhone,
      //       fCardId: element.fId,
      //       fCorpName: element.fCorpName,
      //       fCardName: element.fUserName,
      //       fCardPic: element.fPhotoUrl,
      //       fCardTag: element.fCardTag
      //     }
      //     jsonArr.push(obj)
      //   }
      // })

      wx.request({
        url: dataUrl+'manage-api/resource/cardbag/queryByPhone',
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        data: { "fOtherId": that.data.fPhone },
        success: function (res) {
          if (res.data.data.length > 0) {
            res.data.data.forEach((element, index) => {
              if (element.isCollect == 0) {//是否收藏 0-未收藏 1-已收藏

                let obj = {
                  fOtherId: element.fPhone,
                  fCardId: element.fId,
                  fCorpName: element.fCorpName,
                  fCardName: element.fUserName,
                  fCardPic: element.fPhotoUrl,
                  fCardTag: element.fCardTag
                }
                let tem = '.com/'
                let subIndex = obj.fCardPic.indexOf(tem)
                let needStr = obj.fCardPic.substring(subIndex + (tem.length - 1), obj.fCardPic.length)
                obj.fCardPic = needStr
                jsonArr.push(obj)
              }
            })
            // console.log('allCollection--------------------jsonArr', jsonArr)
            if (jsonArr.length > 0) {
              setTimeout(()=>{
                that.CollectData(JSON.stringify(jsonArr), 2)
                return false
              },1000)
              
            }
          }
        },
        fail: function (err) {
          console.log('请求失败------------------')
        }
      })

    // console.log('allCollection--------------------jsonArr', jsonArr)
    // if (jsonArr.length > 0){
    //   this.CollectData(JSON.stringify(jsonArr))
    // }
    }else{
      this.isLogin()
    }
  },
  isCollecF: function (event) {//单个收藏
    let that = this
    let obj = event.currentTarget.dataset
    let i = obj.index
    let phone = obj.fphone
    this.setData({
      fPhone: phone
    })
    // console.log('obj.iscollect---------------', obj.iscollect)
    if (obj.iscollect) return//已经收藏了，再点击时不执行下方的程序
    let token = wx.getStorageSync('token').token
    if (token) {
      this.setData({
        isDone: true
      })
      if (obj.iscollect) return
      let newArr = this.data.isCollectionArr
      this.data.cardlist.forEach((element, index) => {
        if (index == i) {
          newArr[i] = true
          element.isCollection = true
        } else {
        }
      })
      this.setData({
        isCollectionArr: newArr
      })
      let tem = '.com/'
      let imgUrl = this.data.cardlist[i].fPhotoUrl
      let subIndex = this.data.cardlist[i].fPhotoUrl.indexOf(tem)
      let needStr = this.data.cardlist[i].fPhotoUrl.substring(subIndex + (tem.length - 1), this.data.cardlist[i].fPhotoUrl.length)
      this.data.cardlist[i].fPhotoUrl = needStr

      let jsonArr = [{
        fOtherId: this.data.cardlist[i].fPhone,
        fCardId: this.data.cardlist[i].fId,
        fCorpName: this.data.cardlist[i].fCorpName,
        fCardName: this.data.cardlist[i].fUserName,
        fCardPic: this.data.cardlist[i].fPhotoUrl,
        fCardTag: this.data.cardlist[i].fCardTag
      }]
      // console.log('this.data.cardlist[i].fPhotoUrl---', this.data.cardlist[i].fPhotoUrl)
      setTimeout(()=>{
        this.CollectData(JSON.stringify(jsonArr), 1, i, imgUrl)
      },1000)
      
    }else{
      this.isLogin()
    }
  },
  helpClick: function () {
    // console.log('helpClick---------------')
    if (this.data.cardlist.length>=5){
      this.setData({
        dailogS:true
      }) 
    }else{
      wx.setStorageSync("createCardeState", false)
      this.setData({
        dailogS: false
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
  dailogClick:function () {
    this.setData({
      dailogS: false
    })
  },
  // 虽说这个函数什么都没有做但是也不能去掉，这是为了解决在点击该元素的时候去执行了父级的事件（加了这函数就只会执行自己的事件而不会去执行父级事件了）
  dailogClick2: function () {
  }
})