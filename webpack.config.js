var path = require('path');
var webpack = require('webpack');

// path to folders
var dirs = {
  src: './sample-client/', // src path of client scripts
  dest: './public/js/', // dest path where browser would look up
};

// setup path which needs to be replaced
// to support dynamic require
var contextPaths = ['sample-client/controllers'];
var replacementReg = new RegExp('.\/(' + contextPaths.join('|') + ')\/.*\.js$');

var plugins = [
  // replace dynamic context
  new webpack.ContextReplacementPlugin(/\.\/?/, replacementReg),

  new webpack.optimize.CommonsChunkPlugin({
    async: 'async1',
  }),

  /**
   * if you see duplicate chunks in assets
   * add an additional commonschunkplugin
   *
   */
  // new webpack.optimize.CommonsChunkPlugin({
  //   async: 'async2',
  // }),

  new webpack.optimize.CommonsChunkPlugin({
    minChunks: 2, // if a module used twice, move to a common chunk
    async: true,
  }),

  /**
   * setting this to merge small scripts
   *
   */
  // new webpack.optimize.MinChunkSizePlugin({
  //   minChunkSize: 40000 // unit is byte
  // })
];

module.exports = {
  entry: path.join(__dirname, dirs.src, '/entry.js'),

  output: {
    path: path.join(__dirname, dirs.dest), // absolute path to public folder
    publicPath: dirs.dest, // relative public folder path where generated files would be, make browser able to load
    filename: 'entry.js',
    chunkFilename: '[hash]-[id].js'
  },

  plugins: plugins,

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['', 'node_modules', dirs.src]
  },
};
