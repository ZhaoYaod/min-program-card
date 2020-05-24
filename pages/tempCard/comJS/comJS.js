const app = getApp();
let dataUrl = app.globalData.poxy.API_BASE //接口路径前缀
function comPublic(options,that){

  that.setData({
    hiddenmodalput: false,
    hideModal: true,
    warnFlash: 1,
    title: "数据加载中",
  })

  let token = wx.getStorageSync('token').token;
  if (options && options.fId && options.fId != 'null' || options.scene && (options.scene).indexOf("cardId") >= 0) {
    console.log(options, "进入名片详情页接口")
    console.log(options.share, "分享进来是几")
    let fId = options.fId;
    if (options.share == 0) {//通过分享进来不参与活动
      that.setData({
        'isshare': !that.data.isshare
      })
    } else if (options.share == 1) {// 活动分享进来做处理
      that.setData({
        'isshare': !that.data.isshare
      })
    } else if (options && options.scene) {//通过扫二维码进入详情页
      that.setData({
        'isshare': !that.data.isshare
      })
      let cardId = ''
      let scene = decodeURIComponent(options.scene);
      console.log(scene, "222通过二维码扫描进入详情页", options.scene)
      let arr = decodeURIComponent(options.scene).split("=")
      if (arr && arr.length >= 2) {

        arr.forEach((element, i) => {
          if (typeof (parseInt(element)) == 'number') {
            // fbgm:true(有音乐2) false:没有音乐（1）
            cardId = element
          }
        })
      }
      console.log("fid,9999999999999999", cardId)
      that.setData({
        cardID: cardId
      })
      fId = that.data.cardID;
    } else if (options.from == "editor") {//编辑名片保存后进入详情页
      that.setData({
        'isshare': !that.data.isshare
      })
    }
    wx.request({
      url: app.globalData.poxy.API_BASE + 'manage-api/resource/cardout/queryCardByCardId',
      data: {
        fId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': token,
      },
      success(res) {
        console.log('名片接口', res);
        let val = res.data.data;
        that.setData({
          list: val,
          'mymusic.hasMusic': (that.data.list.fBgmUrl == "") ? false : true,
          'mymusic.src': that.data.list.fBgmUrl,
          'mymusic.title': that.data.list.fBgm,
          'navData.title': val.fUserName + '的名片',
          'cmessage1.cname.cnameCont': val.fUserName,
          'cmessage1.cpost.cpostCont': val.fPosition,
          'cmessage1.ctitle.ctitleCont': val.fCorpName,
          'cmessage2[0].cnumber': (val.fPhone == "" || val.fPhone == null) ? "未添加" : val.fPhone,
          'cmessage2[1].cwx': (val.fWechat == "" || val.fWechat == null) ? "未添加" : val.fWechat,
          'cmessage2[2].cmail': (val.fMail == "" || val.fMail == null) ? "未添加" : val.fMail,
          'cmessage2[3].clocation': (val.fAddress == "" || val.fAddress == null ) ? "未添加" : val.fAddress,
          'cavatarSrc': val.fPhotoUrl,
          'cfunc1[0].cthumb': val.fLikedNum,//点赞数量
          'cfunc1[0].thumbsstatus': val.fIsLiked == 0 ? false : true,//点赞状态
          'cfunc1[1].ccollection': val.fCollectNum,
          'cfunc1[1].collectionstatus': val.fIsCollection,
          'cnumber': val.fPhone,
          'cwx': val.fWechat,
          'cmail': val.fMail,
          "isProduct": val.fProductIds,
          "isService": val.fServiceIds,
          "isArticle": val.fAticleIds,
          "fSprogramLink": val.fSprogramLink,
          "fWxpublicLink": val.fWxpublicLink,
          "fSite": val.fSite,
          "fSiteShowType": val.fSiteShowType,
          'shareModel.title': val.fUserName,
          'shareModel.path': val.fCardTemplateUrl,
          'shareModel.imageUrl': val.fShareImgUrl,
          'shareModel.cardfId': fId,
          'shareModel.hasMusic': (val.fBgmUrl == "") ? false : true,
          "hasWebsite": (val.fSite == "") ? false : true,
          'comment': val.fSite,
        });
        that.setData({
          hiddenmodalput: true,
          hideModal: false,
        })
    
        if (!val.fBgmUrl || val.fBgmUrl == "null" || val.fBgmUrl.length==0) {//判断音乐为空或null
          that.setData({
            'mymusic.hasMusic': false,
          })

        } else {
          that.setData({
            'mymusic.hasMusic': true,
            'mymusic.src': app.globalData.poxy.MUSIC + val.fBgmUrl,
            'mymusic.title': val.fBgm,
          })
        }

        wx.setNavigationBarTitle({
          title: that.data.navData.title,
        })
        that.setData({
          hiddenmodalput: true,
          hideModal: false,
        })

        that.triggerEvent('getCardfId', { val: that.data.shareModel }) //getCardfId自定义名称事件，父组件中使
      }

    })

  } else {

    // 生成海报图
    
    wx.setStorageSync('proType', {
      type: ""
    })
    let fCode = ''
    console.log("进入模板名片")
    if (options && options.scene){
      console.log(options.scene, "扫小程序二维码进入名片")
      that.setData({
        'isshare': !that.data.isshare
      })
      let scene = decodeURIComponent(options.scene);
      if (options.scene.indexOf('extendType')>-1){//推广渠道进入
        let arr = decodeURIComponent(options.scene).split("&");
        console.log(arr,"arr=======");
        var templeteUrl = arr[0];
        var shareWhere = arr[1];
        console.log(templeteUrl,"templeteUrl",shareWhere,"shareWhere ");
        let arr0 = decodeURIComponent(templeteUrl).split("=");
        that.setData({
          fCode: arr0[1]
        })
        fCode = that.data.fCode;
        // 写入推广渠道
        let arr1 = decodeURIComponent(shareWhere).split("=");
        wx.setStorageSync('proType', {
          type: arr1[1]
        })

      }else{
      
        let arr = decodeURIComponent(options.scene).split("=")
        if (arr && arr.length >= 2) {

          arr.forEach((element, i) => {
            if (typeof (parseInt(element)) == 'number') {
              fCode = element
            }
          })
        }
        console.log("fCode,二维码扫描进入模板", fCode)
        that.setData({
          fCode: fCode
        })
        fCode = that.data.fCode;
      }
    } else if (options && options.share){

      let isshare = options.share;
      console.log(isshare, "模板通过分享进入")
      if (isshare && isshare == 0 || isshare && isshare == 1) {
        that.setData({
          'isshare': !that.data.isshare
        })
      }
      fCode = that.data.fCode;
    }else{
      fCode = that.data.fCode;
      console.log("默认模板fCode", fCode);
    }

    // hgj=======================================start
    let obj3 = {
      fPosterUrl: that.data.shareImgDefaultUrl,//海报图
      fPhotoUrl: that.data.cavatarSrc,//名片图片
      fUserName: that.data.cmessage1.cname.cnameCont,//名片名称
      fPosition: that.data.cmessage1.cpost.cpostCont,//职位
      fPhone: '1510000000X',//手机号
      fMail: '15100000000@163.com',//邮箱
      fAddress: '上海市金山区亭林镇林盛路136号',//地址
    }
    that.public.imgTemPath(obj3)
    // hgj=======================================end
    console.log('obj3.fPosterUrl--------------', obj3.fPosterUrl)
    wx.setNavigationBarTitle({
      title: that.data.navData.title + '的名片',
    })
    // 模板统一字段
    that.setData({
      'cmessage2[0].cnumber': '1510000000X',
      'cmessage2[1].cwx': 'yangbin1510000',
      'cmessage2[2].cmail': '15100000000@163.com',
      'cmessage2[3].clocation': '上海市金山区亭林镇林盛路136号',
    })

    wx.request({
      url: dataUrl + '/manage-api/resource/cardTemplate/queryInfoByCode',
      data: {
        fCode: fCode
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        console.log("res", res);
        console.log("res", res.data.data.fQrcodeUrl);
        let vallist=res.data.data;
        if (res.data.data.fMusicUrl){
          that.setData({
            'mymusic.hasMusic': true,
            'mymusic.str': res.data.data.fMusicUrl
          })
        }else{
          that.setData({
            'mymusic.hasMusic': false,
            'mymusic.str': ""
          })
        }
        // that.public.imgTemPath3(res.data.data.fQrcodeUrl);
        that.setData({
          hiddenmodalput: true,
          hideModal: false,
          defaultModel: vallist,
        })
        // 生成模板海报
        //return (bill_js.toMakeBill(1, that.data.list,that))
      }
    })

    
  }
 

}


module.exports.comPublic = comPublic;