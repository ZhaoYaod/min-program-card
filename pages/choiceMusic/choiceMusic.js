// choiceMusic.js
let app = getApp();
let myaudio;
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
// 可以在任意页面获取音频实例，实例唯一
// const bgMusic = wx.getBackgroundAudioManager();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicList:[],
    playIndex:null,
    navHeight: app.globalData.statusBarHeight + 'rpx',
    nowIndex:null,
    imgUrl: imgUrl,
    showMusic:false,
    hideMusic:false,
    loading:false,
    firstEnter:true,
    switchItem:true,
    loadmore:false,
    loadmore1:false,
    h:null,
    w:null,
    tempBgmId:null,
    bgmId:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myaudio = wx.createInnerAudioContext()
    wx.hideShareMenu();
    console.log(options,options.bgmId,'22222222222222')
    this.getTop();
    let fId = options.fid;
    this.setData({
      tempBgmId:fId
    });
    if(options.bgmId){
      this.setData({
        showMusic:true,
        firstEnter:false,
        bgmId: options.bgmId,
        loading:true
      });
      this.getDta(null, options.bgmId);
    }
    let that = this
    // 监听音乐播放完毕时的回调===================================start
    myaudio.onEnded(function (v) {
      console.log(that.data.playIndex,'音乐播放结束了-----mmp--',v)
      let oldArr = that.data.musicList
      let nextCount = that.data.playIndex + 1;  //下一首
      if (nextCount > (that.data.musicList.length-1)){
        nextCount = 0
      }
      oldArr.forEach((element, i) => {
        let eachList = 'musicList[' + i + '].isPlay'
        that.setData({
          [eachList]: false
        })
      })
      // 上一首播歌自然放完毕后自动播放下一首歌(按顺序循环播放)，并且把下一首将要播放的歌曲的图标变为暂停图标=================statr
      let eachList2 = 'musicList[' + nextCount + '].isPlay'
      that.setData({
        [eachList2]:true,
        playIndex: nextCount,
        token: wx.getStorageSync('token').token
      },()=>{
        console.log(that.data.playIndex, '==================================', that.data.musicList[that.data.playIndex].url)
        myaudio.src = that.data.musicList[that.data.playIndex].fMusicUrl
        myaudio.play();
      })
      // 上一首播歌自然放完毕后自动播放下一首歌(按顺序循环播放)，并且把下一首将要播放的歌曲的图标变为暂停图标===================end
    })
    // 监听音乐播放完毕时的回调=====================================end
    myaudio.onTimeUpdate(function (v) {
      var currentTime = parseInt(myaudio.currentTime);
      console.log(myaudio.duration,'音乐正在播放--------------------currentTime', currentTime)
    })
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
    if (this.data.playIndex || this.data.playIndex == 0) {
      let eachList = 'musicList[' + this.data.playIndex + '].isPlay'
      this.setData({
        [eachList]: false
      })
      myaudio.pause()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.playIndex || this.data.playIndex == 0) {
      let eachList = 'musicList[' + this.data.playIndex + '].isPlay'
      this.setData({
        [eachList]: false
      })
      myaudio.pause()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    myaudio.destroy();//页面卸载时销毁myaudio此实例(可以防止wx.createInnerAudioContext()监听回调多次触发)
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
    console.log('上拉触底')
    this.setData({
      loadmore:true,
      loadmore1:true
    });
    setTimeout(()=>{
      this.setData({
        loadmore1: false,
      });
    },1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getTop(){
    let _this = this;
    const query = wx.createSelectorQuery()                // 创建节点查询器
    query.select('#Devil').fields({
      size:true,
      rect:true
    })
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      _this.setData({
        h:res[0].height,
        w:res[0].width
      })
    });
  },
  playOrNot: function (e) {//点击播放或者暂停音乐
    let parmObj = e.currentTarget.dataset
    let index = parmObj.index
    this.setData({
      playIndex: index
    })
    let oldArr = this.data.musicList
    let that = this
    if (parmObj.play){
      console.log('暂停')
      oldArr.forEach((element,i)=>{
        let eachList = 'musicList[' + i + '].isPlay'
        that.setData({
          [eachList]: false
        })
        myaudio.src = ''
        myaudio.pause();
      })
    }else{
      console.log('播放')
      myaudio.pause();
      oldArr.forEach((element, i) => {
        let eachList = 'musicList[' + i + '].isPlay'
        let ok = 'musicList[' + i + '].ok'
        if (index == i) {
          myaudio.src = parmObj.src
          myaudio.play()
          that.setData({
            [eachList]: true,
          })
        } else {
          that.setData({
            [eachList]: false
          })
        }
        this.setData({
          [ok]: false
        })
      });
    }
  },
  getDta: function (fCategory,fId) {//请求获取数据
    this.setData({
      musicList:[]
    })
    let that = this;
    let data = {};
    if (fCategory==null){
      data.fId = fId
    }else if(fId==null){
      data.fCategory = fCategory
    }
    wx.request({
      // url:'https://manage.zuma.com/manage-api/resource/cardMusic/queryList',
      url: api +'manage-api/resource/cardMusic/queryMusicList',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        "Authorization": that.data.token
      },
      data: data,
      success: function (res) {
        let songArr = res.data.data;
        let flag = false;
        let count = 0;
        for(let i=0; i<songArr.length; i++){
          let element = songArr[i];
          wx.getImageInfo({
            src: element.fImgUrl,
            success: (res) => {
              count++;
              let h = that.data.h;
              let w = that.data.w;
              let p = res.width / res.height;
              if (p == 1) {       //方图
                element.width = w;
                element.height = h;
                element.left = 0;
                element.top = 0;
              } else if (p < 1) {  //竖图
                element.width = w;
                element.height = Math.round(w / p);
                element.left = 0;
                element.top = Math.round((element.height - h) / 2)
              } else if (p > 1) {  //横图
                element.height = h;
                element.width = Math.round(h * p);
                element.top = 0;
                element.left = Math.round((element.width - w) / 2);
              }
              if (count==songArr.length){
                flag = true;
              }
            }
          })
          if (!element.isPlay) {
            element.isPlay = false;
            element.confirm = false;
            element.ok = false
          }
          if (fId && element.fId == fId) {
            element.ok = true
          }
          switch (element.fCategory) {
            case 1: element.musicType = '纯音乐'; break;
            case 2: element.musicType = '歌曲'; break;
            case 3: element.musicType = '搞笑';
          }
        };  
       var timer = setInterval(()=>{
         if (flag) {
           console.log(songArr)
           that.setData({
             loading: false,
             firstEnter: true,
             musicList: songArr,
             switchItem: true,
             nowIndex: songArr[0].fCategory - 1
           });
           clearInterval(timer)
         }  
       },50)
      },
      fail: function (err) {
        // console.log('请求失败------------------')
      }
    })
  },
  selected(e){          //选中音乐
    let url = e.currentTarget.dataset.url;
    let name = e.currentTarget.dataset.name;
    let bgmid = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let ok = e.currentTarget.dataset.ok;
    console.log('ok',ok)
    var mIndex = 'musicList[' + index + '].confirm';
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2]; //上一个页面
    var info = prevPage.data //取上页data里的
    var isPlay = this.data.musicList[index].isPlay;
    prevPage.setData({
      bgmurl: url,
      bgmid: bgmid,
      bgm: name
    });
    if(isPlay||ok){
      console.log('111111111111111')
      this.setData({
        [mIndex]: true
      }, function () {
        console.log('333333333333333')
        setTimeout(() => {
          console.log('44444444444444')
          wx.navigateBack()
        }, 650)
      })
    }else{
      console.log('222222222222222')
      wx.navigateBack();
    }
  },
  switchChange(e){
    let bl = this.data.showMusic;   //是否隐藏音乐
    console.log(bl)
    if(bl){
      myaudio.src = ''    //停止播放
      myaudio.pause();
      this.setData({
        showMusic: false,
        loading: false,
      });
      this.data.musicList.forEach((element, index) => {
        var mIndex = 'musicList[' + index + '].isPlay';
        this.setData({
          [mIndex]:false
        })
      });
      // 若关闭音乐，则修改上个页面的音乐字段
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];//当前页
      var prevPage = pages[pages.length - 2]; //上一个页面
      var info = prevPage.data //取上页data里的
      prevPage.setData({
        bgmurl: '',
        bgmid: null,
        bgm: '无效果'
      });
    }else{
      this.setData({
        showMusic: true,
      });
      let tempBgmId = this.data.tempBgmId;
      let bgmId = this.data.bgmId
      if (tempBgmId && !bgmId){ 
        this.setData({
          loading:true
        }) 
        this.getDta(null, tempBgmId);
      } else if (!tempBgmId && !bgmId){
        this.setData({
          loading: true
        })
        this.getDta(2, null);
      }
    }
  },
  chooseType(e){
    let index = parseInt(e.currentTarget.dataset.index);
    let obj = {};
    myaudio.src = ''    //停止播放
    myaudio.pause();
    this.setData({
      nowIndex:index,
      switchItem:false,
      loading:true,
      loadmore1:false,
      loadmore:false
    });
    wx.pageScrollTo({         
      scrollTop: 0
    });
    this.getDta(index+1,null)
  }
})