require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const session = require('express-session');
const connectDB = require('./server/config/db.js');
const methodOverride = require('method-override');



const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));



app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}));

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

const routermain = require('./server/routes/main');
const routeradmin = require('./server/routes/admin');


app.use('/',routermain);
app.use('/',routeradmin);
app.listen(PORT, ()=> {
    console.log('App listening on port $(PORT)');
});