# Markdown Webserver

A NodeJS Application that transcripts Markdown to HTML, supporting MathJax and with Github CSS Markdown like a style. Serving itself has a server.

### What does it do?
This application serves has a Markdown Viewer. 

It's perfect for publishing fast websites, convert from Markdown to HTML and Custom CSS it or even post a website quickly, based on you application documentation.

### How is it build?
This application is build using NodeJS, Express for easy hosting, ShowdownJS for the easy transcription. Github-markdown-css for the CSS like style, and MathJax for Math support.


https://github.com/mathjax/MathJax

https://github.com/showdownjs/showdown

https://github.com/sindresorhus/github-markdown-css

### Instalation

To install this repository simply:
 - Make sure you have npm (Node Package Manager)
 - Download the repository.
 
 > git clone https://github.com/joaoofreitas/markdown-webserver.git

 - Enter to the folder in the terminal

 > cd mardown-webserver

 - Install the dependencies:

 > npm install

 - Run the server

 > npm start

 - Visit the website in your browser in localhost

 - All done!

### Running your own Markdown

- Place your _.md_ file in _files/mdstructure/ and rename it has __markdown.md__ .
- Run the server with npm start

> __NOTE:__ Make sure you are inside the repository before running __npm start__ . Otherwise you will get an error.

### Docker
