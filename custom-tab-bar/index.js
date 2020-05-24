const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE     //接口路径前缀
Component({
  data: {
    selected: 0,
    color: "#666",
    selectedColor: "#1081FF",
    scan:false,
    list: [{
      pagePath: "/pages/index/index",
      iconPath: imgUrl + "index1.png",
      selectedIconPath: imgUrl + "index2.png",
      text: "名片夹",
      news: 0
    },{
      pagePath: "/pages/service/service",
      iconPath: imgUrl + "service1.png",
      selectedIconPath: imgUrl + "service2.png",
      text: "发现",
      news: 0
    },{
      pagePath: "/pages/scan/scan",
      iconPath: imgUrl + "scan1.png",
      selectedIconPath: imgUrl + "scan2.png",
      text: "扫名片",
      news: 0
    },{
      pagePath: "/pages/mine/mine",
      iconPath: imgUrl + "mine1.png",
      selectedIconPath: imgUrl + "mine2.png",
      text: "我",
      news: 0
    }]
  },
  properties:{
    scanback:{
      type:Boolean,
      value:false
    }
  },
  lifetimes: {
    attached () {
      let pagepath = getCurrentPages()[getCurrentPages().length - 1].route;
      let that = this;
      that.setData({
        selected: pagepath == "pages/index/index" ? 0 : pagepath == "pages/service/service" || pagepath == "pages/radar/radar" ? 1 : 3
      })
      if (pagepath == "pages/mine/mine"){
        that.setData({
          'list[3].news':0
        })
      }else{
        let pNum = wx.getStorageSync('phone');
        let token = wx.getStorageSync('token')
        if(pNum && token && token.token){
          wx.request({
            url: dataUrl + 'manage-api/resource/cardout/queryByListPhone',
            data: {
              fPhone: pNum
            },
            header: {
              'content-type': 'application/json',
              'Authorization': token.token
            },
            success(res) {
              let m = 0;
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].fIsRead == 0){m++}
              }
              that.setData({
                'list[3].news': m
              })
            }
          })
        }
      }
    }
  },
  observers:{
    'scanback':function(scanback){
      this.updataScanBack()
    }
  },
  methods: {
    switchTab(e) {
      if (e.currentTarget.dataset.index == 2){
        this.setData({scan:true})
        return
      }
      const url = e.currentTarget.dataset.path;
      if ('/'+getCurrentPages()[getCurrentPages().length - 1].route == url) return;
      wx.reLaunch({
        url
      })
    },
    onscan: function (e) {
      this.setData({scan:false})
    },
    updataScanBack(){
      if(this.data.scanback){
        this.setData({
          scan:this.data.scanback
        })
      }
    }
  }
})