const express = require('express')
const app = express()
const showdown  = require('showdown')
const fs = require('fs')
const EventEmitter = require("events").EventEmitter;

var markdown = new EventEmitter();
var html = new EventEmitter();

showdown.setFlavor('github');

fs.readFile('files/mdstructure/markdown.md', 'utf8', (err, data) => {
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
	<link rel="stylesheet"
	      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/styles/default.min.css">
	      <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/highlight.min.js"></script>
	<script>hljs.initHighlightingOnLoad();</script>
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

    .hljs {
	display: block;
	background: white;
	padding: 0.5em;
        color: #333333;
	overflow-x: auto;
	}

	.hljs-comment,
	.hljs-meta {
	      color: #969896;
	}

	.hljs-variable,
	.hljs-template-variable,
	.hljs-strong,
	.hljs-emphasis,
	.hljs-quote {
	      color: #df5000;
	}

	.hljs-keyword,
	.hljs-selector-tag,
	.hljs-type {
	      color: #d73a49;
	}

	.hljs-literal,
	.hljs-symbol,
	.hljs-bullet,
	.hljs-attribute {
	      color: #0086b3;
	}

	.hljs-section,
	.hljs-name {
	      color: #63a35c;
	}

	.hljs-tag {
	      color: #333333;
	}

	.hljs-title,
	.hljs-attr,
	.hljs-selector-id,
	.hljs-selector-class,
	.hljs-selector-attr,
	.hljs-selector-pseudo {
	      color: #6f42c1;
	}

	.hljs-addition {
	      color: #55a532;
	      background-color: #eaffea;
	}

	.hljs-deletion {
	      color: #bd2c00;
	      background-color: #ffecec;
	}

	.hljs-link {
	      text-decoration: underline;
	}

	.hljs-number {
	      color: #005cc5;
	}

	.hljs-string {
	      color: #032f62;
	}
	</style>
	
	<article class='markdown-body'>
	    ${html.data}
	</article>
	`); 
    });
});

app.listen(80);
