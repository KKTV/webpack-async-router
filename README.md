# webpack-entry-router
This router works with webpack, after proper webpack config, this would be a perfect solution to get dependencies on-demand by current visiting path, e.g:

While visiting `/`, which is home page of your web app, browser only loads `home` controller dependencies.  
On the other hand, when visiting `/signup`, browser will load `signup` controller dependencies asynchronously.  


This will reduce initial loading time, and avoid redundant loading cost.(b/c we pack file individually)

**by far it would pack all entry files of controllers into a single chunk**, if you know how to seperate them, please let me know.
