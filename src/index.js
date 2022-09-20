const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');
const webAppRouter = require('./routers/webapp');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.use(webAppRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.listen(port, () => {
    console.log('Server is up on port', port);
});