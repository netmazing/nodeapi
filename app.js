const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path')

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true},
  )
  .then(() => console.log('DB Connected'))
   
  mongoose.connection.on(`error`, err => {
    console.log(`DB connection error: ${err.message}`)
  });

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      const docs = JSON.parse(data);
      res.json(docs)
    }
  })
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node.js app is listening at port: ${port}`)
})