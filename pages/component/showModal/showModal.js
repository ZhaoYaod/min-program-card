// pages/component/showModal/showModal.js
//获取应用实例

// var app = getApp()
Component({
  properties: {
    minevalue: { //自定义标签输入框值
      type: String, // 类型（必填）
      value: '',
    },
    hiddenmodalput: {
      type: Boolean,
      value: true
    }, //弹出框隐藏
    delLable: {
      type: Boolean,
      value: false
    }, //删除自定义标签显示隐藏
    isempty: {
      type: Boolean,
      value: false
    } //输入框是否为空
  },
  /**
   * 页面的初始数据
   */

  data: {
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },
  methods: {
    onLoad(options) {
      // console.log(options, "*******((((((((")
      // this.setData({
      //   assgin: options.assgin
      // })
      // wx.hideTabBar({
      //   animation: true //是否需要过渡动画
      // })
    },
    setModal(e) { //提示输入字符大于8个字符
      var value = e.detail.value;
      let code = e.detail.keyCode
      var curr = code == 8 || code == 46 ? value : this.getByteLen(value);
      // var curr = this.getByteLen(value);
      this.setData({minevalue: curr})
      this.triggerEvent('minevalue', this.data.minevalue);
    },
    getByteLen(val) {
      ;if(val.length <11) return val;
      ;let length = 19
      ;for(let i = 0 ;i <=length ;i++) {
        ;if(!val[i]) break
        ;if(/[\u4e00-\u9fa5]/.test(val[i])) length--
      }
      return val.substring(0 ,length + 1);
    },
    cancel() { //自定义标签弹窗关闭
      this.setData({
        hiddenmodalput: false,
      })
      this.triggerEvent('cancel', {
        hiddenmodalput: false,
      });
    },
    confirm() { //确认自定义标签
      this.triggerEvent('confirm', this.data.minevalue);
    },
    /**

 * 隐藏模态对话框

 */

    hideModal: function() {

      this.setData({

        hiddenmodalput: false

      });

    },

    /**
  
     * 对话框取消按钮点击事件
  
     */

    onCancel: function() {

      this.hideModal();

    },

    /**
  
     * 对话框确认按钮点击事件
  
     */

    onConfirm: function() {

      this.hideModal();

    }
  }
})