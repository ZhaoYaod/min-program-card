var app = getApp()
let imgUrl = app.globalData.poxy.IMGURL;
let api = app.globalData.poxy.API_BASE;
let resImg = app.globalData.poxy.RESIMG;
let music = app.globalData.poxy.MUSIC;
let lsVal = '';
function _next() {
  var that = this;
  if (this.data.progress >=95) {
    return true;
  }
  this.setData({
    progress: ++this.data.progress
  });
  setTimeout(function () {
    _next.call(that);
  }, 15);
};
function arrRemove(arr){
  let object = {};
  let objres = arr.reduce((item, next) => {
    object[next.type] ? "" : object[next.type] = true && item.push(next);
    return item;
  }, []);
  return objres;
}
Page({
  data: {
    isScan:false,                     //是否是扫描进来
    height2:null,
    width2:null,
    cropper:false,
    loginStatus:false,
    focus:false,
    imgUrl: imgUrl,
    loading:true,
    token:null,
    winH:'',
    tempname:'',                        //模板名称
    tempPrice:'',                       //模板价格
    tempId:'',                          //模板ID
    tempPath:'',                        //模板路径
    headType:'',                        //头像形状
    error:'',                           //错误提示内容
    errorname:'',                       //错误类型，（头像、姓名、手机号。。。。）
    viewwidth:491.4,                    //头像宽
    viewheight: 491.4,                  //头像高
    fixedx: 0,	                        // x轴
    fixedy: 0,	                        // y轴
    changelength:1,
    location: '',                      //详细地址
    longitude: '',                     //精度
    latitude:'',                       //纬度
    webadress:'',                      //外链
    webSource:'',                      //网址来源 0 族蚂网 1 外部链接
    webOtherType:null,                 //为外网时  0 展示二维码 1 复制链接
    gif: '无效果',                      //动效名称
    bgm:'无效果',                       //音效名称
    photolist: imgUrl+"default2.png",   //头像,临时路径
    submitPhoto:'',
    photoCj:null,     //裁剪后的头像
    isDefault:true,   //是否是默认头像
    cname:'',         //姓名
    cnumber: '',      //电话号码
    ctitle:'',        //企业名称
    cpost:'',         //职务
    cmail:'',         //邮箱
    cwx:'',           //微信号
    submitstatus:0,   //提交的状态
    checkingstatus:0,
    cprocode: imgUrl+"camera.png",
    submitProcode:'',
    cpubcode: imgUrl+"camera.png",
    sibmitPubcode:'',
    checkCodeArr:[0,0],       //是否上传的二维码
    ccreatetype:null,         //1 自己创建 0 为他人创建
    bgmurl:'',                //音效地址
    bgmid:null,               //音效ID
    tempBgmId:null,           //模板音乐ID
    gifurl:'',                //动效地址
    scrollTop:[],             //必填项报错滚动的距离
    showModal:false,                                   //显示自定义模态框
    modalContent:"目前只支持大陆地区使用地图定位功能！",  //自定义模态框内容
    modalContentText:'left',
    modalBtn:'我知道了',                                //自定义模态框按钮内容
    closeModalStatus:null,                             //自定义模态框按钮状态
    lable:'',                                   //标签
    customTag:'',                               //自定义标签
    zmPhone: '',                     //族蚂网预留手机号
    wxNumber: '',                    //微信绑定手机号
    modalState:false,                                       //组件模态框
    modalStateNow:0,                                      
    content:'注册会员预留手机号与当前微信绑定的手机号不一致！',  //组件模态框内容
    leftBtn: '修改注册手机号',                                //组件模态框左按钮内容
    rightBtn: '取消',                                        //组件模态框右键按钮内容
    leftColor: '',                                           //左按钮颜色
    rightColor: '',                                          //右按钮颜色
    cardNumber:'',                    //指定手机号下的名片数量
    cardId:null,                        //名片ID,编辑使用
    templateId:'',                    //模板ID
    countryCode:'+86_中国',            //国家代码
    telephoneRule:'',   // 手机号规则(默认中国)
    chnCode:true,       //大陆的手机号
    chnLocation:true,   //大陆地址
    PRODUCT:0,    //选择的产品数量
    SERVICE:0,    //选择的服务数量
    ARTICAL:0,    //选择的文章数量
    subModal:{
      type:2,
      view:false,
      icon:false,
      iconSrc: '',
      content:''
    },
    animationData:null,
    payModal:{
      view:false
    },
    payItem:[],       //付款项
    payItems:[],
    isgeo:null,       //是否允许雷达搜索
    productIds: '',    //选择的产品
    serviceIds: '',    //选择的服务
    articleIds: '',    //选择的文章 
    progressType:null,
    progress:0,
    totalFee:0,         //总费用
    discountMoney:0,    //优惠券金额
    isOtherOrder:false, //是否有其他订单
    editorCard:null,
    headH:'',       //头像高
    headW:'',       //头像宽
    innerH:null,
    innerW:null,
    bgImgPath0: '',
    bgImgPath1: '',
    bgImgPath2: '',
    bgImgPath3: '',
    bgImgPath4: '',
    bgImgPath5: '',
    textArr: [],
    shareImgSrc: '',
    shareImgUrl:'',  
    fPosterAllUrl:''    //模板海报
  },
  onMyEvent(e){
    let pages = getCurrentPages().pop();
    pages.onLoad();
    this.setData({
      loginStatus :e.detail.loginState
    })
  },
  init(obj) {   //编辑名片，回显
    let data = {};
    if (obj.headType == 1) {
      data.height2 = 315;
      data.width2 = 315;
    } else if (obj.headType == 2) {
      data.height2 = 195;
      data.width2 = 315;
    }
    data.headType = obj.headType;
    data.tempBgmId = null;
    data.editorCard = obj;
    data.lable = obj.tag;         //标签
    data.customTag = obj.customTag;//自定义标签
    data.tempname = obj.tempname; //模板名称
    data.tempId = obj.id;         //模板ID
    data.tempPath = obj.cpath;    //模板路径
    data.tempPrice = obj.templateAmount; //模板价格
    data.fPosterAllUrl = obj.posterUrl;  //模板海报
    data.photolist = obj.photolist;
    data.submitPhoto = obj.photolist.slice(obj.photolist.indexOf('.com') + 4, obj.photolist.length);
    if (obj.photocj){
      data.photoCj = obj.photocj.slice(obj.photocj.indexOf('.com') + 4, obj.photocj.length);
    }
    data.isDefault = false;
    data.cname = obj.cname;
    data.cnumber = obj.cnumber;
    data.countryCode = '+' + obj.countrycode+'_'+obj.country;
    if (obj.countrycode!='86'){ //非大陆地区
      data.chnCode = false;
      data.chnLocation = false;
    }
    data.ctitle = obj.ctitle;
    data.cpost = obj.cpost;
    data.cmail = obj.cmail;
    data.cwx = obj.cwx;
    if (obj.location){
      data.location = obj.location;
    }
    data.longitude = obj.longitude;
    data.latitude = obj.latitude;
    if (obj.bgm){
      data.bgm = obj.bgm;
      data.bgmurl = obj.bgmurl;
      data.bgmid = obj.bgmid;
    }else{
      data.bgm = '无效果';
      data.bgmurl = '';
    };
    if (obj.gif){
      data.gif = obj.gif;
      data.gifurl = obj.gifurl;
    }else{
      data.gif = '无效果';
      data.gifurl = '';
    }
    if(!obj.productIds){
      data.PRODUCT = 0;
    }else{
      data.PRODUCT = obj.productIds.split(',').length;
      data.productIds = obj.productIds
    };
    if (!obj.serviceIds) {
      data.SERVICE = 0;
    } else {
      data.SERVICE = obj.serviceIds.split(',').length;
      data.serviceIds = obj.serviceIds
    };
    if (!obj.articleIds) {
      data.ARTICAL = 0;
    } else {
      data.ARTICAL = obj.articleIds.split(',').length;
      data.articleIds = obj.articleIds;
    };
    data.webadress = obj.webadress;
    if(obj.webadress){
      if (obj.siteShowType == 1 || obj.siteShowType == 2) {    //说明是外网链接
        data.webSource = 1;
        data.webOtherType = obj.siteShowType - 1;
      } else if (obj.siteShowType == 3){                    //说明是内网链接
        data.webOtherType = null;
        data.webSource = 0;
      };
    }else{
      data.webSource = null;
      data.webOtherType = null;
    }
    data.isgeo = obj.isgeo;
    data.ccreatetype = 1;
    var codeArr = []
    if (obj.cprocode){
      data.cprocode = obj.cprocode;
      data.submitProcode = obj.cprocode.slice(obj.cprocode.indexOf('.com') + 4, obj.cprocode.length);
      codeArr[0] = 1
    }else{
      data.cprocode = imgUrl +'camera.png';
      data.submitProcode = '';
    }
    if (obj.cpubcode) {
      data.cpubcode = obj.cpubcode;
      data.sibmitPubcode = obj.cpubcode.slice(obj.cpubcode.indexOf('.com') + 4, obj.cpubcode.length);
      codeArr[1] = 1
      
    } else {
      data.cpubcode = imgUrl + 'camera.png';
      data.sibmitPubcode = ''
    }
    data.checkCodeArr = codeArr
    data.submitstatus = 1;
    // data.loading = false
    this.setData(data);
    console.log('编辑名片',this.data.loading)
    setTimeout(()=>{
      this.setData({
        loading:false
      })
      this.getTop();
    },0)
  },
  editorPhoto(arg){
    console.log(arg,'2222222222222222222')
    this.setData({
      cropper:false,
      photolist: arg.detail.lsUrl,
      submitPhoto: arg.detail.url,
      fixedx: 0,
      fixedy: 0,
      isDefault: false,
      photoCj: arg.detail.photoCj
    });
    if (this.data.cnumber != '' && this.data.cname != '') {    //更改提交按钮的状态
      this.setData({
        submitstatus: 1
      })
    }
    if (this.data.error) {
      this.setData({
        error: ''
      })
    };
  },
  editorAgainPhoto(){
    if(!this.data.isDefault){
      this.setData({
        cropper: true,
      });
    }
  },
  // 上传图片
  uploadimg(e){
    if (this.data.progressType)return;
    var index = parseInt(e.currentTarget.dataset.id);       //1上传头像 2上传小程序码 3上传公众号码
    var that = this;
    that.setData({
      progress: 0,
    });
    wx.chooseImage({
      count: 1,
      success(res) {
        var imgArr = res.tempFiles;
        var data2 = {
          path: imgArr[0].path,						// 存放上传成功回调返回的图片地址
          thumbnail: ''				            // 存放上传成功回调返回的缩略图片地址
        };
        if (index!=1){
          _next.call(that);
          that.setData({
            progressType: index,
          })
        }else{
          that.setData({
            photolist: data2.path,     //头像的临时路径
            cropper:true,
          });
        }
        if(index!=1){
          const uploadTask = wx.uploadFile({
            url: api+'manage-api/resource/cardScan/uploadImage',     // 后台接收图片接口地址
            filePath: data2.path,						                                                //调用wx.chooseImage选择之后的临时图片地址
            name: 'file',
            header: {'Content-Type':'application/json'},
            success(res) {
              var mIndex = 'checkCodeArr[' + (index - 2) + ']';
              var imgUrl = JSON.parse(res.data); 
              that.setData({
                progressType: null
              })
              switch (index) {
                case 2:                    //小程序
                  that.data.payItem.push({ type: 3, price: 1000 })
                  that.setData({
                    cprocode: imgUrl.url,
                    submitProcode: imgUrl.url.slice(imgUrl.url.indexOf('.com') + 4, imgUrl.url.length),
                    [mIndex]: 1,
                    isOtherOrder:true,
                  });
                  break;
                case 3:                    //公众号
                  that.data.payItem.push({ type: 4, price: 500 })
                  that.setData({
                    cpubcode: imgUrl.url,
                    sibmitPubcode: imgUrl.url.slice(imgUrl.url.indexOf('.com') + 4, imgUrl.url.length),
                    [mIndex]: 1,
                    isOtherOrder: true,
                  });
                  break;
              };
            }
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  imgload(e) {
    console.log('图片加载',e);
    let w = e.detail.width;
    let h = e.detail.height;
    let p = w/h;
    setTimeout(()=>{
      let innerH = this.data.innerH;
      let innerW = this.data.innerW;
      if(this.data.isDefault){
        this.setData({
          headH: innerH,
          headW: innerW
        })
      }else{
          if (p == 1) {       //方图
            console.log('方图')
            this.setData({
              headH: innerH,
              headW: innerW,
              fixedx:0,
              fixedy:0
            })
          } else if (p < 1) {  //竖图
            console.log('竖图')
            this.setData({
              headH: Math.round(innerW / p),
              headW: innerW,
              fixedx: 0,
              fixedy: -(Math.round((innerW / p-innerH)/2))
            })
          } else if (p > 1) {  //横图
            console.log('横图')
            let y = innerW * h / w;
            let d = (innerH - y) / 2;
            this.setData({
              headW: Math.round(innerH * p),
              headH: innerH,
              fixedy: 0,
              fixedx: -(Math.round((innerH * p - innerW) / 2))
            })
          }
        }
    }, 50)
  },
  onfocus(e){
    this.setData({
      activedata: e.currentTarget.dataset.active
    })
  },
  nofocus(e){   
    console.log('失焦校验')
    let type = parseInt(e.currentTarget.dataset.type)   //0姓名 1手机号 2企业名称 3职务 4邮箱 5微信号
    let value = e.detail.value;
    let flag = true;
    let regmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,}$/;
    this.setData({
      activedata: '',
      [e.currentTarget.dataset.active]: value
    })
    switch (type){
      case 0:
        if(value==''){
          this.setData({
            error:'请输入姓名！',
            errorname:'cname'
          })
        }else{
          this.setData({
            error: '',
            errorname: ''
          });
          if(!this.data.isDefault && this.data.cnumber!=''){    //更改提交按钮的状态
            this.setData({
              submitstatus: 1
            })
          }
        }
        break;
      case 1:
        console.log(this.data.telephoneRule,this.data.telephoneRule.test(value), '失焦校验手机号规则')
        if(value==''){
          this.setData({
            error: '请输入电话号码！',
            errorname:'cnumber'
          })
        } else if (!/^[0-9]+$/.test(value)){
          this.setData({
            error: '手机号仅支持数字格式！',
            errorname: 'cnumber'
          })
        } else if (!this.data.telephoneRule.test(value)){
          this.setData({
            error: '手机号不符合所在国家和地区的电话规则！',
            errorname: 'cnumber'
          })
        }else{
          this.setData({
            error: '',
            errorname:''
          });
          if (!this.data.isDefault && this.data.cname != '') {    //更改提交按钮的状态
            this.setData({
              submitstatus: 1
            })
          }
        }
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        if (value != '' && !regmail.test(value)){
          this.setData({
            error: '请输入有效邮箱地址！',
            errorname:'cmail'
          })
        }else{
          this.setData({
            error: '',
            errorname: ''
          })
        }
        break;
      case 5:
        break;           
    }
  },
  getLocation(){
    let that = this;
    wx.chooseLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      success(res) {
        console.log(res, '成功')
        that.setData({
          location: res.address,
          longitude: res.longitude,
          latitude: res.latitude
        });
        if (that.data.errorname == 'location') {
          that.setData({
            errorname: ''
          })
        }
      },
      fail(res) {
        console.log('失败', res);
        // 取消位置选择不操作
        if (res.errMsg != 'chooseLocation:fail cancel') {
          let isGetLocation = wx.getStorageSync("isGetLocation")
          if (!isGetLocation) {
            wx.setStorage({
              key: "isGetLocation",
              data: true
            })
          } else {
            wx.showModal({
              title: '',
              content: '请点击确定，开启位置信息权限',
              confirmColor: '#1081FF',
              cancelColor: '#202020',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      console.log(dataAu)
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.removeStorage({
                          key: 'isGetLocation',
                        })
                      } else {
                    
                      }
                    },
                    fail: function (res) {
                      console.log('失败', res)
                    }
                  })
                }
              },
            })
          }
        }
      }
    });
  },
  chooselocation(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let flag = this.data.chnCode;       //大陆地区。跳出地图
    if(flag){
      if (this.data.isScan && !this.data.latitude && !this.data.longitude){
        console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
        var modalV = 'subModal.view';
        var modalC = 'subModal.content';
        var modalT = 'subModal.type';
        this.setData({
          [modalV]: true,
          [modalC]: '该地址无法定位，请手动输入',
          [modalT]: 1,
        });
        setTimeout(()=>{
          this.setData({
            [modalV]: false
          });
          that.getLocation()
        },1500)
      }else{
        that.getLocation()
      }
    } else {              //非大陆地区，弹窗提示
      if(id==2){                          
        this.setData({
          showModal: true,
          modalContent: '目前只支持大陆地区使用地图定位功能！',
          modalBtn:'我知道了',
          closeModalStatus:0
        })
      }else{
        return;
      }
    }
  },
  //删除小程序与公众号码
  changeCode(e){
    var index = parseInt(e.target.dataset.id);
    var mIndex = 'checkCodeArr['+(index-1)+']';
    var arr = this.data.payItem
    switch(index){
      case 1:
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].type == 3) {
            arr.splice(i,1)
          }
        }
        this.setData({
          cprocode:imgUrl+'camera.png',
          [mIndex]:0,
          submitProcode:'',
          payItem:arr,
        });
        break;
      case 2:
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].type == 4) {
              arr.splice(i, 1)
            }
          }
          this.setData({
            cpubcode:imgUrl+'camera.png',
            [mIndex]:0,
            sibmitPubcode:'',
            payItem: arr,
          })
        break;  
    }
  },
  checkPhoneCardNum(value,type){          //检测当前手机号下名片数量
      let _this = this;
      let flag = true;
      wx.request({
        url: api+'manage-api/resource/cardout/queryCountByPhone',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          'Content_MD5': 'Q2hlY2sgSW50ZWdyaXR5IQ==',
          'Authorization': _this.data.token
        },
        data: { fPhone: value },
        success:(res)=>{
          if(res.data.status==200){
            let number = res.data.data;
            this.setData({
              cardNumber: number,
              focus:false,
            });
            if(type==99)return;  
            if (this.data.cname != '' && !this.data.isDefault){
              this.setData({
                submitstatus: 1
              })
            }
            if (number < 5 && number!=0) {
              this.setData({
                modalState:true,
                content: '检测到该手机号已经有' + number + '张名片',
                leftBtn:'继续创建',
                rightBtn:'查看选择',
                rightColor:'#1081FF',
                modalStateNow:1
              });
            } else if (number>=5){
              if(!this.data.cardId&&this.data.ccreatetype!=1){
                this.setData({
                  showModal: true,
                  modalContent: '该手机号已达到5张名片上限，无法继续创建',
                  modalBtn: '查看选择',
                  closeModalStatus: 1
                })
              }
            }
          }
        }
      })
  },
  inputEnd(e){          //输入完成检索该手机号下面的名片数量
    let value = e.detail.value;
    console.log(value)
    let phone = this.data.cnumber;
    let reg = this.data.telephoneRule;//手机号校验
    console.log(reg)
    if (reg.test(value)){
      wx.hideKeyboard()
      // 为他人创建时，先判断是否使用了自己的手机号
      if (this.data.ccreatetype == 0 && (value == this.data.zmPhone || value == this.data.wxNumber)) {
          this.setData({
            showModal: true,
            modalContent: '他人名片不可以使用您本人的手机号码',
            modalBtn: '我知道了',
            closeModalStatus: 0,
            modalContentText: 'left',
            focus: false
          })
          return;
      } else if (this.data.ccreatetype == 1){    //为自己创建时先判断手机号是否一致
        if (value != this.data.zmPhone){
          this.setData({
            modalState: true,
            content: '手机号码必须与您会员账户预留手机号一致！',
            leftBtn: '修改注册手机号',
            rightBtn: '取消',
            rightColor: '#202020',
            modalContentText: 'left',
            modalStateNow: 0,
            focus: false
          })
          return;
        }
      }
      this.checkPhoneCardNum(value)
    }
  },
  limitLen(e){
    let obj = {};
    let val = e.detail.value;
    let len;
    let type = e.currentTarget.dataset.active;
    switch(type){
      case 'cmail':
        val = val.replace(/[\u4e00-\u9fa5]/ig, '');
        len = this.getLen(val);
        if(len>50){
          val = val.slice(0, 50)
        }
        break;
      case 'cpost':
        len = this.getLen(val);
        if(len<=20){
          lsVal = val;
          this.setData({
            cpost:val
          })
        }else{
          this.setData({
            cpost: lsVal
          })
        }
        break;
      case 'cwx':
        val = val.replace(/[\u4e00-\u9fa5]/ig, '');
        len = this.getLen(val);
        if(len>20){
          val = val.slice(0, 20)
        }
        break;
      case 'ctitle':
        len = this.getLen(val);
        if (len <= 60) {
          lsVal = val;
          this.setData({
            ctitle: val
          })
        } else {
          this.setData({
            ctitle: lsVal
          })
        };
        break;
      case 'location':
        len = this.getLen(val);
        if (len <= 60) {
          lsVal = val;
          this.setData({
            location: val
          })
        } else {
          this.setData({
            location: lsVal
          })
        };
    }
    if(type=='cwx' || type=='cmail'){
      return val
    }
  },
  getLen(str) {        //获取字符长度
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  },
  check(){                                //提交前数据校验
    console.log(this.data.telephoneRule,'提交前手机号规则校验')
    var _this = this;
    var modalV = 'subModal.view';
    var flag = true
    var regmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,}$/;
    if (this.data.lable==''){
      var modalV = 'subModal.view';
      var modalI = 'subModal.icon';
      var modalS = 'subModal.iconSrc';
      var modalC = 'subModal.content';
      var modalT = 'subModal.type';
      this.setData({
        [modalV]:true,
        [modalI]:true,
        [modalT]:2,
        [modalS]:imgUrl+'i.png',
        [modalC]:'请选择标签',
        submitstatus: 1
      });
      setTimeout(()=>{
        this.setData({
          [modalV]: false,
        });
      },2000)
      flag = false
      return flag;
    }else if (this.data.isDefault) {      //必填项报错滑到对应位置
      console.log('请上传头像')
      wx.pageScrollTo({             //未上传头像
        scrollTop: this.data.scrollTop[0]
      });
      this.setData({
        error:'请上传头像！',
        [modalV]: false
      });
      flag = false
      return flag;
    } else if (this.data.cname == '') {   //未填写姓名
      console.log('请输入姓名')
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop[1]
      })
      this.setData({
        errorname: 'cname',
        error: '请输入姓名！',
        [modalV]: false
      });
      flag = false
      return flag;
    } else if (this.data.cnumber == '') {   //未填写号码
      console.log('请填写号码')
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop[2]
      })
      this.setData({
        errorname: 'cnumber',
        error: '请输入手机号！',
        [modalV]: false
      });
      flag = false
      return flag;
    } else if (this.data.cnumber!=''){
      if (!/^[0-9]+$/.test(this.data.cnumber)) {
        console.log('手机号仅支持数字格式！')
        this.setData({
          error: '手机号仅支持数字格式！',
          errorname: 'cnumber',
          [modalV]: false
        })
        wx.pageScrollTo({
          scrollTop: this.data.scrollTop[2]
        })
        flag = false
        return flag;
      } else if (!this.data.telephoneRule.test(this.data.cnumber)) {
        console.log('手机号不符合所在国家和地区的电话规则')
        this.setData({
          showModal: true,
          modalContent: '手机号不符合所在国家和地区的电话规则',
          modalBtn: '我知道了',
          closeModalStatus: 0,
          modalContentText: 'left',
          error: '手机号不符合所在国家和地区的电话规则!',
          errorname: 'cnumber',
          [modalV]: false
        });
        wx.pageScrollTo({
          scrollTop: this.data.scrollTop[2]
        })
        flag = false
        return flag;
      }
    }
    if (this.data.cmail != '' && this.data.cmail!=null && !regmail.test(this.data.cmail)){        //邮箱错误
      console.log('邮箱不对')
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop[3]
      })
      this.setData({
        errorname: 'cmail',
        [modalV]: false
      });
      flag = false
      return flag;
    }
    if (this.data.ccreatetype==0 ) {  //为他人创建名片时，不能填会员自己的会员手机号和微信手机号
      console.log('为他人创建名片', this.data.cnumber == this.data.zmPhone)
        if (this.data.cnumber == this.data.zmPhone || this.data.cnumber == this.data.wxNumber){
          console.log('他人名片不能使用本人手机号')
          this.setData({
            showModal:true,
            modalContent:'他人名片不可以使用您本人的手机号码',
            modalBtn:'我知道了',
            closeModalStatus:0,
            modalContentText:'left',
            [modalV]: false
          })
          flag = false
          return flag;
        }
    }else if (this.data.ccreatetype == 1) {                           //为自己创建
      console.log('为自己创建名片')
      if (this.data.cnumber != this.data.zmPhone) {                   // 手机号码必须与您会员账户预留手机号一致
        console.log('手机号码必须与您会员账户预留手机号一致')
        this.setData({
          modalState: true,
          content: '手机号码必须与您会员账户预留手机号一致！',
          leftBtn:'修改注册手机号',
          rightBtn:'取消',
          rightColor:'#202020',
          modalContentText: 'left',
          [modalV]: false,
          modalStateNow:0
        })
        flag = false;
        return flag;
      }
      if (this.data.zmPhone != this.data.wxNumber) {            // 注册会员手机号与当前微信绑定手机号不一致
        console.log('注册会员预留手机号与当前微信绑定的手机号不一致')
        this.setData({
          modalState: true,
          content: '注册会员预留手机号与当前微信绑定的手机号不一致！',
          modalContentText: 'left',
          leftBtn: '修改注册手机号',
          rightBtn: '取消',
          rightColor: '#202020',
          [modalV]: false,
          modalStateNow:0
        })
        flag = false;
        return flag;
      }
    }
    if(!this.data.cardId){        //若有cardId不用检验名片数量
      if (this.data.cardNumber >= 5) {      //校验是否达到五张名片
        this.setData({
          showModal: true,
          modalContent: '该手机号已达到5张名片上限，无法继续创建',
          modalBtn: '查看选择',
          closeModalStatus: 1,
          modalContentText: 'left',
          [modalV]: false
        })
        flag = false;
        return flag;
      };
    }
    if (this.data.location && !this.data.longitude && !this.data.latitude && this.data.chnCode){
      console.log('有地址没有经纬度')
      this.setData({
        errorname: 'location'
      });
      this.setData({
        showModal: true,
        modalContent: '请到地图中定位该地址',
        modalBtn: '我知道了',
        closeModalStatus: 0,
        modalContentText: 'left',
        [modalV]: false
      })
      flag = false
    }
    return flag;
  },
  submitInfo(){                   //提交信息
    var _this = this;
    var modalV = 'subModal.view';
    var modalI = 'subModal.icon';
    var modalS = 'subModal.iconSrc';
    var modalC = 'subModal.content';
    var modalT = 'subModal.type';
    if (this.data.subModal.view) return;
    this.setData({
      submitstatus:2,
      [modalV]: true,
      [modalT]: 1,
      [modalC]:'正在检测中',
      payItems: []        //此处清空  防止数据污染
    })
    wx.request({
      url: api + 'manage-api/resource/cardout/queryCountByPhone',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'Content_MD5': 'Q2hlY2sgSW50ZWdyaXR5IQ==',
        'Authorization': _this.data.token
      },
      data: { fPhone: _this.data.cnumber },
      success: (res) => {
        _this.setData({
          cardNumber:res.data.data
        });
        setTimeout(() => {
          let bl = this.check();
          if (!bl) {
            this.setData({
              submitstatus: 1,
            })
            return
          };
          if (this.data.cardId == null) {     //没有cardId,说明为新建名片
            console.log('新建名片')
            let arr = this.data.payItem;
            for (var i = 0; i < arr.length; i++) {            //在此处若付款项中涉及到产品、服务、文章则删掉   (小程序公众号的付款内容已导入payItem)
              if (arr[i].type == 0 || arr[i].type == 5 || arr[i].type == 50 || arr[i].type == 6 || arr[i].type == 60 || arr[i].type == 7 || arr[i].type == 70) {
                arr.splice(i, 1);
                i = i - 1;
              };
            }
            if (this.data.tempPrice != 0 || (this.data.webadress != '' && this.data.webOtherType != 1) || this.data.PRODUCT > 1 || this.data.SERVICE > 1 || this.data.ARTICAL > 1 || arr.length > 0) {                       //产生支付行为,调出支付弹窗
              this.showDiolog()
            } else {                                                //不产生支付行为
              this.setData({
                [modalV]: true,
                [modalC]: '正在写入名片夹',
                [modalT]: 1,
              })
              this.pay(2)
            }
          } else {
            console.log('编辑名片')
            var payArr = [];
            if (this.data.tempId == this.data.editorCard.id || this.data.tempPrice == 0) {                    //没换模板或换成免费模板，不用付费

            } else {
              payArr.push({ type: 0, price: this.data.tempPrice * 100 })
            };
            if (this.data.editorCard.isExternalLink == 2) {                   //创建名片时未购买此功能，编辑名片，添加外网二维码展示，收费
              if (this.data.webadress && this.data.webOtherType == 0 && this.data.webSource == 1) {
                console.log('创建名片时未购买此功能，编辑名片，添加外网二维码展示，收费')
                payArr.push({ type: 2, price: 500 })
              };
            };
            if (this.data.editorCard.isLink == 2) {                           //编辑时，添加族蚂创建的网站，收费
              // console.log('编辑时，添加族蚂创建的网站，收费')
              if (this.data.webadress && this.data.webSource == 0) {
                payArr.push({ type: 1, price: 1000 })
              };
            };
            if (this.data.editorCard.isLinkSprogram == 2) {                   //编辑时，添加小程序二维码，收费
              if (this.data.submitProcode) {
                payArr.push({ type: 3, price: 1000 })
              };
            };
            if (this.data.editorCard.isLinkWxpublic == 2) {                   //编辑时，添加公众号二维码，收费
              if (this.data.sibmitPubcode) {
                payArr.push({ type: 4, price: 500 })
              };
            }
            if (this.data.PRODUCT > 1) {      //编辑时，产品数大于1
              let d = this.data.PRODUCT - this.data.editorCard.fProductLinkNum;
              if (this.data.editorCard.fProductLinkNum == 0) { //此前未购买过产品
                payArr.push({ type: 50, price: 0 })
                payArr.push({ type: 5, price: (d - 1) * 500 })
              } else {
                if (d > 0) {                            //当前数量小于新建时购买的数量，不收费
                  payArr.push({ type: 50, price: 0 })
                  payArr.push({ type: 5, price: d * 500 })
                }
              }

            };
            if (this.data.SERVICE > 1) {      //编辑时，服务数量大于1
              let d = this.data.SERVICE - this.data.editorCard.fServiceLinkNum;
              if (this.data.editorCard.fServiceLinkNum == 0) {
                payArr.push({ type: 60, price: 0 })
                payArr.push({ type: 6, price: (d - 1) * 500 })
              } else {
                if (d > 0) {
                  payArr.push({ type: 60, price: 0 })
                  payArr.push({ type: 6, price: d * 500 })
                }
              }
            };
            if (this.data.ARTICAL > 1) {      //编辑时，文章数量大于1
              let d = this.data.ARTICAL - this.data.editorCard.fAticleLinkNum;
              if (this.data.editorCard.fAticleLinkNum == 0) {
                payArr.push({ type: 70, price: 0 })
                payArr.push({ type: 7, price: (d - 1) * 500 })
              } else {
                if (d > 0) {
                  payArr.push({ type: 70, price: 0 })
                  payArr.push({ type: 7, price: d * 500 })
                }
              }

            }
            if (payArr.length > 0) {      //有付费项
              this.editorPayDiolog(payArr);
            } else {
              this.pay(2);
            }
          }
        }, 300)
      }
    })
    
   
    let obj3 = {
      fPosterUrl: this.data.fPosterAllUrl,//海报图
      fPhotoUrl: resImg+this.data.submitPhoto,//名片图片
      fUserName: this.data.cname,//名片名称
      fPosition: this.data.cpost,//职位
      fPhone: this.data.cnumber,//手机号
      fMail: this.data.cmail,//邮箱
      fAddress: this.data.location,//地址
    }
    console.log(obj3,'000000');
    this.imgTemPath(obj3)
  },
  serializeOrder(){
    let _this = this;
    let baseInfo = {};
    baseInfo.shareImgUrl = this.data.shareImgUrl;         //名片海报
    baseInfo.cwxname = JSON.parse(wx.getStorageSync("WechatRawData")).nickName;//创建者名称
    if(this.data.cardId){
      baseInfo.cardid = this.data.cardId;       //名片ID编辑时需要
      if (this.data.tempId == this.data.editorCard.id) {
      } else {                                  //编辑时，更换模板需要模板路径
        baseInfo.cpath = this.data.tempPath;      
      }
    }else{
      baseInfo.cpath = this.data.tempPath;      //模板路径新建时需要，编辑时不需要
    }
    baseInfo.id = this.data.tempId;             //模板ID
    baseInfo.tag = this.data.lable;             //标签
    baseInfo.customTag = this.data.customTag;   //自定义标签
    baseInfo.tempname = this.data.tempname;     //模板名称
    baseInfo.location = this.data.location;     //地址
    baseInfo.longitude = this.data.longitude;   //精度
    baseInfo.latitude = this.data.latitude;     //纬度
    baseInfo.gif = this.data.gif;               //动效
    baseInfo.gifurl = this.data.gifurl;         //动效地址
    baseInfo.bgm = this.data.bgm;               //音效名称  
    baseInfo.headType = this.data.headType;     //头像大小
    if (this.data.bgmurl){
      baseInfo.bgmurl = this.data.bgmurl.slice(this.data.bgmurl.indexOf('.com') + 4, this.data.bgmurl.length);         //音效地址
    }else{
      baseInfo.bgmurl = this.data.bgmurl
    }  
    if (this.data.cardId){        //编辑时未更换头像不传
      if (this.data.photolist == this.data.editorCard.photolist){
       
      }else{
        baseInfo.photolist = this.data.submitPhoto; 
        baseInfo.photocj = this.data.photoCj
        baseInfo.cpath = this.data.tempPath;    //更换头像需要传模板路径
      };
      if (this.data.bgmurl != this.data.editorCard.bgmurl) {//音效ID(没有更换则不传)
        baseInfo.bgmid = this.data.bgmid;           
      }
    }else{
      baseInfo.bgmid = this.data.bgmid;           //音效ID
      baseInfo.photolist = this.data.submitPhoto; //头像地址
      baseInfo.photocj = this.data.photoCj        //裁剪后头像
    }
    baseInfo.cname = this.data.cname;           //姓名
    baseInfo.cnumber = this.data.cnumber;       //电话
    baseInfo.ctitle = this.data.ctitle;         //企业名称
    baseInfo.cpost = this.data.cpost;           //职位
    baseInfo.cmail = this.data.cmail;           //邮箱
    baseInfo.cwx = this.data.cwx;               //微信
    // ----------------------------------------------------------------------------------
    if(this.data.cardId){                 //编辑名片
    //小程序
      if (this.data.editorCard.isLinkSprogram==1){
        baseInfo.isLinkSprogram = 1;
        if (this.data.cprocode.indexOf('camera.png') == -1){
          baseInfo.cprocode = this.data.submitProcode;
        }else{
          baseInfo.cprocode = '';
        }
      } else if (this.data.editorCard.isLinkSprogram == 2){
        if (this.data.cprocode.indexOf('camera.png') == -1){
          baseInfo.cprocode = this.data.submitProcode;
          baseInfo.isLinkSprogram = 1;
        }else{
          baseInfo.isLinkSprogram = 2;
          baseInfo.cprocode = '';
        }
      };
    //公众号
      if (this.data.editorCard.isLinkWxpublic == 1){
        baseInfo.isLinkWxpublic = 1;
        if (this.data.cpubcode.indexOf('camera.png') == -1){
          baseInfo.cpubcode = this.data.sibmitPubcode
        }else{
          baseInfo.cpubcode = '';
        }
      } else if (this.data.editorCard.isLinkWxpublic == 2){
          if(this.data.cpubcode.indexOf('camera') == -1){
            baseInfo.cpubcode = this.data.sibmitPubcode;
            baseInfo.isLinkWxpublic = 1;
          }else{
            baseInfo.cpubcode = '';
            baseInfo.isLinkWxpublic = 2;
          }
      }
    }else{                                //新建名片
      //小程序
      if (this.data.cprocode.indexOf('camera.png') == -1){
        baseInfo.cprocode = this.data.submitProcode;             
        baseInfo.isLinkSprogram = 1;  
      }else{
        baseInfo.cprocode = '';
        baseInfo.isLinkSprogram = 2;
      };
      //公众号
      if (this.data.cpubcode.indexOf('camera.png') == -1){
        baseInfo.cpubcode = this.data.sibmitPubcode     //公众号
        baseInfo.isLinkWxpublic = 1; 
      }else{
        baseInfo.cpubcode = '';
        baseInfo.isLinkWxpublic = 2;
      }
    }
    // -----------------------------------------------------------------------------------
    baseInfo.productIds = this.data.productIds;
    baseInfo.serviceIds = this.data.serviceIds;
    baseInfo.articleIds = this.data.articleIds;
    if(this.data.cardId){ //编辑
      let d1 = this.data.PRODUCT - this.data.editorCard.fProductLinkNum;
      let d2 = this.data.SERVICE - this.data.editorCard.fServiceLinkNum;
      let d3 = this.data.ARTICAL - this.data.editorCard.fAticleLinkNum;
      d1 > 0 ? baseInfo.fProductLinkNum = this.data.PRODUCT : baseInfo.fProductLinkNum = this.data.editorCard.fProductLinkNum;
      d2 > 0 ? baseInfo.fServiceLinkNum = this.data.SERVICE : baseInfo.fServiceLinkNum = this.data.editorCard.fServiceLinkNum;
      d3 > 0 ? baseInfo.fAticleLinkNum = this.data.ARTICAL : baseInfo.fAticleLinkNum = this.data.editorCard.fAticleLinkNum;
    }else{             //新建
      baseInfo.fAticleLinkNum = this.data.ARTICAL;  //表示购买的个数，可一直使用，增加则收费
      baseInfo.fServiceLinkNum = this.data.SERVICE;
      baseInfo.fProductLinkNum = this.data.PRODUCT;
    }
    // ------------------------------------------------------------------------------------
    baseInfo.ccreatetype = this.data.ccreatetype; //创建对象0 给他人  1 给自己
    baseInfo.isgeo = this.data.isgeo;             //是否允许雷达搜索
    var codeStr = this.data.countryCode.split('_')[0];
    baseInfo.countrycode = codeStr.slice(1, codeStr.length) //国家代码
    baseInfo.country = this.data.countryCode.split('_')[1];
    // ------------------------------------------------------------------------------------
    //网站
    baseInfo.webadress = this.data.webadress; 
    if(this.data.cardId){       //编辑名片
      if(this.data.webSource == 0){     //族蚂创建的网站
        baseInfo.siteShowType = 3;
        if (this.data.editorCard.isLink == 1) { //此前购买过此功能
          baseInfo.isLink = 1;
          baseInfo.isExternalLink = this.data.editorCard.isExternalLink;
        } else if (this.data.editorCard.isLink == 2) {  //未购买
          if (this.data.webadress){       //此条件可删掉
            baseInfo.isLink = 1;
            baseInfo.isExternalLink = this.data.editorCard.isExternalLink;
          }else{
            baseInfo.isLink = 2;
            baseInfo.isExternalLink = this.data.editorCard.isExternalLink;
          }
        }
      }else if(this.data.webSource == 1){   //外部网站
        if (this.data.editorCard.isExternalLink == 1){  //此前购买过
          baseInfo.isExternalLink = 1;
          baseInfo.isLink = this.data.editorCard.isLink;
          baseInfo.siteShowType = this.data.webOtherType+1;
        } else if (this.data.editorCard.isExternalLink == 2){ //未购买
            if(this.data.webOtherType==0){    //二维码展示
              baseInfo.isExternalLink = 1;
              baseInfo.siteShowType = 1;
              baseInfo.isLink = this.data.editorCard.isLink
            }else{                          //复制链接
              baseInfo.siteShowType = 2;
              baseInfo.isExternalLink = 2;
              baseInfo.isLink = this.data.editorCard.isLink
            }
        }
      }else{
        baseInfo.isExternalLink = 2;
        baseInfo.isLink = 2;
        baseInfo.siteShowType = 0;
      }
    }else{                      //新建名片
      if (this.data.webadress){           //添加了外链
        if (this.data.webSource == 0) {              //网站类型 1 - 族蚂内网    2 - 外部链接
          baseInfo.isLink = 1;      //代表添加了族蚂网站(购买此功能)
          baseInfo.isExternalLink = 2;
          baseInfo.siteShowType = 3;
        } else if (this.data.webSource == 1) {
          baseInfo.isLink = 2;      //代表添加了外部链接(购买此功能)
          if (this.data.webOtherType == 0) {  //展示二维码
            baseInfo.isExternalLink = 1;
            baseInfo.siteShowType = 1;
          } else {                            //复制链接
            baseInfo.isExternalLink = 2;
            baseInfo.siteShowType = 2;
          }
        };
      }else{                    //没添加外链
        baseInfo.isLink = 2; 
        baseInfo.isExternalLink = 2;
        baseInfo.siteShowType = 0;
      }
    }
    // ------------------------------------------------------------------------------------
    var obj;                          //模板订单
    if(this.data.cardId){             //编辑时
      if (this.data.tempPrice != 0 || this.data.tempId==this.data.editorCard.id){       //编辑时，免费或未更换模板，则不收费
        obj = null
      }else{
        obj = {};
        obj.fTemplateId = this.data.tempId;
        obj.fTemplateName = this.data.tempname;
        obj.fOrderType = 1;
        obj.fTotalAmount = this.data.totalFee;
        obj.fOrderAmount = this.data.tempPrice * 100;
      }
    }else{                            //新建时
      if (this.data.tempPrice != 0) {
        obj = {};
        obj.fTemplateId = this.data.tempId;
        obj.fTemplateName = this.data.tempname;
        obj.fOrderType = 1;
        obj.fTotalAmount = this.data.totalFee;
        obj.fOrderAmount = this.data.tempPrice * 100;
      } else {
        obj = null;
      }
    }
    baseInfo.templateOrder = obj;
    // ------------------------------------------------------------------------------------
    var obj2;                         //其他订单
    var arr = this.data.payItems, newArr = [], transactionItem = [], detailArr=[];
    arr.map((item) => {                    //剔除模板
      if (item.type != 0) {
        newArr.push(item)
      }
    });
    console.log(newArr,'其他订单');
    if (newArr.length > 0) {    //有其他类型的订单
      obj2 = {};
      obj2.fOrderType = 2;
      obj2.fTotalAmount = this.data.totalFee;
      if(!this.data.cardId){
        obj2.fOrderAmount = this.data.totalFee - this.data.tempPrice * 100;
      }else{
        obj2.fOrderAmount = this.data.totalFee;
      }
      newArr.map((item) => {
        if (item.type != 50 && item.type != 60 && item.type != 70) {
          var detailItem = {};
          switch (item.type) {
            case 1:
              detailItem.name = '族蚂二级站跳转';
              detailItem.price = 1000;
              detailItem.num = 1;
              detailItem.type = 0;
              break;
            case 2:
              detailItem.name = 'URL网址二维码展示';
              detailItem.price = 500;
              detailItem.num = 1;
              detailItem.type = 0;
              break;
            case 3:
              detailItem.name = '小程序二维码展示';
              detailItem.price = 1000;
              detailItem.num = 1;
              detailItem.type = 0;
              break;
            case 4:
              detailItem.name = '公众号二维展示';
              detailItem.price = 500;
              detailItem.num = 1;
              detailItem.type = 0;
              break;
            case 5:
              detailItem.name = '产品内链';
              detailItem.price = 500;
              if(!this.data.cardId){
                detailItem.num = this.data.PRODUCT;
                detailItem.type = 1;
              }else{
                if (this.data.editorCard.productIds != '' && this.data.editorCard.productIds!=null){
                  detailItem.num = this.data.PRODUCT - this.data.editorCard.productIds.split(',').length;
                  detailItem.type = 0;
                }else{
                  detailItem.num = this.data.PRODUCT;
                  detailItem.type = 1;
                }
              }
              break;
            case 6:
              detailItem.name = '服务内链';
              detailItem.price = 500;
              if(!this.data.cardId){
                detailItem.num = this.data.SERVICE;
                detailItem.type = 1;
              }else{
                if (this.data.editorCard.serviceIds != '' && this.data.editorCard.serviceIds!=null){
                  detailItem.num = this.data.SERVICE - this.data.editorCard.serviceIds.split(',').length;
                  detailItem.type = 0;
                }else{
                  detailItem.num = this.data.SERVICE;
                  detailItem.type = 1;
                }
              }
              break;
            case 7:
              detailItem.name = '文章内链';
              detailItem.price = 500;
              if(!this.data.cardId){
                detailItem.num = this.data.ARTICAL;
                detailItem.type = 1;
              }else{
                if (this.data.editorCard.articleIds != '' && this.data.editorCard.articleIds!=null){
                  detailItem.num = this.data.ARTICAL - this.data.editorCard.articleIds.split(',').length;
                  detailItem.type = 0;
                }else{
                  detailItem.num = this.data.ARTICAL;
                  detailItem.type = 1;
                }
                
              }
              break;
          }
          transactionItem.push(detailItem.name)
          detailArr.push(detailItem)
        }
      });
      obj2.fTransactionItem = transactionItem.join(',');
      obj2.fOrderDetails = JSON.stringify(detailArr);
    } else {                  //没有其他类型的订单
      obj2 = null;
    };
    baseInfo.otherOrder = obj2;
    // ------------------------------------------------------------------------------------
    return baseInfo;
  },
  showDiolog() {
    var payV = 'payModal.view';
    var modalV = 'subModal.view';
    var arr = this.data.payItem; 
    var totalPrice = 0;
    if(this.data.tempPrice!=0){
      arr.push({ type: 0, price: this.data.tempPrice*100})
    }else{
      arr.map((item,index)=>{
        if(item.type==0){
          arr.splice(index,1)
        }
      })
    }
    if(this.data.PRODUCT>1){       //产品数量大于1
      arr.push({ type: 50, price: 0 })
      arr.push({ type: 5, price: 5 * (this.data.PRODUCT-1)*100})
    }
    if(this.data.SERVICE>1){        //服务数量大于1
      arr.push({ type: 60, price: 0 })
      arr.push({ type: 6, price: 5 * (this.data.SERVICE - 1)*100})
    }
    if(this.data.ARTICAL>1){          //文章数量大于1
      arr.push({ type: 70, price: 0 })
      arr.push({ type: 7, price: 5 * (this.data.ARTICAL - 1)*100})
    }
    let newArr = arrRemove(arr);
    newArr.map((item)=>{
      totalPrice+=item.price
    });
    this.setData({
      payItems: newArr,
      totalFee: totalPrice,
      [modalV]:false
    });
    setTimeout(()=>{
      this.setData({
        [payV]: true
      })
    },0)
  },
  editorPayDiolog(payArr){
    var payV = 'payModal.view';
    var modalV = 'subModal.view';
    var totalPrice = 0;
    payArr.map((item) => {
      totalPrice += item.price
    });
    console.log(totalPrice,'PPPPPPPPPPPPPPPPPPPPPPPPPPP')
    this.setData({
      payItems: payArr,
      totalFee: totalPrice,
      [modalV]: false
    });
    setTimeout(() => {
      this.setData({
        [payV]: true
      })
    }, 0)
  },
  pay(type) {
    let isBgm = this.data.bgmurl==''?1:2;
    var d = this.data.discountMoney - this.data.totalFee;     //抵扣后的余额;
    if (type != 2 && d < 0) {      //产生支付行为且抵扣不足
      wx.showToast({
        icon: 'loading',
        title: '支付中..',
        duration: 3000
      });           //调出微信支付的加载过程
    }
    var modalV = 'subModal.view';
    var modalI = 'subModal.icon'; 
    var modalS = 'subModal.iconSrc';
    var modalC = 'subModal.content';
    var modalT = 'subModal.type';
    var payV = 'payModal.view';
    if (d >= 0) {
      this.setData({
        [modalV]: true,
        [modalC]: '正在写入名片夹',
        [modalT]:1,
        [payV]: false
      })
    };
    var timer = setInterval(()=>{
      if(this.data.shareImgUrl!=''){
        clearInterval(timer)
        var data = this.serializeOrder();
        console.log(data);
        // return;
        var _this = this;
        wx.request({
          url: api + 'manage-api/resource/cardout/paySaveCard',
          header: {
            'Content-Type': 'application/json',
            'Authorization': _this.data.token
          },
          method: "POST",
          data: JSON.stringify(data),
          success(res) {
            console.log(res.data.data,'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
            if (res.data.status == 0) {
              wx.removeStorage({ //保存成功后，清除扫描的名片信息
                key:'cardInfo'
              });
              wx.removeStorage({
                key: 'lable'
              });
              wx.removeStorage({
                key: 'assignLable'
              });
              wx.removeStorage({
                key: 'tempData'
              });
              if (type === 2) {           //没有支付行为，直接跳转
                _this.setData({
                  [modalV]: true,
                  [modalI]: true,
                  [modalT]: 2,
                  [modalC]: '已完成',
                  [modalS]: imgUrl + 'u180.png',
                  submitstatus:1
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/' + _this.data.tempPath + '?fId=' + res.data.data + '&from=editor',
                  });
                  _this.setData({
                    [modalV]: false,
                  })
                }, 500)
              } else {                   //有支付行为，
                if (d > 0) {                //优惠券抵扣，不用付款
                  console.log('优惠券抵扣，不用付款')
                  _this.setData({
                    [modalV]: true,
                    [modalI]: true,
                    [modalT]: 2,
                    [modalC]: '已完成',
                    [modalS]: imgUrl + 'u180.png',
                    submitstatus: 1
                  });
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/' + _this.data.tempPath + '?fId=' + res.data.data + '&from=editor',
                    })
                  }, 500)
                } else {              //拉起微信支付
                  let data = res.data.data;
                  wx.hideLoading();
                  wx.requestPayment({
                    'appId': data.appid,
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonce_str,
                    'signType': 'MD5',
                    'paySign': data.paySign,
                    'package': 'prepay_id=' + data.prepay_id,
                    success: function (res) {
                      console.log('族蚂支付测试成功', res);
                      _this.setData({
                        [payV]: false,
                        [modalV]: true,
                        [modalT]: 1,
                        [modalC]: '正在写入名片夹'
                      });
                      setTimeout(() => {
                        wx.request({
                          url: api + 'manage-api/resource/cardout/queryCardId',
                          method: "GET",
                          data: { outTradeNo: data.out_trade_no },
                          success: (res) => {
                            _this.setData({
                              [modalV]: true,
                              [modalI]: true,
                              [modalT]: 2,
                              [modalC]: '已完成',
                              [modalS]: imgUrl + 'u180.png',
                              submitstatus: 1
                            });
                            setTimeout(() => {
                              wx.redirectTo({
                                url: '/' + _this.data.tempPath + '?fId=' + res.data.data + '&from=editor',
                              });
                              _this.setData({
                                [modalV]: false,
                              })
                            }, 500)
                          }
                        })
                      }, 700)
                    },
                    fail: function (res) {
                      console.log('族蚂支付测试失败', res)
                    }
                  });
                }
              }
            } else {
              console.log(res, '失败的原因')
              _this.setData({
                [modalV]: true,
                [modalI]: false,
                [modalT]: 2,
                [modalC]: '写入失败',
              })
              setTimeout(() => {
                _this.setData({
                  [modalV]: false,
                })
              }, 1000)
            }
          }
        })
      }
    }, 100)
  },
  redirectUrl(e){
    let id = parseInt(e.currentTarget.dataset.id);
    let _this = this;
    switch(id){
      case 1:       //选择动效
        wx.navigateTo({
          url: '../effectchoose/effectchoose',
        });
        break;
      case 2:       //选择音效
        if (this.data.tempBgmId){   //新建有模板ID
          if(this.data.bgmid){
            wx.navigateTo({
              url: '../choiceMusic/choiceMusic?fid=' + this.data.tempBgmId + '&bgmId=' + this.data.bgmid,
            })
          }else{
            wx.navigateTo({
              url: '../choiceMusic/choiceMusic?fid=' + this.data.tempBgmId,
            })
          }
        }else{    //编辑只有音乐ID
          if (this.data.bgmid){
            wx.navigateTo({
              url: '../choiceMusic/choiceMusic?bgmId=' + this.data.bgmid,
            })
          }else{
            if (this.data.tempBgmId){
              wx.navigateTo({
                url: '../choiceMusic/choiceMusic?fid=' + this.data.tempBgmId,
              })
            }else{
              wx.navigateTo({
                url: '../choiceMusic/choiceMusic',
              })
            }
          }
        }
        break;
      case 3:       //选择网站
        if (this.data.webadress){
          wx.navigateTo({
            url: './sitetype/sitetype?link=' + this.data.webadress+'&type=' + this.data.webSource + '&showType=' + this.data.webOtherType
          });
        }else{
          wx.navigateTo({
            url: './sitetype/sitetype'
          });
        }
        break;
      case 4:        //选择标签
        if(this.data.cardId){
          this.saveLable();
        }
        wx.navigateTo({
          url: '../addLable/addLable',
          success: res => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              selectid: true,
              ismark: this.data.isgeo==1?true:false
            })
          }
        })
        break;
      case 5:        //选择模板
        if (this.data.cardId) {
          this.saveLable();
        }
        wx.navigateTo({
          url: '../selecttemp/selecttemp',
          success: res => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              tempEdit: true,
              selectid: this.data.tempId,
              fAmount:this.data.tempPrice
            })
          }
        })
        break;
      case 6:       //选择产品
        wx.navigateTo({
          url: '/pages/service/component/addTypeList/addTypeList?type=product_2',
          success: res => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              productIds: this.data.productIds
            })
          }
        })
        break;
      case 7:       //选择服务
        wx.navigateTo({
          url: '/pages/service/component/addTypeList/addTypeList?type=service_2',
          success: res => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              serviceIds: this.data.serviceIds
            })
          }
        })
        break;
      case 8:       //选择文章
        wx.navigateTo({
          url: '/pages/service/component/addTypeList/addTypeList?type=artical_2',
          success: res => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              articleIds: this.data.articleIds
            })
          }
        })
        break;
    }
  },
  saveLable(){    //  存标签
    let labArr = [];
    this.data.lable.split(',').map((val) => {
      if (this.data.customTag.split(',').indexOf(val) == -1) {
        labArr.push(val)
      }
    });
    let newLabArr = [];
    labArr.map((val) => {
      let obj = {};
      obj.title = val;
      obj.ischeck = true;
      newLabArr.push(obj);
    });
    wx.setStorageSync('lable', newLabArr);                                         //选中标签;
    if(this.data.customTag){
      wx.setStorageSync("assignLable", this.data.customTag.split(','));            //自定义标签;
    }
  },
  modalLeft(){    //修改手机号||继续创建||取消
    if (this.data.modalStateNow==1){
      this.setData({
        modalState: false,
      })
    }else{
      var token = wx.getStorageSync('token').token;
      var zmtoken = wx.getStorageSync('zmToken');
      var zmcookie = wx.getStorageSync('token').zmCookie;
      var newZmToken;
      var domain;
      if (api.indexOf('pre') != -1) {
        domain = 'https://m.pre-zuma.com'
      } else {
        domain = 'https://m.zuma.com'
      }
      wx.request({
        url: api + 'manage-api/resource/carduser/loginZmToken',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: { zmtoken: zmtoken, zmcookie: zmcookie },
        success: (res) => {
          newZmToken = res.data.data.zmToken;
          wx.setStorage({
            key: "zmToken",
            data: newZmToken
          })
          var url = domain + '/mobMemberCenter/updatePhoneNumber/?zmsource=2&zmToken=' + newZmToken;
          wx.navigateTo({
            url: '/pages/webview/webview?url=' + encodeURIComponent(url),
          })
        }
      })
    }
  },
  modalRight(){         //取消||查看选择||确定
    if (this.data.modalStateNow==1){
      wx.navigateTo({
        url: '/pages/cardListFromAdd/cardListFromAdd?fPhone=' + this.data.cnumber + '&fromEditor=1'
      });
      this.setData({
        modalState: false,
      })
    }else{
      this.setData({
        modalState: false,
      })
    }
  },
  code(){
    wx.navigateTo({
      url: './chooseCode/chooseCode',
    })
  },
  closeModal(e){       //两种情况，一种是跳转(1)，一种是直接关闭(0)
    let obj = {};
    if (this.data.closeModalStatus==0){
      obj.showModal = false;
      this.setData(obj)
    }else{
      if(this.data.ccreatetype==1){
        wx.navigateTo({
          url: '../mine/mine',
        });
      }else if(this.data.ccreatetype==0){
        let phone = this.data.cnumber;
        wx.navigateTo({
           url: '/pages/cardListFromAdd/cardListFromAdd?fPhone=' + phone + '&fromEditor=1'
        })
      }
    
      this.setData({
        showModal: false,
      })
    }
  },
  closeDiolog(){
    var payV = 'payModal.view'
    this.setData({
      [payV]: false,
      submitstatus:1
    })
  },
  getCountryCode() { //查询国家代码
    wx.request({         
      url: api + 'manage-api/resource/cardScan/queryCardPhone',
      header: {
        'Content-Type': 'application/json',
        'Content_MD5': 'Q2hlY2sgSW50ZWdyaXR5IQ==',
      },
      success: (res) => { 
        if(res.data.status==200){ 
          let code = res.data.data;
          wx.setStorage({
            key: 'CODE',
            data: code,
          })
        }
      }
    });
  },
  queryDiscount() {//查询优惠券金额
    let _this = this;
    wx.request({
      url: api + 'manage-api/resource/cardOrder/queryCoupons',
      header: {
        'Content-Type': 'application/json',
        'Authorization': _this.data.token
      },
      success: (res) => {
        if (res.data.status==0){
          _this.setData({
            discountMoney: res.data.data
          })
        } else if (res.data.status==404){
          _this.setData({
            loginStatus:true
          })
        }
      }
    });
  },
  queryPhoneFromZm(){   //查询族蚂网预留手机号
    let _this = this;
    wx.request({
      url: api + 'manage-api/resource/carduser/getPhoneNumOfzuma',
      header: {
        'Content-Type': 'application/json',
        'Authorization': _this.data.token
      },
      success: (res) => {
        this.setData({
          zmPhone: res.data.data
          // zmPhone:18621535196
        })
      }
    });
  },
  addZero(n) {
    n = n.toString();
    if (n.indexOf(".") == -1) {     //没有小数
      return n + ".00";
    } else if (n.indexOf(".") == n.length - 2) {    //一位小数
      return n + "0";
    } else {
      return parseFloat(n).toFixed(2);
    }
  },
  getTop(){
    let _this = this;
    const query = wx.createSelectorQuery()                // 创建节点查询器
    query.select('#head').boundingClientRect()
    query.select('#name').boundingClientRect()
    query.select('#telphone').boundingClientRect()
    query.select('#mail').boundingClientRect()
    query.select('#inner').boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      var newArr = [res[0].top, res[1].top, res[2].top, res[3].top]
      _this.setData({
        scrollTop: _this.data.scrollTop.concat(newArr),
        innerW:res[4].width,
        innerH:res[4].height,
      });
    });
  },
  closeMask(e){   //关闭弹窗
    let type = e.target.dataset.type;
    let obj = {};
    if(type){
      switch(type){
        case "1":
          obj.showModal = false;
          this.setData(obj)
          break;
        case "2":
          setTimeout(()=>{
            obj.modalState = false;  
            this.setData(obj)
          },200)
          break; 
        case "3":
          let payV = 'payModal.view';
          this.setData({
            [payV]: false
          })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('页面加载')
      this.setData({
        telephoneRule: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/,
        token: wx.getStorageSync('token').token,
        winH: Math.ceil(wx.getSystemInfoSync().windowHeight * 2.34) + 'rpx',
        wxNumber: wx.getStorageSync('phone'),
      })
      this.queryDiscount();       //获取优惠券金额
      this.getCountryCode();      //获取国家代码
      let _this = this;
      let eventChannel = this.getOpenerEventChannel();
      this.queryPhoneFromZm();    //获取族蚂网预留手机号   
      let cardInfo = wx.getStorageSync("cardInfo");      //扫出的名片信息
      if (cardInfo && cardInfo.length>0) {       //扫名片直接进入名片编辑页
        console.log(cardInfo, '=============================================================')
        let takePhoto = wx.getStorageSync("takePhoto");
        let obj = {};
        obj.photolist = resImg + takePhoto;
        obj.submitPhoto = takePhoto;
        obj.photoCj = takePhoto;
        obj.isDefault = false;
        obj.submitstatus = 1;
        obj.isScan = true;
        // 去重
        cardInfo = arrRemove(cardInfo);
        console.log(cardInfo,'扫描信息')
        for (var i = 0; i < cardInfo.length; i++) {
          if (cardInfo[i].type == 'name' && cardInfo[i].proWord != '') {
            obj.cname = cardInfo[i].proWord;
          } else if (cardInfo[i].type == 'email' && cardInfo[i].proWord != '') {
            obj.cmail = cardInfo[i].proWord.replace(/^\s+/g, "").replace(/\s+$/g, "");
          } else if (cardInfo[i].type == 'httpurl' && cardInfo[i].proWord != '') {
            obj.webadress = cardInfo[i].proWord;
            obj.webSource = 1;    //网站类型为外网
            obj.webOtherType = 1; //展示方式为复制链接
          } else if (cardInfo[i].type == 'mobile' && cardInfo[i].proWord != '') {
            obj.cnumber = cardInfo[i].proWord;
          } else if (cardInfo[i].type == 'wxh' && cardInfo[i].proWord != '') {
            obj.cwx = cardInfo[i].proWord;
          } else if (cardInfo[i].type == 'company' && cardInfo[i].proWord != '') {
            obj.ctitle = cardInfo[i].proWord;
          } else if (cardInfo[i].type == 'adress') {
            let _this = this;
            if(cardInfo[i].proWord!=''){    //有地址
              obj.location = cardInfo[i].proWord;
              wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/?address=' + cardInfo[i].proWord +'&key=ZYCBZ-VGPKO-GUSWH-SQT3N-FHFZJ-M5BFM',
                success: function (res) {
                  if (res.data.status==0){  //查询到地址
                    obj.longitude = res.data.result.location.lng;
                    obj.latitude = res.data.result.location.lat
                  }else{    //未查询到地址
                    obj.longitude = '';
                    obj.latitude = '';
                  }
                  _this.setData(obj)
                }
              })
            }else{  //没有地址定位当前地址
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=ZYCBZ-VGPKO-GUSWH-SQT3N-FHFZJ-M5BFM";
                  obj.longitude = res.longitude;
                  obj.latitude = res.latitude
                  wx.request({
                    url: getAddressUrl,
                    success: function (res) {
                      let address = res.data.result.address;
                      obj.location = address;
                      _this.setData(obj)
                    }
                  })
                }
              });
            }
          } else if (cardInfo[i].type == 'job' && cardInfo[i].proWord != '') {
            obj.cpost = cardInfo[i].proWord
          }
        };
        this.setData(obj)
      }
      let lableStr = '';
      //获取标签
      let lable = wx.getStorageSync("lable");
      let assignLable = wx.getStorageSync("assignLable");
      // 热门标签
      if(lable){
        for (var i = 0; i < lable.length; i++) {
          lableStr += lable[i].title + ','
        }
      }
      // 自定义标签
      if (assignLable){
        this.setData({
          customTag: assignLable.join(',')
        })
        for (var i = 0; i < assignLable.length; i++) {
          lableStr += assignLable[i] +','
        }
      }
      // 获取模板数据
      let tempObj = wx.getStorageSync('tempData');
      //获取创建对象（他人还是自己）
      let createObj = wx.getStorageSync('createCardeState');
      if(createObj===true){       //为自己创建
        this.setData({
          ccreatetype:1,
          cnumber: wx.getStorageSync('phone')
        })
        this.checkPhoneCardNum(wx.getStorageSync('phone'),99)
      } else {                    //为他人创建
        setTimeout(()=>{
          this.setData({
            ccreatetype: 0,
            loading: false,
            
          });
        },0)                  
        setTimeout(()=>{
          _this.getTop();
        },100)
      }
      //是否允许雷达搜索
      let radar = wx.getStorageSync("isRadar");
      if (radar){
        this.setData({
          isgeo:1
        })
      }else{
        this.setData({
          isgeo: 0
        })
      };
      if (tempObj.fHeadType==1){
        this.setData({
          height2:315,
          width2:315
        })
      } else if(tempObj.fHeadType==2){
        this.setData({
          height2: 195,
          width2: 315
        })
      }
      this.setData({
        lable: lableStr ? lableStr.slice(0, lableStr.length - 1) : this.data.lable,
        tempname: tempObj.fName,
        tempId: tempObj.fCode,
        tempPath: tempObj.fXmlPath,
        tempPrice: tempObj.fAmount,
        headType: tempObj.fHeadType,
        fPosterAllUrl: tempObj.fPosterAllUrl,
        tempBgmId:tempObj.fMusicId,
      })
      // 编辑名片回显
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        _this.setData({
          cardId: data.cardid,//名片id
          templateId: data.selectid//模板id
        });
        wx.request({
          url: api+'manage-api/resource/cardout/queryById',
          header: {
            'Content-Type': 'application/json',
            'Authorization': _this.data.token,
            'Content_MD5': 'Q2hlY2sgSW50ZWdyaXR5IQ==',
          },
          method: "GET",
          data: { fId: data.cardid },
          success: (res) => {
            setTimeout(()=>{
              _this.init(res.data.data);
            },0)
          }
        })
      });
      setTimeout(()=>{
        if (!this.data.cardId && createObj === true) {    //新建名片默认使用微信头像
          console.log('为自己新建名片，写入微信头像')
          wx.getUserInfo({
            success: function (res) {
              console.log(res, '111111111111')
              if (res.userInfo.avatarUrl){
                wx.request({
                  url: api + '/manage-api/resource/cardScan/getPicByUrl_v2',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    imageUrl: res.userInfo.avatarUrl,
                    formatName: 'jpg'
                  },
                  success(res) {
                    var imgUrl = res.data.data;
                    let p1 = imgUrl.url.slice(imgUrl.url.indexOf('.com') + 4, imgUrl.url.length);
                    let p2 = imgUrl.cjurl ? imgUrl.cjurl.slice(imgUrl.cjurl.indexOf('.com') + 4, imgUrl.cjurl.length) : p1;
                    _this.setData({
                      photolist: resImg + p1,
                      submitPhoto: p1,
                      photoCj: p2,
                      isDefault: false,
                      loading: false
                    });
                    _this.getTop();
                  }
                })
              }else{
                _this.setData({
                  loading: false
                });
                _this.getTop();
                console.log('获取微信头像失败', res)
              }
            },
            fail:function(res){
              _this.setData({
                loading: false
              });
              _this.getTop();
              console.log('获取微信头像失败',res)
            }
          })
        }
      },150)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    console.log(imgUrl + 'u2255.png')
    return {
      title: '能链接官网、公众号、小程序的智能名片，轻量化引流工具',
      path: '/pages/addLable/addLable',
      imageUrl:imgUrl+'u2255.png'
    }
  },
  // 把图片处理成圆角矩形
  roundRect: function (ctx, r, x, y, w, h, img) {
    ctx.save()
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath();
    ctx.clip()
    ctx.drawImage(img, x, y, w, h)
    ctx.restore() // 返回上一状态
  },
  // 画圆角矩形
  drawRoundedRect: function (ctx, x, y, width, height, r, fill, stroke) {
    ctx.save(); ctx.beginPath(); // draw top and top right corner 
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
    ctx.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
    ctx.arcTo(x, y, x + r, y, r);
    if (fill) { ctx.fill(); }
    if (stroke) { ctx.stroke(); }
    ctx.restore();
  },
  //canvas画圆形图片
  circleImg: function (ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    // clip() 方法从原始画布中剪切任意形状和尺寸。
    // 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。您也可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。
    ctx.clip()
    ctx.drawImage(img, x, y, d, d)
    ctx.restore()
  },
  /*
  *eachData是一个名片数据（是一个对象）必须要有以下属性（就算对应的值没有也要传个空字符）
  {
    fPosterUrl:'',//海报图
    fPhotoUrl:'',//名片图片
    fUserName:'',//名片名称
    fPosition:'',//职位
    fPhone:'',//手机号
    fMail:'',//邮箱
    fAddress:'',//地址
  }
  */
  imgTemPath: function (eachData) {//生成临时图片路径
    let that = this;
    let bgImgPath1 = eachData.fPosterUrl ? eachData.fPosterUrl : (imgUrl + '文章.png');
    let bgImgPath2 = eachData.fPhotoUrl ? eachData.fPhotoUrl : (imgUrl + '文章.png');
    let bgImgPath3 = ''
    let bgImgPath4 = ''
    let bgImgPath5 = ''


    // console.log('img1---------------', img1)
    // console.log('bgImgPath3---------------', bgImgPath3)


    let tArr = []
    if (eachData.fPhone && eachData.fPhone.length > 0) {//手机号
      let obj = {
        imgUrl: imgUrl + 'haibaoP.png',
        text: eachData.fPhone
      }
      tArr.push(obj)
    }
    if (eachData.fMail && eachData.fMail.length > 0) {//邮箱
      let obj = {
        imgUrl: imgUrl + 'haibaoX.png',
        text: eachData.fMail
      }
      tArr.push(obj)
    }
    if (eachData.fAddress && eachData.fAddress.length > 0) {//地址
      let obj = {
        imgUrl: imgUrl + 'haibaoD.png',
        text: eachData.fAddress,
        type:'Address'
      }
      tArr.push(obj)
    }
    that.setData({
      textArr: tArr
    })


    wx.downloadFile({//族蚂后台图片
      url: imgUrl + '智慧.png',//网络路径
      success: res => {
        // console.log(bgImgPath1, '族蚂后台图片转换成功111')
        let path = res.tempFilePath //临时本地路径
        that.setData({
          bgImgPath0: path
        })
      }
    })


    wx.downloadFile({//族蚂后台图片
      url: bgImgPath1,//网络路径
      success: res => {
        console.log(bgImgPath1, '族蚂后台图片转换成功111')
        let path = res.tempFilePath //临时本地路径
        // console.log('path---------------------', path)
        that.setData({
          bgImgPath1: path
        })
      },
      fail: res => {
        console.log(bgImgPath1, '族蚂后台图片转换失败111----使用默认图', imgUrl + '智慧.png')
        wx.downloadFile({//族蚂后台图片
          url: imgUrl + '智慧.png',//网络路径
          success: sData => {
            let path = sData.tempFilePath //临时本地路径
            that.setData({
              bgImgPath1: path
            })
          },


        })
      }
    })


    wx.downloadFile({//名片图片
      url: bgImgPath2,//网络路径
      success: res => {
        console.log(bgImgPath2, '名片图片转换成功222')
        let path = res.tempFilePath //临时本地路径
        that.setData({
          bgImgPath2: path
        })
      },
      fail: res => {
        console.log(bgImgPath2, '名片图片转换失败22222----使用默认图', imgUrl + '智慧.png')
        wx.downloadFile({
          url: imgUrl + '智慧.png',//网络路径
          success: sData => {
            let path = sData.tempFilePath //临时本地路径
            that.setData({
              bgImgPath2: path
            })
          },


        })
      }
    })


    that.data.textArr.forEach((element, i) => {//把网络图片“手机图片”，“邮箱图片”，“地址图片”路径循环生成临时图片路径
      wx.downloadFile({//手机图片
        url: element.imgUrl,//网络路径
        success: res => {
          console.log(bgImgPath3, '手机图片转换成功333')
          let path = res.tempFilePath //临时本地路径
          element.imgUrl = path
        },
        fail: res => {
          console.log(bgImgPath3, '手机图片转换失败111----使用默认图', imgUrl + '智慧.png')
          wx.downloadFile({//族蚂后台图片
            url: imgUrl + '智慧.png',//网络路径
            success: sData => {
              let path = sData.tempFilePath //临时本地路径
              element.imgUrl = path
            }
          })
        }
      })
    })
    function df() {
      return new Promise(function (res1, rej) {
        wx.downloadFile({//族蚂后台图片
          url: imgUrl + '智慧.png',//网络路径
          success: res => {
            // console.log(bgImgPath1, '族蚂后台图片转换成功111')
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath0: path
            }, function () {
              res1()
            })
          }
        })
      })
    }
    function df2() {
      return new Promise(function (res1, rej) {
        wx.downloadFile({//族蚂后台图片
          url: bgImgPath1,//网络路径
          success: res => {
            console.log(bgImgPath1, '族蚂后台图片转换成功111')
            let path = res.tempFilePath //临时本地路径
            // console.log('path---------------------', path)
            that.setData({
              bgImgPath1: path
            }, function () {
              res1()
            })
          }
        })
      })
    }
    function df3() {
      return new Promise(function (res1, rej) {
        wx.downloadFile({//名片图片
          url: bgImgPath2,//网络路径
          success: res => {
            console.log(bgImgPath2, '名片图片转换成功222')
            let path = res.tempFilePath //临时本地路径
            that.setData({
              bgImgPath2: path
            }, function () {
              res1()
            })
          }
        })
      })
    }
    Promise.all([df(), df2(), df3()]).then(function () {
      // Promise.all([df(), df3()]).then(function () {
      // console.log('@@@@@@@@@@@@@@@@--------222')
      that.mataImg(eachData.fUserName, eachData.fPosition)
    })
    // setTimeout(() => {
    //   if (!that.data.bgImgPath1) {
    //     that.setData({
    //       bgImgPath1: that.data.bgImgPath2
    //     })
    //   }
    //   if (!
  },
  imgTemPathold: function (eachData) {//生成临时图片路径
    let that = this;
    let bgImgPath1 = eachData.fPosterUrl ? eachData.fPosterUrl : (imgUrl + '文章.png');
    let bgImgPath2 = eachData.fPhotoUrl ? eachData.fPhotoUrl : (imgUrl + '文章.png');
    let bgImgPath3 = ''
    let bgImgPath4 = ''
    let bgImgPath5 = ''

    // console.log('img1---------------', img1)
    // console.log('bgImgPath3---------------', bgImgPath3)

    let tArr = []
    if (eachData.fPhone && eachData.fPhone.length > 0) {//手机号
      let obj = {
        imgUrl: imgUrl + 'haibaoP.png',
        text: eachData.fPhone
      }
      tArr.push(obj)
    }
    if (eachData.fMail && eachData.fMail.length > 0) {//邮箱
      let obj = {
        imgUrl: imgUrl + 'haibaoX.png',
        text: eachData.fMail
      }
      tArr.push(obj)
    }
    if (eachData.fAddress && eachData.fAddress.length > 0) {//地址
      let obj = {
        imgUrl: imgUrl + 'haibaoD.png',
        text: eachData.fAddress
      }
      tArr.push(obj)
    }
    that.setData({
      textArr: tArr
    })


    wx.downloadFile({//族蚂后台图片
      url: imgUrl + '智慧.png',//网络路径
      success: res => {
        // console.log(bgImgPath1, '族蚂后台图片转换成功111')
        let path = res.tempFilePath //临时本地路径
        that.setData({
          bgImgPath0: path
        })
      }
    })

    wx.downloadFile({//族蚂后台图片
      url: bgImgPath1,//网络路径
      success: res => {
        console.log(bgImgPath1, '族蚂后台图片转换成功111')
        let path = res.tempFilePath //临时本地路径
        // console.log('path---------------------', path)
        that.setData({
          bgImgPath1: path
        })
      },
      fail: res => {
        console.log(bgImgPath1, '族蚂后台图片转换失败111----使用默认图', imgUrl + '智慧.png')
        wx.downloadFile({//族蚂后台图片
          url: imgUrl + '智慧.png',//网络路径
          success: sData => {
            let path = sData.tempFilePath //临时本地路径
            that.setData({
              bgImgPath1: path
            })
          },

        })
      }
    })

    wx.downloadFile({//名片图片
      url: bgImgPath2,//网络路径
      success: res => {
        console.log(bgImgPath2, '名片图片转换成功222')
        let path = res.tempFilePath //临时本地路径
        that.setData({
          bgImgPath2: path
        })
      },
      fail: res => {
        console.log(bgImgPath2, '名片图片转换失败22222----使用默认图', imgUrl + '智慧.png')
        wx.downloadFile({
          url: imgUrl + '智慧.png',//网络路径
          success: sData => {
            let path = sData.tempFilePath //临时本地路径
            that.setData({
              bgImgPath2: path
            })
          },

        })
      }
    })

    that.data.textArr.forEach((element, i) => {//把网络图片“手机图片”，“邮箱图片”，“地址图片”路径循环生成临时图片路径
      wx.downloadFile({//手机图片
        url: element.imgUrl,//网络路径
        success: res => {
          console.log(bgImgPath3, '手机图片转换成功333')
          let path = res.tempFilePath //临时本地路径
          element.imgUrl = path
        },
        fail: res => {
          console.log(bgImgPath3, '手机图片转换失败111----使用默认图', imgUrl + '智慧.png')
          wx.downloadFile({//族蚂后台图片
            url: imgUrl + '智慧.png',//网络路径
            success: sData => {
              let path = sData.tempFilePath //临时本地路径
              element.imgUrl = path
            }
          })
        }
      })
    })
    setTimeout(() => {
      // console.log('开始画图==================')
      // console.log('that.data.bgImgPath3==================', that.data.bgImgPath3)
      if (!that.data.bgImgPath1) {
        that.setData({
          bgImgPath1: that.data.bgImgPath2
        })
      }
      if (!that.data.bgImgPath1 && !that.data.bgImgPath2) {
        that.setData({
          bgImgPath1: that.data.bgImgPath0,
          bgImgPath2: that.data.bgImgPath0
        })
      }
      that.mataImg(eachData.fUserName, eachData.fPosition)
      return
    }, 1500)
  },
  /*
  *context:画布，
  *text：文字
  *w:文字显示宽度
  *x:文字开始x轴
  *y:文字开始y轴
  */
  lemitText: function (context,text,w,x,y){
    let width2 = context.measureText(text).width;//开始测量字体的宽度
    if (width2 > w) {
      let str = ''
      let str2 = '...'
      let arrT = text.split('')
      for (let i = 0; i < arrT.length; i++) {
        str += arrT[i]
        width2 = context.measureText(str).width;
        if (width2 > w) {
          break
        }
      }
      context.fillText(str + str2, x, y);
    } else {
      context.fillText(text, x, y)
    }
  },
  mataImg: function (t1, t2) {
    let that = this
    //画海报==============================start
    let context = wx.createCanvasContext('myShare')
    context.fillStyle = "#f2f2f2"
    context.fillRect(0, 0, 200, 162)
    that.roundRect(context, 6, 6, 6, 188, 117, that.data.bgImgPath1)

    context.fillStyle = "rgba(0,0,0,.6)"
    that.drawRoundedRect(context, 6, 6, 188, 117, 8, true, false)

    that.circleImg(context, that.data.bgImgPath2, 19, 16, 16)

    context.font = "14px Arial";
    context.fillStyle = "#fff";

    this.lemitText(context, t1,100,58,28)
    // context.fillText(t1, 58, 28)

    context.font = "10px Arial";
    this.lemitText(context, t2, 105, 58, 42)
    // context.fillText(t2, 58, 42)
 
    if (that.data.textArr[0] && that.data.textArr[0].text.length > 0) {
      context.drawImage(that.data.textArr[0].imgUrl, 21, 60, 12, 12)
      context.font = "10px Arial";
      if (that.data.textArr[0].type && that.data.textArr[0].type.indexOf('Address') > -1) {
        this.lemitText(context, that.data.textArr[0].text, 130, 38, 70)
      } else {
        context.fillText(that.data.textArr[0].text, 38, 70);
      }
      // context.fillText(that.data.textArr[0].text, 38, 70);
    }


    if (that.data.textArr[1] && that.data.textArr[1].text.length > 0) {
      context.drawImage(that.data.textArr[1].imgUrl, 21, 80, 12, 12)
      context.font = "10px Arial";
      if (that.data.textArr[1].type && that.data.textArr[1].type.indexOf('Address') > -1) {
        this.lemitText(context, that.data.textArr[1].text, 130, 38, 88)
      } else {
        context.fillText(that.data.textArr[1].text, 38, 88);
      }
      // context.fillText(that.data.textArr[1].text, 38, 88);
    }

    if (that.data.textArr[2] && that.data.textArr[2].text.length > 0) {
      context.drawImage(that.data.textArr[2].imgUrl, 21, 100, 12, 12)
      context.font = "10px Arial";
      if (that.data.textArr[2].type && that.data.textArr[2].type.indexOf('Address')>-1){

        // let width4 = context.measureText(that.data.textArr[2].text).width;//开始测量字体的宽度
        // if (width4 > 130) {
        //   let str = ''
        //   let str2 = '...'
        //   let arrT = that.data.textArr[2].text.split('')
        //   for (let i = 0; i < arrT.length; i++) {
        //     str += arrT[i]
        //     width3 = context.measureText(str).width;
        //     if (width3 > 130) {
        //       break
        //     }
        //   }
        //   context.fillText(str + str2, 38, 109);
        // } else {
        //   context.fillText(that.data.textArr[2].text, 38, 109);
        // }
        this.lemitText(context, that.data.textArr[2].text, 130, 38, 109)
      }else{
        context.fillText(that.data.textArr[2].text, 38, 109);
      }
      // context.fillText(that.data.textArr[2].text, 38, 109);
    }

    context.fillStyle = "#1081FF"
    that.drawRoundedRect(context, 50, 130, 93, 24, 3, true, false)

    context.fillStyle = "#fff"
    context.font = "12px Arial";
    context.fillText("查看名片", 74, 146);

    // context.draw()
    context.draw(false, function () {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 280,
          height: 162,
          destWidth: 110 * 10,
          destHeight: 110 * 8,
          canvasId: 'myShare',
          // fileType: 'jpg', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
          // quality: 1,
          success: function (res) {
            // console.log('res.tempFilePath###################', res.tempFilePath);
            that.setData({
              shareImgSrc: res.tempFilePath
            });
            that.upLoCanvasImg(that.data.shareImgSrc)
            if (!res.tempFilePath) {
              wx.showModal({
                title: '提示',
                content: '图片绘制中，请稍后重试',
                showCancel: false
              })
            }
          },
          fail: function (res) {
            // console.log('图片生成失败-----', res)
          }
        })
      }, 0)
    })
    //画海报==============================end
  },
  upLoCanvasImg:function(v){
    let _this = this;
    const uploadTask = wx.uploadFile({
      url: api + 'manage-api/resource/cardScan/uploadImage',     // 后台接收图片接口地址
      filePath: v,						                                                //调用wx.chooseImage选择之后的临时图片地址
      name: 'file',
      header: { 'Content-Type': 'application/json' },
      success(res) {
        let url = JSON.parse(res.data).url
        console.log(url.slice(url.indexOf('.com') + 4, url.length))
        _this.setData({
          shareImgUrl: url.slice(url.indexOf('.com') + 4, url.length)
        })
      }
      
    })
  }
})