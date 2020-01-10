const { responseObj } = require('../helpers/utilsHelper');

exports.error404 = (req, res) => {
  if (req.url.indexOf('/api/') > -1) {
    res.status(404).json(responseObj('Page not found!'));
  } else {
    res.status(404).render('error404', { 'title': 'Page not found!' });
  }
}
