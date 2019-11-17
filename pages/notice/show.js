const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const WXAPI = require('../../wxapi/main')
Page({
  data: {},
  onLoad: function(options) {
    var that = this;
    WXAPI.noticeDetail(options.id).then(function(res) {
      if (res.code == 0) {
        that.setData({
          notice: res.data
        });
        WxParse.wxParse('article', 'html', res.data.content, that, 5);
      }
    })
  }
})