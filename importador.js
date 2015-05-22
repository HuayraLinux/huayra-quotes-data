var fs = require('fs');
var XmlStream = require('xml-stream');
var counter = 0;

var stream=fs.createReadStream('eswikiquote-20150406-pages-articles.xml');
var xml = new XmlStream(stream);

var index = {};

xml.preserve('title', true);

xml.on('endElement: page', function(item) {
  var title = item.title['$text'];
  var id = item.id;
  var text = item.revision.text['$text'];
  var target_filename = "data/" + id + ".txt";

  counter +=1;
  //console.log('----------');
  //console.log(title);
  //console.log(id);

  console.log("Creando: " + target_filename);
  fs.writeFileSync(target_filename, text);
  

  index[id] = title;

  if (counter > 5) {
    var data = {pages: index};
    var filename = 'data/index.json';
    console.log("Generando el archivo " + filename);
    fs.writeFileSync(filename, JSON.stringify(data));
    process.exit(0);
  }
});
