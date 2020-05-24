// cardQRcode.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL//static文件夹图片路径前缀
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareImgSrc:'',
    bgImgPath0:'',
    bgImgPath1:'',
    bgImgPath2:'',
    bgImgPath3:'',
    bgImgPath4:'',
    bgImgPath5:'',
    bgImgPath6:'',
    bgImgPath7:'',
    // tetxArr: ['18720986997', '上海金山去亭林镇林盛路136号', 'yingbin1510000@qq.com', 'yingbin1510000'],
    // tetxArr: ['18720986997', '上海金山去亭林镇林盛路136号', 'yingbin1510000@qq.com'],
    // tetxArr: ['18720986997', '上海金山去亭林镇林盛路136号'],
    tetxArr: ['18720986997'],
    sub:0,
    canvasHeight:550,
    fUserName:'',
    dataObj:{
      fPhotoUrl: '',//名片图像
      fUserName: '',//名片名称
      fPosterUrl: '',//manage后台的海报图片
      fPosition: '',//职位
      fCorpName: '',//公司名称
      fPhone: '',//手机号
      fAddress: '',//地址（公司？）
      fMail: '',//邮箱
      fWechat: '',//微信号
      fCardUrl: '',//小程序二维码
    },
    btnShow:false,
    windowHeight: 0,
    warnTitle: '',
    num: 1,//1:loading  2:success 0:!
    isShow: true,
    isShareIn:false,
    img_status:true,//判断用户是否授权图片保存到相册 true:授权  false:拒绝授权,
    fId:'',
    fCardTemplateUrl:'',
    imgInFo:{},//记录名片图片信息（原始宽高等）
    showCanvas:true,
    windWidth:320,
    showBtn:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight,
      fId: options.fId ? options.fId:'',
      fCardTemplateUrl: options.fCardTemplateUrl ? options.fCardTemplateUrl:''
    })
    let that = this;
    if (options.shareIn) {
      this.getData(options.fPhone, options.fId)
      // 为了解决当用户通过点击名片二维码分享出去的页面进到“名片二维码”再返回到上一页（“名片列表"）没有数据的情况
      wx.setStorageSync('QRobj', {
        fPhone: options.fPhone,
        fId: options.fId
      })
      this.setData({
        isShareIn:true
      })
      // wx.setNavigationBarTitle({
      //   title: '名片二维码',//页面标题
      // })
    }else{
      this.getData(options.fPhone, options.fId)
      wx.setStorageSync('QRobj', {})
      this.setData({
        isShareIn: false
      })
    }
    if (options.fromMine){
      let obj = JSON.parse(options.objJSON)
      this.imgTemPath(2, obj)
    }
    that.setData({
      warnTitle: '正在生成海报',
      num: 1,//1:loading  2:success 0:!
      isShow: true,
    })

    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope(进到此页先判断是否授权相册保存本地的权限)==========start
    wx.getSetting({
      success: (res) => {
        // console.log('res----------------', res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.setData({
            img_status: true
          })
          wx.setStorageSync('hasRight', {
            img_status: true,
          })
        } 
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用保存到相册，后续调用 wx.writePhotosAlbum 接口不会弹窗询问
              // wx.writePhotosAlbum()
              // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
              wx.saveImageToPhotosAlbum({
                success(res) {
                  // console.log('&&&&&&&&&&&&&&&')
                 }
              })
              that.setData({
                img_status: true
              })
              wx.setStorageSync('hasRight', {
                img_status: true,
              })
            },
            fail(){
              // console.log('@@@@@@@@@@@@@@@222')
              wx.saveImageToPhotosAlbum({
                success(res) {
                  // console.log('&&&&&&&&&&&&&&&666666')
                }
              })
              that.setData({
                img_status: false
              })
              wx.setStorageSync('hasRight', {
                img_status: false,
              })
            }
          })
        }
      }
    })
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope(进到此页先判断是否授权相册保存本地的权限)============end
  },
  //请求获取数据
  getData: function (v,v2) {
    let that = this
    let token = wx.getStorageSync('token').token
    // if (!token) return
    wx.request({
      // url: dataUrl + 'manage-api/resource/cardbag/queryCards',
      url: dataUrl + 'manage-api/resource/cardout/queryCardByCardId',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        // 'Authorization': token
      },
      // data: { "fOtherId": v },
      data: { "fId": v2 },
      success: function (res) {
        // console.log('res.data.data---------------', res.data.data)
        that.imgTemPath(2, res.data.data)
        that.setData({
          fId: res.data.data.fId,
          fCardTemplateUrl: res.data.data.fCardTemplateUrl
        })

        wx.setNavigationBarTitle({
          title: res.data.data.fUserName+'的名片',//页面标题
        })
      },
      fail: function (err) {
        // console.log('请求失败------------------')
      }
    })
  },
  setValue: function (v) {//数据的赋值
    let otherObj = {
      fCardTemplateUrl: v.fCardTemplateUrl,//名片模版路径
      fId: v.fId,//名片主键Id
      fPhotoUrl: v.fPhotoUrl ? v.fPhotoUrl : (imgUrl + '服务.png'),//名片图像
      fUserName: v.fUserName ? v.fUserName : '',//名片名称
      fPosterUrl: v.fPosterUrl ? v.fPosterUrl : (imgUrl + '服务.png'),//manage后台的海报图片
      fPosition: v.fPosition ? v.fPosition : '',//职位
      fCorpName: v.fCorpName ? v.fCorpName : '',//公司名称
      fPhone: v.fPhone ? v.fPhone : '',//手机号
      fAddress: v.fAddress ? v.fAddress : '',//地址（公司？）
      fMail: v.fMail ? v.fMail : '',//邮箱
      fWechat: v.fWechat ? v.fWechat : '',//微信号
      fCardUrl: v.fCardUrl ? v.fCardUrl : (imgUrl + 'ccc.png'),//对应的名片二维码
    }
    // console.log(v.fPosterUrl,'------v.fCardUrl------------------------', v.fCardUrl)
    let textA = []
    if (otherObj.fPhone && otherObj.fPhone.length > 0) {
      let obj = {
        imgUrl: imgUrl + '09-12-小程序海报-icon_03.png',
        text: otherObj.fPhone
      }
      textA.push(obj)
      // textA.push(otherObj.fPhone)
    }
    if (otherObj.fAddress && otherObj.fAddress.length > 0) {
      let obj = {
        imgUrl: imgUrl + '09-12-小程序海报-icon_06.png',
        text: otherObj.fAddress,
        type:'lemit'
      }
      textA.push(obj)
      // textA.push(otherObj.fAddress)
    }
    if (otherObj.fMail && otherObj.fMail.length > 0) {
      let obj = {
        imgUrl: imgUrl + '09-12-小程序海报-icon_08.png',
        text: otherObj.fMail
      }
      textA.push(obj)
      // textA.push(otherObj.fMail)
    }
    if (otherObj.fWechat && otherObj.fWechat.length > 0) {
      let obj = {
        imgUrl: imgUrl + '09-12-小程序海报-icon_10.png',
        text: otherObj.fWechat,
        type: 'lemit'
      }
      textA.push(obj)
      // textA.push(otherObj.fWechat)
    }
    this.setData({
      tetxArr: textA
    })
    this.setData({
      canvasHeight: 542 - (4 - this.data.tetxArr.length) * 18,
      sub: (4 - this.data.tetxArr.length) * 18
    })
    this.setData({
      dataObj: otherObj
    })
  },
  /*v:1(代表不仅要画图还要保存图片到本地)) 否者只是画图
  *obj={
      fPhotoUrl: '',//名片图像
      fUserName: '',//名片名称
      fPosterUrl: v.fPosterUrl,//manage后台的海报图片
      fPosition: '',//职位
      fCorpName: '',//公司名称
      fPhone: '',//手机号
      fAddress: '',//地址（公司？）
      fMail: '',//邮箱
      fWechat: '',//微信号
      fCardUrl: '',//小程序二维码
    }
  */
  imgTemPath: function (v, obj) {//生成临时图片路径以及其他数据的获取
    let that = this;
    that.setValue(obj)
    let bgImgPath1 = that.data.dataObj.fPosterUrl ? that.data.dataObj.fPosterUrl : (imgUrl + '文章.png');
    let bgImgPath2 = that.data.dataObj.fPhotoUrl ? that.data.dataObj.fPhotoUrl : (imgUrl + '文章.png');
    let bgImgPath3 = imgUrl + '09-12-小程序海报-icon_03.png'
    let bgImgPath4 = imgUrl + '09-12-小程序海报-icon_06.png'
    let bgImgPath5 = imgUrl + '09-12-小程序海报-icon_08.png'
    let bgImgPath6 = imgUrl + '09-12-小程序海报-icon_10.png'
    let bgImgPath7 = that.data.dataObj.fCardUrl;

    function df() {//族蚂后台图片 
      return new Promise(function (res1, rej) {
        wx.downloadFile({//族蚂后台图片
          url: bgImgPath1,//网络路径
          success: res => {
            // console.log('00族蚂后台图片转换成功111')
            let path = res.tempFilePath //临时本地路径
            // console.log('path---------------------', path)
            that.setData({
              bgImgPath1: path
            },function(){
              res1(that.data.bgImgPath1)
            })
          },
          fail: res => {
            // console.log('族蚂后台图片转换失败')
          }
        })
      })
    }
    function df2() {//名片图片
      return new Promise(function (res1, rej) {
        wx.downloadFile({//名片图片
          url: bgImgPath2,//网络路径
          success: res => {
            // console.log('名片图片转换成功111')
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath2: path
            }, function () {
              // res1(that.data.bgImgPath2)

              wx.getImageInfo({//获取原始图片的信息（如宽高等）
                src: that.data.bgImgPath2,
                success(res) {
                  // console.log('图片信息--------',res)
                  that.setData({
                    imgInFo: res
                  },()=>{
                    res1(that.data.bgImgPath2)
                  })
                }
              })

              
            })
            // res1('2')
          },
          fail: res => {
            // console.log('名片图片转换失败')
          }
        })
      })
    }
    function df3() {//手机图片临时路径
      return new Promise(function (res1, rej) {
        wx.downloadFile({//手机图片临时路径
          url: bgImgPath3,//网络路径
          success: res => {
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath3: path
            }, function () {
              res1(that.data.bgImgPath3)
            })
            // res1('3')
          }
        })
      })
    }
    function df4() {//地址图片临时路径
      return new Promise(function (res1, rej) {
        wx.downloadFile({//地址图片临时路径
          url: bgImgPath4,//网络路径
          success: res => {
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath4: path
            }, function () {
              res1(that.data.bgImgPath4)
            })
            // res1('4')
          }
        })
      })
    }
    function df5() {//邮箱图片临时路径
      return new Promise(function (res1, rej) {
        wx.downloadFile({//邮箱图片临时路径
          url: bgImgPath5,//网络路径
          success: res => {
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath5: path
            }, function () {
              res1(that.data.bgImgPath5)
            })
            // res1('4')
          }
        })
      })
    }
    function df6() {//微信图片临时路径
      return new Promise(function (res1, rej) {
        wx.downloadFile({//微信图片临时路径
          url: bgImgPath6,//网络路径
          success: res => {
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath6: path
            }, function () {
              res1(that.data.bgImgPath6)
            })
            // res1('4')
          }
        })
      })
    }
    this.data.tetxArr.forEach((element, i) => {//把网络图片“手机图片”，“邮箱图片”，“地址图片”路径循环生成临时图片路径
      wx.downloadFile({//手机图片
        url: element.imgUrl,//网络路径
        success: res => {
          // console.log(bgImgPath3, '手机图片转换成功333')
          let path = res.tempFilePath //临时本地路径
          element.imgUrl = path
        },
        fail: res => {
          console.log('手机图片转换失败111----使用默认图', imgUrl + '智慧.png')
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

    // console.log('this.data.tetxArr---------', this.data.tetxArr)
    // this.setData({
    //   tetxArr: this.data.tetxArr
    // })
    function df7() {//小程序二维码图片
      return new Promise(function (res1, rej) {
        wx.downloadFile({//小程序二维码图片
          url: bgImgPath7,//网络路径
          success: res => {
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath7: path
            }, function () {
              res1(that.data.bgImgPath7)
            })
            // res1('4')
          }
        })
      })
    }
    // Promise.all([df(), df2(), df3(), df4(), df5(), df6(), df7()]).then(function(res){
    Promise.all([df(), df2(), df7()]).then(function(res){
      that.mateImg(v)
    })
  },
  /*
  *context:画布，
  *text：文字
  *w:文字显示宽度
  *x:文字开始x轴
  *y:文字开始y轴
  */
  lemitText: function (context, text, w, x, y) {
    if (text.length >= 10){
      // console.log('lemitText-------------')
      let width2 = context.measureText(text).width;//开始测量字体的宽度
      if (width2 > w) {
        let str = ''
        let str2 = '...'
        let arrT = text.split('')
        for (let i = 0; i < arrT.length; i++) {
          str += arrT[i]
          if (i > 12) {
            width2 = context.measureText(str).width;
            if (width2 > w) {
              break
            }
          }
          // width2 = context.measureText(str).width;
          // if (width2 > w) {
          //   break
          // }
        }
        context.fillText(str + str2, x, y);
      } else {
        context.fillText(text, x, y)
      }
    }else{
      context.fillText(text, x, y)
    }
  },
  mateImg: function (v2) {//画图
    let that = this;
    let context = wx.createCanvasContext('share');
    let bgImgPath1 = '服务.png'
    let bgImgPath2 = '服务.png'
    let bgImgPath3 = '服务.png'
    let bgImgPath4 = '服务.png'
    let bgImgPath5 = '服务.png'
    let bgImgPath6 = '服务.png'
    let bgImgPath7 = '服务.png'

    bgImgPath1 = this.data.bgImgPath1
    bgImgPath2 = this.data.bgImgPath2
    bgImgPath3 = this.data.bgImgPath3
    bgImgPath4 = this.data.bgImgPath4
    bgImgPath5 = this.data.bgImgPath5
    bgImgPath6 = this.data.bgImgPath6
    bgImgPath7 = this.data.bgImgPath7
    
    //这里是把页面上的数据写入到画布里，具体的坐标需要各位自行调整
    
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, 280, 550);
    context.drawImage(bgImgPath1, 0, 0, 280, 186)
    
    //宽：88  高：72===========半包围的长方形=======start
    //再次设置恢复为实线，数组再次设置成空即可
    context.setLineDash([]);
    context.lineWidth = 2
    context.strokeStyle = '#fff'
    context.beginPath();
    
    //左上线
    context.moveTo(35, 58);
    context.lineTo(35, 49);
    // 横上线
    context.moveTo(35, 50);
    context.lineTo(124, 50);
    // 右边线
    context.moveTo(123, 50);
    context.lineTo(123, 123);
    // 横下线
    context.moveTo(123, 122);
    context.lineTo(35, 122);
    // 左下线
    context.moveTo(35, 123);
    context.lineTo(35, 114);
    context.closePath();
    context.stroke();
    //宽：88  高：72===========半包围的长方形=======end

    //半包围的长方形里面的文字==================start
    
    context.fillStyle = "#FFF";
    context.font = "bold 20px Arial";
    context.fillText("族蚂名片", 19, 84);
    context.font = "14px Arial";
    context.fillText("小程序生成", 19, 104);
    
    //半包围的长方形里面的文字====================end

    // context.drawImage(bgImgPath2, 18, 206, 58, 58)
    if (that.data.imgInFo.width > 58 || that.data.imgInFo.height > 58) {
      // 原始图片的宽高较之显示区域较大，就需要小小地压缩一下(参照算法的网址：https://www.cnblogs.com/boboweiqi/p/9523793.html)
      let dw = 58 / that.data.imgInFo.width
      let dh = 58 / that.data.imgInFo.height
      if (that.data.imgInFo.width <= that.data.imgInFo.height) {//原始图片的宽 < 原始图片的高
        context.drawImage(bgImgPath2, 0, (that.data.imgInFo.height - 58 / dw) / 2, that.data.imgInFo.width, 58 / dw, 20, 206, 58, 58)
      } else {//原始图片的宽 > 原始图片的高原始图片的高
        context.drawImage(bgImgPath2, (that.data.imgInFo.width - 58 / dh) / 2, 0, 58 / dh, that.data.imgInFo.height, 20, 206, 58, 58)
      }
    } else {//原始图片宽高均小于显示区域 (默认情况下会将原始图片的宽高都扯开成刚好铺满画布。这个就不管了，让它自由填充吧)
      context.drawImage(bgImgPath2, 20, 206, 58, 58)
    }
    
    context.font = "bold 14px Arial";
    context.fillStyle = "#000";
    context.fillText(that.data.dataObj.fUserName, 88, 220);
    
    
    
    context.fillStyle = "#000";
    context.font = "12px Arial";
    this.lemitText(context, that.data.dataObj.fPosition, 165, 88, 240) 
    

    
    context.font = "12px Arial";
    context.fillStyle = "#797979";
    this.lemitText(context, that.data.dataObj.fCorpName, 165, 88, 260) 
    

    if (this.data.tetxArr[0] && this.data.tetxArr[0].text.length>0){
      
      // console.log('this.data.tetxArr[0].text------------', this.data.tetxArr[0].text)
      context.font = "12px Arial";
      context.fillStyle = "#797979";
      // context.drawImage(bgImgPath3, 18, 278, 12, 12)
      context.drawImage(this.data.tetxArr[0].imgUrl, 20, 278, 12, 12)
      
      if (that.data.tetxArr[0].type && that.data.tetxArr[0].type == 'lemit') {
        this.lemitText(context, this.data.tetxArr[0].text, 205, 39, 288)
      }else{
        context.fillText(this.data.tetxArr[0].text, 39, 288);
      }
      
    }
   
    if (this.data.tetxArr[1] && this.data.tetxArr[1].text.length > 0){
      
      // console.log('this.data.tetxArr[1].text------------', this.data.tetxArr[1].text)
      context.font = "12px Arial";
      context.fillStyle = "#797979";
      context.drawImage(this.data.tetxArr[1].imgUrl, 20, 298, 12, 12)
      // context.drawImage(bgImgPath4, 18, 298, 12, 12)
      // context.fillText(that.data.dataObj.fAddress, 37, 308);
      if (that.data.tetxArr[1].type && that.data.tetxArr[1].type == 'lemit') {
        this.lemitText(context, this.data.tetxArr[1].text, 205, 39, 308) 
      } else {
        context.fillText(this.data.tetxArr[1].text, 39, 308);
      }
      
    }

    if (this.data.tetxArr[2] && this.data.tetxArr[2].text.length > 0){
      
      // console.log('this.data.tetxArr[2].text------------', this.data.tetxArr[2].text)
      context.font = "12px Arial";
      context.fillStyle = "#797979";
      context.drawImage(this.data.tetxArr[2].imgUrl, 20, 318, 12, 12)
      // context.drawImage(bgImgPath5, 18, 318, 12, 12)
      if (that.data.tetxArr[2].type && that.data.tetxArr[2].type == 'lemit') {
        this.lemitText(context, this.data.tetxArr[2].text, 205, 39, 328)
      } else {
        context.fillText(this.data.tetxArr[2].text, 39, 328);
      }
      
    }
   
    if (this.data.tetxArr[3] && this.data.tetxArr[3].text.length > 0){
      
      // console.log('this.data.tetxArr[3].text------------', this.data.tetxArr[3].text)
      context.font = "12px Arial";
      context.fillStyle = "#797979";
      context.drawImage(this.data.tetxArr[3].imgUrl, 20, 338, 12, 12)
      // context.drawImage(bgImgPath6, 18, 338, 12, 12)
      if (that.data.tetxArr[3].type && that.data.tetxArr[3].type == 'lemit') {
        this.lemitText(context, this.data.tetxArr[3].text, 205, 39, 347) 
      } else {
        context.fillText(this.data.tetxArr[3].text, 39, 347);
      }    
      
    }
    
    //画一条虚线===================================start
    context.setLineDash([3, 4])
    context.lineWidth = 0.5
    context.strokeStyle = '#797979'
    context.beginPath();
    context.moveTo(16, (364-this.data.sub));
    context.lineTo(256, (364 - this.data.sub));
    context.stroke();
    //画一条虚线===================================end

    context.drawImage(bgImgPath7, 90, (390 - this.data.sub), 100, 95)
    
    context.fillStyle = "#1081FF";
    context.font = "11px Arial";
    context.fillText("长按或使用扫一扫识别小程序码查看名片", 40, (520 - this.data.sub));
    
    // if(v2 == 1){
      context.draw(false, function(){
        setTimeout(()=>{
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 280,
            height: 550,
            destWidth: 280 * 10,
            destHeight: 550 * 10,
            canvasId: 'share',
            success: function (res) {
              // console.log('###################', res.tempFilePath);
              that.setData({
                shareImgSrc: res.tempFilePath,
                showCanvas:false,
                showBtn:true
              })
              if (!res.tempFilePath) {
                wx.showModal({
                  title: '提示',
                  content: '图片绘制中，请稍后重试',
                  showCancel: false
                })
              }
            },
            fail: function (res) {
              console.log('图片生成失败-----', res)
            },
            complete(res) {
              that.setData({
                warnTitle: '保存成功',
                num: 2,//1:loading  2:success 0:!
                isShow: false
              })
            }
          })
        },100)
      })    
  },
  //canvas画圆形图片
  circleImg: function (ctx, img, x, y, r) {
    ctx.save();
    let d = 2 * r;
    let cx = x + r;
    let cy = y + r;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    // clip() 方法从原始画布中剪切任意形状和尺寸。
    // 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。您也可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。
    ctx.clip()
    ctx.drawImage(img, x, y, d, d)
    ctx.restore()
  },
  //用户是通过分享进入的，按钮为查看名片点击跳转名片详情页
  cardDetail:function(){
    // fbgm:true(有音乐2) false:没有音乐（1）
    wx.navigateTo({
      url: '../../' + this.data.fCardTemplateUrl + '?fId=' + this.data.fId + '&bgm=1'
    })
  },
  //将图片保存到相册
  saveApi:function(){
    let that = this
    //4. 当用户点击分享到朋友圈时，将图片保存到相册========start
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgSrc,
      success(res) {
        that.setData({
          warnTitle: '保存成功',
          num: 2,//1:loading  2:success 0:!
          isShow: true
        })
        setTimeout(() => {
          that.setData({
            warnTitle: '保存成功',
            num: 2,//1:loading  2:success 0:!
            isShow: false
          })
          return
        }, 1500)
      }, fail(err) {
        // console.log('图片保存失败--------------err', err)
        that.setData({
          warnTitle: '保存失败',
          num: 1,//1:loading  2:success 0:!
          isShow: false
        })
      }
    })
    //4. 当用户点击分享到朋友圈时，将图片保存到相册==========end
  },
  //图片保存到相册的授权是允许的
  createImg: function () {
    // console.log('createImg---------------------')
    let that = this
    // let bgImgPath1 = imgUrl + 'zuma mpx_shuffling_banner_04.png';
    that.setData({
      warnTitle: '正在保存海报',
      num: 1,//1:loading  2:success 0:!
      isShow: true
    })
    // that.imgTemPath(1, that.data.dataObj)
    that.saveApi()
  },
  //图片保存到相册的授权是拒绝的，就会跳转到微信内置的授权页，询问用户是否授权
  bind_load:function(){
    let that = this
    // wx.saveImageToPhotosAlbum()
    // console.log('that.data.img_status------------', that.data.img_status)
    if (that.data.img_status){
      that.saveApi()
    }else{
      wx.getSetting({
        // wx.openSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum']) {
            console.log('授权了')
            that.setData({
              img_status: true,
              warnTitle: '正在保存海报',
              num: 1,//1:loading  2:success 0:!
              isShow: true
            })
            wx.setStorageSync('hasRight', {
              img_status: true,
            })
            that.saveApi()
          } else if (!res.authSetting['scope.writePhotosAlbum'] == false) {
            console.log('没有授权了')
            that.setData({
              img_status: false,
              warnTitle: '正在保存海报',
              num: 1,//1:loading  2:success 0:!
              isShow: false
            })
            wx.setStorageSync('hasRight', {
              // img_status: res.authSetting['scope.writePhotosAlbum'],
              img_status: false,
            })
            that.saveApi()
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this.data.isShareIn, 'that.data.isShareIn------onReady------that.data.img_status', this.data.img_status)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.isShareIn, 'that.data.isShareIn------onShow------that.data.img_status', this.data.img_status)
    // wx.setNavigationBarTitle({
    //   title: '名片二维码',//页面标题
    // })
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
    if (this.data.isShareIn){
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
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
      title: this.data.dataObj.fUserName+'的名片',    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index?shareIn=shareFromQR&fPhone=' + this.data.dataObj.fPhone + '&fId=' + this.data.dataObj.fId + '&fCardTemplateUrl=' + this.data.fCardTemplateUrl, // 默认是当前页面，必须是以‘/'开头的完整路径
    }
  }
})