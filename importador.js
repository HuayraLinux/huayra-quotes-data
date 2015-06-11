var fs = require('fs');
var path = require('path');
var sax = require('sax');
var slug = require('slug');

var loki = require('lokijs');
var db = new loki('data/db.json');
var index_collection = db.addCollection('index');
var xmlFile = path.resolve(__dirname, "eswikiquote-latest-pages-articles.xml");

var pages = [];
var pageCount = 1;
var pageLimit = -1;

var inPage = false;
var inTitle = false;
var inText = false;

var lastPage = {};

function sanitizeString(str){
  return slug(str);
}

function getCategory(page) {
  var rx = /\[\[Categoría:(.[^\]]*)\]\]/g;
  var arr = rx.exec(page.text);

  if (arr && arr.length > 0) {
    return arr[1].split("|")[0];
  } else {
    return "";
  }
}

function isPageToSave(page) {
  var result = {save: true, save_file: true};
  var title = page.title;


  if (/#REDIRECT/.test(page.text)) {
    result.save_file = false;
  }

  if (/#REDIRECCIÓN/.test(page.text)) {
    result.save_file = false;
  }


  if (/Wikiquote/.test(title)){
    result.save_file = false;
    result.save = false;
  }

  if (/Plantilla/.test(title)){
    result.save_file = false;
    result.save = false;
  }

  if (/MediaWiki/.test(title)){
    result.save_file = false;
    result.save = false;
  }

  if (/Categoría/.test(title)){
    result.save_file = false;
    result.save = false;
  }

  return result;
}

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
  var pageToSave = false;
  if (node === 'page') {

    pageToSave = isPageToSave(lastPage);
    if (pageToSave.save) {
      var category = getCategory(lastPage);

      pageCount += 1;

      pages.push({id: lastPage.id, title: lastPage.title});

      index_collection.insert({id: lastPage.id,
                               title: lastPage.title,
                               redirect: lastPage.redirect||"",
                               slug: slug(lastPage.title, ' '),
                               category: category
                              });

      inPage = false;

      if (pageToSave.save_file) {
        var target_filename = "data/" + lastPage.id + ".txt";
        //console.log("Creando: " + target_filename);
        fs.writeFileSync(target_filename, lastPage.text);
      }

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

  if ( /#REDIRECT/.test(lastPage.text) || /#REDIRECCIÓN/.test(lastPage.text) ) {
    match = text.match(/\[\[(.[^\]]*)\]\]/i);
    if( match ){
      lastPage.redirect = slug(match[1]);
    }
  }

});

saxStream.on('end', function() {
  save_and_exit();
});

function save_and_exit() {
  //var filename = 'data/index.json';
  //var data = {pages: pages};

  //console.log("Generando el archivo " + filename);
  //fs.writeFileSync(filename, JSON.stringify(data));

  db.saveDatabase(function(err) {
    var n = index_collection.find({}).length;
    console.log("Se ha creado la base de datos con " + n + " registros.");
    process.exit(0);
  });
}

fs.createReadStream(xmlFile).pipe(saxStream);
