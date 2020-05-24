
function comShare(res, shareData, shareImgUrl){
  let unionId = wx.getStorageSync('token').unionId
  let share = (wx.getStorageSync('taskStatus') == 2) ? 1 : 0 
  if (shareData.cardfId) {//模板详情页的分享
    let bgm = (shareData.hasMusic ? 2 : 1);
    console.log(bgm, shareData.hasMusic, "点击分享按钮获取数据")
    let shareObj = {
      title: '这是' + shareData.title + '的名片，推荐给您！',    // 默认是小程序的名称(可以写slogan等)
      path: shareData.path + '?fId=' + shareData.cardfId + '&share=' + share + '&unionId=' + unionId + '&bgm=' + bgm,    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: shareData.imageUrl
    }
    console.log("分享路径1", shareObj.path)
    if (res.from == 'button') {
      shareObj.title = '这是' + shareData.title + '的名片，推荐给您！',
        shareObj.path = shareData.path + '?fId=' + shareData.cardfId  + '&share=' + share + '&unionId=' + unionId + '&bgm=' + bgm,
        shareObj.imageUrl = shareData.imageUrl
    }
    console.log("分享路径2", shareObj.path)
    return shareObj
  } else {//默认模板的分享
    let shareObj = {
      title: '您的好友都在使用这款模板创建名片！',    // 默认是小程序的名称(可以写slogan等)
      path: shareData.path  + '?share=' + share + '&unionId=' + unionId,    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: shareImgUrl
    }
    if (res.from == 'button') {
      // 此处可以修改 shareObj 中的内容
      shareObj.title = '您的好友都在使用这款模板创建名片！'
      shareObj.path = shareObj.path + '?share=' + share + '&unionId=' + unionId,
      console.log(shareObj.path)
      shareObj.imageUrl = shareObj.imageUrl
      // console.log('这是自定义分享按钮--------------------------', shareObj.path)
    }
    return shareObj
  }
}
module.exports.comShare = comShare;