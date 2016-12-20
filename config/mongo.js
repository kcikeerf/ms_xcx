var mongo = {
   client: require('mongodb').MongoClient,
   assert: require('assert'),
   url: "mongodb://localhost:27017/swtk_xcx",
   run: function(func, callback){
     callback = typeof callback !== "undefined" ? callback : function(db){ db.close(); }
     this.client.connect(this.url, function(err,db){
       func(db, callback);
     })
   }
}

mongo.run(function(db, callback){
  db.createCollection("xcx_user", {}, function(err, results){
    //console.log(err);
   // console.log("^^^^");
   // mongo.assert.equal(null, err);
    //console.log("assert after");
    db.collection("xcx_user").createIndex({ openId: 1}, {unique:true, backgournd: true, w:1}, function(err, indexName){
      //mongo.assert.equal(null, err);
    })
  });

  callback(db);
})
module.exports = mongo;

