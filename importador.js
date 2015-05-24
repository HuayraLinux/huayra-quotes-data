var fs = require('fs');
var path = require('path');
var sax = require('sax');
var Datastore = require('nedb');
var db = new Datastore({filename: 'data/db.nedb', autoload: true});
var xmlFile = path.resolve(__dirname, "eswikiquote-20150406-pages-articles.xml");

var pages = [];
var pageCount = 1;
var pageLimit = -1;

var inPage = false;
var inTitle = false;
var inText = false;

var lastPage = {};

function sanitizeString(str){
  str = str.replace(/[¿?¡!áéíóúñü:\/ \.,_-]/gim, "");
  return str.trim();
}

function isPageToSave(page) {
  var title = page.title;

  if (/#REDIRECT /.test(page.text)) {
    return false;
  }

  if (/Wikiquote/.test(title))
    return false;

  if (/Plantilla/.test(title))
    return false;

  if (/MediaWiki/.test(title))
    return false;

  if (/Categoría/.test(title))
    return false;

  return true;
}

db.remove({}, {multi: true});

var saxStream = sax.createStream(true);

saxStream.on("error", function (e) {
});

saxStream.on("opentag", function(node) {

  if (node.name === "page") {
    inPage = true;
    lastPage = {};
  }

  if (node.name === "title") {
    inTitle = true;
  }

  if (node.name === "text") {
    inText = true;
  }

});

saxStream.on("closetag", function(node) {

  if (node === 'page') {

    if (isPageToSave(lastPage)) {
      pageCount += 1;
      pages.push({id: lastPage.id, title: lastPage.title});

      db.insert({id: lastPage.id, title: lastPage.title}, function(err, data) {
        if (err) {
          console.error(err);
        }
      });

      inPage = false;

      var target_filename = "data/" + lastPage.id + ".txt";
      //console.log("Creando: " + target_filename);
      fs.writeFileSync(target_filename, lastPage.text);

      if (pageLimit !== -1) {
        if (pageCount > pageLimit) {
          save_and_exit();
        }
      }
    }

  }

  if (node === 'title') {
    inTitle = false;
  }

  if (node === "text") {
    inText = false;
  }

});

saxStream.on('text', function(text) {

  if (inTitle) {
    lastPage.title = text;
    lastPage.id = sanitizeString(text);
  }

  if (inText) {
    lastPage.text = text;
  }

});

saxStream.on('end', function() {
  save_and_exit();
});

function save_and_exit() {
  var filename = 'data/index.json';
  var data = {pages: pages};

  //console.log("Generando el archivo " + filename);
  fs.writeFileSync(filename, JSON.stringify(data));

  db.count({}, function(err, data) {
    console.log("Se han creado " + data + " registros.");
    process.exit(0);
  });
}

fs.createReadStream(xmlFile).pipe(saxStream);
