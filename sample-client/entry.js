/**
 * entry.js listen to window.onload
 * and instantiate router which would load correspond controller
 * inside specified `path` (see router.js)
 *
 */
var routerConfig = {
  // relative path from router to source files where would be required
  path: './controllers', 
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
