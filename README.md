# Markdown Webserver 📄

A NodeJS Application that transcripts Markdown to HTML, supporting MathJax and with Github CSS Markdown like a style. Serving itself has a server.

### What does it do? 🤠
This application serves has a Markdown Viewer. 

It's perfect for publishing fast websites, convert from Markdown to HTML and Custom CSS it or even post a website quickly, based on you application documentation.

### How is it build? 🔨
This application is build using NodeJS, Express for easy hosting, ShowdownJS for the easy transcription. Github-markdown-css for the CSS like style, MathJax for Math support, and HighlightJS for code highlighting.


[MathJax](https://github.com/mathjax/MathJax)

[HighlightJS](https://github.com/highlightjs/highlight.js)

[ExpressJS](https://github.com/expressjs/express)

[ShowdownJS](https://github.com/showdownjs/showdown)

[Github-Markdown-CSS](https://github.com/sindresorhus/github-markdown-css)

### Installation 📲

__To install this repository simply:__
 1. Make sure you have npm (Node Package Manager)
 2. Download the repository.
 
 `git clone https://github.com/joaoofreitas/markdown-webserver.git`

 3. Enter to the folder in the terminal

 `cd markdown-webserver`

 4. Install the dependencies:

 `npm install`

 5. Run the server

 `npm start`

 6. Visit the website in your browser in localhost

##### All done!

### Running your own Markdown 📟

1. Place your _.md_ file in _files/mdstructure/_ and rename it has __markdown.md__ .
2. Run the server with npm start

> __NOTE:__ Make sure you are inside the repository before running __npm start__. Otherwise you will get an error.

### Docker 🐳

This application has also a Docker image so you can run it and deploy it in a Docker Container. Or even building it with an Nginx Proxy and a Let's Encrypt Proxy Companion. 

For that you just need do build the docker image with docker build inside the program folder.

`__Example:__`

` user@localhost ~/markdown--webserver docker build -t <IMAGE_NAME> .`

To run the container:

`docker run -p 80:80 <IMAGE_NAME>`
