const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '63ac9906adaa0fbceb13ebaf',
  };

  next();
});

app.use('/', require('./routes'));

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
