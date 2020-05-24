// components/component-tag-name.js
// const myaudio = wx.createInnerAudioContext();

const app = getApp();
const model = app.globalData.model;
let imgUrl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
let picUrl = app.globalData.poxy.PICIMG //本地图片路径前缀
let imgurl = app.globalData.poxy.RESIMG;//接口返回图片路径前缀
let musicUrl = app.globalData.poxy.MUSIC;//音频域名前缀
const bgMusic = wx.getBackgroundAudioManager();  //创建背景音乐
//const drawQR = require('../../utils/qrcode.js') //引用二维码插件
 const drawQR = require('../../../utils/weapp.qrcode.js') //引用二维码插件
const W = wx.getSystemInfoSync().windowWidth;    
const rate = 750.0 / W;
// 300rpx 在6s上为 150px
const qrcode_w = 300 / rate;
const rpx= wx.getSystemInfoSync().windowWidth/375;
const util = require('../../../utils/throttle.js');
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    link:{
      type:String,
    },
    loginState:{
      type: Boolean,
    },
    compontpass:{
      type: Boolean,
    },
    list:{
      type: Object,
      value: ''
    },
    midId:{
      type: Number,
      value: ''
    },
    navData: {
      type:Object,
      value:''
    },
    hasWebsite: {//是否有官网
      type: Boolean,
    },
    isshare: {//是否分享进入
      type: Boolean,
    },
    fCode:{ //模板id
      type:String,
    },
    navtitle:{ //模板title
      type: String,
    },
    tabBar: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } 
    },
    tabBar1: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { }
    },
    mymusic:{
      type: Object,
    },
    cavatarSrc:{ //头像
      type:String,
    },
    shareImgDefaultUrl:{//海报图
      type: String,
    },
    cardfId: {//详情页的cardfId
      type: String,
    },
    cmessage1: {  //姓名 + 职位 + 公司
      type: Object
    },
    cmessage2: {  //打电话 + 加微信 + 发邮件 + 看地图
      type: Array,
    },
    cfunc1: {  //收藏 + 点赞
      type: Array,
    },
    cfunc2: {  //给自己制作 + 帮好友制作
      type: Array,
    },
    qrodetitle:{
      type:String
    },
    qrodeInfo:{//二维码描述
      type: String
    },
    fWxpublicLink:{//微信公众号图片
      type: String
    },
    fSprogramLink:{//小程序图片
      type: String
    },
    fSite: {//官网图片
      type: String
    },
    imagePath:{
      type: String
    },
    musicMsg: {
      type: Object
    },//接收音乐数据对象
    fSiteShowType:{//网站网址类型
      type: Number
    },
    shareModel: {
      type: Object,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } 
    },
    defaultModel: {//模板数据包含二维码
      type: Object,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { }
    },

    //bgmusic=======================================================
    mymusic: {
      type: Object,
      value: "",
      observer: function (newVal) {
      
        // this._initMusic(newVal);//一旦接受页面传来的音乐文件地址，就初始化音乐
      }
    },
    //bgmusic=======================================================
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowAuthor:false,//是否显示授权图片弹框
    canvasWidth:'',
    canvasHeight:'',
    pixelRatio:'',
    billData:{},
    fUserName: '',
    
    //  生成海报的图片集合
    isClickCollect:false,//是否点击了收藏按钮
    choseMethod:"",//收藏方式
    isClickThumb:false,//是否点击了点赞按钮
    choseThumbMethod:"",//点赞方式
    assgin:"",//返回页数
    model: 0,
    queryBean: "",//接受预览页传过来的参数：对象
    getTempData:{
      fName: null,
      fCode: null,
      fXmlPath : null,
      fHeadType: null,
      fAmount: null,
      fPosterAllUrl: null,
      fMusicId: null,
      fMusicName: null,
      fMusicUrl: null,
    },
    icon_collect: picUrl +'collected.svg',
    icon_uncollect: picUrl + 'collect.svg',
    icon_good: picUrl + 'gooded.svg',
    icon_ungood: picUrl + 'good.svg',
    // list:{},
    hidden: true,
//bgmusic=======================================================
    bgmSrc: '',
    mypause: false,
    innerAudioCtx: '',
//bgmusic=======================================================

    cardID:'',
    shareModel: {
      title:"",
      path:"",
      imageUrl:"" ,
      cardfId: "",
      hasMusic: ''
    },
    urls: picUrl,
    // 数据渲染
    cthumbflag:false, //点赞
    ccollectionflag:false, //收藏
    csave: '保存到通讯录',
    cnumber: '15100000000',
    cnumber_icon:'',
    ccall: '打电话',
    cmail: '15100000000@163.com',
    cmail_icon:'',
    ccopymail: '复制邮箱',
    cwx: 'yangbin1510000',
    cwx_icon:'',
    ccopywx: '复制微信',
    clocation: '上海市金山区亭林镇林盛路136号',
    clocation_icon:'',
    cfixed: '位置',
    fLongitude:"",
    fDimension:'',
    userfixed: { address: "上海市金山区林盛路136号", name: "上海新帑实业有限公司", latitude: 30.886194, longitude: 121.35016 },
    // 状态
    // playmusic: true,      //是否播放
    
    fold:false, //关于我们
    tAnimate:'',
    bAnimate:'',
    timer:'',
    loginData:{},
    // loginState: false,//true：显示登录页 false：不显示登陆页
    // compontpass: false,//true:登录页点击了暂不登陆按钮,
    hidempModal: true, //模态框的状态  true-隐藏  false-显示
    hideAbout: false, //true-显示  false-隐藏
    // animationData: {},
    hideComPop: false,//true：显示公用弹框 false：隐藏公用弹框
    hideComPop2:false,
    qrodeHidden: true,//true：隐藏二维码弹框 false：显示二维码弹框
    showPop:false,

    isArticle:"",
    isService:"",
    isProduct:"",
    isDoubleClick:false,//是否重复点击
    qrcode_w: qrcode_w,
    isMakeQrcode:false, //是否生成二维码,
    // qrodeMakeHidden:true,
    // qrcodeURL: "",
    // codeText: "",
    // imgsrc:'',
    canvasHidden: true,
    comment:'',
    maskHidden: true,
    imagePath: '',
    siteHidden: true,
    canvasImgPath:'',
    currentStatu:'open',
    isshare: false,//是否分享页：false不是从分享页进入，true是从分享页进入
    shareTitle:'',
    sharePath:'',
    shareImg:'',
    isDoubleClickCollect:'',
    tapTime: '',		// 防止两次点击操作间隔太快

    // hgj==================================================start
    imgInfo:{},
    bgImgPath0: '',
    bgImgPath1: '',
    bgImgPath2: '',
    bgImgPath3: '',
    bgImgPath4: '',
    bgImgPath5: '',
    textArr: [],
    shareImgSrc: '',
    shareImgUrl: '',
    fPosterAllUrl: '',   //模板海报

    bgImgPath6: picUrl + 'website.png',
    bgImgPath7: '',
    bgImgPath8: '',
    // hgj====================================================end
   
    bgImgPath9: picUrl + 'miniprogram.png',
    bgImgPath10: '',
    // ======================================
    bgImgPath11: picUrl + 'official.png',
    bgImgPath12: '',
    hasModeMemu:true,//模板菜单显示
    modeObj:{},
    canvasType:'',
  },
  lifetimes: {
  
    created() {},
    attached() {
      let that=this;
      that.setNavSize();
      // 获取屏幕宽高
      wx.getSystemInfo({
        success: function (res) {
          console.log(res)
          that.setData({
            canvasWidth: res.windowWidth / 375,
            canvasHeight: res.windowHeight
          })
        }
      })
      const systemInfo = wx.getSystemInfoSync();
      let pixelRatio = systemInfo.pixelRatio;
      that.setData({
        pixelRatio: pixelRatio
      })
    },
    detached() {}
  },

  ready:function(){
    let that = this
    console.log(that.data.loginState, "是否登录");
    that.setData({
      model: model
    })

    let defaultBillData={};
    defaultBillData.pixelRatio = that.data.pixelRatio;
    defaultBillData.canvasWidth=that.data.canvasWidth;
    defaultBillData.status = that.data.status;
    defaultBillData.navHeight = that.data.navHeight;
    defaultBillData.fId = that.data.fCode;//名片fId
    defaultBillData.headImg = that.data.cavatarSrc;//头像
    defaultBillData.name = that.data.cmessage1.cname.cnameCont;//姓名
    defaultBillData.job = that.data.cmessage1.cpost.cpostCont;//职位
    defaultBillData.company = that.data.cmessage1.ctitle.ctitleCont;//公司
    that.setData({
      billData: defaultBillData,
    })
    // 获取Bill 组件
    that.bill=that.selectComponent("#bill");
    // // 生成模板海报
    // return (bill_js.toMakeBill(1, that.data.list))
    //return (bill_js.toMakeBill(1, that.data.list, that))
   
  },
  pageLifetimes: {

    show() {},
    hide() {}

  },
  /**
   * 组件的方法列表
   */
  methods: {
    hidePop:function(){
      var that=this;
      if (that.data.hideAbout) {
        that.setData({
          hideAbout: !that.data.hideAbout,
          currentStatu: 'open',
          'tabBar.mytab[0].flag': !that.data.tabBar.mytab[0].flag,
          'tabBar1.mytab[0].flag': !that.data.tabBar1.mytab[0].flag,
        });
      }

    },

    onCollect:function(){
      var that=this;
     
      if (that.data.list.fId && that.data.list.fId !="null"){//详情页

        let iscollect = that.data.list.fIsCollection//是否已收藏//0-未收藏 1-已收藏
        that.collectPass();

      }else{//模板

      }
    

    },

    an_play:function(){
      var that = this;
      that.animation = wx.createAnimation({
        duration: 1000,
      })
      that.animation.scale(0.2).step({ duration:400 });
      that.animation.scale(1.0).step({ duration: 400 });
      that.setData({
        animation: that.animation.export()
      })
    },




    collectPass:function(){
      var that=this;
      var fPhotoUrl = that.data.list.fPhotoUrl.indexOf('/basic');
      var fPhotoUrlAfter = that.data.list.fPhotoUrl.substr(fPhotoUrl);
      let token = wx.getStorageSync('token').token,
        type = (that.data.list.fIsCollection == 0) ? 'POST' : 'GET',
        url = (that.data.list.fIsCollection == 0) ? 'manage-api/resource/cardbag/collectCardList' : 'manage-api/resource/cardbag/deleteCardList',
        data = (that.data.list.fIsCollection == 0) ? JSON.stringify([
          {
            fOtherId: that.data.cmessage2[0].cnumber,  //收藏名片的电话号码 '18758325051'
            fCardId: that.data.list.fId, //收藏名片的Id '1' getCurrentPages()[getCurrentPages().length - 1].options.cardid
            fCardName: that.data.cmessage1.cname.cnameCont, //收藏名片的姓名 '特仑苏纯牛奶'
            fCorpName: that.data.cmessage1.ctitle.ctitleCont,//收藏名片的公司名称 '党员1'
            fCardPic: fPhotoUrlAfter, //收藏名片的头像 'https://image.zuma.com/website/1105442586855094876.jpg?_=0.6711493375695636'
            fCardTag: that.data.list.fCardTag, //收藏名片的标签
          }
        ]) : {
            fOtherId: that.data.cmessage2[0].cnumber, //收藏的名片夹电话号码
            fCardId: that.data.list.fId   //名片Id
          };

      wx.request({
        url: dataUrl + url,
        data: data,
        dataType: 'json',
        method: type,
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': token
        },
        success(res) {
          console.log(res.data)
          if (res.data.status == 0) {//收藏成功
              
              that.setData({
                'cfunc1[1].ccollection': that.data.cfunc1[1].collectionstatus ? ((Number(that.data.cfunc1[1].ccollection) - 1) < 0 ? 0 : Number(that.data.cfunc1[1].ccollection) - 1): Number(that.data.cfunc1[1].ccollection) + 1,
                'cfunc1[1].collectionstatus': !that.data.cfunc1[1].collectionstatus,
              });
              that.an_play();

          } else {//收藏失败
            that.setData({
              hideModal: true,
              warnFlash: 2,
              title: "收藏失败",
            })

            setTimeout(() => {
              that.setData({
                hideModal: false,
              })
            }, 1300)
          }

        }
      })
    },
    showBigImg:function(e){
      console.log('00000000000000000');
      var current = e.target.dataset.src;
      wx.previewImage({
        current: current, // 当前显示图片的http链接 
        urls: [current] // =============重点重点=============// 需要预览的图片http链接列表 
      }) 
      
    },
    closeQR:function(){
        var that=this;
        that.setData({
          'siteHidden':true,
          'bgImgPath9': picUrl + 'miniprogram.png',
          'bgImgPath10': '',
          'bgImgPath11': picUrl + 'official.png',
          'bgImgPath12': '',
        })
    },
    draw: function (url, headUrl){
      var that=this;
      const imgPath = new Promise((resolve, reject) => {
        drawQR({
          width: 160 * rpx,
          height: 160 * rpx,
          canvasId: 'mycanvas',
          _this: that,
          text: url,
          background: 'transparent',
          // foreground: '#ffffff',
          // image: {
          //   imageResource: headUrl,
          //   dx: 50,
          //   dy: 50,
          //   dWidth: 45,
          //   dHeight: 45
          // },
          callback: () => {
            setTimeout(() => {  
              wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: res => {
                  resolve(res)
                }
              },that)
            }, 500)
          }
        })
      })
      imgPath.then(res => {
        console.log('res: ', res)
        var tempFilePath = res.tempFilePath;
        that.setData({
          bgImgPath7: tempFilePath//存入data中
        }, () => {
          console.log('官网二维码画成功that.data.bgImgPath7------9999', that.data.bgImgPath7)
          that.imgTemPath2();
        })
       
     })    
    },
    shareMake: util.throttle(
      function(e){
        var that = this;
        if (!that.data.list.fId) {//模板页
            wx.navigateTo({
              url: '../../../pages/zumaCard/zumaCard',
            })
        } else {//详情页
          // 判断拿过来的网站地址是什么类型
          if (that.data.list.fSite) {//存在官网网址
            if (that.data.list.fSiteShowType == 1) {//生成二维码
              that.setData({
                comment: that.data.list.fSite,
                hideModal: true,
                warnFlash: 1,
                title: "正在生成图片",
              })

              var url = that.data.comment;//二维码内容
              var urlAfter;
              if (url.indexOf('https') != -1) {
                urlAfter = that.data.list.fSite;
              } else {
                urlAfter = 'https://' + that.data.list.fSite;
              }
              console.log("需要生成二维码的路径", url, urlAfter);
            var headUrl = that.data.list.fPhotoUrl;
              that.draw(urlAfter, headUrl);
              console.log('that.data.canvasImgPath------', that.data.canvasImgPath)
          
              
            } else if (that.data.list.fSiteShowType  == 2) {// 2 链接 

              wx.setClipboardData({
                data: that.data.list.fSite,
                success: function (res) {
                  wx.hideToast();
                  that.setData({
                    hideModal: true,
                    warnFlash: 2,
                    title: "已复制",
                  })

                  setTimeout(() => {
                    that.setData({
                      hideModal: false,
                    })
                  }, 1300)
                  
                }
              });
              return;
            
            } else if (that.data.list.fSiteShowType == 3) {// 3 族蚂网创建的
          
              if (that.data.list.fSite.indexOf('zuma') != -1) {//二级域名
                wx.navigateTo({
                  url: '../../../pages/webview/webview?url=https://' + encodeURIComponent(that.data.list.fSite),
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })

              } else {//自主域名
              
                wx.setClipboardData({
                  data: that.data.list.fSite,
                  success: function (res) {
                    wx.hideToast();
                    that.setData({
                      hideModal: true,
                      warnFlash: 2,
                      title: "已复制",
                    })
                    setTimeout(() => {
                      that.setData({
                        hideModal: false,
                      })
                    }, 1300)
                  }
                });
                return;
              }
              
            }
          }
        }
    },1000),
    imgTemPath2: function (urlAfter, headUrl) {//生成临时图片路径以及其他数据的获取
      console.log(picUrl+'website.png',"我的网址图片")
      let that = this;
  
      function df() {//族蚂后台图片 
        return new Promise(function (res1, rej) {
          wx.downloadFile({//族蚂后台图片
            url: picUrl+'website.png',//网络路径
            success: res => {
              console.log('00族蚂后台图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              console.log('path---------------------', path)
              that.setData({
                bgImgPath6: path
              }, function () {
                res1(that.data.bgImgPath6)
              })
            },
            fail: res => {
              console.log('族蚂后台图片转换失败')
            }
          })
        })
      }
      function df2() {//名片图片
        console.log(that.data.bgImgPath7,"二维码");
     return new Promise(function (res1, rej) {
          wx.downloadFile({//名片图片
            url: that.data.list.fPhotoUrl,//网络路径
            success: res => {
              console.log('名片图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              that.setData({
                bgImgPath8: path
              }, function () {
                res1(that.data.bgImgPath8)
              })
              // res1('2')
            },
            fail: res => {
              console.log('名片图片转换失败')
            }
          },that)
        })
      }
      Promise.all([df(), df2()]).then(function (res) {
        wx.getImageInfo({
          src: that.data.bgImgPath7,
          success: function (res) {
            that.setData({
              'imgInfo.width': res.width,
              'imgInfo.height': res.height,
            })

            that.mateImg(that.data.bgImgPath6, '打开我的网站', that.data.bgImgPath7, '长按保存图片，使用微信扫描功能', '识别二维码，跳转网站', true, that.data.bgImgPath8)
          }
        })
        
      })
    },
    mateImg:function(img,title,hasImg,des1,des2,logo,logoImg){//img:页面小图片；title:标题文字；hasImg:后台返回的图片路径或生成二维码的路径；des1,des2:描述文字

      // console.log('img', img)
      // console.log('hasImg', hasImg)
      let that = this;
      let context = wx.createCanvasContext('mycanvas2',that);
      that.fillRoundRect(context, 0, 0, 290, 380, 10, 'rgb(255,255,255)');//绘制并填充一个圆角矩形  
      context.drawImage(img, 25, 50, 40, 40);
      context.fillStyle = "#000";
      context.font = "normal 14px Arial";
      context.fillText(title, 70, 75);
      //that.toCanvasImg(hasImg, context);
     
      if (that.data.imgInfo){
        let w = that.data.imgInfo.width;
        let h = that.data.imgInfo.height;
        let dw = 160 / that.data.imgInfo.width;
        let dh = 160 / that.data.imgInfo.height;
        //裁剪图片中间部分
        if (w > 160 && h > 160 || w < 160 && h < 160) {
          if (dw > dh) {
            context.drawImage(hasImg, 0, (h - 160 / dw) / 2, w, 160 / dw, 65, 110, 160 * rpx, 160 * rpx)
          } else {
            context.drawImage(hasImg, (w - 160 / dh) / 2, 0, 160 / dh, h, 65, 110, 160 * rpx, 160 * rpx)
          }
        }//拉伸图片
        else {
          if (w < 160) {
            context.drawImage(hasImg, 0, (h - 160 / dw) / 2, w, 160 / dw, 65, 110, 160 * rpx, 160 * rpx)
          } else {
            context.drawImage(hasImg, (w - 160 / dh) / 2, 0, 160 / dh, h, 65, 110, 160 * rpx, 160 * rpx)
          }
        }
      }
      
      //context.drawImage(hasImg, 65, 110, 160 * rpx, 160 * rpx)
      if(logo){
        context.drawImage(logoImg, 122, 167, 45 * rpx, 45 * rpx)
      }
      context.fillStyle = "#868686";
      context.font = "normal 12px Arial";
      context.fillText(des1, 57, 320);
      if (des2){
          context.font = "normal 12px Arial";
          context.fillText(des2, 92, 335);
      }
      context.draw(false, setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas2',
          x: 0,
          y: 0,
          width: 290,
          height: 380,
          destWidth: 145 * 10,
          destHeight: 190 * 10,
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
              canvasImgPath: tempFilePath,//存入data中
            })
            if (img == that.data.bgImgPath9){
              if (tempFilePath !== '') {
                that.setData({
                  'siteHidden': true,
                }, () => {
                  that.setData({
                    hideModal: false,
                  })
                });
                wx.previewImage({
                  current: that.data.canvasImgPath, // 当前显示图片的http链接  
                  urls: [that.data.canvasImgPath], // 需要预览的图片http链接列表  
                })
              }
            }else{
              that.setData({
                'siteHidden': false,
                // 'siteData.canvasImgPath': tempFilePath,
              }, () => {
                that.setData({
                  hideModal: false,
                })
              });
            }
            
            console.log(that.data.canvasImgPath, "画完成图片路径")

          },
          fail: function (res) {
            console.log(res);
          }
        },that)

      }, 200));
    },

    /**该方法用来绘制一个有填充色的圆角矩形 
    *@param cxt:canvas的上下文环境 
    *@param x:左上角x轴坐标 
    *@param y:左上角y轴坐标 
    *@param width:矩形的宽度 
    *@param height:矩形的高度 
    *@param radius:圆的半径 
    *@param fillColor:填充颜色 
    **/
    fillRoundRect: function (cxt, x, y, width, height, radius, /*optional*/ fillColor) {
        //圆的直径必然要小于矩形的宽高          
        if(2 * radius > width || 2 * radius > height) { return false; }

        cxt.save();
        cxt.translate(x, y);
        //绘制圆角矩形的各个边  
        this.drawRoundRectPath(cxt, width, height, radius);
        cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
        cxt.fill();
        cxt.restore();
    },
    drawRoundRectPath:function (cxt, width, height, radius) {
        cxt.beginPath(0);
        //从右下角顺时针绘制，弧度从0到1/2PI  
        cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

        //矩形下边线  
        cxt.lineTo(radius, height);

        //左下角圆弧，弧度从1/2PI到PI  
        cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

        //矩形左边线  
        cxt.lineTo(0, radius);

        //左上角圆弧，弧度从PI到3/2PI  
        cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

        //上边线  
        cxt.lineTo(width - radius, 0);

        //右上角圆弧  
        cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

        //右边线  
        cxt.lineTo(width, height - radius);
        cxt.closePath();
  },

    imgTemPath3: function (imgType) {//小程序：生成临时图片路径以及其他数据的获取
      let that = this
      function df() {//族蚂后台图片 
        return new Promise(function (res1, rej) {
          wx.downloadFile({//族蚂后台图片
            url: that.data.bgImgPath9,//网络路径
            success: res => {
              // console.log('00族蚂后台图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              console.log('path---------------------', path)
              that.setData({
                bgImgPath9: path
              }, function () {
                res1(that.data.bgImgPath9)
              })
            },
            fail: res => {
              console.log('族蚂后台图片转换失败')
            }
          })
        })
      }
      function df2() {//小程序图片
        return new Promise(function (res1, rej) {
          wx.downloadFile({//名片图片
            url: imgType,//网络路径
            success: res => {
              console.log('小程序图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              that.setData({
                bgImgPath10: path
              }, function () {
                res1(that.data.bgImgPath10)
              })
              // res1('2')
            },
            fail: res => {
              console.log('小程序图片转换失败')
            }
          })
        })
      }
      Promise.all([df(), df2()]).then(function (res) {

        wx.getImageInfo({
          src: that.data.bgImgPath10,
          success: function (res) {
            that.setData({
              'imgInfo.width': res.width,
              'imgInfo.height': res.height,
            })
            that.mateImg(that.data.bgImgPath9, '小程序二维码', that.data.bgImgPath10, '长按识别二维码，跳转小程序');
          }
        }) 

        
      })
    },
    imgTemPath4: function (imgType) {//二维码：生成临时图片路径以及其他数据的获取
      let that = this
      function df() {//族蚂后台图片 
        return new Promise(function (res1, rej) {
          wx.downloadFile({//族蚂后台图片
            url: that.data.bgImgPath11,//网络路径
            success: res => {
              // console.log('00族蚂后台图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              console.log('path---------------------', path)
              that.setData({
                bgImgPath11: path
              }, function () {
                res1(that.data.bgImgPath11)
              })
            },
            fail: res => {
              console.log('族蚂后台图片转换失败')
            }
          })
        })
      }
      function df2() {//公众号图片
        return new Promise(function (res1, rej) {
          wx.downloadFile({//名片图片
            url: imgType,//网络路径
            success: res => {
              console.log('小程序图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              that.setData({
                bgImgPath12: path
              }, function () {
                res1(that.data.bgImgPath12)
              })
              // res1('2')
            },
            fail: res => {
              console.log('小程序图片转换失败')
            }
          })
        })
      }
      Promise.all([df(), df2()]).then(function (res) {

        wx.getImageInfo({
          src: that.data.bgImgPath12,
          success: function (res) {
            that.setData({
              'imgInfo.width': res.width,
              'imgInfo.height': res.height,
            })

            that.mateImg(that.data.bgImgPath11, '打开我的公众号', that.data.bgImgPath12, '长按保存图片，使用微信扫描功能', '识别二维码，跳转公众号');
          }
        })

       
      })
    },
    bgmControl: function () {
      if (this.innerAudioContext.paused) {
        this.innerAudioContext.play()
        this.setData({
          bgmSrc: this.properties.mymusic.hasMusic,
          mypause: false,
        })
      } else {
        this.innerAudioContext.pause()
        this.setData({
          bgmSrc: this.properties.pauseicon,
          mypause: true
        })
      }
    },
    // 初始化音乐
    _initMusic: function (newVal) {
      // 当页面传来新的music时，先销毁之前的audioCtx，否则页面会很嗨
      if (this.data.innerAudioCtx) {
        this.data.innerAudioCtx.destroy()
      }
      if (newVal) {
        var audioCtx = wx.createInnerAudioContext()
        this.setData({
          innerAudioCtx: audioCtx
        })
        if (this.data.audioStatus == '1') {
          innerAudioCtx.autoplay = true
        }
        audioCtx.loop = true
        audioCtx.src = newVal.src
      }
    },
    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
      var size = {};
      try {
        var res = wx.getSystemInfoSync();
        var scale = 750 / 320;//不同屏幕下canvas的适配比例；设计稿是750宽
        var scale2 = 750 / 340;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth / scale;
        var height = res.windowWidth / scale2;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败" + e);
      }
      return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH) {
      var _this=this;
      //调用插件中的draw方法，绘制二维码图片
      drawQR.api.draw(url, canvasId, cavW, cavH);
      setTimeout(() => { _this.canvasToTempImage(); }, 800);

    },

    // 开始播放
    listenerButtonPlay: function (src) {
      var that = this
      // console.log(src)
      bgMusic.src = src;
      bgMusic.onTimeUpdate(() => {  //监听音频播放进度
        // console.log(bgMusic.currentTime)
      })
      bgMusic.onEnded(() => {  //监听音乐自然播放结束
        console.log("音乐播放结束", that.data.mymusic.src);
        that.listenerButtonPlay(that.data.mymusic.src);
        console.log(that.data.mymusic.src);
        bgMusic.title = that.data.mymusic.title;
        bgMusic.src = that.data.mymusic.src;
      })
      bgMusic.play(); //播放音乐
    },

    pmusic() {//暂停音乐
      var that = this;
      if (that.data.playmusic) {
        // innerAudioContext.stop();
        bgMusic.pause();
      } else {
        bgMusic.play();
      }
      that.setData({ playmusic: !that.data.playmusic });
    },

    //停止播放
    listenerButtonStop: function () {
      bgMusic.stop()
    },

 
    //保存图片
    saveImage(){
      let that=this;
      wx.saveImageToPhotosAlbum({
        filePath: that.data.canvasImgPath,
        success(res) {
          that.setData({
            hideModal: true,
            warnFlash: 2,
            title: "保存成功",
          })
          setTimeout(() => {
            that.setData({
              hideModal: false,
            })
          }, 1300)
        },
        fail(res) {
          wx.showToast({
            title: '保存图片失败！',
          })
        }
      })
    },
    // 询问是否授权访问相册
    getSetting(event){
      let that=this;

      if (!event.detail.authSetting['scope.writePhotosAlbum']) {
        that.setData({
          isShowAuthor: true
        })
       
      } else {
        that.setData({
          isShowAuthor: false
        })
        wx.showToast({
          icon: 'success',
          title: `授权成功`,
          success(res) {}
        })
      }
      
    },
    hideAuthorBox(){
      let that=this;
      that.setData({
        isShowAuthor: false
      })
    },
    //预览二维码照片
    saveQR:function(e){
      var that=this;
      var canvasid= e.currentTarget.dataset.value;
      if (canvasid==1){//小程序长按识别
       
      }else{//保存图片
        //获取相册授权
        wx.getSetting({
          success(res){
            if(!res.authSetting['scope.writePhotosAlbum']){//用户不授权

              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {//这里是用户同意授权后的回调
                  that.saveImage();
                  that.setData({
                    isShowAuthor: false
                  })
                },
                fail() {//这里是用户拒绝授权后的回调
                  that.setData({
                    isShowAuthor: true
                  })
                }
              });

               
            }else{//用户授权了
              that.setData({
                isShowAuthor: false
              })
              that.saveImage();
            }
          }
        })  
      
      }
    },

    previewImage:function(e){//长按识别二维码
      var that = this;
      // var index=e.target.dataset.index;
      var current = e.target.dataset.src;   //这里获取到的是一张本地的图片
      wx.previewImage({
        current: current,//需要预览的图片链接列表
        urls: [current]  //当前显示图片的链接
      })
    },

    detached: function () {  // 页面销毁时执行

      this.listenerButtonStop();
    },
    // 显示遮罩层
    showModal: function () {

      var that = this;
      that.setData({
        hidempModal: false
      })

      wx.removeStorage({
        key: 'lable'
      });
      wx.removeStorage({
        key: 'assignLable'
      });
      var animation = wx.createAnimation({
        duration: 200,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(function () {
        that.fadeIn();//调用显示动画
      }, 100)
    },

    // 隐藏遮罩层
    hideModal: function () {
      var that = this;
      var animation = wx.createAnimation({
        duration: 200,//动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      that.fadeDown();//调用隐藏动画   
      setTimeout(function () {
        that.setData({
          hidempModal: true,
          compontpass:false,
        })
      }, 200)//先执行下滑动画，再隐藏模块

    },

    //动画集
    fadeIn: function () {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
      })
    },
    fadeDown: function () {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },
    
    callphone: util.throttle(function(){
      var that=this;
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      if (fId && fId != "null") {
        if (!that.data.list.fPhone ) {
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加手机号！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        } else {
          wx.makePhoneCall({
            phoneNumber: that.data.list.fPhone,
          })
        }
      }else{

        if (that.data.cmessage2[0].cnumber=="未添加"){
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加手机号！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        }else{
          wx.makePhoneCall({
            phoneNumber: that.data.cmessage2[0].cnumber,
          })
        }
        
      }
    
      // console.log(that.data.cnumber,"电话号码");
      
    },1000),
    copytext(e) {
      var that=this;
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      console.log(e.currentTarget.dataset.number, "复制微信");
      if (fId && fId != "null") {

        if (!that.data.list.fWechat) {
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加微信号！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        } else {
          wx.setClipboardData({
            data: e.currentTarget.dataset.number,
            success: function (res) {
              wx.showToast({ title: '复制成功！' });
            }
          });
        }

      }else{

        if (e.currentTarget.dataset.number=="未添加"){
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加微信号！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        }else{
          wx.setClipboardData({
            data: e.currentTarget.dataset.number,
            success: function (res) {
              wx.showToast({ title: '复制成功！' });
            }
          });
        }
        
      }
   
      
    },
    copyemail(e){
      var that=this;
      // console.log(e.currentTarget.dataset.number,"复制邮箱");
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      if (fId && fId != "null") {
        if (!that.data.list.fMail) {
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加邮箱！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        } else {
          wx.setClipboardData({
            data: e.currentTarget.dataset.number,
            success: function (res) {
              wx.showToast({ title: '复制成功！' });
            }
          });
        }
      }else{
        if (e.currentTarget.dataset.number=="未添加"){
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加邮箱！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        }else{
          wx.setClipboardData({
            data: e.currentTarget.dataset.number,
            success: function (res) {
              wx.showToast({ title: '复制成功！' });
            }
          });  
        }
       
      }
      
    },
    cfixed(){
      var that=this;
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      if(fId && fId!="null"){

        if (!that.data.list.fAddress){
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加地址！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        }else{
          if (!that.data.list.fDimension && !that.data.list.fLongitude){
            that.setData({
              hideModal: true,
              warnFlash: 0,
              title: "无法定位该地址",
            })
            setTimeout(() => {
              that.setData({
                hideModal: false,
              })
              // wx.request({
              //   url: 'https://apis.map.qq.com/ws/geocoder/v1/?address=' + that.data.list.fAddress + '&key=ZYCBZ-VGPKO-GUSWH-SQT3N-FHFZJ-M5BFM',
              //   success: function (res) {
              //     if (res.data.status == 0) {  //查询到地址
              //       obj.longitude = res.data.result.location.lng;
              //       obj.latitude = res.data.result.location.lat
              //     } else {    //未查询到地址
              //       obj.longitude = '';
              //       obj.latitude = '';
              //     }
              //   }
              // })
            }, 1000)
            return;
          }else{
            wx.openLocation({
              latitude: Number(that.data.list.fDimension),
              longitude: Number(that.data.list.fLongitude),
              address: that.data.cmessage2[3].clocation,
              scale: 28
            })
          }
          
        }
        
      }else{

        if (that.data.cmessage2[3].clocation=="未添加"){
          that.setData({
            hideComPop: !that.data.hideComPop,
            contentTit: that.data.list.fUserName + '未添加地址！',
            boxHeight: '71',
            leftBtnTit: '我知道了',
            leftcolor: "#202020",
            direction: '0',
            contBoxPadLR: '18'
          })
        }else{
          console.log("进入模板地址查看");
          wx.openLocation({
            latitude: 30.885466947723668, // 纬度，浮点数，范围为90 ~ -90
            longitude: 121.35037594841002, // 经度，浮点数，范围为180 ~ -180。
            name: '上海金山区亭林镇林盛路', //位置名
            address: '上海金山区亭林镇林盛路136号', // 地址详情说明
            //scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
          });
        }
       
      }
     
    },
    // 收藏
    onCollectTap:util.throttle(function(e){
      let that = this;
      let choseMethod = e.currentTarget.dataset.method;
      that.setData({
        isClickCollect:true,
        choseMethod: choseMethod, 
      })
      //判断是否已登录
      let token = wx.getStorageSync('token').token
      if (token && token.length > 0) {
        console.log('已登录分享页')
        that.toCollect();
      } else {
        console.log('未登录')
        if (that.data.compontpass) {
          return
        }
        that.setData({
          'loginState': true
        })
        console.log("登录页面显示", that.data.loginState)
      }

    },1000),
    toCollect(){
      var that = this;
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      if (fId && fId != "null" || that.data.list.fId) {//详情页收藏（真的）
        if (!that.data.cfunc1[1].collectionstatus) {
          that.setData({
            hideModal: true,
            warnFlash: 1,
            title: "正在收藏名片",
          })
        }else{
          that.setData({
            hideModal: true,
            warnFlash: 1,
            title: "正在取消收藏",
          })
        }

        var fPhotoUrl = that.data.list.fPhotoUrl.indexOf('/basic');
        var fPhotoUrlAfter = that.data.list.fPhotoUrl.substr(fPhotoUrl);
        let type = !this.data.cfunc1[1].collectionstatus ? 'POST' : 'GET',
          url = !this.data.cfunc1[1].collectionstatus ? 'manage-api/resource/cardbag/collectCardList' : 'manage-api/resource/cardbag/deleteCardList',
          data = !this.data.cfunc1[1].collectionstatus ? JSON.stringify([
            {
              fOtherId: that.data.cmessage2[0].cnumber,  //收藏名片的电话号码 '18758325051'
              fCardId: that.data.list.fId, //收藏名片的Id '1' getCurrentPages()[getCurrentPages().length - 1].options.cardid
              fCardName: that.data.cmessage1.cname.cnameCont, //收藏名片的姓名 '特仑苏纯牛奶'
              fCorpName: that.data.cmessage1.ctitle.ctitleCont,//收藏名片的公司名称 '党员1'
              fCardPic: fPhotoUrlAfter, //收藏名片的头像 'https://image.zuma.com/website/1105442586855094876.jpg?_=0.6711493375695636'
              fCardTag: that.data.list.fCardTag, //收藏名片的标签
            }
          ]) : {
              fOtherId: that.data.cmessage2[0].cnumber, //收藏的名片夹电话号码
              fCardId: that.data.list.fId   //名片Id
            };

        wx.request({
          url: dataUrl + url,
          data: data,
          dataType: 'json',
          method: type,
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': wx.getStorageSync('token').token
          },
          success(res) {
            console.log(res.data)
            if (!that.data.cfunc1[1].collectionstatus) {//收藏成功提示
              that.setData({
                hideModal: true,
                warnFlash: 2,
                title: "收藏成功",
              })

              setTimeout(() => {
                that.setData({
                  hideModal: false,
                })
              }, 1000)
            }else{
              that.setData({
                hideModal: true,
                warnFlash: 2,
                title: "取消收藏",
              })

              setTimeout(() => {
                that.setData({
                  hideModal: false,
                })
              }, 1000)
            }

            if (that.data.choseMethod == 1) {
              that.setData({
                ccollectionflag: true,
                'cfunc1[1].ccollection': that.data.cfunc1[1].collectionstatus ? Number(that.data.cfunc1[1].ccollection) - 1 : Number(that.data.cfunc1[1].ccollection) + 1,
                'cfunc1[1].collectionstatus': !that.data.cfunc1[1].collectionstatus,
              });

            } else {
              that.setData({
                'cfunc1[1].ccollection': that.data.cfunc1[1].collectionstatus ? Number(that.data.cfunc1[1].ccollection) - 1 : Number(that.data.cfunc1[1].ccollection) + 1,
                'cfunc1[1].collectionstatus': !that.data.cfunc1[1].collectionstatus,
              });
            }

          }
        })
      } else {//默认模板收藏（假的）
        if (that.data.choseMethod == 1) {
          that.setData({
            ccollectionflag: true,
            'cfunc1[1].ccollection': that.data.cfunc1[1].collectionstatus ? Number(that.data.cfunc1[1].ccollection) - 1 : Number(that.data.cfunc1[1].ccollection) + 1,
            'cfunc1[1].collectionstatus': !that.data.cfunc1[1].collectionstatus,
          });
        } else {
          that.setData({
            'cfunc1[1].ccollection': that.data.cfunc1[1].collectionstatus ? Number(that.data.cfunc1[1].ccollection) - 1 : Number(that.data.cfunc1[1].ccollection) + 1,
            'cfunc1[1].collectionstatus': !that.data.cfunc1[1].collectionstatus,
          });
        }
      }

    },
    //点赞选择二种方式点赞
    onZanTap: util.throttle(function(e){
      let that = this;
      let choseMethod = e.currentTarget.dataset.method;
      that.setData({
        isClickThumb:true,
        choseThumbMethod: choseMethod,
      })
      //判断是否已登录
      let token = wx.getStorageSync('token').token
      if (token && token.length > 0) {
        console.log('已登录分享页')
        that.toThumb();
      } else {
        console.log('未登录')
        if (that.data.compontpass) {
          return
        }
        that.setData({
          'loginState': true
        })
        console.log("登录页面显示", that.data.loginState)
      }
      
    },1000),
    toThumb(){
      let that = this;
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      if (fId && fId != "null" || that.data.list.fId) {//创建的名片
        console.log("点赞", wx.getStorageSync('token').token);
        console.log("点赞状态", that.data.cfunc1[0].thumbsstatus);
        wx.request({
          url: dataUrl + 'manage-api/resource/cardout/updateCardLike',
          data: {
            fId: that.data.list.fId, //名片ID '1' getCurrentPages()[getCurrentPages().length - 1].options.cardid
            type: !that.data.cfunc1[0].thumbsstatus ? 1 : 0 // 0取消点赞 1 点赞
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': wx.getStorageSync('token').token,
          },
          success(res) {
            console.log(res.data, "我点赞了")
            if (that.data.choseThumbMethod == 1) {
              that.setData({
                cthumbflag: true,
                'cfunc1[0].cthumb': that.data.cfunc1[0].thumbsstatus ? ((Number(that.data.cfunc1[0].cthumb) - 1 < 0) ? 0 : Number(that.data.cfunc1[0].cthumb) - 1) : Number(that.data.cfunc1[0].cthumb) + 1,
                'cfunc1[0].thumbsstatus': !that.data.cfunc1[0].thumbsstatus,
              })
            } else {
              that.setData({
                'that.data.cfunc1[0].thumbsstatus': !that.data.cfunc1[0].thumbsstatus,
                'cfunc1[0].cthumb': that.data.cfunc1[0].thumbsstatus ? ((Number(that.data.cfunc1[0].cthumb) - 1 < 0) ? 0 : Number(that.data.cfunc1[0].cthumb) - 1) : Number(that.data.cfunc1[0].cthumb) + 1,
                'cfunc1[0].thumbsstatus': !that.data.cfunc1[0].thumbsstatus,
              })
            }
          }
        })
      } else {//默认模板名片

        if (that.data.choseThumbMethod == 1) {
          that.setData({
            cthumbflag: true,
            'cfunc1[0].cthumb': that.data.cfunc1[0].thumbsstatus ? ((Number(that.data.cfunc1[0].cthumb) - 1 < 0) ? 0 : Number(that.data.cfunc1[0].cthumb) - 1) : Number(that.data.cfunc1[0].cthumb) + 1,
            'cfunc1[0].thumbsstatus': !that.data.cfunc1[0].thumbsstatus,
          })
        } else {
          that.setData({
            'that.data.cfunc1[0].thumbsstatus': !that.data.cfunc1[0].thumbsstatus,
            'cfunc1[0].cthumb': that.data.cfunc1[0].thumbsstatus ? ((Number(that.data.cfunc1[0].cthumb) - 1 < 0) ? 0 : Number(that.data.cfunc1[0].cthumb) - 1) : Number(that.data.cfunc1[0].cthumb) + 1,
            'cfunc1[0].thumbsstatus': !that.data.cfunc1[0].thumbsstatus,
          })
        }

      }
      
    },
    csave(){
      console.log("&&&&&&&&&&&&&&&&&&保存名片", this.data.cmessage1.cname.cnameCont);
      wx.addPhoneContact({
        firstName: this.data.cmessage1.cname.cnameCont,
        mobilePhoneNumber: this.data.cnumber,
      })
    },
    modalLeft(){
      var that = this;
      this.setData({
        hideComPop: !that.data.hideComPop,
      })
      if (that.data.tabBar1.mytab[0].flag == true) {
        that.setData({
          'tabBar1.mytab[0].flag': false,
        })
      }
    },
    modalRight(){
      var that = this;
      wx.navigateTo({
        url: '../../../pages/forminput/forminput'
      })

    },
    // 生成网站二维码

    // tabar
    cnavigateTo: util.throttle(function(e){// 关于我们
      var that=this;
      let i = e.currentTarget.dataset.num || 0;
      let val;
      if (that.data.hasWebsite){//存在官网

        val = 'tabBar.mytab[' + i + '].flag';
        if (that.data.tabBar.mytab[0].flag == true || that.data.tabBar.mytab[1].flag == true || that.data.tabBar.mytab[2].flag == true || that.data.tabBar.mytab[3].flag == true) {
          that.setData({
            'tabBar.mytab[0].flag': false,
            'tabBar.mytab[1].flag': false,
            'tabBar.mytab[2].flag': false,
            'tabBar.mytab[3].flag': false,
          })
        }
        console.log(i, 'iiiiiiiiiiiiiii')

        that.setData({
          [val]: !that.data.tabBar.mytab[i].flag,
        })

      }else{
        val = 'tabBar1.mytab[' + i + '].flag';

        if (that.data.tabBar1.mytab[0].flag == true || that.data.tabBar1.mytab[1].flag == true || that.data.tabBar1.mytab[2].flag == true) {
          that.setData({
            'tabBar1.mytab[0].flag': false,
            'tabBar1.mytab[1].flag': false,
            'tabBar1.mytab[2].flag': false,
          })
        }
        console.log(i, 'iiiiiiiiiiiiiii')

        that.setData({
          [val]: !that.data.tabBar1.mytab[i].flag,
        })
      }

        
    
      let  fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
  
      if(fId || that.data.list.fId){//详情页

          if (that.data.hideAbout) {
            that.setData({
              hideAbout: !that.data.hideAbout,
              currentStatu: 'open'
            });
          }

          // 判断是否有官网存在
          if (that.data.list.fSite) {//有官网
  
            switch (i) {
              case 0:
                  that.setData({
                    hasModeMemu: false,
                    isShowBill: true,
                  })
                  let currentStatu = e.currentTarget.dataset.statu;
                  that.util(currentStatu);
                break;
              case 1:
  
                break;
              case 2:
                that.shareMake();
                break;
              case 3:
                
                console.log(e, "跳转");
                let options= getCurrentPages()[getCurrentPages().length - 1].options;
                if (options && options.share==1){
                  wx.navigateTo({
                    url: "../../../pages/mine/mine?share=1&unionId=" + options.unionId,
                  })
                }else{
                  wx.navigateTo({
                    url: "../../../pages/mine/mine",
                  })
                }
               
                break;
            }

          }else{//没有官网存在

            switch (i) {

              case 0:
                  that.setData({
                    hasModeMemu: false,
                    isShowBill: true,
                  })
                  let currentStatu = e.currentTarget.dataset.statu;
                  that.util(currentStatu);
                break;
              case 1:
                break;
              case 2:
                console.log(e, "跳转")
                let options = getCurrentPages()[getCurrentPages().length - 1].options;
                if (options && options.share == 1) {
                  wx.navigateTo({
                    url: "../../../pages/mine/mine?share=1&unionId=" + options.unionId,
                  })
                } else {
                  wx.navigateTo({
                    url: "../../../pages/mine/mine",
                  })
                }
                break;
            }

          }

    
      }else{//模板页

        if (that.data.hideAbout){
          that.setData({
            hideAbout: !that.data.hideAbout,
            currentStatu: 'open'
          });
        }
     
        switch (i) {
          case 0:
            that.setData({
              hasModeMemu: true,
            })
            let currentStatu = e.currentTarget.dataset.statu;
            that.util(currentStatu);
            break;
          case 1:
           
            break;
          case 2:
            that.shareMake();
            break;
          case 3:
            console.log(e, "跳转")
            wx.navigateTo({
              url: "../../../pages/mine/mine",
            })
            break;
        }

      }
      if(i!=0){
        that.cleave(e);
      }
     
    },500),

    util: function (currentStatu) {
      var that=this;
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200,  //动画时长
        timingFunction: "ease", //线性
        delay: 0  //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      that.animation = animation;

      // 第3步：执行第一组动画：Y轴偏移98px后(盒子高度是98px)，停
      animation.translateY(403).step();

      // 第4步：导出动画对象赋给数据对象储存
      that.setData({
        animationtab: animation.export(),
        // 显示抽屉
        hideAbout: true,
        currentStatu: 'close'
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        // 执行第二组动画：Y轴不偏移，停
        animation.translateY(2).step()
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        that.setData({
          animationtab: animation.export(),
        })

        //关闭抽屉
        if (currentStatu == "close") {
          that.setData(
            {
              hideAbout: false,
              'tabBar.mytab[0].flag': false,
              'tabBar1.mytab[0].flag': false,
              currentStatu: 'open'
            }
          );
        }
       }.bind(that), 100)

    },
    cnavigateTo2: util.throttle(function(event){
      var that=this;
      clearTimeout(that.timer);
      const dataIndex = event.currentTarget.dataset.index;
      let fId = getCurrentPages()[getCurrentPages().length - 1].options.fId;
      if(fId || that.data.list.fId){//详情页
        switch (dataIndex) {
          case "1" || 1://产品
            wx.navigateTo({
              url: '../../../pages/charge/charge?cardId='+that.data.list.fId+'&type=1'
            });
            break;
          case "2" || 2://服务
            wx.navigateTo({
              url: '../../../pages/charge/charge?cardId='+that.data.list.fId+'&type=2'
            });
            break;
          case "3" || 3://文章
            wx.navigateTo({
              url: '../../../pages/charge/charge?cardId='+that.data.list.fId+ '&type=3'
            });
            break;
          case "4" || 4://公众号
            that.setData({
              hideModal: true,
              warnFlash: 1,
              title: "正在生成图片",
            })
            that.imgTemPath4(imgurl+that.data.list.fWxpublicLink);
            break;
          case "5" || 5://小程序
            that.setData({
              canvasType:1,
              bgImgPath9: picUrl + 'miniprogram.png',
              bgImgPath10: '',
              hideModal: true,
              warnFlash: 1,
              title: "正在生成图片",
            })
           
            console.log(imgurl+that.data.list.fSprogramLink,"图片路径，再次生成")
            that.imgTemPath3(imgurl+that.data.list.fSprogramLink);
            break;

          case "6" || 6://生成海报
            // let cardid = that.data.list.fId;
            // let tempUrl = that.data.list.fCardTemplateUrl;
            // let cname = that.data.list.fUserName;
            // wx.navigateTo({
            //   url: '../../../pages/mine/poster/poster?isShareIn=false&cardId=' + cardid + '&tempUrl=' + tempUrl + '&cname=' + cname,
            // });
            that.setData({
              hasModeMemu: false,
              hideAbout: false,
              'tabBar.mytab[0].flag': false,
              'tabBar1.mytab[0].flag': false,
              currentStatu: 'open'
            })
            that.bill.showBill();
            break;  
            default:
           
        }

      }else{//模板
        let cardid=that.data.fCode;
        let tempUrl = that.data.shareModel.path;
        let cname = that.data.shareModel.title;
        that.setData({
          'modeObj.name': that.data.cmessage1.cname.cnameCont,
          'modeObj.company': that.data.cmessage1.ctitle.ctitleCont,
          'modeObj.job': that.data.cmessage1.cpost.cpostCont,
          'modeObj.headImg': that.data.cavatarSrc,
        })
        var data = JSON.stringify(that.data.modeObj);
        switch (dataIndex) {
          case "1" || 1://产品
            wx.navigateTo({
              url: '../../../pages/charge/charge?modeObj='+data+'&type=1' 
            });
            break;
          case "2" || 2://服务
            wx.navigateTo({
              url: '../../../pages/charge/charge?modeObj='+data+'&type=2'  
            });
            break;
          case "3" || 3://文章
            wx.navigateTo({
              url: '../../../pages/charge/charge?modeObj='+data+'&type=3'
            });
            break;
          case "4" || 4://公众号
            that.setData({
              hideModal: true,
              warnFlash: 1,
              title: "正在生成图片",
            })
            that.imgTemPath4(picUrl+'qroffical.jpg');
            break;
          case "5" || 5://小程序
            that.setData({
              canvasType: 1,
              bgImgPath9: picUrl + 'miniprogram.png',
              bgImgPath10: '',
              hideModal: true,
              warnFlash: 1,
              title: "正在生成图片",
            })
            wx.request({
              url: dataUrl+'/manage-api/resource/cardTemplate/queryInfoByCode',
              data: {
                fCode: that.data.fCode
              },
              header: {
                'content-type': 'application/json', // 默认值
              },
              success(res) {
                console.log("res", res);
                console.log("res", res.data.fQrcodeUrl);
                that.imgTemPath3(res.data.data.fQrcodeUrl);
              }
            })
            break;
          case "6" || 6://生成海报
            that.setData({
              hasModeMemu: false,
              hideAbout: false,
              'tabBar.mytab[0].flag': false,
              'tabBar1.mytab[0].flag': false,
              currentStatu: 'open'
            })
            that.bill.showBill();
            // return (bill_js.toMakeBill(1, that.data.defaultModel,that))
            break;
            default:
        }
      }
    
      let val = 'tabBar.mytab[0].flag';
      this.setData({
        'hideAbout':false,
        'currentStatu': 'open',
        [val]:false,
      })
    },1000),
    cleave(e){
      var that=this;
      let i = e.currentTarget.dataset.num;
      let val="";
      if (that.data.hasWebsite){
        val = 'tabBar.mytab[' + i + '].flag';
      }else{
        val = 'tabBar1.mytab[' + i + '].flag';
      }
       
      setTimeout(()=>{
        this.setData({
          [val]: false
        });
      },1000)    
    },
    ClickClose(){
      var that=this;
      that.setData({
        qrodeHidden: true,
      })
    },
    // nav
    // 通过获取系统信息计算导航栏高度        
    setNavSize: function () {
      var that = this
        , sysinfo = wx.getSystemInfoSync()
        , statusHeight = sysinfo.statusBarHeight
        , isiOS = sysinfo.system.indexOf('iOS') > -1
        , navHeight;
      if (!isiOS) {
        navHeight = 48;
      } else {
        navHeight = 44;
      }
      that.setData({
        status: statusHeight,
        navHeight: navHeight,
        // navH: statusHeight + navHeight
      })
      // this.properties.navH = statusHeight + navHeight;
      console.log('setNavSize', navHeight, statusHeight)
      
      var myEventDetail = {
        val: statusHeight + navHeight
      } // detail对象，提供给事件监听函数
      this.triggerEvent('customevent', myEventDetail) //myevent自定义名称事件，父组件中使

      
      
    },  
    // 返回事件        
    back: function () {
      wx.navigateBack({
        delta: 1
      })
      // this.triggerEvent('back', { back: 1 })
    }, 
    backtohome:function(){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    },
    // 制作卡片(我的和好友)
    toMakeCard(event){//inidex=1:我的名片，index=2:好友的名片
      let that = this;
        console.log(event.target.dataset.index);
        that.setData({
          compontpass: false
        })
        let createCardeState = wx.getStorageSync('createCardeState');
        if (event.target.dataset.index == 1) {
          createCardeState = true;
          wx.setStorageSync('createCardeState', createCardeState);
          wx.removeStorage({
            key: 'cardInfo',
          })
          //console.log(createCardeState, "8888888888888888888888");
        } else {
          createCardeState = false;
          wx.setStorageSync('createCardeState', createCardeState);
          wx.removeStorage({
            key: 'cardInfo',
          })
          //console.log(createCardeState, "7777777777777777777");
        }

        //判断是否登录了
        let token = wx.getStorageSync('token').token;
        let options = getCurrentPages()[getCurrentPages().length - 1].options;
        if (token && token.length > 0) {
          console.log('制作名片已登录');
          if (options && options.assign) {
            that.isEnterTemplate();
          } else {
            that.showModal();
          }
          
        } else {
          console.log('制作名片未登录')
          if (that.data.compontpass) {
            return
          }
          that.setData({
            loginState: true,
            success: res => {
            }
          })
        }
    },

    isEnterTemplate: function () {// 判断是否通过预览页进入制作名片
      let that=this;
      let options = getCurrentPages()[getCurrentPages().length - 1].options;
      let labelData = JSON.parse(getCurrentPages()[getCurrentPages().length - 1].options.assign);
        console.log(labelData, "预览页跳过的带的参数");
        that.setData({
          queryBean: labelData,
        })
        that.setData({
          'getTempData.fName': that.data.queryBean.fName,
          'getTempData.fCode': that.data.queryBean.fCode,
          'getTempData.fXmlPath': that.data.queryBean.fXmlPath,
          'getTempData.fHeadType': that.data.queryBean.fHeadType,
          'getTempData.fAmount': that.data.queryBean.fAmount,
          'getTempData.fPosterAllUrl': that.data.queryBean.fPosterAllUrl,
          'getTempData.fMusicId': that.data.queryBean.fMusicId,
          'getTempData.fMusicName': that.data.queryBean.fMusicName,
          'getTempData.fMusicUrl': that.data.queryBean.fMusicUrl,
        })

        wx.setStorageSync("tempData", that.data.getTempData)
        wx.navigateTo({
          url: '/pages/forminput/forminput',
        })
    },
    // 在引导登陆界面点击”微信用户快捷登录“按钮后并且后台成功返回token后执行的事件
    onMyEvent: function (e) {
      let that = this;
      let options = getCurrentPages()[getCurrentPages().length - 1].options;
      let shareUnionId = getCurrentPages()[getCurrentPages().length - 1].options.unionId;
      if (shareUnionId){
        let shareUnionId = getCurrentPages()[getCurrentPages().length - 1].options.unionId;
        let userUnionId = wx.getStorageSync('token').unionId;
        console.log(shareUnionId, "<分享>", userUnionId);
        wx.request({
          url: dataUrl + 'manage-api/resource/cardout/updateProcess',
          data: {
            'fShareUnionId': shareUnionId,
            'fClickUnionId': userUnionId
          },
     
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': wx.getStorageSync('token').token,
          },
        
          success: function (res) {
            console.log(res, '分享返回值');
            console.log("分享活动成功", "名片模板详情页-----------------");
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
      if (that.data.isClickCollect){//收藏登录
        that.toCollect();
      } else if (that.data.isClickThumb) {//点赞登录
        that.toThumb();
      } else if (options && options.assign) {//从预览页进入模板点击制作名片
        that.isEnterTemplate();
      } else{
        that.showModal();
      }
      
      // this.getData()
      // console.log('myevent----------------------')
    },
    // 判断在引导登陆界面是否点击了”暂不登陆“按钮
    compontpass: function (e) {
      var that = this;
      let options=getCurrentPages()[getCurrentPages().length - 1].options;
      let shareUnionId = getCurrentPages()[getCurrentPages().length - 1].options.unionId;
      if (shareUnionId && !that.data.isClickCollect && !that.data.isClickThumb) {//分享活动暂不登录
        that.setData({
          compontpass: e.detail.compontpass
        })
        console.log("点击了站不登入", that.data.compontpass);
        that.showModal();
      } else if (that.data.isClickCollect){//收藏暂不登录
          that.setData({
            isClickCollect:false
          })
          return;
      }else if(that.data.isClickThumb){//点赞暂不登录
        that.setData({
          isClickThumb: false
        })
        return;

      }else if (options && options.assign) {//从预览页进入模板点击制作名片
        return;
      } else{//制作名片暂不登录
        that.showModal();
      }
    },
    //请求获取数据
    getData: function () {
      let token = wx.getStorageSync('token').token
      if (!token) return
      let that = this
      wx.request({
        url: dataUrl + 'manage-api/resource/cardbag/queryCardBag',//开发环境
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': token
        },
        success: function (res) {
          
          that.showModal();
          if (res.data.status == 404) {
            wx.removeStorage({
              key: 'token',
              success(res) {
                console.log('token过期了请重新登录----------------')
                that.showModal();
              }
            })
            return
          }
        }
      })
    },
    // 生成小程序二维码
    getQr:function(){
      var that=this;
      wx.showLoading({
        title: '生成二维码中',
      })
    },

    // hgj=========================================================================start
    // 把图片处理成圆角矩形
    roundRect: function (ctx, r, x, y, w, h, img) {
      ctx.save()
      if (w < 2 * r) r = w / 2
      if (h < 2 * r) r = h / 2
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath();
      ctx.clip()
      ctx.drawImage(img, x, y, w, h)
      ctx.restore() // 返回上一状态
    },
    // 画圆角矩形
    drawRoundedRect: function (ctx, x, y, width, height, r, fill, stroke) {
      ctx.save(); ctx.beginPath(); // draw top and top right corner 
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
      ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
      ctx.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
      ctx.arcTo(x, y, x + r, y, r);
      if (fill) { ctx.fill(); }
      if (stroke) { ctx.stroke(); }
      ctx.restore();
    },
    //canvas画圆形图片
    circleImg: function (ctx, img, x, y, r) {
      ctx.save();
      var d = 2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      // clip() 方法从原始画布中剪切任意形状和尺寸。
      // 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。您也可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。
      ctx.clip()
      ctx.drawImage(img, x, y, d, d)
      ctx.restore()
    },
    /*
    *eachData是一个名片数据（是一个对象）必须要有以下属性（就算对应的值没有也要传个空字符）
    {
      fPosterUrl:'',//海报图
      fPhotoUrl:'',//名片图片
      fUserName:'',//名片名称
      fPosition:'',//职位
      fPhone:'',//手机号
      fMail:'',//邮箱
      fAddress:'',//地址
    }
    */
    imgTemPath: function (eachData) {//生成临时图片路径
      let that = this;
      let bgImgPath1 = eachData.fPosterUrl ? eachData.fPosterUrl : (imgUrl + '文章.png');
      let bgImgPath2 = eachData.fPhotoUrl ? eachData.fPhotoUrl : (imgUrl + '文章.png');
      let bgImgPath3 = ''
      let bgImgPath4 = ''
      let bgImgPath5 = ''

      // console.log('img1---------------', img1)
      // console.log('bgImgPath3---------------', bgImgPath3)

      let tArr = []
      if (eachData.fPhone && eachData.fPhone.length > 0) {//手机号
        let obj = {
          imgUrl: imgUrl + 'haibaoP.png',
          text: eachData.fPhone
        }
        tArr.push(obj)
      }
      if (eachData.fMail && eachData.fMail.length > 0) {//邮箱
        let obj = {
          imgUrl: imgUrl + 'haibaoX.png',
          text: eachData.fMail
        }
        tArr.push(obj)
      }
      if (eachData.fAddress && eachData.fAddress.length > 0) {//地址
        let obj = {
          imgUrl: imgUrl + 'haibaoD.png',
          text: eachData.fAddress
        }
        tArr.push(obj)
      }
      that.setData({
        textArr: tArr
      })

      wx.downloadFile({//族蚂后台图片
        url: imgUrl + '智慧.png',//网络路径
        success: res => {
          // console.log(bgImgPath1, '族蚂后台图片转换成功111')
          let path = res.tempFilePath //临时本地路径
          that.setData({
            bgImgPath0: path
          })
        }
      })

      wx.downloadFile({//族蚂后台图片
        url: bgImgPath1,//网络路径
        success: res => {
          console.log(bgImgPath1, '族蚂后台图片转换成功111')
          let path = res.tempFilePath //临时本地路径
          // console.log('path---------------------', path)
          that.setData({
            bgImgPath1: path
          })
        },
        fail: res => {
          console.log(bgImgPath1, '族蚂后台图片转换失败111----使用默认图', imgUrl + '智慧.png')
          wx.downloadFile({//族蚂后台图片
            url: imgUrl + '智慧.png',//网络路径
            success: sData => {
              let path = sData.tempFilePath //临时本地路径
              that.setData({
                bgImgPath1: path
              })
            },

          })
        }
      })

      wx.downloadFile({//名片图片
        url: bgImgPath2,//网络路径
        success: res => {
          console.log(bgImgPath2, '名片图片转换成功222')
          let path = res.tempFilePath //临时本地路径
          that.setData({
            bgImgPath2: path
          })
        },
        fail: res => {
          console.log(bgImgPath2, '名片图片转换失败22222----使用默认图', imgUrl + '智慧.png')
          wx.downloadFile({
            url: imgUrl + '智慧.png',//网络路径
            success: sData => {
              let path = sData.tempFilePath //临时本地路径
              that.setData({
                bgImgPath2: path
              })
            },

          })
        }
      })

      that.data.textArr.forEach((element, i) => {//把网络图片“手机图片”，“邮箱图片”，“地址图片”路径循环生成临时图片路径
        wx.downloadFile({//手机图片
          url: element.imgUrl,//网络路径
          success: res => {
            console.log(bgImgPath3, '手机图片转换成功333')
            let path = res.tempFilePath //临时本地路径
            element.imgUrl = path
          },
          fail: res => {
            console.log(bgImgPath3, '手机图片转换失败111----使用默认图', imgUrl + '智慧.png')
            wx.downloadFile({//族蚂后台图片
              url: imgUrl + '智慧.png',//网络路径
              success: sData => {
                let path = sData.tempFilePath //临时本地路径
                element.imgUrl = path
              }
            })
          }
        })
      })
      function df(){
        return new Promise(function (res1, rej) {
          wx.downloadFile({//族蚂后台图片
            url: imgUrl + '智慧.png',//网络路径
            success: res => {
              // console.log(bgImgPath1, '族蚂后台图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              that.setData({
                bgImgPath0: path
              },function(){
                res1()
              })
            }
          })
        })
      }
      function df2(){
        return new Promise(function (res1, rej) {
          wx.downloadFile({//族蚂后台图片
            url: bgImgPath1,//网络路径
            success: res => {
              console.log(bgImgPath1, '族蚂后台图片转换成功111')
              let path = res.tempFilePath //临时本地路径
              // console.log('path---------------------', path)
              that.setData({
                bgImgPath1: path
              }, function () {
                res1()
              })
            }
          })
        })
      }
      function df3(){
        return new Promise(function (res1, rej) {
          wx.downloadFile({//名片图片
            url: bgImgPath2,//网络路径
            success: res => {
              console.log(bgImgPath2, '名片图片转换成功222')
              let path = res.tempFilePath //临时本地路径
              that.setData({
                bgImgPath2: path
              }, function () {
                res1()
              })
            }
          })
        })
      }
      Promise.all([df(), df2(), df3()]).then(function () {
      // Promise.all([df(), df3()]).then(function () {
        // console.log('@@@@@@@@@@@@@@@@--------222')
        that.mataImg(eachData.fUserName, eachData.fPosition)
      })
      // setTimeout(() => {
      //   if (!that.data.bgImgPath1) {
      //     that.setData({
      //       bgImgPath1: that.data.bgImgPath2
      //     })
      //   }
      //   if (!that.data.bgImgPath1 && !that.data.bgImgPath2) {
      //     that.setData({
      //       bgImgPath1: that.data.bgImgPath0,
      //       bgImgPath2: that.data.bgImgPath0
      //     })
      //   }
      //   that.mataImg(eachData.fUserName, eachData.fPosition)
      //   return
      // }, 1500)
    },
    mataImg: function (t1, t2) {
      console.log('mataImg-----------------------------')
      let that = this
      //画海报==============================start
      let context = wx.createCanvasContext('myShare')
      // console.log('**********************context-------', context)
      context.fillStyle = "#f2f2f2"
      context.fillRect(0, 0, 200, 162)
      // console.log('that.data.bgImgPath1-----------------', that.data.bgImgPath1)
      that.roundRect(context, 6, 6, 6, 188, 117, that.data.bgImgPath1)

      context.fillStyle = "rgba(0,0,0,.6)"
      that.drawRoundedRect(context, 6, 6, 188, 117, 8, true, false)

      // that.drawRound(context, 19, 16, 16,'../../static/zuma2.png')
      that.circleImg(context, that.data.bgImgPath2, 19, 16, 16)

      context.font = "14px Arial";
      context.fillStyle = "#fff";
      context.fillText(t1, 58, 28)
      context.font = "10px Arial";
      context.fillText(t2, 58, 42)
      // console.log('that.data.textArr----------', that.data.textArr)

      if (that.data.textArr[0] && that.data.textArr[0].text.length > 0) {
        context.drawImage(that.data.textArr[0].imgUrl, 21, 60, 12, 12)
        context.font = "10px Arial";
        context.fillText(that.data.textArr[0].text, 38, 70);
      }


      if (that.data.textArr[1] && that.data.textArr[1].text.length > 0) {
        context.drawImage(that.data.textArr[1].imgUrl, 21, 80, 12, 12)
        context.font = "10px Arial";
        context.fillText(that.data.textArr[1].text, 38, 88);
      }

      if (that.data.textArr[2] && that.data.textArr[2].text.length > 0) {
        context.drawImage(that.data.textArr[2].imgUrl, 21, 100, 12, 12)
        context.font = "10px Arial";
        context.fillText(that.data.textArr[2].text, 38, 109);
      }

      context.fillStyle = "#1081FF"
      that.drawRoundedRect(context, 50, 130, 93, 24, 3, true, false)

      context.fillStyle = "#fff"
      context.font = "12px Arial";
      if(that.data.list.fId){
        context.fillText("查看名片", 74, 146);
      }else{
        context.fillText("创建名片", 74, 146);
      }
      // context.draw()
      context.draw(false, function () {
        // setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 280,
            height: 162,
            destWidth: 110 * 10,
            destHeight: 110 * 8,
            canvasId: 'myShare',
            // fileType: 'jpg', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
            // quality: 1,
            success: function (res) {
              // console.log('res.tempFilePath###################', res.tempFilePath);
              that.setData({
                shareImgSrc: res.tempFilePath
              },function(){
                // console.log('##################################@@@@@')
                that.triggerEvent('imgEvent', { val: that.data.shareImgSrc }) //myevent自定义名称事件，父组件中使
              });
             
              if (!res.tempFilePath) {
                wx.showModal({
                  title: '提示',
                  content: '图片绘制中，请稍后重试',
                  showCancel: false
                })
              }
            },
            fail: function (res) {
              // console.log('图片生成失败-----', res)
            }
          })
        // }, 300)
      })
      //画海报==============================end
    },
    // hgj===========================================================================end
    hideImg:function(){
      let that=this;
      that.setData({
        showbillCanvas:true,
      })
    },


  },

  // 外挂样式属性
  externalClasses: ["cmusic", "cavatarimg", "cavatar", "ctitle", "cmessage1tit", "cmessage1cont", "cname", "cpost", "csave", "cnumber", "ccall", "cmail", "ccopymail", "cwx", "ccopywx", "clocation", "cfixed", "ccollection", "cthumb", "cme", "cother", "cmyself", "cbottom", "cshare", "cweb", "cmyself", "ctabar", "clocationtxt", "thumbtext", "collecttext", "cmainbody", "cheader", "cmessage2box", "cmessage1box", "chooseing", "cselcticon", "cicon", "thumb_collect", "thumbinfo", "ccollectioninfo", "iconfont2", "iconcollect", "geabout","tempowner"]
})
