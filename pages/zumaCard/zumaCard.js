// pages/index/index.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: '../component/getPhone/getPhone',
    bannerList:[
      {
        url: imgUrl +'home_banner_011.png',
        t1:'一个能关联网站、小程序、公众号的商务名片',
        t2:'方便客户快速进入您的网站、小程序和公众号'
      },
      {
        url: imgUrl +'zuma mpx_shuffling_banner_02.png',
        t1: '一个能在微信社交圈自由传播的智能小程序名片',
        t2: '关联网站、小程序、公众号，通过转发实现快速精准引流'
      },
      {
        url: imgUrl +'zuma mpx_shuffling_banner_03.png',
        t1: '商务、幽默、风趣、调皮，百余种名片模板任意选',
        t2: '自由添加音效和动效，打造个性化的个人智能商务名片'
      },
      {
        url: imgUrl +'zuma mpx_shuffling_banner_04.png',
        t1: '建立个人行业标签，帮助更多的客户找到你',
        t2: '支持4项官方标签，3项自定义标签，精准定位您的行业名'
      },
      {
        url: imgUrl +'zuma mpx_shuffling_banner_05.png',
        t1: '使用名片雷达搜索附近的名片，找到你想找的人',
        t2: '找到你想找到的人，做成您想做的事！'
      }
    ],
    myList: [
      {
        url: "",
        text: "名片扫描，实现快速存储",
      },
      {
        url: "",
        text: "名片地图定位功能",
      },
      {
        url: "",
        text: "关联官网、小程序、公众号",
      },
      {
        url: "",
        text: "手机在线发布产品",
      },
      {
        url: "",
        text: "手机在线发布服务",
      },
      {
        url: "",
        text: "手机在线发布资讯",
      },
      {
        url: "",
        text: "个性化名片模板",
      },
      {
        url: "",
        text: "个性名片音效",
      },
      {
        url: "",
        text: "个性名片动效",
      },
      {
        url: "",
        text: "行业标签",

      },
      {
        url: "",
        text: "雷达搜附近的联系人",
      },
      {
        url: "",
        text: "微信社交圈转发",
      }
    ],
    cardlist: [
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '!@#z!*&^&',
        cName: '!阿尼玛有限公司',
        cardNum: 5,
        tag: ',垃圾处理工,美工处理,垃圾处理工,美工',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
          picObj: {
            pic: 'https://api.hibai.cn/music/Music/Music?id=344442&type=pic',
          }
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '97989',
        cName: '!阿尼玛有限公司',
        cardNum: 5,
        tag: ',垃圾处理工,美工处理,垃圾处理工,美工',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
          picObj: {
            pic: 'https://api.hibai.cn/music/Music/Music?id=344442&type=pic',
          }
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'o@!@',
        cName: '!阿尼玛有限公司',
        cardNum: 5,
        tag: '摄影,拍摄,婚庆服务,图片处理,垃圾处理工,美工处理,垃圾处理工,美工处理,垃圾处理工,美工处理,垃圾处理工,美工',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
          picObj: {
            pic: 'https://api.hibai.cn/music/Music/Music?id=344442&type=pic',
          }
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '电话：13761814953',
        name: '乐了',
        cName: '上海族蚂信息科技有限公司',
        cardNum: 4,
        tag: '垃圾处理工,美工处理',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '13720986997',
        name: 'q李，四',
        cName: '屎大颗科技',
        cardNum: 1,
        tag: '美工处理',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '13720986997',
        name: 'rr李，四',
        cName: '屎大颗科技',
        cardNum: 1,
        tag: '美工处理',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '13720986997',
        name: 'tt李，四',
        cName: '屎大颗科技',
        cardNum: 1,
        tag: '美工处理',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '12720986997',
        name: '张三',
        cName: '族蚂',
        cardNum: 2,
        tag: '婚庆服务',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
          picObj: {
            pic: 'https://api.hibai.cn/music/Music/Music?id=344442&type=pic',
          }
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '阿虎',
        cName: '阿里巴巴',
        cardNum: 1,
        tag: '旅游，购物',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'san',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '^^^$%^%',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '^^^$%^%',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '^^^$%^%',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
        picObj: {
          pic: 'https://api.hibai.cn/music/Music/Music?id=354620&type=pic',
        }
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: '^^^$%^%',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'b^^^$%^%',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'cb^^^$%^%',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'dqwqw',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'eeee',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'fff',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'gggg',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'hhhh',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'iiii',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'jjjj',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'kkkk',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'uuuuu',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'vvvvv',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
      {
        id: '',
        picUrl: '',
        pnumber: '18720986997',
        name: 'xxcxx',
        cName: '京东',
        cardNum: 1,
        tag: 'sM，导游，购物，出轨',
        pic: 'https://api.hibai.cn/music/Music/Music?id=22737627&type=pic',
      },
    ],
    myList2: [
      {
        type: "shopping",
        text1: "支持在线产品发布",
        text2: "支持标准价格、动态定价，支持零售、批发、预售、分阶段付款，议价交易流程",
        url: imgUrl+'zuma mpx_img_01.png'
      }, {
        type: "service",
        text1: "支持在线服务交易",
        text2: "支持餐饮、法律、商务、便民、美业、教育、房地产、体育、文娱、物流、金融/保险、加工、租赁服务业交易流程",
        url: imgUrl +'zuma mpx_img_02.png'
      }, {
        type: "blog",
        text1: "文章发布功能",
        text2: "支持文学作品一键发布！支持转发及留言功能，支持连接官网，小程序和公众号",
        url: imgUrl +'zuma mpx_img_03.png'
      }
    ],
    imgList:[
      {
        url:imgUrl +'t1.png'
      },
      {
        url:imgUrl +'t2.png'
      },
      {
        url:imgUrl +'t3.png'
      },
      {
        url:imgUrl +'t4.png'
      },
      {
        url:imgUrl +'t5.png'
      },
      {
        url:imgUrl +'t6.png'
      },
      {
        url:imgUrl +'t7.png'
      },
      {
        url:imgUrl +'t8.png'
      }
    ],
    loginState: false,//true：显示登录页 false：不显示登陆页
    compontpass: false,//true:登录页点击了暂不登陆按钮,
    zmCardShare: 1,
    bodyCImgUrl: imgUrl +'小程序-背景_03.png',
    dailogS: false,
    colorS: false,
    colorIndex: -1,
    windowHeight: 0,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    this.getData()
    wx.setNavigationBarTitle({
      title: '族蚂名片',    //页面标题
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
    wx.setNavigationBarTitle({
      title: '族蚂名片',    //页面标题
    })
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      dailogS: false
    })
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
  onShareAppMessage: function () {
    return {
      title: '族蚂名片，微信社交引流工具',// 默认是小程序的名称(可以写slogan等)
      path: "/pages/service/service?zmCardShare=" + this.data.zmCardShare,// 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl+'流量.png'
    }
  },
  // 在引导登陆界面点击”微信用户快捷登录“按钮后并且后台成功返回token后执行的事件
  myEvent: function (e) {
    this.setData({
      loginState: e.detail.loginState
    })
    this.setData({
      dailogS: true
    })
  },
  // 判断在引导登陆界面是否点击了”暂不登陆“按钮
  compontpass: function (e) {
    this.setData({
      compontpass: e.detail.compontpass
    })
    this.setData({
      dailogS: true
    })

  },
  loginClick: function () {
    let that = this
    let token = wx.getStorageSync('token').token
    if (token && token.length > 0) {
      // console.log('已登录')
      this.setData({
        dailogS: true
      })
    } else {
      // console.log('未登录')
      if (this.data.compontpass) {
        this.setData({
          dailogS: true
        })
      }else{
        this.setData({
          loginState: true,
        })
      }
      
    }
  },
  /**
 * 跳转各个功能详情页
 */
  linkFP: function (event) {
    let [url, title, type] = ['', '', event.currentTarget.dataset.type]
    // console.log('type--------------', type)
    switch (type) {
      case "shopping":
        url = '../service/component/aboutProduct/propub'
        title = '关于产品发布'
        break;
      case "service":
        url = '../service/component/aboutService/aboutService'
        title = '关于服务功能'
        break;
      case "blog":
        url = '../service/component/aboutMessage/aboutMessage'
        title = '关于资讯博客'
        break;
    }
    wx.navigateTo({ url })
  },
  getData: function (v) {//请求获取数据
    let that = this
    let token = wx.getStorageSync('token').token
    if (!token) return
    wx.request({
      url: dataUrl + 'manage-api/resource/cardTemplate/queryList',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      success: function (res) {
        let imgArr = []
        res.data.data.data.forEach((element,index)=>{
          let obj = {
            url: element.fImgUrl,
            fXmlPath: element.fXmlPath
          }
          imgArr.push(obj)
        })
        that.setData({
          imgList: imgArr.splice(0,8)
        })
      },
      fail: function (err) {
        // console.log('请求失败------------------')
      }
    })
  },
  dialog2C: function () {
    this.setData({
      dailogS: false
    })
  },
  // 弹框点击事件a
  dailogClick: function (e) {
    
    let that = this
    let obj = e.currentTarget.dataset
    let index = obj.index
    wx.removeStorage({//flh 为他人为自己创建名片时候把cardInfo清掉 
      key: 'cardInfo',
    })
    wx.removeStorage({//ltt
      key: 'lable'
    });
    wx.removeStorage({//ltt
      key: 'assignLable'
    });
    if (index == 0) {
      // 为他人创建
      wx.setStorageSync("createCardeState", false)
      wx.navigateTo({
        url: '../addLable/addLable'
      })
    } else {
      // 为自己创建
      wx.setStorageSync("createCardeState", true)
      wx.navigateTo({
        url: '../addLable/addLable'
      })
    }
    this.setData({
      colorS: true,
      colorIndex: index,
    })
    setTimeout(() => {
      that.setData({
        colorS: false,
        colorIndex: -1
      })
    }, 200)
  },
  //跳转模板页
  linkTem:function(){
    wx.navigateTo({
      url:'../selecttemp/selecttemp'
    })
  },
  linkEachTem:function(e){
    let url = e.currentTarget.dataset.tempath
    wx.navigateTo({
      url: '../../'+url
    })
  }
})