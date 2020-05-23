const express = require('express')
const app = express()
const showdown  = require('showdown')
const fs = require('fs')
const EventEmitter = require("events").EventEmitter;

var markdown = new EventEmitter();
var html = new EventEmitter();

showdown.setFlavor('github');

fs.readFile('files/mdstructure/docs.md', 'utf8', (err, data) => {
    if (err) {
	console.log(err);
    }
    else{
	markdown.data = data;
	markdown.emit('markdownUpdate');
    }
});

markdown.on('markdownUpdate', () => {
    converter = new showdown.Converter();
    conversion = converter.makeHtml(markdown.data);
    html.data = conversion;
    html.emit('htmlUpdate');
}); 

html.on('htmlUpdate',() => {
    let logCount = 0;

    app.use(express.static(__dirname + '/files'));
    app.get('/', (req, res) => {
    console.log(`=========================Requests Logs nº ${logCount}================================`);
    console.log(req);
    logCount++;
    res.send(`
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="styles/githubmd.css">	
	<script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
	<script>
	    MathJax = {
		tex: {
		    inlineMath: [['$', '$']]
	        },
		svg: {
		    fontCache: 'global'
		}	
	    };    
	</script>
	
	<style>
	    .markdown-body {
			box-sizing: border-box;
			min-width: 200px;
			max-width: 980px;
			margin: 0 auto;
			padding: 45px;
		    }

	    @media (max-width: 767px) {
			.markdown-body {
					padding: 15px;
				    }
		    }
	</style>
	
	<article class='markdown-body'>
	    ${html.data}
	</article>
	`); 
    });
});

app.listen(3000);
