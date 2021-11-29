var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Paillard_Sirene");
  dbo.createCollection("sirene", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Paillard_Sirene");
  var myobj = { 
    name: "Company Inc",
    address: "Highway 37" };
  dbo.collection("sirene").insertOne(myobj, function(err, res) {
    db.close();
  });
});