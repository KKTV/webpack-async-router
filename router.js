var camelize = require('camelize');

/**
 * instantiate a Router
 * invoke Router#visit to execute corespondant controller
 *
 */

// return first 'argument' of current pathname
// prefixed with '/'
function getCurrentPath() {
  var current = window.location.pathname.split('/');

  if (current.length > 1) {
    current = current[1];
    return '/' + current;
  } else {
    return '/';
  }
}

/**
 * @param config {Object} - config object, possible keys:
 *  - path: location of controllers relative to Router
 *  - map: object with key as path and value as controller name
 *
 */
function Router(config) {
  this.path = config.path || './';
  this.pathMap = config.pathMap || {};
}

module.exports = Router;

/**
 * map path with controller name
 * @param path {String} - path without '/'
 * @param name {String} - name of controller to require
 *
 */
Router.prototype.map = function map(path, name) {
  this.pathMap[path] = name;
};

/**
 * require controller, depend on current path of web app
 * @param [name] {String} - name of controller
 * @return controller {Object} - instance of controller
 *
 */
Router.prototype.visit = function get(name) {
  if (!name) {
    var nameFromPathMap = this.pathMap[getCurrentPath()];
    name = nameFromPathMap ? nameFromPathMap : getCurrentPath();
    name = camelize(name); // camelize target controller file name 
  }
  var self = this;
  require.ensure([], function (require) {
    console.log('../' + self.path + name + '.js');
    // this will execute controller
    require('../' + self.path + name + '.js');
  });
};
