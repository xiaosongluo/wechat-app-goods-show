const WXAPI = require('../../wxapi/main')
Page({
  data: {
  },
  getPhoneNumber(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '错误',
        content: e.detail.errMsg,
        showCancel: false
      })
      wx.reLaunch({
        url: "/pages/index/index"
      })
      return;
    }
    var that = this;
    WXAPI.bindMobile({
      token: wx.getStorageSync('token'),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '绑定失败',
          showCancel: false
        })
      }
      wx.reLaunch({
        url: "/pages/index/index"
      })
    })
  }
})