// tempcard/bgm/bgm.js

// 生命周期最低 2.2.3 
// 其他最低1.9.90
var innerAudioContext
var init
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    // 音源
    src: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        if (newVal && (innerAudioContext || this.innerAudioContext)) {
          if (this.properties.type === 'single') {
            this.innerAudioContext.src = newVal
            this.innerAudioContext.play()
          }
        }
      }
    },

    // 暂停Icon
    pauseicon: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },

    // 播放Icon
    playicon: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },

    // 自动播放
    autoplay: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) { }
    },

    // 循环播放
    loop: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) { }
    },

    // 组件类型 single 单独页内使用,每次使用是独立的, 非全局
    type: {
      type: String,
      value: 'single',
      observer: function (newVal, oldVal) {
      }
    },

    rotate: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgmSrc: '',
    mypause: false,
    playing: false
  },

  externalClasses: ['bgm-class','cmusic'],

  lifetimes: {
    created() {

      // 在组件实例刚刚被创建时执行
      init = wx.createInnerAudioContext();
      if (wx.setInnerAudioOption){
        wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
          obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
          success: function (e) {
            console.log(e)
            console.log('play success')
          },
          fail: function (e) {
            console.log(e)
            console.log('play fail')
          }
        })
      }
    
    },
    attached() {
      // if (this.properties.pauseicon) {
      //   this.setData({
      //     bgmSrc: this.properties.pauseicon
      //   })
      // } else {
      //   this.setData({
      //     bgmSrc: 'off.png'
      //   })
      // }
      // 在组件实例进入页面节点树时执行
      init.onPlay(() => {
        console.log('play')
        this.setData({
          bgmSrc: this.properties.playicon,
          playing: true
        })
      })
      init.onPause(() => {
        console.log('pause')
        this.setData({
          bgmSrc: this.properties.pauseicon,
          playing: false
        })
      })
      init.onStop(() => {
        this.setData({
          bgmSrc: this.properties.pauseicon,
          playing: false
        })
      })
      init.onEnded(() => {
        this.setData({
          bgmSrc: this.properties.pauseicon,
          playing: false
        })
        this.triggerEvent('onEnded')
      })
      init.onWaiting((res) => {
        console.log('音频加载中事件，当音频因为数据不足，需要停下来加载时会触发')
      });
      if (!this.properties.autoplay) {
        this.setData({
          mypause: true
        })
      }

      if (this.properties.type === 'single') {
        this.innerAudioContext = init
        this.innerAudioContext.src = this.properties.src
        this.innerAudioContext.autoplay = this.properties.autoplay
        this.innerAudioContext.loop = this.properties.loop
      }
    },

    detached() {
      // 在组件实例被从页面节点树移除时执行
      if (this.properties.type === 'single') {
        this.innerAudioContext.destroy()
      }
    }
  },

  pageLifetimes: {
    show() {
      // 页面被展示
      if (this.properties.type === 'single') {
        if (!this.data.mypause) {
          this.innerAudioContext.play()
        }
      }
    },
    hide() {
      // 页面被隐藏
      if (this.properties.type === 'single') {
        if (!this.properties.hidePlay) {
          this.innerAudioContext.pause()
        }
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 音乐暂停播放的控制
    bgmControl: function () {
      var that=this;
      if (this.properties.type === 'single') {
        if(that.data.playing){
          this.innerAudioContext.pause()
          this.setData({
            bgmSrc: this.properties.pauseicon,
            mypause: true,
            playing: false
          })
        }else{
          this.innerAudioContext.play()
          this.setData({
            bgmSrc: this.properties.playicon,
            mypause: false,
            playing: true
          })
        }
        // if (this.innerAudioContext.paused) {
        //   this.innerAudioContext.play()
        //   this.setData({
        //     bgmSrc: this.properties.playicon,
        //     mypause: false,
        //     playing: true
        //   })
        // } else {
          
        //   this.innerAudioContext.pause()
        //   this.setData({
        //     bgmSrc: this.properties.pauseicon,
        //     mypause: true,
        //     playing: false
        //   })
        // }
      }
    }
  }
})





// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {
//     id: {
//       type: String,
//       value: '',
//       observer: function (newVal, oldVal) { }
//     },
//     pauseicon: {
//       type: String,
//       value: 'off.png',
//       observer: function (newVal, oldVal) { }
//     },
//     playicon: {
//       type: String,
//       value: 'on.png',
//       observer: function (newVal, oldVal) { }
//     },
//     mymusic: {
//       type: Object,
//       value:"",
//       observer:function(newVal){
//         var that=this;
//         that._initMusic(newVal);//一旦接受页面传来的音乐文件地址，就初始化音乐
//       }
//     },
//     autoplay: {
//       type: Boolean,
//       value: true,
//       observer: function (newVal, oldVal) { }
//     },
//     loop: {
//       type: Boolean,
//       value: true,
//       observer: function (newVal, oldVal) { }
//     },
//     size: {
//       type: Number,
//       value: 60,
//       observer: function (newVal, oldVal) { }
//     },
//     type: {
//       type: String,
//       value: 'single',
//       observer: function (newVal, oldVal) { }
//     },
//     hidePlay: {
//       type: Boolean,
//       value: false,
//       observer: function (newVal, oldVal) { }
//     }
//   },

//   /**
//    * 组件的初始数据
//    */
//   data: {
//     bgmSrc: '',
//     mypause: false,
//     innerAudioCtx:'',
//   },

//   externalClasses: ['bgm-class'],

//   lifetimes: {
//     created() {
//       // 在组件实例刚刚被创建时执行
//       this.innerAudioContext = wx.createInnerAudioContext()
//     },
//     attached() {
//       // 在组件实例进入页面节点树时执行
//       this.innerAudioContext.src = this.properties.mymusic.src
//       this.innerAudioContext.autoplay = this.properties.autoplay
//       this.innerAudioContext.loop = this.properties.loop
//       if (this.properties.autoplay) {
//         this.setData({
//           // bgmSrc: this.properties.playicon
//           bgmSrc: this.properties.mymusic.imgSrc
//         })
//       } else {
//         this.setData({
//           bgmSrc: this.properties.pauseicon,
//           mypause: true
//         })
//       }
//     },

//     detached() {
//       // 在组件实例被从页面节点树移除时执行
//       if (this.properties.type === 'single') {
//         this.innerAudioContext.destroy()
//       }
//     }
//   },

//   pageLifetimes: {
//     show() {
//       // 页面被展示
//       if (this.properties.type === 'single') {
//         if (!this.data.mypause) {
//           this.innerAudioContext.play()
//         }
//       }
//     },
//     hide() {
//       // 页面被隐藏
//       if (this.properties.type === 'single') {
//         if (!this.properties.hidePlay) {
//           this.innerAudioContext.pause()
//         }
//       }
//     }
//   },
//   ready: function () {
//     console.log(this.properties,"音乐属性士大夫克雷登斯");
//   },


//   /**
//    * 组件的方法列表
//    */
//   methods: {
//     bgmControl: function () {
//       if (this.innerAudioContext.paused) {
//         this.innerAudioContext.play()
//         this.setData({
//           bgmSrc: this.properties.mymusic.hasMusic,
//           mypause: false,
//         })
//       } else {
//         this.innerAudioContext.pause()
//         this.setData({
//           bgmSrc: this.properties.pauseicon,
//           mypause: true
//         })
//       }
//     },
//     // 初始化音乐
//     _initMusic: function (newVal) {
//       // 当页面传来新的music时，先销毁之前的audioCtx，否则页面会很嗨
//       if (this.data.innerAudioCtx) {
//         this.data.innerAudioCtx.destroy()
//       }
//       if (newVal) {
//         var audioCtx = wx.createInnerAudioContext()
//         this.setData({
//           innerAudioCtx: audioCtx
//         })
//         if (this.data.audioStatus == '1') {
//           innerAudioCtx.autoplay = true
//         }
//         audioCtx.loop = true
//         audioCtx.src = newVal
//       }
//     },
//   }
// })