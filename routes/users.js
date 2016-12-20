var https = require('https');
var express = require('express');
var router = express.Router();
var xcx_cfg = require('../config/xcx.js');
var WXBizDataCrypt = require('../lib/WXBizDataCrypt.js');
var mongo = require('../config/mongo.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/analyze', function(req, res, next) {
  var self_req = req;
  var self_res = res;
  var session_url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + xcx_cfg.xcx.appid 
       + "&secret=" + xcx_cfg.xcx.secret 
       + "&js_code=" + req.body.code
       + "&grant_type=authorization_code";
  https.get(session_url, (res) => {
    var str = "";
    res.on('data', (d) => {
      str += d;
    });
    res.on('end', () => {
      var result = JSON.parse(str);
      var session_key = result.session_key;
      var iv = self_req.body.iv;
      var encryptedData = self_req.body.encryptedData;
      var pc = new WXBizDataCrypt(xcx_cfg.xcx.appid, session_key);
      var data = pc.decryptData(encryptedData , iv);
      mongo.run(function(db, callback){
        db.collection('xcx_user').insertOne({
	  city: data.city,
          country: data.country,
          gender: data.gender,
          language: data.language,
          nickName: data.nickName,
          openId: data.openId,
          province: data.province
	}, 
	function(err, r){
          mongo.assert.equal(null, err);
          mongo.assert.equal(1, r.insertedCount);
	})
      })
      self_res.json(data); 
    })
  });
});

module.exports = router;
