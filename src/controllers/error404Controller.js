exports.error404 = function(req, res) {
  res.status(404).render('error404', {title:'Page not found'})
};
