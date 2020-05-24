// pages/mine/mine.js
var app = getApp();
let imgUrl = app.globalData.poxy.IMGURL
let model = app.globalData.model
let dataUrl = app.globalData.poxy.API_BASE     //接口路径前缀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assgin:'',
    dofor:'',
    loadingHidden: true,
    touchFlog:true,
    model:0,
    index:-1,
    cardset:[],
    scan:false,
    showPublic:false,
    carddata: [],
    share: false,
    loading:true,
    loginState:false,
    oncelogin:false,
    closetouch:false,
    pnum:NaN,
    isShow:false,
    warnTitle: '',
    num: 1,//1:loading  2:success 0:!
    token:'',
    sharecardid:'',
    modal:false,
    deletecard:'',
    imgurl:imgUrl,
    dataurl:dataUrl,
    scanBack:false,
    // hgj===========================================start
    fId:'',
    phone:'',
    link:'../component/getPhone/getPhone'
    // hgj===========================================end
  },

  functoggle(e){
    let str = 'carddata[' + e.currentTarget.dataset.num +'].fAuthen';
    let that = this;
    let token = wx.getStorageSync('token').token;
    wx.request({
      url: app.globalData.poxy.API_BASE+'manage-api/resource/cardout/authen',
      data: {
        fId: e.currentTarget.dataset.cardid,
        fAuthen: 1
      },
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      success(res){
        that.setData({
          [str]: 2
        })
        setTimeout(() => {
          that.setData({
            [str]: 1
          })
        }, 1300)
      }
    })
  },
  onscan: function (e) {
    this.setData({scan:false})
  },
  addcard(e){
    let that = this;
    if(wx.getStorageSync('token').token && wx.getStorageSync('phone') == ''){
      wx.navigateTo({
        url:  '../component/getPhone/getPhone?assign=' + that.data.assgin //获致手机号页面返回的页数;
      })
    }else{
      if (this.data.carddata && this.data.carddata.length>4){
        wx.showModal({
          content: '已达到个人5张名片上限！',
          showCancel:false,
          confirmColor: '#202020',
          confirmText:'我知道了',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }
      // wx.navigateTo({
      //   url: '/pages/scan/addLable/addLable',
      // })
      wx.removeStorage({
        key: 'lable'
      });
      wx.removeStorage({
        key: 'assignLable'
      });
      wx.removeStorage({
        key: 'cardInfo',
      });
      this.setData({
        scan:true
      })
    }
  },
  showfunc(e){
    console.log(e.currentTarget);
    let funcindex = 'carddata[' + e.currentTarget.dataset.index +'].functab';
    this.setData({
      [funcindex]:true,
      closetouch: true
    })
  },
  closetouch(e){
    if (this.data.closetouch) {
      setTimeout(() => {
        this.setData({ closetouch: false });
      }, 300);
    }
  },
  cardview(e){
    if(this.data.closetouch)return
    let bgm = e.currentTarget.dataset.bgm?2:1;
    wx.navigateTo({
      url: '../../' + e.currentTarget.dataset.path + '?fId=' + e.currentTarget.dataset.cardid + '&bgm=' +bgm,
    })
  },
  hiddenfunc(e) {
    let funcindex = 'carddata[' + e.currentTarget.dataset.index + '].functab';
    this.setData({
      [funcindex]: false
    })
  },
  clickshare(e){
    this.setData({
      share: !this.data.share,
      sharecardid: e.currentTarget.dataset.cardid,
      cardset:e.currentTarget.dataset.set,
      fId: e.currentTarget.dataset.fid
    })
  },
  isShare(){
    this.setData({
      share: !this.data.share
    })
  },
  fShare(){
    let that = this;
    this.setData({
      index:0,
    })
    setTimeout(()=>{
      that.setData({
        index: -1,
        share: !this.data.share
      })
    },200)
  },
  phoneshare(e){
    let that = this;
    this.setData({
      index:1,
    })
    setTimeout(()=>{
      that.setData({
        index: -1,
        share: !this.data.share
      })
    },200)
    // hgj============='&fId=' + this.data.fId
    wx.navigateTo({
      url: '/pages/phoneshare/phoneshare?cardid=' + that.data.sharecardid + '&fId=' + that.data.fId + '&phone=' + wx.getStorageSync('phone')
    })
  },
  closetap(e){
    let funcindex = 'carddata[' + e.currentTarget.dataset.index + '].functab';
    this.setData({
      [funcindex]: false
    })
  },
  bindtop(e) {
    let that = this;
    this.setData({
      index:2
    })
    setTimeout(()=>{
      that.setData({
        share: !this.data.share,
        isShow: true,
        warnTitle:'置顶',
        index:-1
      })
    },200)
    wx.request({
      url: app.globalData.poxy.API_BASE +'manage-api/resource/cardout/toTopCard',
      data: {
        cardId: this.data.cardset.cardid
      },
      header: {
        'content-type': 'application/json',
        'Authorization': that.data.token
      },
      success(res) {
        that.onLoad()
      }
    })
  },
  deletecard(e) {
    let that = this;
    this.setData({
      index:4
    })
    setTimeout(()=>{
      that.setData({
        share: !this.data.share,
        modal:true,
        deletecard: this.data.cardset.cardid,
        index:-1
      })
    },200)
  },
  leftBtn(){
    this.setData({
      modal: false,
      deletecard:''
    })
  },
  //生成海报
  forPoster(){
    // let ele = e.currentTarget.dataset.ele
    let ele = this.data.cardset
   
    // console.log('ele-------------',ele)
    let otherObj = {
      fUserName: ele.cname,//名片名称
      fPhotoUrl: ele.photolist,//名片图像
      fPosterUrl: ele.fPosterUrl,//manage后台的海报图片
      fPosition: ele.fPosition,//职位
      fPhone: wx.getStorageSync('phone'),//手机号
      fCorpName: ele.ctitle,//公司名称
      fCardUrl: ele.cardUrl,//对应名片二维码
      fAddress: ele.fAddress,//地址（公司？）
      fWechat: ele.fWechat,//微信号
      fMail: ele.fMail,//邮箱
      fCardTemplateUrl:ele.tempUrl//模板路径
    }
    // console.log('5-------------',otherObj);
    // console.log('this.data.cardlist[this.data.nowIndex]-------', this.data.cardlist[this.data.nowIndex])
    let objJSON = JSON.stringify(otherObj)
    this.setData({
      share: !this.data.share
    })
    wx.navigateTo({
      url: '../cardQRcode/cardQRcode?objJSON=' + objJSON + "&fromMine=1"+"&fId="+ele.cardid,
    })
  },
  // forPoster(){
  //   let that = this;
  //   let cardset = JSON.stringify(this.data.cardset)
  //   let tempUrl = this.data.cardset.tempUrl;
  //   let cardid = this.data.cardset.cardid;
  //   let cname = this.data.cardset.cname;
  //   this.setData({
  //     index:5
  //   })
  //   setTimeout(()=>{
  //     that.setData({
  //       index:-1,
  //       share: !this.data.share,
  //     })
  //   },200)
  //   wx.navigateTo({
  //     url: 'poster/poster?isShareIn=false&cardId=' + cardid + '&tempUrl=' + tempUrl + '&cname=' + cname,
  //   })
  // },
  preview(e){
    // let ele = e.currentTarget.dataset.ele
    let ele = this.data.cardset
    console.log(this.data.cardset);
    // console.log('ele-------------',ele)
    let otherObj = {
      fUserName: ele.cname,//名片名称
      fPhotoUrl: ele.photolist,//名片图像
      fPosterUrl: ele.fPosterUrl,//manage后台的海报图片
      fPosition: ele.fPosition,//职位
      fPhone: wx.getStorageSync('phone'),//手机号
      fCorpName: ele.ctitle,//公司名称
      fCardUrl: ele.cardUrl,//对应名片二维码
      fAddress: ele.fAddress,//地址（公司？）
      fWechat: ele.fWechat,//微信号
      fMail: ele.fMail,//邮箱
      fCardTemplateUrl:ele.tempUrl//模板路径
    }
    // console.log('this.data.cardlist[this.data.nowIndex]-------', this.data.cardlist[this.data.nowIndex])
    let objJSON = JSON.stringify(otherObj)
    this.setData({
      share: !this.data.share
    })
    wx.navigateTo({
      url: '../cardQRcode/cardQRcode?objJSON=' + objJSON + "&fromMine=1",
    })
  },
  rightBtn() {
    let that = this;
    if(!this.data.touchFlog) return;
    this.setData({
      touchFlog:false,
      modal: false,
      isShow: true,
      warnTitle:'删除'
    })
    wx.request({
      url: app.globalData.poxy.API_BASE + 'manage-api/resource/cardout/deleteCard',
      data: {
        cardId: this.data.deletecard
      },
      header: {
        'content-type': 'application/json',
        'Authorization': that.data.token
      },
      success(res) {
        that.setData({
          deletecard:'',
          touchFlog:true
        })
        that.onLoad()
      }
    })
  },
  navigatorto(e){
    let that = this;
    that.setData({
      share: !this.data.share,
      index:3
    })
    wx.setStorageSync('createCardeState', true);
    wx.removeStorage({
      key: 'assignLable'
    });
    wx.navigateTo({
      url: '/pages/forminput/forminput',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
        },
        someEvent: function (data) {
        }
      },
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          cardid: that.data.cardset.cardid
        })
        console.log("成功！")
      }
    })
  },
  onMyEvent(e){
    let options = getCurrentPages()[getCurrentPages().length-1].options;
    if(options && options.share == 1){
      wx.request({
        url: dataUrl + 'manage-api/resource/cardout/updateProcess',
        data:{
          fShareUnionId:options.unionId,
          fClickUnionId:wx.getStorageSync('token').unionId,
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': wx.getStorageSync('token').token
        },
        success: function(res) {
          console.log('转发成功');
        }
      })
    }
    this.setData({
      loginState: e.detail.loginState
    })
      this.methods.http(this)
      this.methods.public(this)
  },
  compontpass: function (e) {
    this.setData({
      oncelogin: e.detail.compontpass,
      carddata: [],
      loading:false,
      loginState:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    let that = this;
    that.setData({
      index:-1
    })
    //判断机型来改变公众号弹窗位置
    if(model == 1){
      that.setData({
        model:1
      })
    }
    if (wx.getStorageSync('token')) {
      that.setData({
        token: wx.getStorageSync('token').token,
        pnum: wx.getStorageSync('phone'),
        oncelogin:true
      })
      that.methods.http(that)
      that.methods.public(that)
    }else{
      that.setData({
        loginState: true,
        showPublic:true
      })
    }
    // if (wx.getStorageSync('phone')) {
    //   that.setData({
    //     pnum: wx.getStorageSync('phone'),
    //     oncelogin:true
    //   })
    // }
  },
  methods:{
    http(that) {
      wx.request({
        url: dataUrl +'manage-api/resource/cardout/queryByListPhone',
        data:{
          fPhone: wx.getStorageSync('phone')
        },
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token').token
        },
        success(res) {
          that.setData({
            carddata: res.data.data,
            loading:false,
            token: wx.getStorageSync('token').token,
            pnum: wx.getStorageSync('phone'),
            isShow:false
          })
          if (that.data.carddata){
            for (let i = 0; i < that.data.carddata.length; i++) {
              wx.request({
                url: dataUrl +'manage-api/resource/cardout/updateRead?fId=' + that.data.carddata[i].cardid,
                method:'POST',
                header: {
                  'Authorization': that.data.token
                }
              })
            }
          }
        }
      })
    },
    public(that){
      //判断关联公众号显示隐藏
      wx.request({
        url:dataUrl+'manage-api/resource/carduser/subscribeState',   //是否关注公众号接口
        header:{
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token').token
        },
        success(res){
          let status = res.data.status
          if(status){
            that.setData({
              showPublic:true
            })
          }else{
            that.setData({
              showPublic:false
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      index:-1
    })
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
    this.onLoad()
    wx.stopPullDownRefresh()
    console.log('刷新完成');
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
      title: '创建自己的电子商务名片，多样风格模板任你选！',    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/mine/mine',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl + 'mineShare.png'
    }
    if(this.data.loginState){
      shareObj = {
        title: '能够关联网站、公众号、小程序的智能微信名片！',    // 默认是小程序的名称(可以写slogan等)
        path: '/pages/index/index',    // 默认是当前页面，必须是以‘/'开头的完整路径
        imageUrl: imgUrl + '智慧.png'
      }
    }
    let unionId = wx.getStorageSync('token').unionId
    let share = (wx.getStorageSync('taskStatus')==2) ?1:0
    if (options.from == 'button') {
      var eData = this.data.cardset;
      let bgm = this.data.bgmUrl ? 2 :1
        // 此处可以修改 shareObj 中的内容
        shareObj.title = '这是' + eData.cname+'的名片，推荐给您！'
        // shareObj.path = '../../' + eData.fcardtemplateurl + '?fId=' + eData.fid
      shareObj.path = eData.tempUrl + '?fId='+eData.cardid + '&share=' + share + '&unionId='+unionId + '&bmg' + bgm
      console.log(shareObj.path)
        // shareObj.imageUrl = imgUrl + '智慧.png'
        shareObj.imageUrl = eData.shareImgUrl
        // console.log('这是自定义分享按钮--------------------------', shareObj.path)
    }
    console.log(shareObj,'000000000000');
    return shareObj
  },

})