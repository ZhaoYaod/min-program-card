Page({
  data: {
    angle:0
  },
  onReady() {
    const that = this
    wx.onAccelerometerChange(function (res) {
      let x = Math.abs(res.x);
      let y = Math.abs(res.y);
      let tan = y / x;
      let rad = Math.atan(tan);//用反三角函数求弧度
      let angle = Math.floor(180 / (Math.PI / rad));//将弧度转换成角度

      if (res.x > 0 && res.y > 0) {//第1象限
        angle = 270 - angle;
      }
      if (res.x > 0 && res.y < 0) {//第2象限
        angle = 270 + angle;
      }
      if (res.x < 0 && res.y < 0) {//第3象限
        angle = 90 - angle;
      }
      if (res.x < 0 && res.y > 0) {//第4象限
        angle = 90 + angle;
      }
      if (res.x == 1 && res.y == 0) {//x轴正半轴
        angle = 270;
      }
      if (res.x == -1 && res.y == 0) {//x轴负半轴
        angle = 90;
      }
      if (res.x == 0 && res.y == 1) {//y轴正半轴
        angle = 180;
      }
      if (res.x == 0 && res.y == -1) {//y轴负半轴
        angle = 0;
      }

      that.setData({
        angle: angle
      })
    })

    wx.showShareMenu({
      withShareTicket: true
    })    
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '建站建站测试',
      path: '/pages/meter/meter'
    }
  }
})
