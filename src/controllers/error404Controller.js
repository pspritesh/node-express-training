exports.error404 = (req, res) => res.status(404).render('error404', {title:'Page not found'})
