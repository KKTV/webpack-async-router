# webpack-entry-router

## Overview
This router works with webpack, after proper webpack config, this would be a perfect solution to get dependencies on-demand by current visiting path, e.g:

While visiting `/`, which is home page of your web app, browser only loads `home` controller dependencies (with mapping router path, see Setup information below).  
On the other hand, when visiting `/signup`, browser will load `signup` controller dependencies asynchronously.  

## Benefits
- Reduce initial loading time.
- Avoid redundant loading cost. (b/c we pack file individually)

## TODO
- **by far it would pack all entry files of controllers into a single chunk**, if you know how to seperate them, please let me know.

## See How It Works
0. clone repo and cd to root path
1. run `npm install`
2. then `webpack`, this would pack client scripts
3. run `node sample-server/server.js`, which would run a sample server demostrate this router
4. go `http://localhost:3000` and visit `/`, `/signup` and `/detail` to see dependencies are load seperately!

## Setup With Your Own Project
By following steps, you should be able to use this router on your web app.

### Step 1 - Prerequisite
Your web app MUST be a server-side served app. 
For each static HTML page, remember to require "entry file" which "packed" by webpack with config of next step.

### Step 2 - Instantiate Router Inside entry.js
entry.js is the entry point of all your server-side route, so you should instantiate router inside it. e.g:
```js
/**
 * listen to window.onload
 * and instantiate router which would load correspond controller
 * inside specified `path` 
 *
 */
var routerConfig = {
  // relative path from router to source files where would be required
  path: './sample-client/controllers', 
  // assume client is visiting '/my-page'
  // router would get './' + this.path + '/my-page.js' by default
  // set custom map here
  pathMap: {
    '/': '/home'
  }
};

// specifically require router module
// for dynamic require setup in Router#visit method
var Router = require('../router'); 
window.onload = function onload() {
  var router = new Router(routerConfig);
  router.visit();
};
```

config of Router:
- `path` where router would look for controllers, relative to location of router.js, NOT entry.js
- `pathMap` of  visiting path and controller name

Remember `path` configuration is **relative to router.js** instead of entry.js.

### Step 3 - Config Webpack Entry File Output
Server-side HTML template requires same js script, which is your output entry file set in `webpack.config.js`.
See `/sample-server/index.html` and `webpack.config.js` for example.

Setup webpack output config first:

```js
// webpack.config.js

// set dirs.src and dirs.dest of your project
var dirs = {
  src: './sample-client/', // src path of client scripts
  dest: './public/js/', // dest path where browser would look up
};

// entry file is named entry.js
module.exports = {
  entry: path.join(__dirname, dirs.src, '/entry.js'),

  output: {
    path: path.join(__dirname, dirs.dest), // absolute path to public folder
    publicPath: dirs.dest, // relative public folder path where generated files would be, make browser able to load
    filename: 'entry.js',
    chunkFilename: '[hash]-[id].js'
  },
}
```
then require this file in every html page:

```html
<!-- inside your html pages, in the end of <body> -->
<script src="/your/path/to/entry/file/entry.js" type="text/javascript" charset="utf-8"></script>

```

### Step 4 - Controller Require Convention
use `require([modules], callback)` to make async load working, i.e
```js
require(['jquery'], function($){
  // $ is jquery
});
```
I don't know why directly `var $ = require('jquery')` would pack chunks (jquery and controller) together.

See `/sample-client/controllers/` for detail.

### Step 5 - Setup Webpack Context Replacement
b/c it's dynamic require, so you need to ask webpack to pack up specific path,  
this is what [ContextReplacementPlugin](https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin) does.  
you can change `pathNeedReplace` variable inside webpack.config.js to satisfy your project.
```js
// setup path which needs to be replaced
// to support dynamic require
var pathNeedReplace = ['sample-client/controllers'];
```

### Step 6 - Setup Webpack Commons Chunk
I don't really what's working background, but lesson from result, you needs to use CommonsChunkPlugin *at least once*, i.e: 
```js
// webpack.config.js
var plugins = [
  // ... other plugins

  new webpack.optimize.CommonsChunkPlugin({
    async: true,
  }),

  // ... other plugins
];
```
If you see duplicate chunks used inside your generated assets(see report of webpack), e.g:
```js
Asset     Size  Chunks             Chunk Names
entry.js   5.9 kB       0  [emitted]  main
8d59163b0ff94f8f3dd9-1.js  2.84 kB       1  [emitted]  
8d59163b0ff94f8f3dd9-2.js   798 kB    2, 3  [emitted]  
8d59163b0ff94f8f3dd9-3.js   123 kB       3  [emitted]  
8d59163b0ff94f8f3dd9-4.js   267 kB       4  [emitted]  
```
As you see `Asset 8d59163b0ff94f8f3dd9-2.js` has Chunk 2 and 3 and `8d59163b0ff94f8f3dd9-3.js` has Chunk 3 as well.  
In this curcumstances, you need to add another CommonsChunkPlugin and set **minChunks to 2** for the last CommonsChunkPlugin, i.e:
```js
// webpack.config.js
var plugins = [
  // ... other plugins

  new webpack.optimize.CommonsChunkPlugin({
    async: 'async1',
  }),

  new webpack.optimize.CommonsChunkPlugin({
    // minChunks: 2, // if a module used twice, move to a common chunk
    async: true,
  }),

  // ... other plugins
];
```
if you see another duplicated chunks, then add another one with async: 'async2'... and so on.

### It's Done
Run `webpack --display-chunks` to see your pack result.
