const WXAPI = require('../../wxapi/main')
var app = getApp();
Page({
  data: {
  },
  bindGetUserInfo: function(e) {
    if (!e.detail.userInfo) {
      wx.navigateBack();
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.login();
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  login: function() {
    const that = this;
    const token = wx.getStorageSync('token');
    if (token) {
      WXAPI.checkToken(token).then(function(res) {
        if (res.code != 0) {
          wx.removeStorageSync('token')
          that.login();
        } else {
          // 回到原来的地方放
          app.navigateToLogin = false
          wx.navigateBack();
        }
      })
      return;
    }
    wx.login({
      success: function(res) {
        WXAPI.login(res.code).then(function(res) {
          if (res.code == 10000) {
            // 去注册
            that.registerUser();
            return;
          }
          if (res.code != 0) {
            // 登录错误
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '无法登录，请重试',
              showCancel: false
            })
            return;
          }
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('uid', res.data.uid)
          // 回到原来的地方放
          app.navigateToLogin = false
          wx.navigateBack();
        })
      }
    })
  },
  registerUser: function() {
    let that = this;
    wx.login({
      success: function(res) {
        let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function(res) {
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            let referrer = '' // 推荐人
            let referrer_storge = wx.getStorageSync('referrer');
            if (referrer_storge) {
              referrer = referrer_storge;
            }
            // 下面开始调用注册接口
            WXAPI.register( {
              code: code,
              encryptedData: encryptedData,
              iv: iv,
              referrer: referrer
            }).then(function(res) {
              wx.hideLoading();
              that.login();
            })
          }
        })
      }
    })
  }
})