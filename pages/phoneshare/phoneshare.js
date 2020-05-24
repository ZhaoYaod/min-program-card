// pages/phoneshare/phoneshare.js
var app = getApp();
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE     //接口路径前缀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:true,
    // hgj===========================================start
    warnTitle: '',
    num: 1,//1:loading  2:success 0:!
    isShow:false,
    shareImgSrc: '',
    bgImgPath0: '',
    bgImgPath1: '',
    bgImgPath2: '',
    bgImgPath3: '',
    bgImgPath4: '',
    bgImgPath5: '',
    bgImgPath6: '',
    bgImgPath7: '',
    tetxArr: ['18720986997'],
    sub: 0,
    dataObj: {
      fPhotoUrl: '',//名片图像
      fUserName: '',//名片名称
      // fCardUrl: v.fCardUrl,//manage后台的海报图片
      fPosition: '',//职位
      fCorpName: '',//公司名称
      fPhone: '',//手机号
      fAddress: '',//地址（公司？）
      fMail: '',//邮箱
      fWechat: '',//微信号
      fCardUrl: '',//小程序二维码
    },
    canvasHeight: 550,
    fId:'',
    phone:'',
    inputValue:'',
    imgInFo: {}//记录名片图片信息（原始宽高等）
    // hgj===========================================end
  },
  checknumber(e){
    // let pat = /^1/;
    // if (e.detail.value >= 13000000000 && e.detail.value <= 19999999999 && pat.test(e.detail.value)){
    //   this.setData({
    //     check:false
    //   })
    // }else{
    //   this.setData({
    //     check: true,
    //     inputValue: e.detail.value
    //   })
    // }
    if (!(/^1[3456789]\d{9}$/.test(e.detail.value))) {//只匹配国内手机号
    // if (!(/\d{6,20}$/.test(e.detail.value))) {//匹配银河系蓝星手机号码
      this.setData({
        check: true
      })
    } else {
      this.setData({
        check: false,
        inputValue: e.detail.value
      })
    }
    // console.log('e.detail.value--------------', e.detail.value)
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log('phoneshare----------------options', options)
    this.setData({
      cardid: options.cardid,
      phone: options.phone
    },()=>{
      this.getData(this.data.cardid, this.data.phone)
    })
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    console.log(getCurrentPages()[getCurrentPages().length-1].options.cardid) //名片ID
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
  // onShareAppMessage: function () {

  // },
  // hgj======================================================================start
  sendMessge:function(){
    let that = this

    // wx.showLoading({
    //   title:'正在发送',
    //   icon: 'loading',
    //   mask: true
    // })
    that.setData({
      warnTitle: '正在发送',
      num: 1,//1:loading  2:success 0:!
      isShow: true,
    })
    that.imgTemPath(1, this.data.dataObj)
  },
  getData(v,v2) {
    let that = this
    wx.request({
      url: dataUrl + 'manage-api/resource/cardout/queryByListPhone',
      data: {
        fPhone: v2
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token').token
      },
      success(res) {
        // console.log('0000000000000000000====res---', res)
        res.data.data.forEach((element,index)=>{
          if (element.cardid == v){
            // console.log('element-----------------------', element)
            let obj = {
              fPhotoUrl: element.photolist,//名片图像photolist
              fUserName: element.cname,//名片名称cname
              fPosterUrl: element.fPosterUrl,//manage后台的海报图片
              fPosition: element.fPosition,//职位?
              fCorpName: element.ctitle,//公司名称ctitle
              fPhone: that.data.phone,//手机号
              fAddress: element.fAddress,//地址（公司）?
              fMail: element.fMail,//邮箱?
              fWechat: element.fWechat,//微信号?
              fCardUrl: element.cardUrl,//小程序二维码cardUrl
            }
            // console.log('obj-----------------------', obj)
            that.setData({
              dataObj: obj
            })
          }
        })

      }
    })
  },
  /*v:1(代表不仅要画图还要保存图片到本地)) 否者只是画图
  *obj={
    fPhotoUrl: '',//名片图像photolist
    fUserName: '',//名片名称cname
    fPosition: '',//职位?
    fCorpName: '',//公司名称ctitle
    fPhone: '',//手机号
    fAddress: '',//地址（公司）?
    fMail: '',//邮箱?
    fWechat: '',//微信号?
    fCardUrl: '',//小程序二维码1cardUrl
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
            }, function () {
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
                  }, () => {
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
    Promise.all([df(), df2(), df7()]).then(function (res) {
      that.mateImg(v)
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
        type: 'lemit'
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
  /*
  *context:画布，
  *text：文字
  *w:文字显示宽度
  *x:文字开始x轴
  *y:文字开始y轴
  */
  lemitText: function (context, text, w, x, y) {
    if (text.length >= 10) {
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
    } else {
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
      } else {//原始图片的宽 > 原始图片的高
        context.drawImage(bgImgPath2, (that.data.imgInFo.width - 58 / dh) / 2, 0, 58 / dh, that.data.imgInFo.height, 20, 206, 58, 58)
      }
    } else {//原始图片宽高均小于显示区域 (默认情况下会将原始图片的宽高都扯开成刚好铺满画布。这个就不管了，让它自由填充吧)
      context.drawImage(bgImgPath2, 20, 206, 58, 58)
    }

    context.font = "bold 14px Arial";
    context.fillStyle = "#000";

    context.fillText(that.data.dataObj.fUserName, 88, 220);

    context.font = "12px Arial";
    this.lemitText(context, that.data.dataObj.fPosition, 165, 88, 240) 
    // context.fillText(that.data.dataObj.fPosition, 86, 240);

    context.font = "12px Arial";
    context.fillStyle = "#797979";
    
    this.lemitText(context, that.data.dataObj.fCorpName, 165, 88, 260) 
    // context.fillText(that.data.dataObj.fCorpName, 86, 260);

    if (this.data.tetxArr[0] && this.data.tetxArr[0].text.length > 0) {
      // console.log('this.data.tetxArr[0].text------------', this.data.tetxArr[0].text)
      context.font = "12px Arial";
      context.fillStyle = "#797979";
      // context.drawImage(bgImgPath3, 18, 278, 12, 12)
      context.drawImage(this.data.tetxArr[0].imgUrl, 20, 278, 12, 12)

      if (that.data.tetxArr[0].type && that.data.tetxArr[0].type == 'lemit') {
        this.lemitText(context, this.data.tetxArr[0].text, 205, 39, 288)
      } else {
        context.fillText(this.data.tetxArr[0].text, 39, 288);
      }

    }
    if (this.data.tetxArr[1] && this.data.tetxArr[1].text.length > 0) {
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
    if (this.data.tetxArr[2] && this.data.tetxArr[2].text.length > 0) {
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
    if (this.data.tetxArr[3] && this.data.tetxArr[3].text.length > 0) {
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
    context.moveTo(16, (364 - this.data.sub));
    context.lineTo(256, (364 - this.data.sub));
    context.stroke();
    //画一条虚线===================================end


    context.drawImage(bgImgPath7, 90, (390 - this.data.sub), 100, 95)

    context.fillStyle = "#1081FF";
    context.font = "11px Arial";
    context.fillText("使用微信扫一扫功能，识别小程序码查看名片", 45, (520 - this.data.sub));

    if (v2 == 1) {
      context.draw(false, function () {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 280,
            height: 550,
            destWidth: 280*10,
            destHeight: 550*10,
            canvasId: 'share',
            success: function (res) {
              console.log('###################', res.tempFilePath);
              that.upLoCanvasImg(res.tempFilePath)
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
            }
          })
        }, 300)
      })

    } else {
      context.draw()
    }

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
  upLoCanvasImg: function (v) {
    let that = this;
    const uploadTask = wx.uploadFile({
      url: dataUrl + 'manage-api/resource/cardScan/uploadImage',     // 后台接收图片接口地址
      filePath: v,						                                   //调用wx.chooseImage选择之后的临时图片地址
      name: 'file',
      header: { 'Content-Type': 'application/json' },
      success(res) {
        let url = JSON.parse(res.data).url
        console.log('url----------------', url)
        that.setData({
          shareImgSrc: url
        })
        // ===========================================start
        let phone = that.data.inputValue
        let msg = '您的好友' + JSON.parse(wx.getStorageSync('WechatRawData')).nickName + '向您发送了一张电子名片，请及时查收，登陆地址:' + that.data.shareImgSrc
        wx.request({
          url: dataUrl + 'manage-api/resource/cardout/sendPhoneMsg',
          method: 'GET',
          data: {
            "msg": msg,
            "phone": phone
          },
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token').token
          },
          success(res) {
            that.setData({
              warnTitle: '发送成功',
              num: 2,//1:loading  2:success 0:!
              isShow: true
            },()=>{
              setTimeout(()=>{
                wx.reLaunch({
                  url: '/pages/mine/mine'
                })
                return
              },800)
                
            })
          }
        })
        // =============================================end
      }
    })
  }
  // hgj========================================================================end
})