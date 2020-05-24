Page({
  data: {
    current: 'A',
    to: 0,
    code:null,
  },
  choiceCode(e){
    // console.log(e)
    let code = e.currentTarget.dataset.code;
    let rule = e.currentTarget.dataset.rule;

    var reg = new RegExp(rule)
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2]; //上一个页面
    var info = prevPage.data //取上页data里的
    let obj = {};
    obj.countryCode = code;
    obj.telephoneRule = reg;
    console.log(reg)
    if (code!='+86中国'){     //非大陆地区要清楚之前的地址及经纬度
      obj.chnCode = false;
      obj.location = '';
      obj.longitude = '';
      obj.latitude = '';
      obj.chnLocation = false;
    }else{
      obj.chnCode = true;
    }
    prevPage.setData(obj)    //设置数据
    wx.navigateBack({
      success:()=>{

      }
    })
  },
  onReady() {
    let code = wx.getStorageSync('CODE');
    this.setData({
      code:code
    })
    this.claculateTop(code);
  },

  claculateTop(code) {      //计算top
    const page = this;
    code.map((item) => {
      (function (_item) {
        const query = wx.createSelectorQuery();
        const id = _item.letter === '#' ? 'all' : _item.letter;
        query.select('#' + id).boundingClientRect((res) => {
          if (res) {
            _item.top = res.top;
          }else{
            _item.top = undefined;
          }
          page.code = page.data.code;
        }).exec();
      })(item);
    });
    
  },

  switchLetter(e) {
    const {code} = this;
    console.log(code)
    const id = e.currentTarget.dataset.id;
    let avatar = code.find((o) => o.letter === id)
    console.log(avatar)
    if (!avatar || !avatar.top === undefined) return;
    let tmp = {
      current: id
    };
    if (avatar.top !== undefined) {
      tmp.to = avatar.top;
    }
    console.log(tmp)
    this.setData(tmp);
  },

  whenScroll(e) {
    // console.log(e)
    let cur = 'A';
    const { code, data } = this;
    const { current } = data;
    let len = code.length;
    while (len > 0) {
      len--;
      let avatar = code[len];
      if (avatar.top !== undefined && avatar.top <= e.detail.scrollTop) {
        cur = avatar.letter;
        console.log(cur)
        break;
      }
    }
    
    if (current === cur) return;
    this.setData({
      current: cur
    });
  },
  up(){
    this.setData({
      to: 0
    });
  },
  code:''
});