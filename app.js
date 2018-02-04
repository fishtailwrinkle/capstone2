'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');

// routes
const indexRouter = require('./routes/indexRouter');
const productRouter = require('./routes/productRouter');

const app = express();

/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
*/
app.use(morgan('common'));
app.use(express.static('./public'));

///////////////////////////////////////

//app.use('/', indexRouter);
app.use('/products', productRouter);

module.exports = {app};