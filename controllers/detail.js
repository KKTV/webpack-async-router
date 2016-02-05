require(['jquery', 'react', 'moment'], function ($, React, moment) {
  document.querySelector('body').innerHTML = 'You are visiting react page, and react.js\'s  dependencies are loaded, which are jquery, react, and moment';

  $('body').append('<br /><a href="/">To Home</a>');
  $('body').append('<br /><a href="/signup">To Signup Page</a>');
});
