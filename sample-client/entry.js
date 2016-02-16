/**
 * entry.js listen to window.onload
 * and instantiate router which would load correspond controller
 * inside specified `path` (see router.js)
 *
 */
var routerConfig = {
  // relative path from PARENT of router file's path to source files where would be required
  path: 'controllers', 
  // assume client is visiting '/my-page'
  // router would get './' + this.path + '/my-page.js' by default
  // set custom map here
  pathMap: {
    '/': '/home'
  }
};

// require router.js, depends on your project structure
var Router = require('./router/router'); 
window.onload = function onload() {
  var router = new Router(routerConfig);
  // dynamic require is setup in Router#visit method
  router.visit();
};
