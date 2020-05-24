// searchFromIndex.js
const app = getApp()
let imgUrl = app.globalData.poxy.IMGURL
let dataUrl = app.globalData.poxy.API_BASE//接口路径前缀
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardlist: [],
    searchArray: [],
    isValue: false,
    isFocus: false,
    inputValut:'',
    keyValue: '',
    forMarkList: [],
    windowHeight: 0,
    isload: false,
    loginState: false,//true：显示登录页 false：不显示登陆页
    focus:true,
    leidaUrl: imgUrl +'s-leidasou.png',
    img1Url: imgUrl +'close2X.png',
    isClearValue:false
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '名片夹'
    })
    let token = wx.getStorageSync('token').token
    if (token && token.length > 0) {
      // console.log('已登录0000')
      this.setData({
        isload: true
      })
      this.getData()
    } else {
      // console.log('未登录00000')
    }
  },
  /**
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    // console.log('this.data.windowHeight-----------', this.data.windowHeight)
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '名片夹'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    this.setData({
      searchArray: [],
      isValue: false,
      isFocus: true,
      inputValut: '',
      img1Url: imgUrl +'close2X.png'
    })

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      inputValut: '',
      searchArray: []
    })
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
      title: '名片拍照扫描工具，建立自己的微信名片册',// 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',// 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: imgUrl+'扫码.png'
    }
  },
  getData: function () {//请求获取数据
    let poxy = app.globalData.poxy.CARD_LIST
    let token = wx.getStorageSync('token').token
    if (!token) return
    // console.log('token-----------------', token)
    let that = this
    wx.request({
      url: dataUrl+'manage-api/resource/cardbag/queryCardBag',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      // data: { "fId": 1},
      success: function (res) {
        // console.log('ggggggggggg------------------', res)
        let dataArr = []
        let newArr = []
        if (!res.data.data.data || res.data.data.data.length == 0) return
        let imageDomain = res.data.data.imageDomain
        res.data.data.data.forEach((element, index) => {
          if (element.data.length > 0) {
            element.data.forEach((ele, i) => {
              // console.log('ele.fCardName------------', ele.fCardName)
              newArr.push(ele)
              //该手机号超过两张名片时，名称只显示前两张名片的名称（用/分割）==============start
              let arr1 = []
              let str = ''
              arr1 = ele.fCardName ? ele.fCardName.split("/") : ['默认名称']
              // console.log('arr1------------', arr1)
              if (arr1.length >= 2) {
                str = arr1[0] + "/" + arr1[1]
                ele.fCardName = str
              }
              //该手机号超过两张名片时，名称只显示前两张名片的名称（用/分割）================end

              // 去掉标签字符串头尾的"[","]"字符=================================start
              let str1 = ele.fCardTags.replace("[", "")
              ele.fCardTags = str1.replace("]", "")
              // 去掉标签字符串头尾的"[","]"字符=================================end

              // 头像修改====================================================start
              // console.log('ele.fCardPics---------', ele.fCardPics)
              let picArr = ele.fCardPics ? ele.fCardPics.split(",") : ['没有头像']
              ele.fCardPics = []
              picArr.forEach((elem, j) => {
                elem = imageDomain + elem
                ele.fCardPics.push(elem)
              })
              // 头像修改======================================================end
            })
            dataArr.push(element)
          }
        })
        // res.data.data.data.forEach((element, index) => {
        //   if (element.data.length > 0) {
        //     // dataArr.push(element)
        //     element.data.forEach((ele, i) => {
              
        //       //该手机号超过两张名片时，名称只显示前两张名片的名称（用/分割）==============start
        //       let arr1 = []
        //       let str = ''
        //       arr1 = ele.fCardName.split("/")
        //       if (arr1.length >= 3) {
        //         arr1.forEach((el, j) => {
        //           if (j <= 1) {
        //             if (j == 0) {
        //               str += el + "/"
        //             } else {
        //               str += el
        //             }
        //           }
        //         })
        //         ele.fCardName = str
        //       }
        //       //该手机号超过两张名片时，名称只显示前两张名片的名称（用/分割）================end
        //       // 去掉标签字符串头尾的"[","]"字符=================================start
        //       let str1 = ele.fCardTags.replace("[", "")
        //       ele.fCardTags = str1.replace("]", "")
        //       // 去掉标签字符串头尾的"[","]"字符=================================end

        //       // 头像修改====================================================start
        //       let picArr = ele.fCardPics.split(",")
        //       ele.fCardPics = []
        //       picArr.forEach((elem, j) => {
        //         elem = imageDomain + elem
        //         ele.fCardPics.push(elem)
        //       })
        //       // 头像修改======================================================end
        //       newArr.push(ele)
        //     })
        //     dataArr.push(element)
        //   }
        // })
        that.setData({
          forMarkList: dataArr,
          cardlist: newArr
        })
        // console.log(newArr, 'that.data.forMarkList------------------', that.data.forMarkList)
      },
      fail: function (err) {
        console.log('请求失败------------------')
      }
    })
  },
  deleteValue:function(){
    // console.log('deleteValue------------------')
    this.setData({
      isClearValue:true,
      inputValut: '',
      searchArray:[],
      focus:true
    },()=>{
      this.setData({
        inputValut: '',
        searchArray: []
      })
    })
    setTimeout(()=>{
      this.setData({
        inputValut: '',
        searchArray: [],
        focus:true
      })
    },50)
  },
  // 键盘输入时触发(中英文字母不区分大小写添加.toLocaleLowerCase()，区分大小写就把该方法下的.toLocaleLowerCase()都去掉)
  searchInputAction: function (e) {
    let that = this
    let value = e.detail.value
    let searched = []
    that.setData({
      inputValut: value
    })
    if (value == "") {
      that.setData({
        searchArray: searched,
        isValue: false,
        isFocus: true,
        // inputValut: ''
      })
    } else {
      if (this.data.cardlist.length > 0) {
        searched = this.data.cardlist.filter(function (item, index) {
          if ((item.fCardName && item.fCardName.length > 0 && item.fCardName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) || (item.fOtherId && item.fOtherId.length > 0 && item.fOtherId.trim().indexOf(value) > -1) || (item.fCorpName && item.fCorpName.length > 0 && item.fCorpName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) || (item.fCardTags && item.fCardTags.length > 0 && item.fCardTags.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1)) {
            // let newArr2 = []
            item.keyArr = []//微信名数组
            item.keyArr2 = []//手机号码名数组
            item.keyArr3 = []//公司名数
            item.keyArr4 = []//标签数组
            item.realShow = []//真正显示的文字数组

            if (item.fCardTags && item.fCardTags.length > 0 && item.fCardTags.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {//标签
              // console.log('item.fCardTags-----------', item.fCardTags)
              let orIndex = item.fCardTags.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase())
              let maxIndex = orIndex + (value.length - 1)
              // item.keyArr3 = []
              let newArr = item.fCardTags.split('')
              let valueArr = value.split('')
              let newArr2 = []
              newArr.forEach((element, index) => {
                let obj = {
                  isKey: false,
                  value: element
                }
                newArr2.push(obj)
                valueArr.forEach((ele, i) => {
                  if (element.toLocaleLowerCase() === valueArr[i].toLocaleLowerCase()) {
                    if (valueArr.length == 1) {
                      newArr2[index].isKey = true
                    } else {
                      if (index == orIndex) {
                        newArr2[orIndex].isKey = true
                        orIndex++
                        if (orIndex > maxIndex) {
                          orIndex = maxIndex
                        }
                      }
                    }
                  }
                })
              })
              // console.log('newArr2-------------------', newArr2)
              item.keyArr4 = newArr2
              item.realShow = newArr2
              // return item.fCardTags.trim().indexOf(value) > -1
            }

            if (item.fCardName && item.fCardName.length > 0 && item.fCardName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {//微信名
              // console.log('item.fCardName-----------', item.fCardName)
              let orIndex = item.fCardName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase())
              let maxIndex = orIndex + (value.length - 1)
              // item.keyArr = []
              let newArr = item.fCardName.split('')
              let valueArr = value.split('')
              let newArr2 = []
              newArr.forEach((element, index) => {
                let obj = {
                  isKey: false,
                  value: element
                }
                newArr2.push(obj)
                valueArr.forEach((ele, i) => {
                  if (element.toLocaleLowerCase() === valueArr[i].toLocaleLowerCase()) {
                    if (valueArr.length == 1) {
                      newArr2[index].isKey = true
                    } else {
                      if (index == orIndex) {
                        newArr2[orIndex].isKey = true
                        orIndex++
                        if (orIndex > maxIndex) {
                          orIndex = maxIndex
                        }
                      }
                    }
                  }
                })
              })
              item.keyArr = newArr2
              // return item.fCardName.trim().indexOf(value) > -1
            }

            if (item.fOtherId && item.fOtherId.length > 0 && item.fOtherId.trim().indexOf(value) > -1) {//手机号
              // console.log('item.fOtherId-----------', item.fOtherId)
              let orIndex = item.fOtherId.trim().indexOf(value)
              let maxIndex = orIndex + (value.length - 1)
              // item.keyArr2 = []
              let newArr = item.fOtherId.split('')
              let valueArr = value.split('')
              let newArr2 = []
              newArr.forEach((element, index) => {
                let obj = {
                  isKey: false,
                  value: element
                }
                newArr2.push(obj)
                valueArr.forEach((ele, i) => {
                  if (element === valueArr[i]) {
                    if (valueArr.length == 1) {
                      newArr2[index].isKey = true
                    } else {
                      if (index == orIndex) {
                        newArr2[orIndex].isKey = true
                        orIndex++
                        if (orIndex > maxIndex) {
                          orIndex = maxIndex
                        }
                      }
                    }
                  }
                })
              })
              // console.log('newArr2-------------------', newArr2)
              item.keyArr2 = newArr2

              newArr2.unshift({
                value: "电话：",
                isKey:false
              })
              item.realShow = newArr2
              // return item.fOtherId.trim().indexOf(value) > -1
            }

            if (item.fCorpName && item.fCorpName.length > 0 && item.fCorpName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {//公司名称
              // console.log('item.fCorpName-----------', item.fCorpName)
              let orIndex = item.fCorpName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase())
              // item.keyArr3 = []
              let newArr = item.fCorpName.split('')
              let valueArr = value.split('')
              let newArr2 = []
              newArr.forEach((element, index) => {
                let obj = {
                  isKey: false,
                  value: element
                }
                newArr2.push(obj)
                valueArr.forEach((ele, i) => {
                  if (element.toLocaleLowerCase() === valueArr[i].toLocaleLowerCase()) {
                    if (valueArr.length == 1) {
                      newArr2[index].isKey = true
                    } else {
                      if (index == orIndex) {
                        newArr2[orIndex].isKey = true
                        orIndex++
                      }
                    }
                  }
                })
              })
              // console.log('newArr2-------------------', newArr2)
              item.keyArr3 = newArr2
              item.realShow = newArr2
              // return item.fCorpName.trim().indexOf(value) > -1
            }

          } else {

          }

          return ((item.fCardName && item.fCardName.length > 0 && item.fCardName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) || (item.fOtherId && item.fOtherId.length > 0 && item.fOtherId.trim().indexOf(value) > -1) || (item.fCorpName && item.fCorpName.length > 0 && item.fCorpName.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) || (item.fCardTags && item.fCardTags.length > 0 && item.fCardTags.trim().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1))
        })
      }
    }
    if (searched.length > 0) {
      that.setData({
        searchArray: searched,
        isValue: true,
        isFocus: false,
        // inputValut:''
      })
    } else {
      that.setData({
        searchArray: searched,
        isValue: false,
        isFocus: true,
        // inputValut: value
      })
    }
    // 保存搜索关键字
    that.setData({
      keyValue: value,
    })
  },
  // 输入框聚焦时触发
  searchFocus: function (e) {
    this.setData({
      isFocus: true
    })
  },
  // 输入框失去焦点时触发
  searchBlur: function (e) {
    // console.log('this.data.keyValue-------', this.data.keyValue)
    if (this.data.keyValue.length > 0) {
    } else {
      this.setData({
        isFocus: false
      })
    }
  },
  // 关键字搜索时，在符合条件的数据列表中的点击事件
  searchClick: function (event) {
    let that = this
    let obj = event.currentTarget.dataset
    let phone = obj.phone
    wx.navigateTo({
      url: '../cardListFromIndex/cardListFromIndex?phone=' + phone
    })
  },
  cardLongtap:function(){},
  // 点击名片雷达页面跳转
  toRadar: function (e) {
    wx.navigateTo({
      url: '../radar/radar'
    })
  }
})