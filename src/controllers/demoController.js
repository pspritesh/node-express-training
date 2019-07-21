const Data = require('../models/FileDB/Data');

exports.index = function(req, res) {
  res.send('Controller demo method.');
};

exports.my_demo = async function(req, res) {
  const data = new Data([
    `Hello there, Welcome to Pug rendered using Controller method!`,
    `This template defines how to interact with EJS.`
  ])
  message = await data.get()
  res.send(message)
  // res.render('index', {
  //   title: 'Welcome',
  //   messages: this.message
  // });
};

exports.write_file = function(req, res) {
  const data = new Data()
  data.writeMyFile()
  return res.send("Success")
};
