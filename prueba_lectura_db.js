var loki = require('lokijs');
var db = new loki('data/db.json');

db.loadDatabase({}, function() {
  var index_collection = db.getCollection("index");

  var datos = index_collection.find({});
  var n = datos.length;
  console.log("La base de datos tiene " + n + " registros en total.")
});
