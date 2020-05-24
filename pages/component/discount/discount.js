// pages/component/activity/activity.js
import regeneratorRuntime from '../../../utils/runtime.js'
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
    'activityStatus'(pre,cur){
      console.log(pre, cur,'pre, cur observers')
      
      this.setData({
        //pre1  参加活动2，pre2  活动二激活情况
        discount1: pre === 1 ? true : false,
      })
      if (pre === 2) { //查看是否激活
        this.show();
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgurl:imgUrl,
    dataurl:dataUrl,
    discount1: false,  // 参加活动二
    discount2: false,  //是否激活
    relayAmount:'', //领取金额
    amount:'', //余额
    flag:true, //节流
    loginState: false,  //跳登录
    scan: false,  //走流程
    isShow: false,   //
    warnTitle: '',
    num: 2,//1:loading  2:success 0:!
  },
  created() {
    this.show();
    // console.log(123, 'created`````````')
  },
  attached() {
    //  console.log(111, 'attached`````````')
  },
  ready() {
    // console.log(123, 'ready`````````')
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 显示
    async show() {
      let token = wx.getStorageSync('token').token
      // let token = wx.getStorageSync('zmToken');
      // 用户登录并且领过红包活动出现该组件页面 
      if (token) {
        let _this = this;
        // let result = await new Promise((resolve, reject) =>{
        //   wx.request({
        //     url: dataUrl + 'manage-api/resource/cardout/loginVerifyIsReceive', // 参与过什么活动
        //     header: {
        //       'content-type': 'application/json',
        //       'Authorization': token
        //     },
        //     success(res) {
        //       console.log(res, res.data.data === 0, '是否领取大派送')
        //       if (res.data.status === 200){
        //         _this.setData({
        //           showDiscount: res.data.data === 1 ? true : false //0 — 什么活动也没有领取过，1 — 领取过优惠活动，2 — 领取过大派送活动
        //           // showDiscount: true 
        //         })
        //         wx.setStorageSync('token', {taskStatus:res.data.data});
        //         resolve(_this.data.showDiscount)

        //       } else if (res.data.status === 404){
        //         _this.setData({
        //           loginState: true,
        //         })
        //         reject(res.data.status)
        //       }
        //     },
        //     fail(){
        //       console.error(err)
        //       reject(err)
        //     }
        //   })
         
        // })
         
        // console.log(result, this.data.showDiscount,'awaite res1111111111111111111111111')

        // 登录时才触发，所以注释
        // let val = wx.getStorageSync('token').taskStatus === 1 ? true : false;
        // this.setData({ showDiscount: val })
        // console.log(val, '是否领取大派送')
        console.log(this.data.activityStatus,'激活11111')
        if (!(this.data.activityStatus === 2)) return   //登录时有值，登录后页面跳转默认为0 false，不执行以下代码
        console.log(this.data.activityStatus, '激活22222')

        // 领过大派送后 ，，查询是否被激活
        wx.request({
          url: dataUrl + 'manage-api/resource/cardout/queryIsUserIdMinTen', // 查询用户当前领取余额
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success(res) {
            console.log(res, '红包是否被激活')
            if (res.data.status === 200){
              _this.setData({
                discount2: res.data.data.flage === 1 ? true : false , //1—弹窗  代表红包被激活 0—不弹窗
                relayAmount: res.data.data.relayAmount,
                amount: res.data.data.amount,
                
              })
            }
            else if (res.data.status === 404) {
              _this.setData({
                loginState: true,
              })
            }
          }
        })
        
      } 
    },
    
    // 领取  
    async receive() {
      if(!this.data.flag) return
      this.data.flag = false;
      let _this = this;
      let token = wx.getStorageSync('token').token
      // let token = wx.getStorageSync('zmToken');
      await new Promise((resolve, reject) => {
        wx.request({
          url: dataUrl + 'manage-api/resource/cardout/receiveTaskProcess',
          dataType: 'json',
          method: 'GET',
          data: {
            type: 2  //1 – 领取优惠活动 2 – 领取大派送活动
          },
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success(res) {
            console.log(res, '领取大派送成功')
            if(res.data.status === 200){
              resolve(true)
              // wx.showToast({
              //   title: '认领成功',
              //   icon: 'success',
              //   duration: 2000
              // })
              _this.setData({
                isShow: true,
                warnTitle: '认领成功',
                index: -1
              })
              setTimeout(() => {
                _this.setData({
                  isShow: false,
                  warnTitle: '认领成功',
                  index: -1
                })
              }, 2000);
              _this.setData({ 
                discount1:false
              })
              wx.setStorageSync('taskStatus', 2);

            } else if (res.data.status === 404){
              _this.setData({
                loginState: true,
              })
              reject(res.data.status)
            }
          },
          fail() {
            console.error(err)
            reject(err)
          }
        })
      })
      .then()
      .catch(()=>{
        this.data.flag = true
      })
    },
    // onMyEvent() {
    //   console.log('活动2');
    //   // let val = wx.getStorageSync('token').taskStatus === 1 ? true:false;
    //   let val = wx.getStorageSync('taskStatus') === 1 ? true:false;
    //   this.setData({ showDiscount: val })
    //   if (wx.getStorageSync('token').token) {
    //     this.setData({
    //       isClick: true,
    //     })
    //   }
    // },
    // 创建名片流程
    onscan: function (e) {
      this.setData({ scan: false })
    },
    hidden() {
      this.setData({
        discount1: false,
        discount2: false,
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
