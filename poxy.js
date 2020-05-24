module.exports = {
  //开发环境
  dev: {
    API_BASE: 'http://192.168.0.147:8083/',
    CARD_LIST: 'http://192.168.0.147:8083', //名片夹列表查询接口
    IMGURL: 'http://manage.dev-zuma.com/mp_pic/static/', //static文件下图片路径
    PICIMG: 'http://manage.dev-zuma.com/mp_pic/pic/', //模版图片路径
    RESIMG: 'http://image.dev-zuma.com' //接口返回图片前缀
  },
  //预生产环境
  prod: {
    API_BASE: 'https://manage.pre-zuma.com/', //预生产
    IMGURL: 'https://manage.pre-zuma.com/mp_pic/static/', //static文件下图片路径
    PICIMG: 'https://manage.pre-zuma.com/mp_pic/pic/' ,//模版图片路径
    RESIMG: 'https://image.pre-zuma.com', //接口返回图片前缀
    MUSIC: 'https://audio.pre-zuma.com' //音频域名前缀
  },
  //生产环境
  pd: {
    API_BASE: 'https://manage.zuma.com/', //生产
    IMGURL: 'https://manage.zuma.com/mp_pic/static/', //static文件下图片路径
    PICIMG: 'https://manage.zuma.com/mp_pic/pic/' ,//模版图片路径
    RESIMG: 'https://image.zuma.com', //接口返回图片前缀
    MUSIC:'https://audio.zuma.com' //音频域名前缀
  }
}