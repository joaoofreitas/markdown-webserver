const express = require('express')
const app = express()
const showdown  = require('showdown')
const fs = require('fs')

fs.readFile('mdstructure/docs.md', 'utf8', (err, data) => {
    if (err) {
	console.log(err);
    }
});




converter = new showdown.Converter();
text = '# Hello, Markdown!';
html = converter.makeHtml(text);


app.get('/', (req, res) => {
   res.send(html


    

   ); 
});

app.listen(3000);
