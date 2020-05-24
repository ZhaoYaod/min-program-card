// pages/component/activity/activity.js

const app = getApp();
let imgUrl = app.globalData.poxy.IMGURL;
let dataUrl = app.globalData.poxy.API_BASE     //接口路径前缀

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activityStatus: { 
      type: Number, 
      value: '', 
    },
  },
  observers: {
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgurl:imgUrl,
    dataurl:dataUrl,
    activity: false,   //活动页面是否展示
    share: false,  //红包阶段 false 1 true 2 
    // flag: true,//节流

    loginState: false,  //跳登录
    scan: false,  //走流程
    isClick:'', //是否能转发（需要满足条件）
    link: '../../component/getPhone/getPhone'
  },
  created() {
    // console.log(123, 'created`````````')
  },
  attached(){
    this.show();
    if (wx.getStorageSync('token').token) {
      this.setData({
        isClick: true,
      })
      // console.log(this.data.isClick, 'attached`````````')
    }
  },
  ready(){
    console.log(123, this.data.activityStatus,'ready`````````')
  },
 
                                                                                     
  /**
   * 组件的方法列表
   */
  methods: {  
    // 显示
    show() {
      let token = wx.getStorageSync('token').token
      // let token = wx.getStorageSync('zmToken');
      // 用户（登录不登录）并且没有领过红包出现该组件页面 
      if (token) {
        let _this = this;
        wx.request({
          url: dataUrl + 'manage-api/resource/cardout/loginVerifyIsReceive', // 是否领取过红包
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success(res) {
            console.log(res, '是否领取过红包')
            if(res.data.status == 200){
              _this.setData({
                activity: res.data.data === 0 ? true : false //0 — 什么活动也没有领取过，1 — 领取过优惠活动，2 — 领取过大派送活动  
              })
              wx.setStorageSync('taskStatus',res.data.data);
            }
            else if (res.data.status === 404) {
              _this.setData({
                loginState: true,
              })
            }
          }
        })


        // let val = wx.getStorageSync('token').taskStatus === 0 ? true : false;
        // this.setData({ activity: val })
        // console.log(val, '是否领取过红包')

      }else{  //没登录要显示
        this.setData({
          activity: true 
        })
      }
    },
    // 登录回调
    onMyEvent(){
      console.log('活动1');
      // this.setData({ activity: false })
      // let val = wx.getStorageSync('token').taskStatus === 0 ? true:false;
      let val = wx.getStorageSync('taskStatus') === 0 ? true : false;

      this.setData({ 
        activity: val ,
        activityStatus: wx.getStorageSync('taskStatus')
      })
      this.triggerEvent('customevent', {val:this.data.activityStatus}) //myevent自定义名称事件，父组件中使
      console.log(this.data.activityStatus,'activityStatus')
      if (wx.getStorageSync('token').token) {
        this.setData({
          isClick: true,
        })
      }
    },
    // 领红包
    getRedPacket() {
      let _this = this;
      let token = wx.getStorageSync('token').token
      // let token = wx.getStorageSync('zmToken');
      //转发成功去领取
      wx.request({
        url: dataUrl + 'manage-api/resource/cardout/receiveTaskProcess',
          method: 'GET',
          data: {
            type: 1  //1 – 领取优惠活动 2 – 领取大派送活动
          },
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success(res) {
            console.log(res, '领取红包成功')
            if(res.data.status === 200){
              setTimeout(()=>{
                _this.setData({
                  share: res.data.status == 200 ? true : false 
                  // share: true
                },800)
              })
              wx.setStorageSync('taskStatus', 1);
            }
            else if(res.data.status === 404){
              _this.setData({
                loginState: true,
              })
            }
          }
        })
      
    },
    // 点击分享  
    buttonClick(){
      let token = wx.getStorageSync('token').token
      // let token = wx.getStorageSync('zmToken');
      if (!token) { // 没登录时
        this.setData({
          loginState: true,
        })
      }else{  //跳转
        console.log(this.onShareAppMessage,'onShareAppMessage')
          this.getRedPacket(1)
          
      } 
      
    },
    // 创建名片流程
    onscan: function (e) {
      wx.removeStorage({
        key: 'cardInfo',
      })
      this.setData({ scan: false })
    },
    hidden(){
      this.setData({
        activity:false
      })
    },
    creat() {
      this.setData({
        activity: false,
        scan: true
      })
    },
  }
})
