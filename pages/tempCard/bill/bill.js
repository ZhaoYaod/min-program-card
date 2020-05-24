const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL//static文件夹图片路径前缀
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
const util = require('../../../utils/throttle.js')
Component({
  // 组件的属性列表
    properties:{
      propA:{
        type: Object,
        value: ''
      },
      propB: {
        type: Object,
        value: ''
      },
      propC: {
        type: Object,
        value: ''
      },
    },
    // 组件的初始数据
    data:{
      isHasBill:false,
      showbillCanvas: true,//是否显示生成海报图页面
      img_status: true,//判断用户是否授权图片保存到相册 true:授权  false:拒绝授权,
      isShowBill: false,//是否显示生成海报图按钮
      // 生成海报的图片集合
      billImgPath1: "",
      billImgPath2: "",
      billImgPath3: "",
      billImgPath4: "",
      billImgPath5: "",
      billImgPath6: "",
      billImgPath7: "",
      sharebillImgSrc: "",
      tetxArr: [],
      canvasHeight: 504,
      sub: 0,
      imgInFo: {},//记录名片图片信息（原始宽高等）
      dataObj: { //生成海报需要的相关数据
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
    },

    // 组件的方法列表
    methods:{
      // 展示海报页
      showBill(){
        let that=this;
        that.setData({
          isHasBill: !that.data.isHasBill
        })
        console.log(that.data.showbillCanvas,"生成海报是否")
        if(that.data.propC.fId){
          that.toMakeBill(1, that.data.propC);
        }else{
          that.toMakeBill(1, that.data.propA, that.data.propB);
         
        }
        
      },
      //隐藏海报页
      hideBill(){
        let that = this;
        that.setData({
          isHasBill: !that.data.isHasBill,
          showbillCanvas:!that.data.showbillCanvas,
        })
      },
      setValue: function (v, billObj) {//数据的赋值
        let that=this;
        let otherObj;
        if (that.data.propC.fId){//详情页
          otherObj= {
            fCardTemplateUrl: v.fXmlPath,//名片模版路径
            fId: v.fId,//名片主键Id
            fPhotoUrl: v.fPhotoUrl,//名片图像
            fUserName: v.fUserName,//名片名称
            fPosterUrl: v.fPosterUrl,//manage后台的海报图片
            fPosition: v.fPosition,//职位
            fCorpName: v.fCorpName,//公司名称
            fPhone: v.fPhone,//手机号
            fAddress: v.fAddress,//地址（公司？）
            fMail: v.fMail,//邮箱
            fWechat: v.fWechat,//微信号
            fCardUrl:v.fCardUrl,//对应的名片二维码
          }
        }else{
           otherObj = {
            fCardTemplateUrl: v.fXmlPath,//名片模版路径
            fId: billObj.fId,//名片主键Id
            fPhotoUrl: billObj.headImg,//名片图像
            fUserName: billObj.name,//名片名称
            fPosterUrl: v.fPosterAllUrl ? v.fPosterAllUrl : (imgUrl + '服务.png'),//manage后台的海报图片
            fPosition: billObj.job,//职位
            fCorpName: billObj.company,//公司名称
            fPhone: '1510000000X',//手机号
            fAddress: '上海市金山区亭林镇林盛路136号',//地址（公司？）
            fMail: '15100000000@163.com',//邮箱
            fWechat: 'yangbin1510000',//微信号
            fCardUrl: v.fQrcodeUrl ? v.fQrcodeUrl : (imgUrl + 'ccc.png'),//对应的名片二维码
          }
        }
       
        // console.log(v.fPosterUrl,'------v.fCardUrl------------------------', v.fCardUrl)
        let textA = []
        if(otherObj.fPhone && otherObj.fPhone.length > 0) {
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
            text: otherObj.fMail,
            type: 'lemit'
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
        that.setData({
          tetxArr: textA
        })
        that.setData({
          canvasHeight: 512 - (4 - that.data.tetxArr.length) * 16,
          sub: (4 - that.data.tetxArr.length) * 16
        })
        that.setData({
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

      comMakeBill: function (v2) {//画图
        let that=this;
        let context = wx.createCanvasContext('myBill', that);
        let billImgPath1 = '服务.png'
        let billImgPath2 = '服务.png'
        let billImgPath3 = '服务.png'
        let billImgPath4 = '服务.png'
        let billImgPath5 = '服务.png'
        let billImgPath6 = '服务.png'
        let billImgPath7 = '服务.png'

        billImgPath1 = that.data.billImgPath1
        billImgPath2 = that.data.billImgPath2
        billImgPath3 = that.data.billImgPath3
        billImgPath4 = that.data.billImgPath4
        billImgPath5 = that.data.billImgPath5
        billImgPath6 = that.data.billImgPath6
        billImgPath7 = that.data.billImgPath7

        //这里是把页面上的数据写入到画布里，具体的坐标需要各位自行调整

        context.fillStyle = "#FFF";
        context.fillRect(0, 0, 280 * that.data.propB.canvasWidth, 512 * that.data.propB.canvasWidth);
        console.log('billImgPath1--------------------', billImgPath1)
        context.drawImage(billImgPath1, 0, 0, 280 * that.data.propB.canvasWidth, 176 * that.data.propB.canvasWidth)

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

        // context.drawImage(billImgPath2, 18, 206, 58, 58)
        if (that.data.imgInFo.width > 58 || that.data.imgInFo.height > 58) {
          // 原始图片的宽高较之显示区域较大，就需要小小地压缩一下(参照算法的网址：https://www.cnblogs.com/boboweiqi/p/9523793.html)
          let dw = 58 / that.data.imgInFo.width
          let dh = 58 / that.data.imgInFo.height
          if (that.data.imgInFo.width <= that.data.imgInFo.height) {//原始图片的宽 < 原始图片的高
            context.drawImage(billImgPath2, 0, (that.data.imgInFo.height - 58 / dw) / 2, that.data.imgInFo.width, 58 / dw, 18 * that.data.propB.canvasWidth, 186 * that.data.propB.canvasWidth, 58, 58)
          } else {//原始图片的宽 > 原始图片的高
            context.drawImage(billImgPath2, (that.data.imgInFo.width - 58 / dh) / 2, 0, 58 / dh, that.data.imgInFo.height, 18 * that.data.propB.canvasWidth, 186 * that.data.propB.canvasWidth, 58, 58)
          }
        } else {//原始图片宽高均小于显示区域 (默认情况下会将原始图片的宽高都扯开成刚好铺满画布。这个就不管了，让它自由填充吧)
          context.drawImage(billImgPath2, 18 * that.data.propB.canvasWidth, 186 * that.data.propB.canvasWidth, 58, 58)
        }
        context.font = "bold 15px Arial";
        context.fillStyle = "#000";
        // context.fillText("欧阳娜娜", 86, 220);
        context.fillText(that.data.dataObj.fUserName, 86 * that.data.propB.canvasWidth, 200 * that.data.propB.canvasWidth);

        context.font = "13px Arial";

        that.lemitText(context, that.data.dataObj.fPosition, 165 * that.data.propB.canvasWidth, 86 * that.data.propB.canvasWidth, 220 * that.data.propB.canvasWidth)
        // context.fillText(that.data.dataObj.fPosition, 86, 240);

        context.fillStyle = "#797979";
        context.font = "10px Arial";

        that.lemitText(context, that.data.dataObj.fCorpName, 165 * that.data.propB.canvasWidth, 86 * that.data.propB.canvasWidth, 240 * that.data.propB.canvasWidth)
        // context.fillText(that.data.dataObj.fCorpName, 86, 260);
        if (that.data.tetxArr[0] && that.data.tetxArr[0].text.length > 0) {
          context.fillStyle = "#797979";
          // context.drawImage(billImgPath3, 18, 278, 12, 12)
          context.drawImage(that.data.tetxArr[0].imgUrl, 18 * that.data.propB.canvasWidth, 258 * that.data.propB.canvasWidth, 12, 12)
          context.font = "10px Arial";
          if (that.data.tetxArr[0].type && that.data.tetxArr[0].type == 'lemit') {
            that.lemitText(context, that.data.tetxArr[0].text, 205 * that.data.propB.canvasWidth, 37 * that.data.propB.canvasWidth, 268 * that.data.propB.canvasWidth)
          } else {
            context.fillText(that.data.tetxArr[0].text, 37 * that.data.propB.canvasWidth, 268 * that.data.propB.canvasWidth);
          }

        }
        if (that.data.tetxArr[1] && that.data.tetxArr[1].text.length > 0) {
          context.fillStyle = "#797979";
          context.drawImage(that.data.tetxArr[1].imgUrl, 18 * that.data.propB.canvasWidth, 278 * that.data.propB.canvasWidth, 12, 12)
          // context.drawImage(billImgPath4, 18, 298, 12, 12)
          context.font = "10px Arial";
          // context.fillText(that.data.dataObj.fAddress, 37, 308);
          if (that.data.tetxArr[1].type && that.data.tetxArr[1].type == 'lemit') {
            that.lemitText(context, that.data.tetxArr[1].text, 205 * that.data.propB.canvasWidth, 37 * that.data.propB.canvasWidth, 288 * that.data.propB.canvasWidth)
          } else {
            context.fillText(that.data.tetxArr[1].text, 37 * that.data.propB.canvasWidth, 288 * that.data.propB.canvasWidth);
          }

        }
        if (that.data.tetxArr[2] && that.data.tetxArr[2].text.length > 0) {
          context.fillStyle = "#797979";
          context.drawImage(that.data.tetxArr[2].imgUrl, 18 * that.data.propB.canvasWidth, 298 * that.data.propB.canvasWidth, 12, 12)
          // context.drawImage(billImgPath5, 18, 318, 12, 12)
          context.font = "10px Arial";
          if (that.data.tetxArr[2].type && that.data.tetxArr[2].type == 'lemit') {
            that.lemitText(context, that.data.tetxArr[2].text, 205 * that.data.propB.canvasWidth, 37 * that.data.propB.canvasWidth, 308 * that.data.propB.canvasWidth)
          } else {
            context.fillText(that.data.tetxArr[2].text, 37 * that.data.propB.canvasWidth, 308 * that.data.propB.canvasWidth);
          }

        }
        if (that.data.tetxArr[3] && that.data.tetxArr[3].text.length > 0) {
          context.fillStyle = "#797979";
          context.drawImage(that.data.tetxArr[3].imgUrl, 18 * that.data.propB.canvasWidth, 318 * that.data.propB.canvasWidth, 12, 12)
          // context.drawImage(billImgPath6, 18, 338, 12, 12)
          context.font = "10px Arial";
          if (that.data.tetxArr[3].type && that.data.tetxArr[3].type == 'lemit') {
            that.lemitText(context, that.data.tetxArr[3].text, 205 * that.data.propB.canvasWidth, 37 * that.data.propB.canvasWidth, 327 * that.data.propB.canvasWidth)
          } else {
            context.fillText(that.data.tetxArr[3].text, 37 * that.data.propB.canvasWidth, 327 * that.data.propB.canvasWidth);
          }


        }
        //画一条虚线===================================start
        context.setLineDash([3, 4])
        context.lineWidth = 0.5
        context.strokeStyle = '#797979'
        context.beginPath();
        context.moveTo(16 * that.data.propB.canvasWidth, (344 - that.data.sub) * that.data.propB.canvasWidth);
        context.lineTo(256 * that.data.propB.canvasWidth, (344 - that.data.sub) * that.data.propB.canvasWidth);
        context.stroke();
        //画一条虚线===================================end

        // this.circleImg(context, billImgPath7, 90, (390 - that.data.sub), 50);
        context.drawImage(billImgPath7, 90 * that.data.propB.canvasWidth, (360 - that.data.sub) * that.data.propB.canvasWidth, 100 * that.data.propB.canvasWidth, 95 * that.data.propB.canvasWidth)

        context.fillStyle = "#1081FF";
        context.font = "11px Arial red";
        context.fillText("长按或使用扫一扫识别小程序码查看名片", 35 * that.data.propB.canvasWidth, (490 - that.data.sub) * that.data.propB.canvasWidth);

        // if(v2 == 1){
        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: 280*that.data.propB.canvasWidth,
              height: 512 * that.data.propB.canvasWidth,
              destWidth: 280 * that.data.propB.canvasWidth * 11,
              destHeight: 512 * that.data.propB.canvasWidth *11,
              canvasId: 'myBill',
              success: function (res) {
                wx.hideLoading();
                console.log('###################', res.tempFilePath);
                that.setData({
                  sharebillImgSrc: res.tempFilePath,
                  showbillCanvas: false,
                  // showBtn: true,
                  hideModal: false,
                })

                console.log(that.data.sharebillImgSrc, 'sharebillImgSrc=====================');
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
                  isShow: false,

                })
              }
            }, that)
          }, 1000)
        })

      },

      toMakeBill:function (v, obj, ele) {//生成临时图片路径以及其他数据的获取
        let that=this;
        wx.showLoading({
          title: '正在生成海报',
        })
        // that.setData({
        //   hideModal: true,
        //   warnFlash: 1,
        //   title: "正在生成海报",
        // })
        that.setValue(obj, ele);
        let billImgPath1 = that.data.dataObj.fPosterUrl ? that.data.dataObj.fPosterUrl : (imgUrl + '文章.png');
        let billImgPath2 = that.data.dataObj.fPhotoUrl ? that.data.dataObj.fPhotoUrl : (imgUrl + '文章.png');
        let billImgPath3 = imgUrl + '09-12-小程序海报-icon_03.png'
        let billImgPath4 = imgUrl + '09-12-小程序海报-icon_06.png'
        let billImgPath5 = imgUrl + '09-12-小程序海报-icon_08.png'
        let billImgPath6 = imgUrl + '09-12-小程序海报-icon_10.png'
        let billImgPath7 = that.data.dataObj.fCardUrl;

        function df() {//族蚂后台图片 
          return new Promise(function (res1, rej) {
            wx.downloadFile({//族蚂后台图片
              url: billImgPath1,//网络路径
              success: res => {
                // console.log('00族蚂后台图片转换成功111')
                let path = res.tempFilePath //临时本地路径
                // console.log('path---------------------', path)
                that.setData({
                  billImgPath1: path
                }, function () {
                  res1(that.data.billImgPath1)
                })
              },
              fail: res => {
                // console.log('族蚂后台图片转换失败')
              }
            }, that)
          })
        }
        function df2() {//名片图片
          return new Promise(function (res1, rej) {
            wx.downloadFile({//名片图片
              url: billImgPath2,//网络路径
              success: res => {
                // console.log('名片图片转换成功111')
                let path = res.tempFilePath //临时本地路径
                that.setData({
                  billImgPath2: path
                }, function () {
                  // res1(that.data.billImgPath2)

                  wx.getImageInfo({//获取原始图片的信息（如宽高等）
                    src: that.data.billImgPath2,
                    success(res) {
                      // console.log('图片信息--------',res)
                      that.setData({
                        imgInFo: res
                      }, () => {
                        res1(that.data.billImgPath2)
                      })
                    }
                  })


                })
                // res1('2')
              },
              fail: res => {
                // console.log('名片图片转换失败')
              }
            }, that)
          })
        }
        function df3() {//手机图片临时路径
          return new Promise(function (res1, rej) {
            wx.downloadFile({//手机图片临时路径
              url: billImgPath3,//网络路径
              success: res => {
                let path = res.tempFilePath //临时本地路径
                that.setData({
                  billImgPath3: path
                }, function () {
                  res1(that.data.billImgPath3)
                })
                // res1('3')
              }
            }, that)
          })
        }
        function df4() {//地址图片临时路径
          return new Promise(function (res1, rej) {
            wx.downloadFile({//地址图片临时路径
              url: billImgPath4,//网络路径
              success: res => {
                let path = res.tempFilePath //临时本地路径
                that.setData({
                  billImgPath4: path
                }, function () {
                  res1(that.data.billImgPath4)
                })
                // res1('4')
              }
            }, that)
          })
        }
        function df5() {//邮箱图片临时路径
          return new Promise(function (res1, rej) {
            wx.downloadFile({//邮箱图片临时路径
              url: billImgPath5,//网络路径
              success: res => {
                let path = res.tempFilePath //临时本地路径
                that.setData({
                  billImgPath5: path
                }, function () {
                  res1(that.data.billImgPath5)
                })
                // res1('4')
              }
            }, that)
          })
        }
        function df6() {//微信图片临时路径
          return new Promise(function (res1, rej) {
            wx.downloadFile({//微信图片临时路径
              url: billImgPath6,//网络路径
              success: res => {
                let path = res.tempFilePath //临时本地路径
                that.setData({
                  billImgPath6: path
                }, function () {
                  res1(that.data.billImgPath6)
                })
                // res1('4')
              }
            }, that)
          })
        }
        that.data.tetxArr.forEach((element, i) => {//把网络图片“手机图片”，“邮箱图片”，“地址图片”路径循环生成临时图片路径
          wx.downloadFile({//手机图片
            url: element.imgUrl,//网络路径
            success: res => {
              // console.log(billImgPath3, '手机图片转换成功333')
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
              }, that)
            }
          }, that)
        })

        // console.log('that.data.tetxArr---------', that.data.tetxArr)
        // that.setData({
        //   tetxArr: that.data.tetxArr
        // })
        function df7() {//小程序二维码图片
          return new Promise(function (res1, rej) {
            wx.downloadFile({//小程序二维码图片
              url: billImgPath7,//网络路径
              success: res => {
                let path = res.tempFilePath //临时本地路径
                that.setData({
                  billImgPath7: path
                }, function () {
                  res1(that.data.billImgPath7)
                })
                // res1('4')
              }
            }, that)
          })
        }
        // Promise.all([df(), df2(), df3(), df4(), df5(), df6(), df7()]).then(function(res){
        Promise.all([df(), df2(), df7()]).then(function (res) {
          that.comMakeBill(v);
        })
      },

      //将图片保存到相册
      saveApi: function () {
        let that = this
        //4. 当用户点击分享到朋友圈时，将图片保存到相册========start
        wx.saveImageToPhotosAlbum({
          filePath: that.data.sharebillImgSrc,
          success(res) {
            // that.setData({
            //   warnFlash: 2,
            //   title: "保存成功",
            //   hideModal: true,
            // })
            // setTimeout(() => {
            //   that.setData({
            //     warnFlash: 2,
            //     title: "保存成功",
            //     hideModal: false
            //   })
            //   return
            // }, 800)

            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success',//当icon：'none'时，没有图标 只有文字
              duration: 1000
            })
            that.hideBill();
           
        
          }, fail(err) {
            // console.log('图片保存失败--------------err', err)
            wx.hideLoading();
            wx.showToast({
              title: '保存失败',
              image: imgUrl + "i.png",
              duration: 1000
            }) 
            that.setData({
              img_status: false,
            }) 
            // that.setData({
            //   warnFlash: 1,
            //   title: "保存失败",
            //   img_status: false,
            // })
            // setTimeout(() => {
            //   that.setData({
            //     warnFlash: 1,
            //     title: "保存失败",
            //     hideModal: false,
            //     img_status: false,
            //   })
            //   return
            // }, 800)
          }
        })
        //4. 当用户点击分享到朋友圈时，将图片保存到相册==========end
      },

      //图片保存到相册的授权是允许的
      createImg: util.throttle(function () {
        // console.log('createImg---------------------')
        let that = this
        // let bgImgPath1 = imgUrl + 'zuma mpx_shuffling_banner_04.png';
        wx.showLoading({
          title: '正在保存海报',
        })

        // that.setData({
        //   isCanvasShow:true,
        //   warnFlash: 1,
        //   title: "正在保存海报",
        //   hideModal: true
        // })


        // that.imgTemPath(1, that.data.dataObj)
        that.saveApi()
      },1000),

      //图片保存到相册的授权是拒绝的，就会跳转到微信内置的授权页，询问用户是否授权
      bind_load: util.throttle(function () {
        let that = this
        // wx.saveImageToPhotosAlbum()
        // console.log('that.data.img_status------------', that.data.img_status)
        if (that.data.img_status) {
          that.saveApi()
        } else {
          wx.getSetting({
            // wx.openSetting({
            success: (res) => {
              if (res.authSetting['scope.writePhotosAlbum']) {
                console.log('授权了')
                that.setData({
                  img_status: true,
                  warnFlash: 1,
                  title: "正在保存海报",
                  hideModal: true
                })
            
                that.saveApi()
              } else if (!res.authSetting['scope.writePhotosAlbum']) {
                console.log('没有授权了')
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {//这里是用户同意授权后的回调
                    that.setData({
                      img_status: false,
                      warnFlash: 1,
                      title: "正在保存海报",
                      hideModal: false
                    })
    
                    that.saveApi()
                  },
                  fail() {//这里是用户拒绝授权后的回调
                    that.setData({
                      
                    })
                  }
                });

              }
            }
          })
        }
      },1000),

    }
})