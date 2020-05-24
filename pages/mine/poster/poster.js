var app = getApp();
let imgUrl = app.globalData.poxy.IMGURL//static文件夹图片路径前缀
Page({
    data: {
        shareImgSrc:'',
        windowHeight: 0,
        windWidth:320,
        num:'',
        warnTitle:'',
        isShow:true,
				isShareIn:false,
				cardId:'',
				tempUrl:'',
				cname:'',
    },
    onLoad: function() {
        //Do some initialize when page load.
				let that= this;
        let options = getCurrentPages()[getCurrentPages().length - 1].options;
        let cardId = options.cardId;
        let tempUrl = options.tempUrl;
        let cname = options.cname;
        console.log('options--------------666',options)
        let isShareIn = options.isShareIn==="false"?false:true;
        that.setData({
          warnTitle: '海报生成中',
          num: 1,//1:loading  2:success 0:!
					isShow: true,
					cardId:cardId,
					tempUrl:tempUrl,
					cname:cname,
					isShareIn:isShareIn
        })
        wx.request({
            url: app.globalData.poxy.API_BASE +'manage-api/resource/card/produceMpHaiBao',
            data: {
            fId: cardId     
            },
            header: {
            'content-type': 'application/json'
            },
            success(res) {
                console.log(res.data.data,'000000000000000');
                that.setData({
                    shareImgSrc:res.data.data,
                    isShow: false,
                })
            }
        })
    },
    onReady: function() {
        //Do some when page ready.
        
    },
    onShow: function() {
        //Do some when page show.
        
    },
    onHide: function() {
        //Do some when page hide.
        
    },
    onUnload: function() {
        //Do some when page unload.
        
    },
    onPullDownRefresh: function() {
        //Do some when page pull down.
    },
    //图片保存到相册的授权是允许的
    createImg: function () {
      // console.log('createImg---------------------')
      let that = this
      let bgImgPath1 = imgUrl + 'zuma mpx_shuffling_banner_04.png';
      that.setData({
        warnTitle: '正在保存海报',
        num: 1,//1:loading  2:success 0:!
        isShow: true
      })
      // that.imgTemPath(1, that.data.dataObj)
      that.saveApi()
    },
    saveApi:function(){
      let that = this
      //4. 当用户点击分享到朋友圈时，将图片保存到相册========start
      wx.downloadFile({
          url: that.data.shareImgSrc,
          success: function(res) {
              let path = res.tempFilePath
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success(res) {
                    console.log('2222222222222');
                  that.setData({
                    warnTitle: '保存成功',
                    num: 2,//1:loading  2:success 0:!
                    isShow: true
                  })
                  setTimeout(() => {
                    that.setData({
                      isShow: false
                    })
                    return
                  }, 1500)
                }, fail(err) {
                  console.log('图片保存失败--------------err', err)
                  that.setData({
                    warnTitle: '保存失败',
                    num: 1,//1:loading  2:success 0:!
                    isShow: false
                  })
                }
              })
          }
      })
      //4. 当用户点击分享到朋友圈时，将图片保存到相册==========end
    },
		//用户是通过分享进入的，按钮为查看名片点击跳转名片详情页
		cardDetail:function(){
			// fbgm:true(有音乐2) false:没有音乐（1）
			wx.navigateTo({
				url: '../../../' + this.data.tempUrl + '?fId=' + this.data.cardId
			})
		},
    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function (options) {
			return {
				title: this.data.cname+'的名片',    // 默认是小程序的名称(可以写slogan等)
				path:'pages/mine/poster/poster?isShareIn=true&cardId=' + this.data.cardid + '&tempUrl=' + this.data.tempUrl + '&cname=' + cname
			}
    },
})