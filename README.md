# webpack-entry-router

## Overview
This router works with webpack, after proper webpack config, this would be a perfect solution to get dependencies on-demand by current visiting path, e.g:

While visiting `/`, which is home page of your web app, browser only loads `home` controller dependencies.  
On the other hand, when visiting `/signup`, browser will load `signup` controller dependencies asynchronously.  

# Benefits
- Reduce initial loading time.
- Avoid redundant loading cost. (b/c we pack file individually)

# TODO
- **by far it would pack all entry files of controllers into a single chunk**, if you know how to seperate them, please let me know.

## HOW TO
0. clone repo and cd to root path
1. run `npm install`
2. then `webpack`, this would pack client scripts
3. run `node server/server.js`, which would run a sample server demostrate this router
4. visit `http://localhost:3000` to see how router works

## Setup On Your Own Project
By following steps, you should be able to use this router on your web app.

### Step 1 - Server Side Web App
Your web app MUST be a server-side served app. For each static page route,   
they can be any HTML like template you want, but remember to require entry file which
"packed" by webpack with config of next step

### Step 2 - Setup webpack output config
Server-side HTML template requires same js script, which is your output entry file set in `webpack.config.js`.
See `/server/index.html` and `webpack.config.js`.
```
// webpack.config.js
{
  entry: path.join(__dirname, '/sample-client/entry.js'),
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/public/js/',
    filename: 'entry.js',
  }
}
```

### Step 3 - Instantiate Router Inside entry.js
entry.js is the entry point of all your server-side route  

It would instantiate router with config, you can setup
- `path` where router would look for controllers
- `pathMap` of current browser path and controller name

Please check `./sample-client/entry.js` to see detail. 

### Step 4 - Setup Webpack Context Replacement
b/c it's dynamic require, so you need to ask webpack to pack up specific path,  
this is what [ContextReplacementPlugin](https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin) does.  
you can change `pathNeedReplace` variable inside webpack.config.js to satisfy your project.

### Step 4 - Setup Webpack Commons Chunk
I don't really what's working background, but lesson from result, you needs to use CommonsChunkPlugin *at least once*, i.e: (see `plugins` variable inside webpack.config.js):
```
new webpack.optimize.CommonsChunkPlugin({
  async: true,
})
```
but if you see there are duplicate chunks used inside your generated assets(see report of webpack), e.g:
```
Asset     Size  Chunks             Chunk Names
entry.js   5.9 kB       0  [emitted]  main
8d59163b0ff94f8f3dd9-1.js  2.84 kB       1  [emitted]  
8d59163b0ff94f8f3dd9-2.js   798 kB    2, 3  [emitted]  
8d59163b0ff94f8f3dd9-3.js   123 kB       3  [emitted]  
8d59163b0ff94f8f3dd9-4.js   267 kB       4  [emitted]  
```
As you see `Asset 8d59163b0ff94f8f3dd9-2.js` has Chunk 2 and 3. In this curcumstances, you need to add another CommonsChunkPlugin and set minChunks to 2 for the last CommonsChunkPlugin, i.e:
```
new webpack.optimize.CommonsChunkPlugin({
  async: 'async1',
}),

new webpack.optimize.CommonsChunkPlugin({
  // minChunks: 2, // if a module used twice, move to a common chunk
  async: true,
}),
```
if you see another duplicated chunks, then add another one with async: 'async2'... and so on.

### It's Done
Run `webpack --display-chunks` to see your pack result.
And visit `/`, `/signup` and `/detail` to see dependencies are load seperately!
