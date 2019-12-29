const Data = require('../models/FileDB/Data');

exports.index = (req, res) => res.send('Controller demo method.');

exports.my_demo = async (req, res) => {
  const data = new Data([
    `Hello there, Welcome to Pug rendered using Controller method!`,
    `This template defines how to interact with EJS.`
  ]);
  message = await data.get();
  // res.send(message)
  res.render('index', {
    title: 'Welcome',
    messages: message
  });
}

exports.write_file = (req, res) => {
  const data = new Data();
  data.writeMyFile();
  return res.send('Success');
}
